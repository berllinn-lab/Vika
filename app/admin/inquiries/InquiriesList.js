'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InquiriesList({ items: initial, tgSubscribers: initialSubs }) {
  const [items, setItems] = useState(initial);
  const [subs, setSubs] = useState(initialSubs || []);
  const router = useRouter();

  const fmt = (ts) => new Date(ts).toLocaleString('ru-RU');

  const markSeen = async (id) => {
    await fetch(`/api/inquiries/${id}`, { method: 'PATCH' });
    setItems((list) => list.map((it) => (it.id === id ? { ...it, seen: 1 } : it)));
  };

  const del = async (id) => {
    if (!confirm('Удалить заявку?')) return;
    await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    setItems((list) => list.filter((it) => it.id !== id));
  };

  if (items.length === 0) {
    return (
      <>
        <TgSubscribers subs={subs} setSubs={setSubs} />
        <div className="bg-white rounded-2xl p-16 text-center border border-outline-variant/20">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 56 }}>
            inbox
          </span>
          <p className="mt-4 text-on-surface-variant">Пока нет заявок.</p>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <TgSubscribers subs={subs} setSubs={setSubs} />
      {items.map((it) => (
        <div
          key={it.id}
          className={`bg-white rounded-2xl p-6 border ${
            it.seen ? 'border-outline-variant/20' : 'border-primary/40 shadow-md'
          }`}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-headline italic text-xl">{it.name}</h3>
                {!it.seen ? (
                  <span className="text-[10px] uppercase tracking-widest text-primary bg-primary-container/30 px-2 py-0.5 rounded-full">
                    новая
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-on-surface-variant mt-1">{fmt(it.created_at)}</p>
            </div>
            <div className="flex gap-2">
              {!it.seen ? (
                <button
                  onClick={() => markSeen(it.id)}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container"
                >
                  Отметить прочитанной
                </button>
              ) : null}
              <button
                onClick={() => del(it.id)}
                className="text-xs px-3 py-1.5 rounded-full text-error hover:bg-error-container"
              >
                Удалить
              </button>
            </div>
          </div>
          <p className="text-on-surface font-light mt-2">{it.request}</p>
          {it.preferred_time ? (
            <p className="text-xs text-on-surface-variant mt-3">
              <span className="uppercase tracking-widest">Время:</span> {it.preferred_time}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function TgSubscribers({ subs, setSubs }) {
  const removeSub = async (chatId) => {
    if (!confirm('Отписать этого пользователя?')) return;
    await fetch('/api/telegram-subscribers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId }),
    });
    setSubs((list) => list.filter((s) => s.chat_id !== chatId));
  };

  return (
    <div className="mb-8 bg-white border border-outline-variant/20 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🔔</span>
        <p className="font-medium text-on-background">Подписчики на уведомления</p>
        <span className="ml-auto text-xs text-on-surface-variant bg-surface-container-highest rounded-full px-2 py-0.5">
          {subs.length}
        </span>
      </div>
      {subs.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          Нет подписчиков. Напишите боту{' '}
          <a href="https://t.me/vikacrush_bot" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
            @vikacrush_bot
          </a>{' '}
          команду <code className="bg-surface-container-highest rounded px-1 text-xs">/start</code>
        </p>
      ) : (
        <div className="space-y-2">
          {subs.map((s) => {
            const name = [s.first_name, s.username ? `@${s.username}` : ''].filter(Boolean).join(' ');
            return (
              <div key={s.chat_id} className="flex items-center justify-between gap-3 py-2 border-b border-outline-variant/10 last:border-0">
                <div>
                  <span className="text-sm font-medium">{name || 'Без имени'}</span>
                  <span className="text-xs text-on-surface-variant ml-2">ID: {s.chat_id}</span>
                </div>
                <button
                  onClick={() => removeSub(s.chat_id)}
                  className="text-xs px-3 py-1 rounded-full text-error hover:bg-error-container"
                >
                  Удалить
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
