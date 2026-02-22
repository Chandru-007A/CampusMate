import { NextApiRequest, NextApiResponse } from 'next';

// Mock college data for testing
const mockColleges = [
  {
    id: 1,
    name: 'IIT Madras',
    cutoff: 150,
    category: 'General',
    course: 'Computer Science',
    location: 'Chennai'
  },
  {
    id: 2,
    name: 'Anna University',
    cutoff: 180,
    category: 'General',
    course: 'Information Technology',
    location: 'Chennai'
  },
  {
    id: 3,
    name: 'SRM Institute',
    cutoff: 190,
    category: 'General',
    course: 'Information Technology',
    location: 'Chennai'
  },
  {
    id: 4,
    name: 'VIT Chennai',
    cutoff: 170,
    category: 'General',
    course: 'Computer Science',
    location: 'Chennai'
  },
  {
    id: 5,
    name: 'Vellore Institute of Technology',
    cutoff: 200,
    category: 'General',
    course: 'Information Technology',
    location: 'Vellore'
  },
  {
    id: 6,
    name: 'IIT Delhi',
    cutoff: 100,
    category: 'General',
    course: 'Computer Science',
    location: 'Delhi'
  },
  {
    id: 7,
    name: 'IIT Bombay',
    cutoff: 90,
    category: 'General',
    course: 'Computer Science',
    location: 'Mumbai'
  },
  {
    id: 8,
    name: 'NIT Trichy',
    cutoff: 160,
    category: 'General',
    course: 'Electrical Engineering',
    location: 'Trichy'
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    res.status(200).json(mockColleges);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
}
