import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import MessageItem from './MessageItem';

interface ChatRoomProps {
  onBack: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentRoomName, messages, sendMessage, leaveRoom } = useSocket();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleBack = () => {
    leaveRoom();
    onBack();
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full card overflow-hidden">
      {/* Chat header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-dark-accent/30">
        <button 
          onClick={handleBack}
          className="text-dark-muted hover:text-dark-text transition-colors"
          aria-label="Back to room list"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-info flex-1 truncate">{currentRoomName}</h2>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-dark-muted">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-accent-primary/20 to-accent-info/20 rounded-full flex items-center justify-center shadow-glow">
                <Send className="text-accent-primary" size={24} />
              </div>
              <p className="text-center">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-dark-accent/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;