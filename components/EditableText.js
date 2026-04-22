'use client';

import { useEffect, useRef } from 'react';
import { useEdit } from './EditProvider';

/**
 * Inline-редактируемый текст. Рендерит заданный тег.
 * В режиме редактирования становится contentEditable и сохраняет на blur.
 *
 * props:
 *  - as: 'span' | 'h1' | 'p' | ...
 *  - path: путь до поля в content (например, 'hero.title_before' или 'expertise.items.2.title')
 *  - value: текущее значение
 *  - multiline: переводы строк сохраняются (по умолчанию false, Enter делает blur)
 */
export default function EditableText({
  as: Tag = 'span',
  path,
  value,
  multiline = false,
  className = '',
  placeholder = '',
  ...rest
}) {
  const { isAdmin, editMode, update } = useEdit();
  const ref = useRef(null);
  const lastPropRef = useRef(value);

  // Синхронизируем DOM с внешним значением только если оно поменялось извне
  useEffect(() => {
    if (!ref.current) return;
    if (value !== lastPropRef.current) {
      ref.current.textContent = value ?? '';
      lastPropRef.current = value;
    }
  }, [value]);

  const editable = isAdmin && editMode;

  const handleBlur = () => {
    if (!ref.current) return;
    const text = multiline ? ref.current.innerText : ref.current.textContent;
    if (text !== value) {
      lastPropRef.current = text;
      update(path, text);
    }
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      ref.current?.blur();
    }
    if (e.key === 'Escape') {
      if (ref.current) ref.current.textContent = value ?? '';
      ref.current?.blur();
    }
  };

  return (
    <Tag
      ref={ref}
      className={`${className} ${editable ? 'qd-editable' : ''}`}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={editable ? handleBlur : undefined}
      onKeyDown={editable ? handleKeyDown : undefined}
      onClick={editable ? (e) => { e.stopPropagation(); e.preventDefault(); ref.current?.focus(); } : undefined}
      data-placeholder={placeholder}
      {...rest}
    >
      {value}
    </Tag>
  );
}
