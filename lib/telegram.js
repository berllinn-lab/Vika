import { listTelegramSubscribers } from './db';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(chatId, text) {
  if (!TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

export async function notifyNewInquiry({ name, request, preferred_time }) {
  if (!TOKEN) return;
  const subscribers = listTelegramSubscribers();
  if (subscribers.length === 0) return;
  const time = preferred_time ? `\n🕐 <b>Удобное время:</b> ${preferred_time}` : '';
  const text =
    `📩 <b>Новая заявка!</b>\n\n` +
    `👤 <b>Имя:</b> ${name}\n` +
    `✉️ <b>Запрос:</b> ${request}` +
    time;
  await Promise.all(subscribers.map((chatId) => sendTelegramMessage(chatId, text)));
}
