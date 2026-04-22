'use client';

import { useEffect, useRef, useState } from 'react';
import { useEdit } from './EditProvider';

export default function EditablePhoto({ path, value, className = '', alt = '' }) {
  const { isAdmin, editMode, update } = useEdit();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const editable = isAdmin && editMode;

  const onChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');
      update(path, data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={value} alt={alt} className="w-full h-full object-cover grayscale-[20%] sepia-[10%]" />
      {editable ? (
        <>
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/55 text-white transition-colors"
          >
            <span className="bg-white/90 text-on-surface px-5 py-3 rounded-full text-sm flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                photo_camera
              </span>
              {uploading ? 'Загружаю…' : 'Заменить фото'}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onChange}
          />
          {error ? (
            <div className="absolute bottom-2 left-2 right-2 bg-error text-on-error text-xs p-2 rounded">
              {error}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
