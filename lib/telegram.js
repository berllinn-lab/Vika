import { listTelegramSubscribers } from './db';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GH_TOKEN = process.env.GH_DISPATCH_TOKEN;
const GH_REPO = 'berllinn-lab/Vika';

export async function sendTelegramMessage(chatId, text) {
  if (!TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

export async function notifyNewInquiry({ name, request, preferred_time }) {
  const subscribers = listTelegramSubscribers();
  if (subscribers.length === 0) return;

  const time = preferred_time ? `\n🕐 <b>Удобное время:</b> ${preferred_time}` : '';
  const text =
    `📩 <b>Новая заявка!</b>\n\n` +
    `👤 <b>Имя:</b> ${name}\n` +
    `✉️ <b>Запрос:</b> ${request}` +
    time;

  if (!GH_TOKEN) return;

  await fetch(`https://api.github.com/repos/${GH_REPO}/actions/workflows/telegram-notify.yml/dispatches`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        chat_ids: JSON.stringify(subscribers),
        message: text,
      },
    }),
  });
}
