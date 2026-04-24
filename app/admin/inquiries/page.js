import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { listInquiries } from '@/lib/db';
import InquiriesList from './InquiriesList';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  if (!(await isAdmin())) redirect('/admin/login');
  const items = listInquiries();
  return (
    <div className="min-h-screen bg-surface-container-low py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-label text-primary mb-2">Админ</p>
            <h1 className="text-4xl font-headline italic">Заявки с сайта</h1>
          </div>
          <a
            href="/"
            className="text-label border-b border-tertiary-container pb-1 hover:border-primary"
          >
            ← На сайт
          </a>
        </div>
        <div className="mb-8 flex items-start gap-3 bg-white border border-outline-variant/20 rounded-2xl px-5 py-4">
          <span className="text-2xl leading-none mt-0.5">📬</span>
          <div>
            <p className="font-medium text-on-background">Уведомления в Telegram</p>
            <p className="text-sm text-on-surface-variant mt-1">
              Чтобы получать уведомления о новых заявках — напишите боту{' '}
              <a
                href="https://t.me/vikacrush_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                @vikacrush_bot
              </a>{' '}
              команду <code className="bg-surface-container-highest rounded px-1 py-0.5 text-xs">/start</code>
            </p>
          </div>
        </div>
        <InquiriesList items={items} />
      </div>
    </div>
  );
}
