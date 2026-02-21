'use client';

import { useState } from 'react';
import StudentForm from '@/components/StudentForm';
import CollegeCard from '@/components/CollegeCard';
import ProbabilityMeter from '@/components/ProbabilityMeter';

interface PredictionResult {
  college: string;
  probability: number;
}

export default function PredictionPage() {
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (formData: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Prediction failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>College Predictor</h1>
      <StudentForm onSubmit={handlePredict} />
      {loading && <p>Loading predictions...</p>}
      {results.length > 0 && (
        <div>
          <h2>Predicted Colleges</h2>
          {results.map((r, idx) => (
            <div key={idx} style={{ marginBottom: '1rem' }}>
              <CollegeCard college={{ name: r.college } as any} />
              <ProbabilityMeter probability={r.probability} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}