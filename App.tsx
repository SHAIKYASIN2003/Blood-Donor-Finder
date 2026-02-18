
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Search from './pages/Search';
import Emergency from './pages/Emergency';
import Dashboard from './pages/Dashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import Admin from './pages/Admin';
import MedicalRecords from './pages/MedicalRecords';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex bg-white dark:bg-gray-950 transition-colors">
        {/* Persistent Side Navigation */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main Application Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-500">
          <Navbar onMenuToggle={() => setIsSidebarOpen(true)} />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/hospital" element={<HospitalDashboard />} />
              <Route path="/search" element={<Search />} />
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
