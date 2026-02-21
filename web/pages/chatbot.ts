import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const botRes = await fetch('http://localhost:8002/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await botRes.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ reply: 'Chatbot service unavailable' });
  }
}