import RealmProvider from '@/context/realm';
import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import React from 'react';

import './globals.css';

const noto = Noto_Sans_Thai({ subsets: ['thai'] });

export const metadata: Metadata = {
  title: 'Chat Application',
  description: 'This is chat application that using socket',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RealmProvider>
      <html lang="en">
        <body className={`bg-project_black ${noto.className}`}>{children}</body>
      </html>
    </RealmProvider>
  );
}
