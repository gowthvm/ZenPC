import './globals.css';

import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fontDisplay = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ZenPC',
  description: 'Premium PC Builder',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="min-h-dvh bg-bg text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
