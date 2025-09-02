import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Loader2, X, BrainIcon, ArrowUp, ArrowDown, RefreshCcw, FileText } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { MODULES } from '../constant/moduleConstants';

const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const {
    addMessage,
    isLoading,
    selectedModule,
    setSelectedModule,
    availableModules,
    resetChat
  } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollCheckTimeoutRef = useRef<NodeJS.Timeout>();

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSendMessage = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !isLoading && selectedModule) {
      addMessage(trimmedInput, 'user', selectedModule);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && selectedModule) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectModule = (module: string) => {
    setSelectedModule(module);
    setShowModuleModal(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const getModuleFullName = (module: string) => {
    const moduleInfo = MODULES[module];
    if (!moduleInfo) return module;
    return `${moduleInfo.longName} - ${moduleInfo.moduleCode}`;
  };

  const checkScrollPosition = () => {
    if (scrollCheckTimeoutRef.current) {
      clearTimeout(scrollCheckTimeoutRef.current);
    }

    scrollCheckTimeoutRef.current = setTimeout(() => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const atBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      setShowScrollButton(!atBottom);
    }, 100);
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
      if (scrollCheckTimeoutRef.current) {
        clearTimeout(scrollCheckTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    checkScrollPosition();
  }, [input, isLoading]);

  const handleScrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Module Selection Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Select Module
              </h3>
              <button
                onClick={() => setShowModuleModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                title="Close module selection"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {availableModules.map((module) => (
                <button
                  key={module}
                  onClick={() => selectModule(module)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm ${selectedModule === module
                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{module}</div>
                    {MODULES[module]?.year && (
                      <span className="ml-2 inline-block bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        {MODULES[module].year}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getModuleFullName(module)}
                  </div>
                  {/* {MODULES[module]?.matirial && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                        <FileText size={14} className="mr-1" />
                        {MODULES[module].matirial}
                      </span>
                    </div>
                  )} */}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        ref={containerRef}
        className="sticky bottom-0 px-4 sm:px-6 pb-4 dark:border-gray-700 bg-white dark:bg-gray-900 z-10"
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
            <div className={`
             absolute bottom-28 left-0 right-0 flex justify-center
             transition-all duration-300 ease-in-out
             ${showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
           `}>
              <button
                onClick={handleScrollToBottom}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg z-20 flex items-center justify-center"
                aria-label="Scroll to bottom"
              >
                <ArrowDown size={16} />
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedModule ? `Ask about ${selectedModule}` : "Please select a module"}
              rows={1}
              className="block w-full resize-none border-0 bg-transparent pt-4 pb-12 px-4 outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 textarea-resize"
              disabled={!selectedModule || isLoading}
            />

            {/* Action buttons container at bottom right */}
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              {/* Select icon to open module modal */}
              <button
                type="button"
                onClick={() => setShowModuleModal(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border ${selectedModule
                  ? 'border-transparent'
                  : 'border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                  } ${selectedModule
                    ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-400'
                    : 'bg-white/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                  }`}
                aria-label="Select module"
              >
                <BrainIcon
                  size={16}
                  className={`${selectedModule
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                />
                {selectedModule ? (
                  <span className="font-medium">{selectedModule}</span>
                ) : (
                  <span>Select</span>
                )}
              </button>

              {/* New Chat button */}
              <button
                onClick={() => {
                  resetChat();
                  setInput('');
                  textareaRef.current?.focus();
                }}
                disabled={!selectedModule || isLoading}
                className={`p-2 rounded-full ${!selectedModule || isLoading
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                aria-label="Start new conversation"
                title="Start new conversation"
              >
                <RefreshCcw size={20} />
              </button>

              {/* Send button */}
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading || !selectedModule}
                className={`p-2 rounded-full ${!input.trim() || isLoading || !selectedModule
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                  }`}
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <ArrowUp size={20} />
                )}
              </button>
            </div>
          </div>

          <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
            LumoAI may produce inaccurate information about people, places, or facts.
          </p>
        </div>
      </div>
    </>
  );
};

export default MessageInput;