'use client';

import { useState } from 'react';
import ChatUI from '@/components/ChatUI';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your admission counselor. Ask me anything about colleges, cutoffs, or courses.", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, sender: 'user' as const };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMsg = { text: data.reply, sender: 'bot' as const };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chatbot error', error);
    }
  };

  return (
    <div style={{ height: '80vh', padding: '2rem' }}>
      <h1>Chat with Counselor</h1>
      <ChatUI messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} />
    </div>
  );
}