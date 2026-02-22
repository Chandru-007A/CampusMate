interface College {
  id?: number;
  name: string;
  cutoff?: number;
  category?: string;
  course?: string;
  location?: string;
}

export default function CollegeCard({ college }: { college: College }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>{college.name}</h3>
      {college.cutoff && <p>Cutoff: {college.cutoff}</p>}
      {college.category && <p>Category: {college.category}</p>}
      {college.course && <p>Course: {college.course}</p>}
      {college.location && <p>Location: {college.location}</p>}
    </div>
  );
}