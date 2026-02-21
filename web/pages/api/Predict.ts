import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the request to the Python ML service
    const mlServiceUrl = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8001';
    const response = await fetch(`${mlServiceUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`ML service responded with status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Prediction API error:', error);
    return res.status(500).json({ error: 'Failed to get prediction from ML service' });
  }
}