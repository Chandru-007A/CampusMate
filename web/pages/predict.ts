import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const mlRes = await fetch('http://localhost:8001/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await mlRes.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'ML service unavailable' });
  }
}