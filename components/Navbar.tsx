import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, User, HeartPulse, 
  Bell, Moon, Sun, Search, LayoutDashboard, Zap
} from 'lucide-react';
import { StorageService } from '../services/storageService';

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [theme, setTheme] = useState(StorageService.getTheme());
  const location = useLocation();
  const currentUser = StorageService.getCurrentUser();

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
    StorageService.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    const updateCount = () => {
      const user = StorageService.getCurrentUser();
      if (user) {
        const notifs = StorageService.getNotifications();
        const unread = notifs.filter(n => n.donorId === user.id && !n.isRead && n.status === 'Pending').length;
        setUnreadCount(unread);
      }
    };

    updateCount();
    window.addEventListener('lifelink_new_notification', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('lifelink_new_notification', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-[100] transition-all h-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center">
        
        {/* Left Side: Menu Toggle & Title */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={onMenuToggle}
            className="group flex items-center justify-center p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border-2 border-gray-900 dark:border-gray-100 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} strokeWidth={3} />
          </button>
          
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">
              Terminal / <span className="text-red-600">Active</span>
            </h2>
            <h1 className="text-lg font-black text-gray-900 dark:text-white tracking-tighter leading-none">
              {location.pathname === '/' ? 'Protocol Home' : location.pathname.substring(1).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </h1>
          </div>
        </div>

        {/* Center: Emergency Network Status (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl animate-pulse">
          <Zap size={14} className="text-red-600" fill="currentColor" />
          <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Critical Emergency Network Active</span>
        </div>

        {/* Right Side: Global Tools */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            className="p-3 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            title="Appearance Toggle"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {currentUser && (
            <Link 
              to="/dashboard" 
              className="p-3 text-gray-600 dark:text-gray-300 hover:text-red-600 relative bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {!currentUser ? (
            <Link to="/login" className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all border-2 border-gray-900 dark:border-white active:scale-95">
              <User size={16} strokeWidth={3} /> <span className="hidden sm:inline">Access Portal</span>
            </Link>
          ) : (
            <Link to="/dashboard" className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;