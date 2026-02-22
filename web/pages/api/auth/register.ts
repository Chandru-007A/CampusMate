import { NextApiRequest, NextApiResponse } from 'next';
import { addUser } from '../../../src/lib/mockUsers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  try {
    // Add user to mock storage
    const newUser = addUser(name, email, password);
    
    console.log('User registered successfully:', { id: newUser.id, name: newUser.name, email: newUser.email });
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'Email already exists') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
}
