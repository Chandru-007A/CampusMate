export default function ProbabilityMeter({ probability }: { probability: number }) {
  const percentage = Math.round(probability * 100);
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ background: '#eee', height: '10px', borderRadius: '5px' }}>
        <div
          style={{
            width: `${percentage}%`,
            background: percentage > 70 ? '#4caf50' : percentage > 40 ? '#ff9800' : '#f44336',
            height: '10px',
            borderRadius: '5px',
          }}
        />
      </div>
      <p>Admission Probability: {percentage}%</p>
    </div>
  );
}