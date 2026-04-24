import { NextResponse } from 'next/server';
import { addTelegramSubscriber } from '@/lib/db';
import { sendTelegramMessage } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = body?.message;
  if (!message) return NextResponse.json({ ok: true });

  const chatId = message?.chat?.id;
  const text = message?.text?.trim() || '';
  const firstName = message?.from?.first_name || '';
  const username = message?.from?.username || '';

  if (chatId && text === '/start') {
    addTelegramSubscriber(chatId, firstName, username);
    try {
      await sendTelegramMessage(
        chatId,
        '✅ Вы подписались на уведомления!\n\nТеперь каждый раз, когда кто-то оставит заявку на сайте, я сразу пришлю вам сообщение.',
      );
    } catch {
      // Telegram API недоступен — подписчик уже сохранён
    }
  }

  return NextResponse.json({ ok: true });
}
