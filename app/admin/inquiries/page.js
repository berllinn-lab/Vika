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
        <InquiriesList items={items} />
      </div>
    </div>
  );
}
