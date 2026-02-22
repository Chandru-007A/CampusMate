'use client';

import { useState } from 'react';
import StudentForm from '@/components/StudentForm';
import ProbabilityMeter from '@/components/ProbabilityMeter';

interface PredictionResult {
  college: string;
  course: string;
  location: string;
  probability: number;
  cutoffScore: number;
}

export default function PredictionPage() {
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (formData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/Predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        throw new Error('Failed to get predictions');
      }
      
      const data = await res.json();
      console.log('Received predictions:', data);
      setResults(data);
      
      if (data.length === 0) {
        setError('No colleges found matching your criteria. Try different filters.');
      }
    } catch (error) {
      console.error('Prediction failed', error);
      setError('Failed to get predictions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>College Admission Predictor</h1>
      <StudentForm onSubmit={handlePredict} />
      
      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem' }}>🔍 Analyzing your profile and finding matching colleges...</p>
        </div>
      )}
      
      {error && (
        <div style={{ 
          padding: '1rem', 
          margin: '1rem 0', 
          backgroundColor: '#fee', 
          borderRadius: '8px',
          color: '#c00'
        }}>
          {error}
        </div>
      )}
      
      {!loading && results.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Your Admission Predictions ({results.length} colleges)</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {results.map((result, idx) => (
              <div 
                key={idx} 
                style={{ 
                  border: '1px solid #ddd',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>
                      {result.college}
                    </h3>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                      <strong>Course:</strong> {result.course}
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                      <strong>Location:</strong> {result.location}
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                      <strong>Cutoff Score:</strong> {result.cutoffScore}
                    </p>
                  </div>
                  <div style={{ marginLeft: '2rem' }}>
                    <ProbabilityMeter probability={result.probability} />
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  backgroundColor: result.probability >= 0.7 ? '#e8f5e9' : result.probability >= 0.5 ? '#fff3e0' : '#ffebee',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  {result.probability >= 0.7 && '✅ High chance of admission! This is a great match for your profile.'}
                  {result.probability >= 0.5 && result.probability < 0.7 && '⚠️ Moderate chance. Consider this as a target college.'}
                  {result.probability < 0.5 && '❌ Lower chance of admission. This might be a reach college.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}