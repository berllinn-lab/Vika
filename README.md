# The Quiet Dialogue — лендинг с инлайн-редактированием

Одностраничный сайт для психологической практики. Администратор логинится, видит плавающую панель и правит **любой текст прямо на сайте** — тексты, список модулей, FAQ, шаги процесса, контакты, фото. Заявки с формы — в админке.

## Стек
- Next.js 14 (App Router)
- SQLite (better-sqlite3)
- iron-session (auth через cookie)
- TailwindCSS

Всё живёт в одном процессе, разворачивается на любом VPS.

## Локальный запуск

```bash
npm install
cp .env.example .env
# Сгенерировать хеш пароля для админа:
node scripts/hash.js "ваш_пароль"
# Вставить результат в ADMIN_PASSWORD_HASH в .env
# SESSION_PASSWORD — любая длинная случайная строка (32+ символов)
npm run dev
```

- Лендинг: http://localhost:3000
- Вход: http://localhost:3000/admin/login
- Заявки: http://localhost:3000/admin/inquiries (после логина)

## Как редактировать контент (для администратора)

1. Зайти на `/admin/login`, ввести логин и пароль.
2. На главной появится круглая панель внизу экрана.
3. Нажать **«Редактировать»** — тексты подсвечиваются.
4. Кликнуть на любой текст → править прямо на месте.
5. На карточках модулей/FAQ/шагов — кнопки ↑ ↓ 🗑 (в правом верхнем углу).
6. Кнопка **«+ Добавить»** под списками создаёт новый пункт.
7. Иконки модулей меняются кликом на иконку → выбор из палитры.
8. Фото заменяется кнопкой поверх фотографии.
9. **«Сохранить»** — изменения уходят в БД. **«Отмена»** — откат к состоянию до правки.
10. Выход — иконка logout на той же панели.

## Деплой на VPS (коротко)

```bash
# На сервере
git clone <repo> /opt/quiet-dialogue
cd /opt/quiet-dialogue
npm ci
cp .env.example .env   # и заполнить
node scripts/hash.js "реальный_пароль"   # → в ADMIN_PASSWORD_HASH
npm run build

# Запуск под pm2 (или systemd)
npm i -g pm2
pm2 start "npm start" --name quiet-dialogue
pm2 save
pm2 startup
```

Перед nginx/Caddy — проксировать на `127.0.0.1:3000`, выдать TLS.

### Бэкап
Все данные — в папке `data/site.db` и `public/uploads/`. Бэкапить эти два пути.

## Структура

```
app/
  page.js                  # лендинг (SSR, читает БД)
  layout.js                # провайдер + тулбар
  admin/login/page.js
  admin/inquiries/page.js
  api/
    auth/login, logout
    content                # GET публично, PUT только админ
    upload                 # загрузка фото
    inquiries, inquiries/[id]
components/
  EditProvider.js          # React context, состояние правки
  AdminToolbar.js          # плавающая панель
  EditableText.js          # inline contentEditable
  EditablePhoto.js         # загрузка нового фото
  EditableIcon.js          # палитра Material Symbols
  ItemControls.js          # ↑ ↓ 🗑 + кнопка «Добавить»
  Landing.js               # вся страница
  ContactForm.js
lib/
  db.js                    # sqlite, схема, seed
  auth.js                  # iron-session
  icons.js                 # список иконок
data/site.db               # runtime (в .gitignore)
public/uploads/            # runtime (в .gitignore)
```

## Смена пароля

```bash
node scripts/hash.js "новый_пароль"
# заменить ADMIN_PASSWORD_HASH в .env
pm2 restart quiet-dialogue
```
