import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';

export async function POST(req) {
  const { login, password } = await req.json();
  const expectedLogin = process.env.ADMIN_LOGIN || 'admin';
  const hash = process.env.ADMIN_PASSWORD_HASH || '';
  if (!hash) {
    return NextResponse.json({ error: 'Админ не настроен. См. .env.example' }, { status: 500 });
  }
  if (login !== expectedLogin) {
    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 });
  }
  const ok = await bcrypt.compare(password || '', hash);
  if (!ok) {
    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 });
  }
  const session = await getSession();
  session.isAdmin = true;
  await session.save();
  return NextResponse.json({ ok: true });
}
