'use client';

import { useEffect, useState } from 'react';
import CollegeCard from '@/components/CollegeCard';

interface College {
  id: number;
  name: string;
  cutoff: number;
  category: string;
  course: string;
  location: string;
}

export default function DashboardPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/colleges')
      .then((res) => res.json())
      .then((data) => {
        setColleges(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading colleges...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {colleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      )}
    </div>
  );
}