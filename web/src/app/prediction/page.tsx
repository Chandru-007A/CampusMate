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
  status?: string;  // Safe, Target, Dream
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
    <div className="section-overlay" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <h1 className="text-readable-strong" style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>College Admission Predictor</h1>
      <StudentForm onSubmit={handlePredict} />
      
      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p className="text-readable" style={{ fontSize: '1.2rem' }}>🔍 Analyzing your profile and finding matching colleges...</p>
        </div>
      )}
      
      {error && (
        <div className="card-overlay" style={{ 
          padding: '1rem', 
          margin: '1rem 0', 
          backgroundColor: 'rgba(255, 50, 50, 0.2)', 
          borderRadius: '8px',
          border: '1px solid rgba(255, 100, 100, 0.5)',
          color: '#ff6b6b'
        }}>
          {error}
        </div>
      )}
      
      {!loading && results.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 className="text-readable-strong" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>
            Your Admission Predictions
          </h2>
          <p className="text-readable" style={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#ccc' }}>
            Found {results.length} colleges • Based on real cutoff data from 2020-2023
          </p>
          
          {/* Category Summary */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {['Safe', 'Target', 'Dream'].map(status => {
              const count = results.filter(r => r.status === status).length;
              if (count === 0) return null;
              return (
                <div key={status} className="card-overlay" style={{ padding: '1rem', flex: '1', minWidth: '150px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '0.25rem' }}>{status} Colleges</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF79C6' }}>{count}</div>
                </div>
              );
            })}
          </div>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {results.map((result, idx) => {
              // Get status badge styling
              const statusColors = {
                Safe: { bg: 'rgba(76, 175, 80, 0.25)', border: '#4caf50', text: '#81c784' },
                Target: { bg: 'rgba(255, 152, 0, 0.25)', border: '#ff9800', text: '#ffb74d' },
                Dream: { bg: 'rgba(156, 39, 176, 0.25)', border: '#9c27b0', text: '#ba68c8' }
              };
              const statusStyle = statusColors[result.status as keyof typeof statusColors] || statusColors.Target;
              
              return (
                <div 
                  key={idx}
                  className="card-overlay" 
                  style={{ 
                    padding: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#FF79C6' }}>
                          {result.college}
                        </h3>
                        {result.status && (
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: statusStyle.bg,
                            border: `1px solid ${statusStyle.border}`,
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: statusStyle.text
                          }}>
                            {result.status}
                          </span>
                        )}
                      </div>
                      <p style={{ margin: '0.25rem 0', color: '#ccc' }}>
                        <strong style={{ color: '#fff' }}>Course:</strong> {result.course}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#ccc' }}>
                        <strong style={{ color: '#fff' }}>Location:</strong> {result.location}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#ccc' }}>
                        <strong style={{ color: '#fff' }}>Cutoff Rank:</strong> {result.cutoffScore}
                      </p>
                    </div>
                    <div style={{ marginLeft: '2rem' }}>
                      <ProbabilityMeter probability={result.probability} />
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '0.75rem', 
                    backgroundColor: result.probability >= 0.7 ? 'rgba(76, 175, 80, 0.2)' : result.probability >= 0.5 ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                    border: result.probability >= 0.7 ? '1px solid rgba(76, 175, 80, 0.5)' : result.probability >= 0.5 ? '1px solid rgba(255, 152, 0, 0.5)' : '1px solid rgba(244, 67, 54, 0.5)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    color: result.probability >= 0.7 ? '#81c784' : result.probability >= 0.5 ? '#ffb74d' : '#e57373',
                    fontWeight: '500'
                  }}>
                    {result.status === 'Safe' && '✅ Excellent match! You have a strong chance of admission here.'}
                    {result.status === 'Target' && '🎯 Good opportunity! Your profile aligns well with this college.'}
                    {result.status === 'Dream' && '🌟 Aspirational choice! Worth applying if this is your preferred college.'}
                    {!result.status && result.probability >= 0.7 && '✅ High chance of admission! This is a great match for your profile.'}
                    {!result.status && result.probability >= 0.5 && result.probability < 0.7 && '⚠️ Moderate chance. Consider this as a target college.'}
                    {!result.status && result.probability < 0.5 && '❌ Lower chance of admission. This might be a reach college.'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}