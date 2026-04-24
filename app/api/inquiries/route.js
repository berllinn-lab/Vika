import { NextResponse } from 'next/server';
import { addInquiry, listInquiries } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { notifyNewInquiry } from '@/lib/telegram';

export async function POST(req) {
  const body = await req.json();
  const name = String(body.name || '').trim().slice(0, 200);
  const request = String(body.request || '').trim().slice(0, 2000);
  const preferred_time = String(body.preferred_time || '').trim().slice(0, 100);
  if (!name || !request) {
    return NextResponse.json({ error: 'Заполните имя и запрос' }, { status: 400 });
  }
  addInquiry({ name, request, preferred_time });
  notifyNewInquiry({ name, request, preferred_time }).catch(() => {});
  return NextResponse.json({ ok: true });
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(listInquiries());
}
