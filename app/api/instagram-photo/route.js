import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

const IG_SYNC_SECRET = process.env.IG_SYNC_SECRET;
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * POST /api/instagram-photo
 * Принимает сырые байты изображения от GitHub Actions и сохраняет на диск.
 * Headers:
 *   x-sync-secret: <IG_SYNC_SECRET>
 *   x-photo-id:    <instagram post id, только [a-zA-Z0-9_-]>
 *   Content-Type:  image/jpeg | image/png | image/webp
 */
export async function POST(req) {
  const secret = req.headers.get('x-sync-secret');
  if (!IG_SYNC_SECRET || secret !== IG_SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const photoId = req.headers.get('x-photo-id') || '';
  if (!photoId || !/^[a-zA-Z0-9_-]+$/.test(photoId)) {
    return NextResponse.json({ error: 'Invalid or missing x-photo-id' }, { status: 400 });
  }

  const contentType = req.headers.get('content-type') || 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  const filename = `ig_${photoId}.${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);
  const buf = Buffer.from(await req.arrayBuffer());

  if (buf.length === 0) {
    return NextResponse.json({ error: 'Empty body' }, { status: 400 });
  }

  fs.writeFileSync(filepath, buf);

  return NextResponse.json({ ok: true, path: `/uploads/${filename}` });
}
