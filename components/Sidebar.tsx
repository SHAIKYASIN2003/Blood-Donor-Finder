import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Search, AlertCircle, FileText, 
  LayoutDashboard, ShieldAlert, LogOut, 
  HeartPulse, ChevronRight, Activity, Award, Building2, X
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
    { name: 'Find Hospitals', path: '/find-hospitals', icon: Building2 },
    { name: 'Emergency', path: '/emergency', icon: AlertCircle },
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
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[150] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 
        z-[200] transition-all duration-500 ease-in-out w-72 flex flex-col shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header with Close Button (Mobile Only) */}
        <div className="p-8 flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
              <HeartPulse className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">LifeLink</span>
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest leading-none mt-1">Medical Protocol</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-red-600">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Core Protocol</div>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                className={`
                  flex items-center justify-between group p-3.5 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3.5">
                  <Icon size={18} strokeWidth={isActive ? 3 : 2} />
                  <span className={`text-[11px] font-black uppercase tracking-widest`}>
                    {item.name}
                  </span>
                </div>
                {isActive && <ChevronRight size={14} strokeWidth={3} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          {currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
                  <Award size={20} className="text-red-600" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-black text-gray-900 dark:text-white tracking-tighter truncate">{currentUser.name}</div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">{currentUser.role} Status</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
              >
                <LogOut size={14} strokeWidth={3} /> Termination Protocol
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-100 dark:shadow-none hover:bg-red-700 transition-all"
            >
              Network Authentication
            </Link>
          )}
          
          <div className="mt-6 flex items-center justify-between px-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">
            <span>LifeLink v2.5.0</span>
            <div className="flex gap-1.5 items-center">
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