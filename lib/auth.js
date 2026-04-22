import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'dev_only_password_change_me_please_32ch',
  cookieName: 'qd_session',
  cookieOptions: {
    // Пока сайт отдаётся по HTTP (до установки SSL на домен) — secure должен быть false,
    // иначе браузер не сохранит cookie и админ не будет залогинен.
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 дней
  },
};

export async function getSession() {
  return getIronSession(cookies(), sessionOptions);
}

export async function isAdmin() {
  const s = await getSession();
  return Boolean(s?.isAdmin);
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
}
