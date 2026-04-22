'use client';

import { useEdit } from './EditProvider';
import { useRouter } from 'next/navigation';

export default function AdminToolbar() {
  const { editMode, setEditMode, save, discard, dirty, saving, status } = useEdit();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-white shadow-2xl border border-outline-variant/30 rounded-full px-2 py-2 flex items-center gap-2 text-sm">
      <button
        onClick={() => setEditMode(!editMode)}
        className={`px-4 py-2 rounded-full transition-colors ${
          editMode ? 'bg-primary text-white' : 'bg-surface-container-low hover:bg-surface-container'
        }`}
      >
        <span className="material-symbols-outlined align-middle mr-1" style={{ fontSize: 18 }}>
          {editMode ? 'edit_off' : 'edit'}
        </span>
        {editMode ? 'Выйти из правки' : 'Редактировать'}
      </button>

      {editMode ? (
        <>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="px-4 py-2 rounded-full bg-tertiary text-white disabled:opacity-40 hover:opacity-90"
          >
            {saving ? 'Сохраняю…' : 'Сохранить'}
          </button>
          <button
            onClick={discard}
            disabled={!dirty || saving}
            className="px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container disabled:opacity-40"
          >
            Отмена
          </button>
          {status ? <span className="px-2 text-on-surface-variant">{status}</span> : null}
          {dirty ? <span className="px-2 text-primary">● Есть изменения</span> : null}
        </>
      ) : null}

      <a
        href="/admin/inquiries"
        className="px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container"
        title="Заявки с формы"
      >
        <span className="material-symbols-outlined align-middle" style={{ fontSize: 18 }}>
          inbox
        </span>
      </a>
      <button
        onClick={logout}
        className="px-3 py-2 rounded-full hover:bg-surface-container-low text-on-surface-variant"
        title="Выйти"
      >
        <span className="material-symbols-outlined align-middle" style={{ fontSize: 18 }}>
          logout
        </span>
      </button>
    </div>
  );
}
