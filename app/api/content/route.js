import { NextResponse } from 'next/server';
import { getContent, setManyContent } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function GET() {
  return NextResponse.json(getContent());
}

export async function PUT(req) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Bad payload' }, { status: 400 });
  }
  setManyContent(body);
  return NextResponse.json({ ok: true });
}
