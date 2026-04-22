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

## Деплой: Docker + GitHub Actions (myjino VPS)

**Один раз** настраиваем сервер (`803820a5872d.vps.myjino.ru`, SSH порт `49355`):

```bash
# с локальной машины
scp -P 49355 scripts/server-bootstrap.sh root@803820a5872d.vps.myjino.ru:/root/
ssh -p 49355 root@803820a5872d.vps.myjino.ru bash /root/server-bootstrap.sh
```

Это поставит Docker и создаст `/opt/quiet-dialogue`.

**GitHub Secrets** (Settings → Secrets and variables → Actions → New repository secret), репо `berllinn-lab/Vika`:

| Secret | Значение |
|---|---|
| `SSH_HOST` | `803820a5872d.vps.myjino.ru` |
| `SSH_PORT` | `49355` |
| `SSH_USER` | `root` |
| `SSH_PASSWORD` | (пароль от сервера) |
| `HOST_PORT` | `80` |
| `ADMIN_LOGIN` | `vika` |
| `ADMIN_PASSWORD_HASH` | bcrypt-хеш (см. ниже) |
| `SESSION_PASSWORD` | длинная случайная строка |

Сгенерировать хеш пароля:
```bash
node scripts/hash.js "новый_пароль"
```

Сгенерировать `SESSION_PASSWORD`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### Деплой
- `git push origin main` → GitHub Actions сама подключится к серверу, подтянет код, пересоберёт и перезапустит контейнер.
- Ручной запуск: Actions → Deploy → Run workflow.

### Что происходит на сервере
- Код лежит в `/opt/quiet-dialogue`.
- Перед деплоем — бэкап `data/site.db` в `backups/` (храним 20 последних).
- БД и загруженные фото — volumes (`./data`, `./public/uploads`) и не теряются при пересборке.
- Контейнер: `docker compose up -d --build`, слушает порт `HOST_PORT` (по умолчанию 80).

### Привязка домена `vikavasilieva.ru`
1. В DNS домена поставить A-запись на IP сервера myjino.
2. Для HTTPS проще всего поставить Caddy перед контейнером:

```bash
# на сервере
apt-get install -y caddy
cat > /etc/caddy/Caddyfile <<'EOF'
vikavasilieva.ru, www.vikavasilieva.ru {
    reverse_proxy 127.0.0.1:3000
}
EOF
systemctl restart caddy
```

В этом случае в GitHub Secrets поменяйте `HOST_PORT` на `3000` и запустите workflow снова — контейнер перестанет занимать 80-й порт, его возьмёт Caddy с авто-TLS от Let's Encrypt.

### Смена пароля администратора
```bash
node scripts/hash.js "новый_пароль"
# обновить ADMIN_PASSWORD_HASH в GitHub Secrets → Re-run workflow
```


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
