import { NextResponse } from 'next/server';
import { upsertInstagramPost } from '@/lib/db';

export const dynamic = 'force-dynamic';

const IG_SYNC_SECRET = process.env.IG_SYNC_SECRET;

/**
 * POST /api/instagram-import
 * Записывает метаданные постов в БД. Вызывается из GitHub Actions после
 * того, как фото уже загружены через /api/instagram-photo.
 * Body: { posts: [{id, photo_url, caption, permalink, ig_timestamp}] }
 */
export async function POST(req) {
  const secret = req.headers.get('x-sync-secret');
  if (!IG_SYNC_SECRET || secret !== IG_SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { posts } = body;
  if (!Array.isArray(posts)) {
    return NextResponse.json({ error: 'posts must be an array' }, { status: 400 });
  }

  let updated = 0;
  for (const post of posts) {
    if (!post.id) continue;

    // ig_timestamp может прийти как ISO-строка или как Unix секунды
    let igTimestamp = Date.now();
    if (post.ig_timestamp) {
      const parsed = typeof post.ig_timestamp === 'string'
        ? new Date(post.ig_timestamp).getTime()
        : post.ig_timestamp * 1000;
      if (!isNaN(parsed)) igTimestamp = parsed;
    }

    upsertInstagramPost({
      id: post.id,
      photo_url: post.photo_url || '',
      caption: post.caption || '',
      permalink: post.permalink || '',
      ig_timestamp: igTimestamp,
    });
    updated++;
  }

  return NextResponse.json({ ok: true, updated, total: posts.length });
}
