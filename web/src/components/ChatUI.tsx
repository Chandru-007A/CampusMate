
import { Dispatch, SetStateAction } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface Props {
  messages: Message[];
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  sendMessage: () => void;
}

export default function ChatUI({ messages, input, setInput, sendMessage }: Props) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: msg.sender === 'user' ? '#FF79C6' : '#eee',
                color: msg.sender === 'user' ? 'white' : 'black',
                borderRadius: '20px',
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ padding: '1rem', borderTop: '1px solid #ccc', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button onClick={sendMessage} style={{ padding: '0.5rem 1rem' }}>Send</button>
      </div>
    </div>
  );
}