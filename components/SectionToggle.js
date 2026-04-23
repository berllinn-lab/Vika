'use client';

import { useEdit, DEFAULT_SECTION_ORDER } from './EditProvider';

/**
 * Панель управления секцией: скрыть/показать + переместить вверх/вниз.
 * Видна только в режиме редактирования.
 */
export default function SectionToggle({ id }) {
  const { editMode, isAdmin, content, toggleSection, moveSection } = useEdit();
  if (!editMode || !isAdmin) return null;

  const hidden = Boolean(content._hidden?.[id]);
  const order = content._order ?? DEFAULT_SECTION_ORDER;
  const idx = order.indexOf(id);

  return (
    <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white shadow border border-outline-variant/40 rounded-full px-1 py-1">
      <button
        onClick={() => moveSection(id, -1)}
        disabled={idx <= 0}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Переместить вверх"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_upward</span>
      </button>
      <button
        onClick={() => moveSection(id, 1)}
        disabled={idx < 0 || idx >= order.length - 1}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Переместить вниз"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_downward</span>
      </button>
      <div className="w-px h-4 bg-outline-variant/30 mx-0.5" />
      <button
        onClick={() => toggleSection(id)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium hover:bg-surface-container-low transition-colors"
        title={hidden ? 'Показать секцию' : 'Скрыть секцию'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          {hidden ? 'visibility' : 'visibility_off'}
        </span>
        {hidden ? 'Показать' : 'Скрыть'}
      </button>
    </div>
  );
}
