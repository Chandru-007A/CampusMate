'use client';

import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlobalBackground from '@/components/GlobalBackground';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Global Fixed Animated Background */}
        <GlobalBackground />
        
        {/* Scrollable Content */}
        <div className="content-wrapper">
          <Navbar />
          <main style={{ position: 'relative', zIndex: 2 }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}