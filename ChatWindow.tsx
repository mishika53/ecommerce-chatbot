import { useState, useRef, useEffect } from 'react';
import { getUser } from '../utils/auth';
import ProductCard from './ProductCard';

type MessageType = {
  from: 'user' | 'bot';
  type: 'text' | 'product' | 'order' | 'options';
  content?: string;
  message?: string;
  data?: any;
  time: string;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: MessageType = {
      from: 'user',
      type: 'text',
      content: input,
      time: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);

    // Show "Typing..." bot message
    const loadingMessage: MessageType = {
      from: 'bot',
      type: 'text',
      content: '🤖 Typing...',
      time: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          user: getUser()?.email || 'guest'
        })
      });

      if (!response.ok) throw new Error('Server error: ' + response.status);

      const bot = await response.json();
      const botMessage: MessageType = {
        from: 'bot',
        ...bot,
        time: new Date().toLocaleTimeString()
      };

      // Replace "Typing..." with actual bot response
      setMessages(prev => [...prev.slice(0, -1), botMessage]);
    } catch (error) {
      const errorMessage: MessageType = {
        from: 'bot',
        type: 'text',
        content: '⚠️ Unable to connect to the server. Please try again later.',
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    }

    setInput('');
  };

  return (
    <div className="chat-window">
      <div className="messages h-96 overflow-y-auto p-2 border">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 ${msg.from === 'bot' ? 'text-left' : 'text-right'}`}>
            <div className="text-xs text-gray-400">{msg.time}</div>

            {/* Message Type Renderer */}
            {msg.type === 'product' ? (
              <div className="grid grid-cols-2 gap-4">
                {msg.data.products.map((p: any, idx: number) => (
                  <ProductCard key={idx} product={p} />
                ))}
              </div>
            ) : msg.type === 'order' ? (
              <div className="bg-gray-100 p-2 rounded text-left">
                <p><strong>Order ID:</strong> {msg.data.order.id}</p>
                <p><strong>Status:</strong> {msg.data.order.status}</p>
                <p><strong>Total:</strong> ₹{msg.data.order.total}</p>
                <ul className="list-disc ml-5">
                  {msg.data.order.items.map((item: any, idx: number) => (
                    <li key={idx}>{item.quantity} × {item.product.name}</li>
                  ))}
                </ul>
              </div>
            ) : msg.type === 'options' ? (
              <div className="bg-blue-100 p-2 rounded text-left">
                {msg.message}
                <ul className="mt-1 list-disc ml-4">
                  {msg.data.options.map((opt: string, idx: number) => (
                    <li key={idx}>{opt}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className={`inline-block p-2 rounded ${msg.from === 'bot' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                {msg.content || msg.message}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-2 flex">
        <input
          className="flex-1 border p-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 ml-2">
          Send
        </button>
      </div>
    </div>
  );
}
