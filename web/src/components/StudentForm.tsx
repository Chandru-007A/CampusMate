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
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '2rem 0' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Cutoff Score</label>
        <input type="number" name="cutoff" value={form.cutoff} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }}>
          <option>General</option>
          <option>OBC</option>
          <option>SC</option>
          <option>ST</option>
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Preferred Course</label>
        <input type="text" name="course" value={form.course} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Preferred Location</label>
        <input type="text" name="location" value={form.location} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
      </div>
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>Predict</button>
    </form>
  );
}