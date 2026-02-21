import { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '@/lib/db';
import { comparePassword, signJWT } from '@/lib/auth';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const db = getDB();
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  const users = rows as any[];
  if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

  const user = users[0];
  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signJWT({ id: user.id, email: user.email });

  res.setHeader('Set-Cookie', serialize('token', token, { path: '/', httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 }));
  res.status(200).json({ message: 'Login successful' });
}