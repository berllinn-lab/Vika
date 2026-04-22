'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', request: '', preferred_time: 'Утро буднего дня' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка отправки');
      setStatus('ok');
      setForm({ name: '', request: '', preferred_time: 'Утро буднего дня' });
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  if (status === 'ok') {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 56 }}>
          check_circle
        </span>
        <h3 className="text-2xl font-headline italic mt-4 mb-2">Спасибо за доверие.</h3>
        <p className="text-on-surface-variant font-light">
          Я свяжусь с вами в ближайшее время, чтобы договориться о первой сессии.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-label border-b border-tertiary-container pb-1 hover:border-primary"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div>
        <label className="text-label text-[10px] block mb-2">Имя</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-2 transition-all outline-none font-light"
          placeholder="Как к вам обращаться"
          type="text"
        />
      </div>
      <div>
        <label className="text-label text-[10px] block mb-2">Суть запроса</label>
        <input
          required
          value={form.request}
          onChange={(e) => setForm({ ...form, request: e.target.value })}
          className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-2 transition-all outline-none font-light"
          placeholder="Несколько слов, с чем хотите обратиться"
          type="text"
        />
      </div>
      <div>
        <label className="text-label text-[10px] block mb-2">Удобное время</label>
        <select
          value={form.preferred_time}
          onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}
          className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-2 transition-all outline-none font-light appearance-none"
        >
          <option>Утро буднего дня</option>
          <option>День буднего дня</option>
          <option>Вечер</option>
          <option>Выходные</option>
        </select>
      </div>
      {error ? <p className="text-error text-sm">{error}</p> : null}
      <button
        disabled={status === 'sending'}
        type="submit"
        className="w-full bg-primary text-white px-10 py-4 rounded-full text-label font-medium hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-50"
      >
        {status === 'sending' ? 'Отправляю…' : 'Отправить заявку'}
      </button>
    </form>
  );
}
