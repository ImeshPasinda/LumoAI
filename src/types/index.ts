export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  module?: string;
}

export interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  selectedModule: string;
  setSelectedModule: (module: string) => void;
  addMessage: (content: string, role: 'user' | 'assistant', module?: string) => void;
  availableModules: string[];
  resetChat: () => void;
}