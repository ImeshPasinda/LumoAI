import React from 'react';
import { Sun, Moon, MessageSquare } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 py-4 px-4 sm:px-6 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
          <MessageSquare size={18} />
        </div>
        <div className="flex items-center gap-1.5">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">LumoAI</h1>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-sm -translate-y-1 inline-block">
            Beta
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default Header;