import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { igPostExists, upsertInstagramPost } from '@/lib/db';

export const dynamic = 'force-dynamic';

const APIFY_TOKEN = process.env.APIFY_TOKEN;
const IG_SYNC_SECRET = process.env.IG_SYNC_SECRET;
const IG_USERNAME = process.env.IG_USERNAME || 'time_prenatal';
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req) {
  // Проверка секрета
  const secret = req.headers.get('x-sync-secret');
  if (!IG_SYNC_SECRET || secret !== IG_SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!APIFY_TOKEN) {
    return NextResponse.json({ error: 'APIFY_TOKEN not set' }, { status: 500 });
  }

  try {
    // Запускаем Apify Instagram Profile Scraper синхронно (ждём результат)
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=120`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernames: [IG_USERNAME],
          resultsLimit: 30,
        }),
      }
    );

    if (!runRes.ok) {
      const text = await runRes.text();
      return NextResponse.json({ error: `Apify error: ${runRes.status}`, detail: text }, { status: 502 });
    }

    const items = await runRes.json();
    // Apify возвращает массив профилей; посты в latestPosts / posts
    const posts = items?.[0]?.latestPosts ?? items?.[0]?.posts ?? [];

    if (!Array.isArray(posts)) {
      return NextResponse.json({ error: 'Unexpected Apify response shape', items }, { status: 502 });
    }

    fs.mkdirSync(UPLOADS_DIR, { recursive: true });

    let added = 0;
    for (const post of posts) {
      const igId = post.id || post.shortCode;
      if (!igId) continue;
      if (igPostExists(igId)) continue; // уже есть

      // Скачиваем фото к себе чтобы ссылки не протухли
      const remoteUrl = post.displayUrl || post.imageUrl || post.thumbnailUrl;
      if (!remoteUrl) continue;

      let localUrl = '';
      try {
        const imgRes = await fetch(remoteUrl);
        if (imgRes.ok) {
          const ext = remoteUrl.includes('.png') ? 'png' : 'jpg';
          const filename = `ig_${igId}.${ext}`;
          const filepath = path.join(UPLOADS_DIR, filename);
          const buf = Buffer.from(await imgRes.arrayBuffer());
          fs.writeFileSync(filepath, buf);
          localUrl = `/uploads/${filename}`;
        }
      } catch {
        localUrl = remoteUrl; // fallback на оригинальную ссылку
      }

      const igTimestamp = post.timestamp
        ? new Date(post.timestamp).getTime()
        : (post.takenAtTimestamp ? post.takenAtTimestamp * 1000 : Date.now());

      upsertInstagramPost({
        id: igId,
        photo_url: localUrl || remoteUrl,
        caption: post.caption || '',
        permalink: post.url || `https://www.instagram.com/p/${post.shortCode}/`,
        ig_timestamp: igTimestamp,
      });
      added++;
    }

    return NextResponse.json({ ok: true, added, total: posts.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
