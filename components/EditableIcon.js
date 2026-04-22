'use client';

import { useState } from 'react';
import { useEdit } from './EditProvider';
import { ICON_CHOICES } from '@/lib/icons';

export default function EditableIcon({ path, value, className = '' }) {
  const { isAdmin, editMode, update } = useEdit();
  const [open, setOpen] = useState(false);
  const editable = isAdmin && editMode;

  if (!editable) {
    return (
      <span className={`material-symbols-outlined ${className}`}>{value}</span>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="qd-editable inline-flex items-center gap-2 px-2 py-1"
        title="Сменить иконку"
      >
        <span className={`material-symbols-outlined ${className}`}>{value}</span>
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>
          edit
        </span>
      </button>
      {open ? (
        <div className="absolute z-50 mt-2 left-0 bg-white border border-outline-variant/40 rounded-xl shadow-2xl p-3 w-80 max-h-80 overflow-auto grid grid-cols-6 gap-1">
          {ICON_CHOICES.map((icon) => (
            <button
              key={icon}
              onClick={() => {
                update(path, icon);
                setOpen(false);
              }}
              className={`aspect-square flex items-center justify-center rounded hover:bg-surface-container-low ${
                icon === value ? 'bg-primary-container/40' : ''
              }`}
              title={icon}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                {icon}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
