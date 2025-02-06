import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import Sidebar from '../components/shared/Sidebar';
import api from '../services/api';

interface Message {
  id: number;
  content: string;
  type: 'user' | 'bot';
  created_at: string;
  isLoading?: boolean;
}

interface SuggestedPrompt {
  document_id: number;
  suggested_prompts: string[];
}

const ChatInterface: React.FC = () => {
  const { id } = useParams();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const chatResponse = await api.get(`/documents/${id}/chat`);
        const transformedMessages = chatResponse.data.flatMap((msg: any) => [
          {
            id: msg.id * 2,
            content: msg.question,
            type: 'user',
            created_at: msg.created_at,
          },
          {
            id: msg.id * 2 + 1,
            content: msg.answer,
            type: 'bot',
            created_at: msg.created_at,
          },
        ]);
        setMessages(transformedMessages);

        const promptsResponse = await api.get<SuggestedPrompt>(
          `/documents/${id}/suggested-prompts`
        );
        setSuggestedPrompts(promptsResponse.data.suggested_prompts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (id) fetchInitialData();
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !id || loading) return;

    const tempId = Date.now();
    const userMessage: Message = {
      id: tempId,
      content: inputMessage,
      type: 'user',
      created_at: new Date().toISOString(),
    };

    const botLoadingMessage: Message = {
      id: tempId + 1,
      content: '',
      type: 'bot',
      created_at: new Date().toISOString(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, botLoadingMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await api.post('/ask', {
        question: inputMessage,
        document_id: id  // This matches our QuestionRequest interface
      });

      setMessages(prev =>
        prev.map(msg =>
          msg.id === botLoadingMessage.id
            ? {
                ...msg,
                content: response.data.answer,
                isLoading: false,
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== botLoadingMessage.id));
    } finally {
      setLoading(false);
    }
};
  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex min-h-screen bg-black relative">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
  
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-between h-screen">
          {/* Messages Container - Updated with tighter spacing */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto lg:mx-[350px] w-full px-4 py-4 space-y-3">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[80%] p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-[#B0948AFC] rounded-br-none'
                        : 'bg-[#272523] rounded-bl-none'
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                      </div>
                    ) : (
                      <p className="text-white text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
  
          {/* Input Container */}
          <div className="border-t border-white/10 bg-black">
            <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto lg:mx-[350px] w-full px-4 py-4 space-y-3">
              {/* Quick Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-3 py-1.5 rounded-full border border-[#E38E4E] text-[#E38E4E] text-sm hover:bg-[#E38E4E26] transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
  
              {/* Message Input */}
              <div className="relative">
                <textarea
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message..."
                  className="w-full bg-[#E38E4E26] text-white p-3 pr-12 rounded-lg outline-none resize-none min-h-[48px] max-h-32 text-sm placeholder-white/50"
                  rows={1}
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    inputMessage.trim() && !loading
                      ? 'text-[#E38E4E] hover:text-[#E38E4E]/80'
                      : 'text-white/30 cursor-not-allowed'
                  }`}
                  disabled={!inputMessage.trim() || loading}
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatInterface;