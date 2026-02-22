import { NextApiRequest, NextApiResponse } from 'next';

// Mock college data - same as colleges.ts
const mockColleges = [
  { id: 1, name: 'IIT Madras', cutoff: 150, category: 'General', course: 'Computer Science', location: 'Chennai' },
  { id: 2, name: 'Anna University', cutoff: 180, category: 'General', course: 'Information Technology', location: 'Chennai' },
  { id: 3, name: 'SRM Institute', cutoff: 190, category: 'General', course: 'Information Technology', location: 'Chennai' },
  { id: 4, name: 'VIT Chennai', cutoff: 170, category: 'General', course: 'Computer Science', location: 'Chennai' },
  { id: 5, name: 'Vellore Institute of Technology', cutoff: 200, category: 'General', course: 'Information Technology', location: 'Vellore' },
  { id: 6, name: 'IIT Delhi', cutoff: 100, category: 'General', course: 'Computer Science', location: 'Delhi' },
  { id: 7, name: 'IIT Bombay', cutoff: 90, category: 'General', course: 'Computer Science', location: 'Mumbai' },
  { id: 8, name: 'NIT Trichy', cutoff: 160, category: 'General', course: 'Electrical Engineering', location: 'Trichy' }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cutoff, category, course, location } = req.body;
    
    console.log('Prediction request:', { cutoff, category, course, location });

    // Filter colleges based on criteria
    let matchingColleges = mockColleges.filter(college => {
      const courseMatch = !course || college.course.toLowerCase().includes(course.toLowerCase());
      const locationMatch = !location || college.location.toLowerCase().includes(location.toLowerCase());
      return courseMatch && locationMatch;
    });

    console.log('Matching colleges:', matchingColleges.length);

    if (matchingColleges.length === 0) {
      // If no exact matches, return colleges from nearby locations or similar courses
      matchingColleges = mockColleges.filter(college => {
        const similarCourse = course && (college.course.toLowerCase().includes('computer') || college.course.toLowerCase().includes('information'));
        return similarCourse;
      }).slice(0, 5);
    }

    // Calculate admission probability for each college
    const results = matchingColleges.map(college => {
      const userCutoff = Number(cutoff);
      const collegeCutoff = college.cutoff;
      
      // Calculate probability based on cutoff score
      let probability = 0;
      if (userCutoff <= collegeCutoff * 0.7) {
        probability = 0.9 + Math.random() * 0.09; // 90-99%
      } else if (userCutoff <= collegeCutoff * 0.9) {
        probability = 0.7 + Math.random() * 0.2; // 70-90%
      } else if (userCutoff <= collegeCutoff) {
        probability = 0.5 + Math.random() * 0.2; // 50-70%
      } else if (userCutoff <= collegeCutoff * 1.2) {
        probability = 0.2 + Math.random() * 0.3; // 20-50%
      } else {
        probability = 0.05 + Math.random() * 0.15; // 5-20%
      }

      return {
        college: college.name,
        course: college.course,
        location: college.location,
        probability: Math.round(Math.min(probability, 1.0) * 100) / 100,
        cutoffScore: collegeCutoff
      };
    });

    // Sort by probability (highest first)
    results.sort((a, b) => b.probability - a.probability);

    console.log('Prediction results:', results.length);

    return res.status(200).json(results);
  } catch (error) {
    console.error('Prediction API error:', error);
    return res.status(500).json({ error: 'Failed to get prediction' });
  }
}