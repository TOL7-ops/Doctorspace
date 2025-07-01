import './globals.css';
import { Inter } from 'next/font/google';
import SupabaseProvider from '@/components/providers/SupabaseProvider';
import { createServerSupabase } from '@/lib/supabase-server';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DoctorSpace',
  description: 'Your healthcare management platform',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider session={session}>
          {children}
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  );
}
