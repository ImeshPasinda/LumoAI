import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Message, ChatContextType } from '../types';
import { API_POST_ASK, baseUrl } from '../constant/apiConstant';
import { MODULES, AVAILABLE_MODULES } from '../constant/moduleConstants';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! Please select a module and ask your question.',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [initialLoad, setInitialLoad] = useState(true);

  const getModuleDescription = (module: string) => {
    const moduleInfo = MODULES[module];
    if (!moduleInfo) return 'Hello! Please ask your question about the selected module.';
    return `Hello! This LumoAI is related to ${moduleInfo.longName} - ${moduleInfo.moduleCode}. You can ask anything about this module.`;
  };

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
  
    if (selectedModule) {
      setMessages([
        {
          id: Date.now().toString(),
          content: getModuleDescription(selectedModule),
          role: 'assistant',
          timestamp: new Date(),
          module: selectedModule,
        },
      ]);
    }
  }, [selectedModule, initialLoad]);  

  const addMessage = useCallback((content: string, role: 'user' | 'assistant', module?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
      module: module || selectedModule,
    };
    setMessages(prev => [...prev, newMessage]);
  }, [selectedModule]);

  const getAIResponse = useCallback(async (userMessage: string) => {
    if (!selectedModule) return;
    
    setIsLoading(true);
    
    try {
      const userHistory = messages
        .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
        .map((msg) => ({
          role: msg.role,
          content: msg.content
        }));
  
      const response = await fetch(`${baseUrl}${API_POST_ASK}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: userMessage,
          module: selectedModule,
          history: userHistory,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      addMessage(data.answer, 'assistant');
    } catch (error) {
      console.error('Error fetching AI response:', error);
      addMessage("Sorry, I couldn't process your request. Please try again.", 'assistant');
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, messages, selectedModule]);  

  const handleNewUserMessage = useCallback((content: string, module?: string) => {
    if (!selectedModule && !module) return;
    addMessage(content, 'user', module);
    getAIResponse(content);
  }, [addMessage, getAIResponse, selectedModule]);

  // NEW - RESET CHAT FUNCTION
  const resetChat = useCallback(() => {
    setSelectedModule('');
    setMessages([
      {
        id: '1',
        content: 'Hello! Please select a module and ask your question.',
        role: 'assistant',
        timestamp: new Date(),
      },
    ]);
  }, []);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      isLoading, 
      selectedModule,
      setSelectedModule,
      addMessage: handleNewUserMessage,
      availableModules: AVAILABLE_MODULES,
      resetChat, // Pass reset function
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
