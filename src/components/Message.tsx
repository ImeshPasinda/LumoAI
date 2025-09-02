import React, { useState, useEffect } from 'react';
import { Copy, Check, User, Bot, BadgeCheck, Volume2, Pause, Play, Edit, X, CheckCircle } from 'lucide-react';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
  onSuggestedQuestionClick?: (question: string) => void;
}

const Message: React.FC<MessageProps> = ({
  message,
  onSuggestedQuestionClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [displayedText, setDisplayedText] = useState(message.role === 'user' ? message.content : '');

  const isUser = message.role === 'user';
  const isModuleIntro = message.content.includes('This LumoAI is related to');
  const isInitialPrompt = message.content === 'Hello! Please select a module and ask your question.';

  const suggestedQuestions = [
    "What is the main topic of this module?",
    "Give me a summary of this module",
    "List the key points",
    "Explain it like I am five"
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) return;

      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'en-US';
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setIsPaused(false);
    } else {
      alert('Sorry, your browser does not support text to speech.');
    }
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopSpeechIfLeaving = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  useEffect(() => {
    return () => {
      stopSpeechIfLeaving();
    };
  }, []);

  useEffect(() => {
    if (!isUser && !isModuleIntro && !isInitialPrompt) {
      let index = 0;
      let currentText = '';

      const interval = setInterval(() => {
        currentText += message.content.charAt(index);
        setDisplayedText(currentText);
        index++;
        if (index >= message.content.length) {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayedText(message.content);
    }
  }, [message.content, isUser, isModuleIntro, isInitialPrompt]);

  return (
    <div className={`py-6 px-4 sm:px-6`} data-role={message.role}>
      <div className={`max-w-3xl mx-auto flex gap-3 ${isUser ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
            }`}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className={`flex items-center justify-between mb-0 ${isUser ? 'flex-row-reverse' : ''}`}>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
              {isUser ? 'You' : 'LumoAI'}
              {!isUser && (
                <span title="Verified">
                  <BadgeCheck size={12} className="text-orange-400" />
                </span>
              )}
            </p>
          </div>

          <div className="relative">
            <div
              className={`mt-1 text-sm break-words whitespace-pre-wrap ${isUser
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white ml-auto'
                : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                }`}
              style={{
                display: 'inline-block',
                maxWidth: '85%',
                minWidth: '60px',
                padding: '10px 16px',
                borderRadius: '1rem',
                textAlign: 'left',
                marginBottom: '1px'
              }}
            >
              {isUser ? message.content : displayedText}
            </div>

            {!isUser && (
              <div className="absolute left-0 flex gap-1 mt-1">
                <button
                  onClick={copyToClipboard}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} className="text-gray-700 dark:text-gray-300" />
                  )}
                </button>

                {!isSpeaking ? (
                  <button
                    onClick={speakText}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                    aria-label="Speak text"
                  >
                    <Volume2 size={16} className="text-gray-700 dark:text-gray-300" />
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={resumeSpeech}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                    aria-label="Resume speech"
                  >
                    <Play size={16} className="text-gray-700 dark:text-gray-300" />
                  </button>
                ) : (
                  <button
                    onClick={pauseSpeech}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                    aria-label="Pause speech"
                  >
                    <Pause size={16} className="text-gray-700 dark:text-gray-300" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Suggested questions with fade-in animation */}
          {isModuleIntro && onSuggestedQuestionClick && (
            <div className="mt-10 flex flex-wrap gap-2 max-w-lg">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestedQuestionClick(question)}
                  style={{
                    animation: `fade-in 0.4s ease-out`,
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'forwards',
                    opacity: 0,
                  }}
                  className="px-3 py-1.5 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;