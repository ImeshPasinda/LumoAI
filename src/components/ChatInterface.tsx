import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ChatProvider } from '../context/ChatContext';

const ChatInterface: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex-1 flex flex-col overflow-hidden">
        <MessageList />
      </div>
      <MessageInput />
    </ChatProvider>
  );
};

export default ChatInterface;