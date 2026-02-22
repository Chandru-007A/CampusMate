
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
    <div className="card-overlay" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.25rem',
                background: msg.sender === 'user' ? '#FF79C6' : 'rgba(255, 255, 255, 0.1)',
                color: msg.sender === 'user' ? '#060010' : 'white',
                borderRadius: '20px',
                maxWidth: '80%',
                wordWrap: 'break-word',
                textAlign: 'left',
                boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(255, 121, 198, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 121, 198, 0.3)', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything about college admissions..."
          style={{ 
            flex: 1, 
            padding: '0.75rem', 
            border: '1px solid rgba(255, 121, 198, 0.3)',
            backgroundColor: 'rgba(6, 0, 16, 0.5)',
            borderRadius: '20px',
            color: '#fff',
            fontSize: '1rem'
          }}
        />
        <button 
          onClick={sendMessage} 
          style={{ 
            padding: '0.75rem 1.5rem',
            backgroundColor: '#FF79C6',
            color: '#060010',
            border: 'none',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ff9ed6';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FF79C6';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}