'use client';

import { useState } from 'react';

interface Props {
  onSubmit: (data: any) => void;
}

export default function StudentForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    cutoff: '',
    category: 'General',
    course: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="card-overlay" style={{ maxWidth: '600px', padding: '1.5rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#fff' }}>Cutoff Score</label>
        <input 
          type="number" 
          name="cutoff" 
          value={form.cutoff} 
          onChange={handleChange} 
          required 
          placeholder="Enter your cutoff score"
          style={{ 
            width: '100%', 
            padding: '0.75rem',
            border: '1px solid rgba(255, 121, 198, 0.3)',
            backgroundColor: 'rgba(6, 0, 16, 0.5)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '1rem'
          }} 
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#fff' }}>Category</label>
        <select 
          name="category" 
          value={form.category} 
          onChange={handleChange} 
          style={{ 
            width: '100%', 
            padding: '0.75rem',
            border: '1px solid rgba(255, 121, 198, 0.3)',
            backgroundColor: 'rgba(6, 0, 16, 0.5)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '1rem'
          }}
        >
          <option style={{ backgroundColor: '#060010' }}>General</option>
          <option style={{ backgroundColor: '#060010' }}>OBC</option>
          <option style={{ backgroundColor: '#060010' }}>SC</option>
          <option style={{ backgroundColor: '#060010' }}>ST</option>
          <option style={{ backgroundColor: '#060010' }}>MBC</option>
          <option style={{ backgroundColor: '#060010' }}>BC</option>
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#fff' }}>Preferred Course</label>
        <input 
          type="text" 
          name="course" 
          value={form.course} 
          onChange={handleChange} 
          required 
          placeholder="e.g., Computer Science, Information Technology"
          style={{ 
            width: '100%', 
            padding: '0.75rem',
            border: '1px solid rgba(255, 121, 198, 0.3)',
            backgroundColor: 'rgba(6, 0, 16, 0.5)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '1rem'
          }} 
        />
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#fff' }}>Preferred Location</label>
        <input 
          type="text" 
          name="location" 
          value={form.location} 
          onChange={handleChange} 
          required 
          placeholder="e.g., Chennai, Bangalore, Mumbai"
          style={{ 
            width: '100%', 
            padding: '0.75rem',
            border: '1px solid rgba(255, 121, 198, 0.3)',
            backgroundColor: 'rgba(6, 0, 16, 0.5)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '1rem'
          }} 
        />
      </div>
      <button 
        type="submit" 
        style={{ 
          width: '100%',
          padding: '0.875rem 2rem',
          backgroundColor: '#FF79C6',
          color: '#060010',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ff9ed6';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 121, 198, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FF79C6';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Predict Colleges
      </button>
    </form>
  );
}