'use client';

import { useEffect, useRef, useState } from 'react';
import { useEdit } from './EditProvider';

export default function EditablePhoto({ path, value, className = '', alt = '' }) {
  const { isAdmin, editMode, updateAndSave } = useEdit();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const editable = isAdmin && editMode;

  const onChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setOk(false);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');
      updateAndSave(path, data.url);
      setOk(true);
      setTimeout(() => setOk(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  // Пробиваем кеш браузера после замены (одного и того же пути нет, но на всякий).
  const imgSrc = value || '';

  return (
    <div className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={imgSrc}
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover grayscale-[20%] sepia-[10%]"
      />
      {editable ? (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/55 text-white transition-colors"
          >
            <span className="bg-white/90 text-on-surface px-5 py-3 rounded-full text-sm flex items-center gap-2 pointer-events-none">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                photo_camera
              </span>
              {uploading ? 'Загружаю…' : 'Заменить фото'}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.heic,.heif"
            className="hidden"
            onChange={onChange}
          />
          {error ? (
            <div className="absolute bottom-2 left-2 right-2 bg-red-600 text-white text-xs p-2 rounded shadow-lg z-10">
              {error}
            </div>
          ) : null}
          {ok ? (
            <div className="absolute bottom-2 left-2 right-2 bg-green-600 text-white text-xs p-2 rounded shadow-lg z-10 text-center">
              Фото обновлено и сохранено
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
