import { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import { ChatProvider } from './context/ChatContext';

function App() {
  // Initialize state to match the already-applied theme
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  // Sync changes (user toggles dark mode later)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ChatProvider>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <ChatInterface />
      </ChatProvider>
    </div>
  );
}

export default App;