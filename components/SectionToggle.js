'use client';

import { useEdit } from './EditProvider';

/**
 * Кнопка показать/скрыть секцию. Видна только в режиме редактирования.
 * Сохраняет состояние в content._hidden[id].
 */
export default function SectionToggle({ id }) {
  const { editMode, isAdmin, content, toggleSection } = useEdit();
  if (!editMode || !isAdmin) return null;

  const hidden = Boolean(content._hidden?.[id]);

  return (
    <button
      onClick={() => toggleSection(id)}
      className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white shadow border border-outline-variant/40 hover:bg-surface-container-low transition-colors"
      title={hidden ? 'Показать секцию' : 'Скрыть секцию'}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
        {hidden ? 'visibility' : 'visibility_off'}
      </span>
      {hidden ? 'Показать' : 'Скрыть блок'}
    </button>
  );
}
