import './globals.css';
import { EditProvider } from '@/components/EditProvider';
import AdminToolbar from '@/components/AdminToolbar';
import { getContent } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export const metadata = {
  title: 'The Quiet Dialogue — психологическая практика',
  description: 'Тихое пространство для настоящего диалога с собой.',
};

export default async function RootLayout({ children }) {
  const content = getContent();
  const admin = await isAdmin();
  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface selection:bg-primary-container/30">
        <EditProvider initialContent={content} isAdmin={admin}>
          {children}
          {admin ? <AdminToolbar /> : null}
        </EditProvider>
      </body>
    </html>
  );
}
