import RealmProvider from '@/context/realm';
import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <body className={`bg-project_black ${noto.className}`}>
          <ToastContainer theme="dark" />
          {children}
        </body>
      </html>
    </RealmProvider>
  );
}
