import React from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { socket } = useSocket();
  const isOwnMessage = socket?.id === message.senderId;
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fadeIn`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isOwnMessage
            ? 'bg-accent-primary text-white rounded-br-none shadow-glow'
            : 'bg-dark-accent/40 text-dark-text rounded-bl-none hover:bg-dark-accent/50 transition-colors'
        }`}
      >
        <p className="break-words">{message.text}</p>
        <div
          className={`text-xs mt-1 ${
            isOwnMessage ? 'text-accent-info' : 'text-dark-muted'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;