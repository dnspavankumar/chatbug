import { useEffect } from 'react';
import { SocketProvider } from './contexts/SocketContext';
import Home from './pages/Home';
import './tailwind.css';

function App() {
  useEffect(() => {
    // Add dark mode class to document for Tailwind dark mode
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent-secondary/10 rounded-full filter blur-3xl"></div>
      </div>

      <SocketProvider>
        <Home />
      </SocketProvider>
    </div>
  );
}

export default App;