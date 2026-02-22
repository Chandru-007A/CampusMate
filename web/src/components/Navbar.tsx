'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav style={{ padding: '1rem 2rem', background: '#060010', borderBottom: '1px solid #FF79C6', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF79C6', textDecoration: 'none' }}>
          CampusMate
        </Link>
        <div>
          <Link href="/prediction" style={{ marginRight: '1rem', color: pathname === '/prediction' ? '#FF79C6' : 'white', textDecoration: 'none' }}>
            Predict
          </Link>
          <Link href="/chatbot" style={{ marginRight: '1rem', color: pathname === '/chatbot' ? '#FF79C6' : 'white', textDecoration: 'none' }}>
            Chat
          </Link>
          <Link href="/dashboard" style={{ marginRight: '1rem', color: pathname === '/dashboard' ? '#FF79C6' : 'white', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <Link href="/login" style={{ color: pathname === '/login' ? '#FF79C6' : 'white', textDecoration: 'none' }}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}