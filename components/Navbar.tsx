
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
/* Added LayoutDashboard to the import list from lucide-react */
import { 
  Menu, User, HeartPulse, 
  Bell, Moon, Sun, Search, LayoutDashboard
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
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-[100] transition-colors h-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center">
        
        {/* Left Side: Mobile Menu & Breadcrumbs/Title */}
        <div className="flex items-center gap-6">
          <button 
            onClick={onMenuToggle}
            className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border border-gray-100 dark:border-gray-700 lg:hidden"
          >
            <Menu size={20} />
          </button>
          
          <div className="hidden sm:block">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
              Protocol / <span className="text-gray-900 dark:text-white">
                {location.pathname === '/' ? 'Terminal Home' : location.pathname.substring(1).replace('-', ' ')}
              </span>
            </h2>
          </div>
        </div>

        {/* Right Side: Global Tools */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-2 group focus-within:border-red-500 transition-all">
            <Search size={16} className="text-gray-400 group-focus-within:text-red-500" />
            <input 
              type="text" 
              placeholder="System Search..." 
              className="bg-transparent border-none outline-none px-3 text-xs font-bold w-40 dark:text-white"
            />
          </div>

          <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              className="p-3 text-gray-500 hover:text-red-600 transition-colors bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
              title="Switch Appearance"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            {currentUser && (
              <Link 
                to="/dashboard" 
                className="p-3 text-gray-500 hover:text-red-600 relative bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {!currentUser ? (
              <Link to="/login" className="flex items-center gap-3 px-5 py-3 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-100 dark:shadow-none hover:bg-red-700 transition-all">
                <User size={16} /> <span className="hidden sm:inline">Access Portal</span>
              </Link>
            ) : (
              <Link to="/dashboard" className="hidden sm:flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                {/* Fixed LayoutDashboard reference by adding it to imports */}
                <LayoutDashboard size={16} /> Console
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
