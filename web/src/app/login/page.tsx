'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      console.log('Login response:', data);
      
      if (res.ok) {
        setSuccess(true);
        setError('');
        
        // Store user data in localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('User stored in localStorage:', data.user);
        }
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log('Token stored in localStorage');
        }
        
        // Immediate redirect using next/navigation router
        console.log('Redirecting to dashboard...');
        router.push('/dashboard');
        setLoading(false);
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="section-overlay-light" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card-overlay" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <h1 style={{ marginBottom: '1.5rem', color: '#fff' }}>Login to CampusMate</h1>
      
        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'rgba(255, 50, 50, 0.2)', color: '#ff6b6b', borderRadius: '4px', border: '1px solid rgba(255, 100, 100, 0.5)' }}>
            {error}
          </div>
        )}
      
        {success && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'rgba(50, 255, 50, 0.2)', color: '#6bff6b', borderRadius: '4px', border: '1px solid rgba(100, 255, 100, 0.5)' }}>
            Login successful! Redirecting...
          </div>
        )}
      
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#fff' }}>Email</label>
            <input
              type="email"
              value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your email"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid rgba(255, 121, 198, 0.3)', 
              backgroundColor: 'rgba(6, 0, 16, 0.5)',
              borderRadius: '4px',
              fontSize: '1rem',
              color: '#fff'
            }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#fff' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your password"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid rgba(255, 121, 198, 0.3)', 
              backgroundColor: 'rgba(6, 0, 16, 0.5)',
              borderRadius: '4px',
              fontSize: '1rem',
              color: '#fff'
            }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%',
            padding: '0.75rem 1rem', 
            backgroundColor: loading ? '#666' : '#FF79C6',
            color: loading ? '#999' : '#060010',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(255, 121, 198, 0.1)', borderRadius: '4px', border: '1px solid rgba(255, 121, 198, 0.2)' }}>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#ccc' }}>Test Accounts:</p>
        <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', fontFamily: 'monospace', color: '#FF79C6' }}>test@example.com / password123</p>
        <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', fontFamily: 'monospace', color: '#FF79C6' }}>demo@example.com / demo123</p>
      </div>
      
      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#ccc' }}>
        Don't have an account? <Link href="/register" style={{ color: '#FF79C6', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
      </p>
      </div>
    </div>
  );
}