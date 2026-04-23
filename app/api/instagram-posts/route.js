import { NextResponse } from 'next/server';
import { listInstagramPosts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = listInstagramPosts({ limit: 24 });
  return NextResponse.json(posts);
}
