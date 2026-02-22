export default function ProbabilityMeter({ probability }: { probability: number }) {
  const percentage = Math.round(probability * 100);
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.2)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${percentage}%`,
            background: percentage > 70 ? '#4caf50' : percentage > 40 ? '#ff9800' : '#f44336',
            height: '12px',
            borderRadius: '6px',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
          }}
        />
      </div>
      <p style={{ 
        marginTop: '0.5rem', 
        fontWeight: 'bold', 
        fontSize: '1.1rem',
        color: percentage > 70 ? '#4caf50' : percentage > 40 ? '#ff9800' : '#f44336',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
      }}>
        Admission Probability: {percentage}%
      </p>
    </div>
  );
}