
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Search, AlertCircle, FileText, 
  LayoutDashboard, ShieldAlert, LogOut, 
  Settings, HeartPulse, ChevronRight,
  Activity, Award
} from 'lucide-react';
import { StorageService } from '../services/storageService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const currentUser = StorageService.getCurrentUser();

  const menuItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Find Donors', path: '/search', icon: Search },
    { name: 'Emergency', path: '/emergency', icon: AlertCircle, color: 'text-red-600' },
    { name: 'Medical Records', path: '/medical-records', icon: FileText },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  if (currentUser?.role === 'admin') {
    menuItems.push({ name: 'Admin Console', path: '/admin', icon: ShieldAlert });
  }

  if (currentUser?.role === 'hospital') {
    menuItems.push({ name: 'Hospital Portal', path: '/hospital', icon: Activity });
  }

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    window.location.href = '#/';
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Side Menu Container */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 
        z-[200] transition-transform duration-500 ease-in-out w-72 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-8">
          <Link to="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:rotate-12 transition-transform duration-300">
              <HeartPulse className="text-white" size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">LifeLink</span>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-none mt-1">Medical Protocol</span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Primary Protocol</div>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center justify-between group p-4 rounded-2xl transition-all duration-300
                  ${isActive 
                    ? 'bg-red-50 dark:bg-red-900/10 text-red-600' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    p-2 rounded-xl transition-all duration-300
                    ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-transparent text-current'}
                  `}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    {item.name}
                  </span>
                </div>
                {isActive && <ChevronRight size={14} className="text-red-600" />}
              </Link>
            );
          })}
        </nav>

        {/* User / Settings Section */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
          {currentUser ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-5 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-700 flex items-center justify-center border border-gray-100 dark:border-gray-600 shadow-sm">
                  <Award size={24} className="text-red-600" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-black text-gray-900 dark:text-white tracking-tighter truncate">{currentUser.name}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{currentUser.role}</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 hover:border-red-100 transition-all"
              >
                <LogOut size={14} /> Termination Protocol
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-3 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-100 dark:shadow-none hover:bg-red-700 transition-all"
            >
              System Authentication
            </Link>
          )}
          
          <div className="flex items-center justify-between px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>LifeLink v2.5.0</span>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
