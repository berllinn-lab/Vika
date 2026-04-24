import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'site.db');

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    init(db);
  }
  return db;
}

function init(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      request TEXT NOT NULL,
      preferred_time TEXT,
      created_at INTEGER NOT NULL,
      seen INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS instagram_posts (
      id TEXT PRIMARY KEY,
      photo_url TEXT NOT NULL,
      caption TEXT,
      permalink TEXT,
      ig_timestamp INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS telegram_subscribers (
      chat_id INTEGER PRIMARY KEY,
      created_at INTEGER NOT NULL
    );
  `);
  seedDefaults(db);
  migrateFooterLinks(db);
  migrateGallery(db);
  migrateTelegramSubscribers(db);
}

export function getContent() {
  const rows = getDb().prepare('SELECT key, value FROM content').all();
  const out = {};
  for (const r of rows) {
    try { out[r.key] = JSON.parse(r.value); }
    catch { out[r.key] = r.value; }
  }
  return out;
}

export function setContent(key, value) {
  const stmt = getDb().prepare(
    'INSERT INTO content(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at'
  );
  stmt.run(key, JSON.stringify(value), Date.now());
}

export function setManyContent(obj) {
  const tx = getDb().transaction((pairs) => {
    for (const [k, v] of pairs) setContent(k, v);
  });
  tx(Object.entries(obj));
}

export function addInquiry({ name, request, preferred_time }) {
  return getDb()
    .prepare('INSERT INTO inquiries(name,request,preferred_time,created_at) VALUES(?,?,?,?)')
    .run(name, request, preferred_time || '', Date.now());
}

export function listInquiries() {
  return getDb().prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
}

export function markInquirySeen(id) {
  return getDb().prepare('UPDATE inquiries SET seen=1 WHERE id=?').run(id);
}

export function deleteInquiry(id) {
  return getDb().prepare('DELETE FROM inquiries WHERE id=?').run(id);
}

export function listInstagramPosts({ limit = 20 } = {}) {
  return getDb()
    .prepare('SELECT * FROM instagram_posts ORDER BY ig_timestamp DESC LIMIT ?')
    .all(limit);
}

export function upsertInstagramPost({ id, photo_url, caption, permalink, ig_timestamp }) {
  getDb()
    .prepare(`
      INSERT INTO instagram_posts(id, photo_url, caption, permalink, ig_timestamp, created_at)
      VALUES(?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET
        photo_url=excluded.photo_url,
        caption=excluded.caption,
        permalink=excluded.permalink
    `)
    .run(id, photo_url, caption || '', permalink || '', ig_timestamp, Date.now());
}

export function igPostExists(id) {
  return Boolean(getDb().prepare('SELECT 1 FROM instagram_posts WHERE id=?').get(id));
}

// Миграция: обновляет href ссылок футера с '#' на реальные страницы,
// и исправляет telegram_url. Запускается при каждом старте.
function migrateFooterLinks(db) {
  // --- footer: privacy/terms links + telegram social ---
  const row = db.prepare("SELECT value FROM content WHERE key='footer'").get();
  if (row) {
    try {
      const footer = JSON.parse(row.value);
      let changed = false;
      const map = {
        'Политика конфиденциальности': '/privacy',
        'Условия использования': '/terms',
      };
      (footer.links || []).forEach((l) => {
        if (map[l.label] && l.href === '#') {
          l.href = map[l.label];
          changed = true;
        }
      });
      (footer.links || []).forEach((l) => {
        if (l.label === 'Telegram' && (l.href === 'https://t.me/' || l.href === '#')) {
          l.href = 'https://t.me/+79114511696';
          changed = true;
        }
      });
      if (changed) {
        db.prepare("UPDATE content SET value=?, updated_at=? WHERE key='footer'")
          .run(JSON.stringify(footer), Date.now());
      }
    } catch {}
  }

  // --- contact.telegram_url (ключ 'contact', не 'contacts') ---
  const cRow = db.prepare("SELECT value FROM content WHERE key='contact'").get();
  if (cRow) {
    try {
      const contact = JSON.parse(cRow.value);
      if (contact.telegram_url === 'https://t.me/' || contact.telegram_url === '#') {
        contact.telegram_url = 'https://t.me/+79114511696';
        db.prepare("UPDATE content SET value=?, updated_at=? WHERE key='contact'")
          .run(JSON.stringify(contact), Date.now());
      }
    } catch {}
  }
}

// Миграция: добавляет секцию gallery для существующих БД без неё.
function migrateGallery(db) {
  const row = db.prepare("SELECT value FROM content WHERE key='gallery'").get();
  if (row) return; // уже есть
  db.prepare("INSERT INTO content(key,value,updated_at) VALUES(?,?,?)").run(
    'gallery',
    JSON.stringify({
      eyebrow: 'Пространство',
      title: 'Место, где проходит работа.',
      items: [
        { photo: '', caption: 'Кабинет' },
        { photo: '', caption: 'Детали' },
        { photo: '', caption: 'Атмосфера' },
      ],
    }),
    Date.now()
  );
}

function migrateTelegramSubscribers(db) {
  const cols = db.prepare("PRAGMA table_info(telegram_subscribers)").all().map((c) => c.name);
  if (!cols.includes('first_name')) {
    db.exec("ALTER TABLE telegram_subscribers ADD COLUMN first_name TEXT NOT NULL DEFAULT ''");
  }
  if (!cols.includes('username')) {
    db.exec("ALTER TABLE telegram_subscribers ADD COLUMN username TEXT NOT NULL DEFAULT ''");
  }
}

function seedDefaults(db) {
  const existing = db.prepare('SELECT COUNT(*) as c FROM content').get().c;
  if (existing > 0) return;

  const defaults = {
    brand: 'The Quiet Dialogue',
    nav: [
      { href: '#about', label: 'Обо мне' },
      { href: '#expertise', label: 'Направления' },
      { href: '#process', label: 'Процесс' },
      { href: '#faq', label: 'FAQ' },
    ],
    hero: {
      eyebrow: 'Клинический психолог • Частная практика',
      title_before: 'Место, где можно ',
      title_accent: 'просто быть',
      title_after: '.',
      cta_primary: 'Записаться на сессию',
      cta_secondary: 'Как это работает',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbb3EKZOXWlf33FSNm1mvwIe3rvU8kyEAlRUNfmOjJxy52XUuV4ox6aLy4pX83ncgwisuDby0yoKpelOYsJgfHFutG3Gxc6xMAWH4jXamI3nVzRVG6lHFcHbvUd4HUNgd9GWQ0RqFAGkaAjFnUVrlt26BZp7c_owEHPoFY5AWEm9GwNR4ku3x-HS8TnSXSInr5ZnEBesuxAyF8kHyQXc3TirvXjkBupVaHNZBPoAuIlNjeDHdrMSCHUZ0a0V6lZWr5cim9HXIS7oQ',
    },
    about: {
      eyebrow: 'О практике',
      title: 'С эмпатией в сердце, с наукой в руках.',
      paragraphs: [
        'На сессиях мы выходим за рамки работы с симптомами. Мы создаём диалог — тихое, осознанное пространство, в котором можно исследовать слои своего опыта с любопытством, а не с осуждением.',
        'Мой подход опирается на скандинавские принципы профессиональной теплоты и функционального минимализма. Терапия должна ощущаться как убежище — комната, где можно отложить груз ожиданий и начать проговаривать свою правду.',
      ],
      credentials: [
        { label: 'Образование', title: 'Ph.D. по клинической психологии', subtitle: 'Университет Копенгагена' },
        { label: 'Философия', title: 'Гуманистически-экзистенциальный подход', subtitle: 'Интеграция КПТ и майндфулнес' },
        { label: 'Аккредитация', title: 'Лицензированный психотерапевт', subtitle: 'Член BPS и APA' },
      ],
    },
    expertise: {
      eyebrow: 'Направления работы',
      title: 'Мягкая поддержка в сложные моменты.',
      items: [
        { icon: 'waves', title: 'Тревога и напряжение', text: 'Найти тихий центр посреди шторма постоянного беспокойства и телесного дискомфорта.' },
        { icon: 'cloud', title: 'Депрессия и апатия', text: 'Постепенно возвращать краски в жизнь, когда всё кажется серым и тяжёлым.' },
        { icon: 'energy_savings_leaf', title: 'Выгорание и усталость', text: 'Восстановить жизненно важную границу между тем, что вы отдаёте миру, и тем, что оставляете себе.' },
        { icon: 'favorite', title: 'Отношения', text: 'Разбираться в тонких узорах привязанности, близости и коммуникации с другими.' },
        { icon: 'self_care', title: 'Самоценность', text: 'Взращивать более добрый внутренний монолог и видеть свою неотъемлемую, тихую ценность.' },
        { icon: 'autostop', title: 'Жизненные переходы', text: 'Удерживать пространство для горя и роста, которые приходят с важными сдвигами в идентичности и обстоятельствах.' },
      ],
    },
    process: {
      eyebrow: 'Процесс',
      title: 'Как мы идём этим путём.',
      steps: [
        { num: '01', title: 'Первая сессия', text: '50-минутная консультация, чтобы понять ваши запросы и почувствовать, подходит ли наш диалог.' },
        { num: '02', title: 'Регулярная работа', text: 'Еженедельные или раз в две недели встречи — углубляем понимание и осваиваем новые инструменты.' },
        { num: '03', title: 'Интегрированный рост', text: 'Двигаетесь дальше с более ясным чувством себя и внутренними ресурсами для любой погоды.' },
      ],
    },
    faq: {
      eyebrow: 'Частые вопросы',
      title: 'В поисках ясности.',
      items: [
        { q: 'Сколько длится сессия?', a: 'Стандартная сессия — 50 минут. Этого достаточно для сфокусированного диалога и времени на переход и рефлексию.' },
        { q: 'Есть ли онлайн-консультации?', a: 'Да, я провожу защищённые видео-сессии для тех, кто не может прийти лично. Качество работы не меняется.' },
        { q: 'Защищена ли моя приватность?', a: 'Конфиденциальность — основа практики. Все записи хранятся в соответствии с GDPR и профессиональной этикой.' },
        { q: 'Правила отмены?', a: 'Пожалуйста, сообщайте об отмене минимум за 24 часа — это позволит передать время тому, кто ждёт поддержки.' },
        { q: 'Сколько понадобится сессий?', a: 'Длительность терапии индивидуальна. Кому-то достаточно нескольких встреч, кто-то выбирает долгосрочную работу.' },
        { q: 'Работаете со страховкой?', a: 'Сотрудничаю с несколькими крупными провайдерами. Напишите мне данные — проверим покрытие до первой сессии.' },
      ],
    },
    contact: {
      eyebrow: 'Начать разговор',
      title: 'Сделайте тихий шаг вперёд.',
      address_label: 'Наше пространство',
      address: 'Strandgade 44, 1401\nКопенгаген, Дания',
      contact_label: 'Прямой контакт',
      telegram_text: 'Написать в Telegram',
      telegram_url: 'https://t.me/+79114511696',
    },
    gallery: {
      eyebrow: 'Пространство',
      title: 'Место, где проходит работа.',
      items: [
        { photo: '', caption: 'Кабинет' },
        { photo: '', caption: 'Детали' },
        { photo: '', caption: 'Атмосфера' },
      ],
    },
    footer: {
      copyright: '© 2024 The Human Sanctuary. Все права защищены.',
      links: [
        { label: 'Политика конфиденциальности', href: '/privacy' },
        { label: 'Условия использования', href: '/terms' },
        { label: 'Telegram', href: 'https://t.me/+79114511696' },
      ],
    },
  };

  const stmt = db.prepare('INSERT INTO content(key,value,updated_at) VALUES(?,?,?)');
  const now = Date.now();
  for (const [k, v] of Object.entries(defaults)) {
    stmt.run(k, JSON.stringify(v), now);
  }
}

export function addTelegramSubscriber(chatId, firstName, username) {
  getDb()
    .prepare(
      'INSERT INTO telegram_subscribers(chat_id, first_name, username, created_at) VALUES(?,?,?,?) ON CONFLICT(chat_id) DO UPDATE SET first_name=excluded.first_name, username=excluded.username'
    )
    .run(chatId, firstName || '', username || '', Date.now());
}

export function listTelegramSubscribers() {
  return getDb()
    .prepare('SELECT chat_id FROM telegram_subscribers')
    .all()
    .map((r) => r.chat_id);
}

export function listTelegramSubscribersDetailed() {
  return getDb()
    .prepare('SELECT chat_id, first_name, username, created_at FROM telegram_subscribers ORDER BY created_at DESC')
    .all();
}

export function removeTelegramSubscriber(chatId) {
  getDb()
    .prepare('DELETE FROM telegram_subscribers WHERE chat_id=?')
    .run(chatId);
}
