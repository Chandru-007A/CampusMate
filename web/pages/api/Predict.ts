import { NextApiRequest, NextApiResponse } from 'next';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cutoff, category, course, location } = req.body;
    
    console.log('Prediction request:', { cutoff, category, course, location });

    // Map frontend course names to database course codes
    const courseMap: { [key: string]: string } = {
      'computer science': 'CSE',
      'computer': 'CSE',
      'cse': 'CSE',
      'information technology': 'IT',
      'it': 'IT',
      'electronics': 'ECE',
      'ece': 'ECE',
      'electrical': 'EEE',
      'eee': 'EEE',
      'mechanical': 'MECH',
      'mech': 'MECH',
      'civil': 'CIVIL'
    };

    // Map category to database format
    const categoryMap: { [key: string]: string } = {
      'general': 'OC',
      'oc': 'OC',
      'obc': 'BC',
      'bc': 'BC',
      'mbc': 'MBC',
      'sc': 'SC',
      'st': 'ST'
    };

    const mappedCourse = courseMap[course?.toLowerCase()] || 'CSE';
    const mappedCategory = categoryMap[category?.toLowerCase()] || 'OC';
    const userRank = Number(cutoff);

    // Call ML service for recommendations
    const mlResponse = await fetch(`${ML_SERVICE_URL}/recommend-colleges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rank: userRank,
        course: mappedCourse,
        category: mappedCategory,
        year: 2024
      }),
    });

    if (!mlResponse.ok) {
      throw new Error('ML service unavailable');
    }

    const mlData = await mlResponse.json();
    console.log('ML service response:', mlData);

    // Transform ML service response to frontend format
    const results = mlData.colleges.map((college: any) => ({
      college: college.name,
      course: college.course,
      location: extractLocation(college.name),
      probability: college.probability,
      cutoffScore: college.cutoff_rank,
      status: college.status  // Safe, Target, or Dream
    }));

    // Sort by probability (highest first), then by status priority
    const statusPriority: { [key: string]: number } = { 'Safe': 1, 'Target': 2, 'Dream': 3 };
    results.sort((a: any, b: any) => {
      if (a.status !== b.status) {
        return statusPriority[a.status] - statusPriority[b.status];
      }
      return b.probability - a.probability;
    });

    console.log('Prediction results:', results.length);

    return res.status(200).json(results);
  } catch (error) {
    console.error('Prediction API error:', error);
    
    // Fallback to mock data if ML service is down
    return res.status(200).json([
      {
        college: 'Sample College 1',
        course: req.body.course || 'CSE',
        location: req.body.location || 'Chennai',
        probability: 0.85,
        cutoffScore: Number(req.body.cutoff) - 1000,
        status: 'Safe'
      },
      {
        college: 'Sample College 2',
        course: req.body.course || 'IT',
        location: req.body.location || 'Chennai',
        probability: 0.65,
        cutoffScore: Number(req.body.cutoff) + 500,
        status: 'Target'
      },
      {
        college: 'Sample College 3',
        course: req.body.course || 'CSE',
        location: req.body.location || 'Coimbatore',
        probability: 0.35,
        cutoffScore: Number(req.body.cutoff) + 2000,
        status: 'Dream'
      }
    ]);
  }
}

// Helper function to extract location from college name
function extractLocation(collegeName: string): string {
  const locations = [
    'chennai', 'coimbatore', 'madurai', 'trichy', 'salem', 'tirunelveli',
    'vellore', 'erode', 'tiruchirappalli', 'thanjavur', 'dindigul',
    'kanchipuram', 'nagercoil', 'karur', 'tirupur'
  ];
  
  const nameLower = collegeName.toLowerCase();
  for (const loc of locations) {
    if (nameLower.includes(loc)) {
      return loc.charAt(0).toUpperCase() + loc.slice(1);
    }
  }
  
  return 'Tamil Nadu';
}