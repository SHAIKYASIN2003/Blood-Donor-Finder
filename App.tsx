
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Search from './pages/Search';
import HospitalSearch from './pages/HospitalSearch';
import Emergency from './pages/Emergency';
import Dashboard from './pages/Dashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import Admin from './pages/Admin';
import MedicalRecords from './pages/MedicalRecords';

const App: React.FC = () => {
  // Default to open on desktop (lg), closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  // Close sidebar automatically on window resize to mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex bg-white dark:bg-gray-950 transition-colors">
        {/* Persistent Side Navigation */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main Application Content Area */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
          <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/hospital" element={<HospitalDashboard />} />
              <Route path="/search" element={<Search />} />
              <Route path="/find-hospitals" element={<HospitalSearch />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
