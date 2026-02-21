import { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const db = getDB();
  const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
  if ((existing as any[]).length > 0) return res.status(409).json({ message: 'Email already exists' });

  const hashed = await hashPassword(password);
  await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);

  res.status(201).json({ message: 'User created' });
}