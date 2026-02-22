'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface College {
  id: number;
  name: string;
  cutoff: number;
  category: string;
  course: string;
  location: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Fetch colleges
    fetch('/api/colleges')
      .then((res) => res.json())
      .then((data) => {
        setColleges(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching colleges:', err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem', 
          backgroundColor: '#fff', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Dashboard</h1>
            {user && <p style={{ margin: 0, color: '#666' }}>Welcome back, <strong>{user.name}</strong>!</p>}
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>
        
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Available Colleges</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.125rem', color: '#666' }}>Loading colleges...</p>
          </div>
        ) : colleges.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {colleges.map((college) => (
              <div 
                key={college.id} 
                style={{
                  backgroundColor: '#fff',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0070f3' }}>{college.name}</h3>
                <p style={{ margin: '0.25rem 0', color: '#666' }}><strong>Course:</strong> {college.course}</p>
                <p style={{ margin: '0.25rem 0', color: '#666' }}><strong>Location:</strong> {college.location}</p>
                <p style={{ margin: '0.25rem 0', color: '#666' }}><strong>Category:</strong> {college.category}</p>
                <p style={{ margin: '0.25rem 0', color: '#e63946', fontWeight: 'bold' }}>Cutoff Rank: {college.cutoff}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '8px' }}>
            <p style={{ color: '#666' }}>No colleges available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}