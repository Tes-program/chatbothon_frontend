import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import Sidebar from '../components/shared/Sidebar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface FilePreview {
  name: string;
  type: string;
}

const ChatInterface: React.FC = () => {
  const { id } = useParams();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [filePreview, setFilePreview] = useState<FilePreview | null>({
    name: "Rental agreements.docx",
    type: "docx"
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex min-h-screen bg-black relative">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        isSidebarOpen ? 'pl-0 md:pl-64' : 'pl-0'
      }`}>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col justify-center pb-4 px-4 md:px-6">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto max-w-3xl w-full mx-auto justify-center mb-4 space-y-4">
            {/* Messages would go here */}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="max-w-3xl mx-auto w-full mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button className="px-4 py-2 rounded-full border border-[#D35400] text-[#D35400] hover:bg-[#D35400] hover:text-white transition-colors whitespace-nowrap text-sm md:text-base">
                What does this contract mean?
              </button>
              <button className="px-4 py-2 rounded-full border border-[#D35400] text-[#D35400] hover:bg-[#D35400] hover:text-white transition-colors whitespace-nowrap text-sm md:text-base">
                Summarize this
              </button>
              <button className="px-4 py-2 rounded-full border border-[#D35400] text-[#D35400] hover:bg-[#D35400] hover:text-white transition-colors whitespace-nowrap text-sm md:text-base">
                Explain what jaundice means
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="max-w-3xl mx-auto w-full relative">
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="w-full bg-[#2A2A2A] text-white p-4 pr-12 outline-none resize-y min-h-[56px] max-h-32 rounded-3xl"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                  inputMessage.trim() 
                    ? 'text-[#D35400] hover:text-[#ff6b1a]' 
                    : 'text-gray-400 cursor-not-allowed'
                } transition-colors`}
                disabled={!inputMessage.trim()}
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;