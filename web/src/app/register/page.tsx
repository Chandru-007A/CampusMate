'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      console.log('Registration response:', data);
      
      if (res.ok) {
        setSuccess(true);
        setError('');
        
        // Redirect to login page after brief delay
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setError(data.message || 'Registration failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="section-overlay-light" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card-overlay" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <h1 style={{ marginBottom: '1.5rem', color: '#fff' }}>Register for CampusMate</h1>
      
        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'rgba(255, 50, 50, 0.2)', color: '#ff6b6b', borderRadius: '4px', border: '1px solid rgba(255, 100, 100, 0.5)' }}>
            {error}
          </div>
        )}
      
        {success && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'rgba(50, 255, 50, 0.2)', color: '#6bff6b', borderRadius: '4px', border: '1px solid rgba(100, 255, 100, 0.5)' }}>
            Registration successful! Redirecting to login...
          </div>
        )}
      
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#fff' }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your full name"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid rgba(255, 121, 198, 0.3)',
                backgroundColor: 'rgba(6, 0, 16, 0.5)', 
                borderRadius: '4px',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#ccc' }}>
          Already have an account? <Link href="/login" style={{ color: '#FF79C6', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}