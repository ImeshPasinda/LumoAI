import React, { useRef, useEffect } from 'react';
import Message from './Message';
import { useChat } from '../context/ChatContext';
import { BadgeCheck, Loader2 } from 'lucide-react';

const MessageList: React.FC = () => {
  const { messages, isLoading, addMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSuggestedQuestionClick = (question: string) => {
    addMessage(question, 'user');
  };

  return (
    <div className="flex-1 overflow-y-auto px-2 sm:px-6 pb-6 pt-2">
      {messages.map((message, index) => {
        const isLast = index === messages.length - 1;
        return (
          <div key={message.id} className={isLast ? 'animate-fade-in' : ''}>
            <Message 
              message={message} 
              onSuggestedQuestionClick={
                index === 0 || message.content.includes('This LumoAI is related to') 
                  ? handleSuggestedQuestionClick 
                  : undefined
              } 
            />
          </div>
        );
      })}

      {isLoading && (
        <div className="py-6 px-4 sm:px-6 animate-fade-in">
          <div className="max-w-3xl mx-auto flex gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
              <Loader2 size={20} className="animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                LumoAI
                <span title="Verified" aria-label="Verified" className="inline-flex items-center">
                  <BadgeCheck size={12} className="text-orange-400" />
                </span>
              </p>

              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-150" />
                <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-300" />
                <span className="ml-2 text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;