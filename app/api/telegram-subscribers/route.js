import { NextResponse } from 'next/server';
import { listTelegramSubscribersDetailed, removeTelegramSubscriber } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(listTelegramSubscribersDetailed());
}

export async function DELETE(req) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { chatId } = await req.json();
  if (!chatId) return NextResponse.json({ error: 'chatId required' }, { status: 400 });
  removeTelegramSubscriber(chatId);
  return NextResponse.json({ ok: true });
}
