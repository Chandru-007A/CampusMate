import { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const db = getDB();
  const [rows] = await db.execute('SELECT id, name, cutoff, category, course, location FROM colleges');
  res.status(200).json(rows);
}