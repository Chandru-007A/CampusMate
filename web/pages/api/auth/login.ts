import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser } from '../../../src/lib/mockUsers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Authenticate user
    const user = authenticateUser(email, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Mock token
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString('base64');
    
    res.status(200).json({ 
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email },
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
