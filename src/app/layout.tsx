import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Dialog } from '@/components/ui/dialog';
import { RegisterDialogContent } from '@/components/auth/register-dialog';

export const metadata: Metadata = {
  title: "RUIMUN",
  description:
    "The official web application for the Redeemer's University International Model United Nations (RUIMUN) '26 conference. Join us for a world-class simulation of the United Nations, where future leaders are forged.",
  keywords: ["RUIMUN", "Model UN", "Redeemer's University", "MUN", "conference", "diplomacy", "leadership", "global engagement"],
  authors: [{ name: "RUIMUN Secretariat" }, { name: "John J. Lawal" , url: "johnjaylawal.site" }],
  creator: "John J. Lawal",
  publisher: "RUIMUN Secretariat",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <FirebaseClientProvider>
          <Dialog>
            {children}
            <RegisterDialogContent />
          </Dialog>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
