'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка входа');
      router.push('/');
      router.refresh();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface-container-low">
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md space-y-6 border border-outline-variant/20"
      >
        <div>
          <h1 className="text-3xl font-headline italic text-on-surface">Вход для администратора</h1>
          <p className="text-sm text-on-surface-variant mt-2 font-light">
            После входа на главной появится панель редактирования.
          </p>
        </div>
        <div>
          <label className="text-label text-[10px] block mb-2">Логин</label>
          <input
            autoFocus
            required
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary focus:ring-0 px-0 py-2 outline-none"
          />
        </div>
        <div>
          <label className="text-label text-[10px] block mb-2">Пароль</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary focus:ring-0 px-0 py-2 outline-none"
          />
        </div>
        {err ? <p className="text-error text-sm">{err}</p> : null}
        <button
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-full text-label font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Вхожу…' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
