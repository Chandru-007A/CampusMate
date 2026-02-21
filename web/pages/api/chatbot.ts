import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'http://localhost:8002';
    const botRes = await fetch(`${chatbotUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!botRes.ok) {
      throw new Error(`Chatbot service responded with status ${botRes.status}`);
    }

    const data = await botRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({ 
      response: 'Sorry, the chatbot service is currently unavailable. Please try again later.'
    });
  }
}
