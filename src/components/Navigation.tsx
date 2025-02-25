import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wand2 } from 'lucide-react';

interface NavigationProps {
  isAdmin: boolean;
}

export function Navigation({ isAdmin }: NavigationProps) {
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">Wizards of Tekron</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              to="/"
              className={`text-gray-300 hover:text-white transition-colors duration-200 ${location.pathname === '/' ? 'text-white' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/questions"
              className={`text-gray-300 hover:text-white transition-colors duration-200 ${location.pathname === '/questions' ? 'text-white' : ''}`}
            >
              Questions
            </Link>
            <Link 
              to="/leaderboard"
              className={`text-gray-300 hover:text-white transition-colors duration-200 ${location.pathname === '/leaderboard' ? 'text-white' : ''}`}
            >
              Leaderboard
            </Link>
            {isAdmin && (
              <Link 
                to="/admin"
                className={`text-gray-300 hover:text-white transition-colors duration-200 ${location.pathname.startsWith('/admin') ? 'text-white' : ''}`}
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 