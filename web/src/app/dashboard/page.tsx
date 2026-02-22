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
    <div className="section-overlay" style={{ padding: '2rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="card-overlay" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem', 
          padding: '1.5rem'
        }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Dashboard</h1>
            {user && <p style={{ margin: 0, color: '#ccc' }}>Welcome back, <strong style={{ color: '#FF79C6' }}>{user.name}</strong>!</p>}
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
        
        <h2 style={{ marginBottom: '1rem', color: '#fff' }}>Available Colleges</h2>
        {loading ? (
          <div className="card-overlay" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.125rem', color: '#ccc' }}>Loading colleges...</p>
          </div>
        ) : colleges.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {colleges.map((college) => (
              <div 
                key={college.id}
                className="card-overlay" 
                style={{
                  padding: '1.5rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 121, 198, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#FF79C6' }}>{college.name}</h3>
                <p style={{ margin: '0.25rem 0', color: '#ccc' }}><strong>Course:</strong> {college.course}</p>
                <p style={{ margin: '0.25rem 0', color: '#ccc' }}><strong>Location:</strong> {college.location}</p>
                <p style={{ margin: '0.25rem 0', color: '#ccc' }}><strong>Category:</strong> {college.category}</p>
                <p style={{ margin: '0.25rem 0', color: '#FFD700', fontWeight: 'bold' }}>Cutoff Rank: {college.cutoff}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-overlay" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#ccc' }}>No colleges available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}