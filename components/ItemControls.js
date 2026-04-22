'use client';

import { useEdit } from './EditProvider';

/**
 * Обёртка для элемента списка. Показывает кнопки «вверх/вниз/удалить» в режиме правки.
 */
export default function ItemControls({ section, index, length }) {
  const { editMode, isAdmin, content, replaceSection } = useEdit();
  if (!editMode || !isAdmin) return null;

  // section может быть путём через точку (expertise.items, faq.items, process.steps)
  const keys = section.split('.');
  const getList = () => {
    let node = content;
    for (const k of keys) node = node?.[k];
    return Array.isArray(node) ? [...node] : [];
  };
  const setList = (list) => {
    // Обновим всю верхнюю секцию
    const next = structuredClone(content);
    let node = next;
    for (let i = 0; i < keys.length - 1; i++) node = node[keys[i]];
    node[keys[keys.length - 1]] = list;
    replaceSection(keys[0], next[keys[0]]);
  };

  const move = (delta) => {
    const list = getList();
    const j = index + delta;
    if (j < 0 || j >= list.length) return;
    [list[index], list[j]] = [list[j], list[index]];
    setList(list);
  };
  const remove = () => {
    if (!confirm('Удалить этот пункт?')) return;
    const list = getList();
    list.splice(index, 1);
    setList(list);
  };

  return (
    <div className="qd-item-controls absolute -top-3 -right-3 z-10 gap-1 bg-white shadow-lg border border-outline-variant/40 rounded-full p-1">
      <button
        onClick={() => move(-1)}
        disabled={index === 0}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container-low disabled:opacity-30"
        title="Вверх"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_upward</span>
      </button>
      <button
        onClick={() => move(1)}
        disabled={index === length - 1}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container-low disabled:opacity-30"
        title="Вниз"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_downward</span>
      </button>
      <button
        onClick={remove}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-error-container text-error"
        title="Удалить"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
      </button>
    </div>
  );
}

export function AddItemButton({ section, template, label = 'Добавить' }) {
  const { editMode, isAdmin, content, replaceSection } = useEdit();
  if (!editMode || !isAdmin) return null;
  const keys = section.split('.');
  const onClick = () => {
    const next = structuredClone(content);
    let node = next;
    for (let i = 0; i < keys.length - 1; i++) node = node[keys[i]];
    const list = Array.isArray(node[keys[keys.length - 1]]) ? node[keys[keys.length - 1]] : [];
    list.push(structuredClone(template));
    node[keys[keys.length - 1]] = list;
    replaceSection(keys[0], next[keys[0]]);
  };
  return (
    <button
      onClick={onClick}
      className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-dashed border-primary text-primary hover:bg-primary-container/20"
    >
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
      {label}
    </button>
  );
}
