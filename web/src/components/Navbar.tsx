'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      background: 'rgba(6, 0, 16, 0.9)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #FF79C6', 
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF79C6', textDecoration: 'none' }}>
          CampusMate
        </Link>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link 
            href="/prediction" 
            style={{ 
              color: pathname === '/prediction' ? '#FF79C6' : 'white', 
              textDecoration: 'none',
              fontWeight: pathname === '/prediction' ? 'bold' : 'normal',
              transition: 'color 0.3s ease'
            }}
          >
            Predict
          </Link>
          <Link 
            href="/chatbot" 
            style={{ 
              color: pathname === '/chatbot' ? '#FF79C6' : 'white', 
              textDecoration: 'none',
              fontWeight: pathname === '/chatbot' ? 'bold' : 'normal',
              transition: 'color 0.3s ease'
            }}
          >
            Chat
          </Link>
          <Link 
            href="/dashboard" 
            style={{ 
              color: pathname === '/dashboard' ? '#FF79C6' : 'white', 
              textDecoration: 'none',
              fontWeight: pathname === '/dashboard' ? 'bold' : 'normal',
              transition: 'color 0.3s ease'
            }}
          >
            Dashboard
          </Link>
          <Link 
            href="/login" 
            style={{ 
              color: pathname === '/login' ? '#FF79C6' : 'white', 
              textDecoration: 'none',
              fontWeight: pathname === '/login' ? 'bold' : 'normal',
              transition: 'color 0.3s ease'
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}