'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const Ctx = createContext(null);

export function useEdit() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useEdit must be used inside EditProvider');
  return c;
}

export function EditProvider({ initialContent, isAdmin, children }) {
  const [content, setContent] = useState(initialContent || {});
  const [editMode, setEditMode] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const initialRef = useRef(initialContent);

  // Обновляем значение по пути section.field или вложенным путям в массиве: expertise.items.2.title
  const update = useCallback((path, value) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let node = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (node[k] === undefined || node[k] === null) {
          node[k] = isNaN(Number(keys[i + 1])) ? {} : [];
        }
        node = node[k];
      }
      node[keys[keys.length - 1]] = value;
      return next;
    });
    setDirty(true);
  }, []);

  // Заменить целиком секцию (для списков)
  const replaceSection = useCallback((key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  // Скрыть/показать секцию по id
  const toggleSection = useCallback((id) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      if (!next._hidden) next._hidden = {};
      next._hidden[id] = !next._hidden[id];
      return next;
    });
    setDirty(true);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setStatus('');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error('Ошибка сохранения');
      setDirty(false);
      initialRef.current = content;
      setStatus('Сохранено');
      setTimeout(() => setStatus(''), 2000);
    } catch (e) {
      setStatus(e.message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  }, [content]);

  // Точечное сохранение куска content — используется для auto-save фото/иконок.
  const saveNow = useCallback(async (nextContent) => {
    setSaving(true);
    setStatus('');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextContent),
      });
      if (!res.ok) throw new Error('Ошибка сохранения');
      initialRef.current = nextContent;
      setDirty(false);
      setStatus('Сохранено');
      setTimeout(() => setStatus(''), 1500);
    } catch (e) {
      setStatus(e.message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  }, []);

  // Обновить путь и сразу сохранить (для загрузок файлов).
  const updateAndSave = useCallback(
    (path, value) => {
      setContent((prev) => {
        const next = structuredClone(prev);
        const keys = path.split('.');
        let node = next;
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i];
          if (node[k] === undefined || node[k] === null) {
            node[k] = isNaN(Number(keys[i + 1])) ? {} : [];
          }
          node = node[k];
        }
        node[keys[keys.length - 1]] = value;
        saveNow(next);
        return next;
      });
    },
    [saveNow]
  );

  const discard = useCallback(() => {
    setContent(initialRef.current);
    setDirty(false);
  }, []);

  // Предупреждение при уходе со страницы с несохранёнными
  useEffect(() => {
    if (!dirty) return;
    const h = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  // Класс на body для включения стилей редактирования
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('qd-edit-mode', Boolean(isAdmin && editMode));
  }, [editMode, isAdmin]);

  const value = useMemo(
    () => ({
      content,
      isAdmin: Boolean(isAdmin),
      editMode,
      setEditMode,
      update,
      replaceSection,
      toggleSection,
      save,
      discard,
      updateAndSave,
      dirty,
      saving,
      status,
    }),
    [content, isAdmin, editMode, update, replaceSection, toggleSection, save, discard, updateAndSave, dirty, saving, status]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
