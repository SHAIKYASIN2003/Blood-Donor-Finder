
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, UserPlus, AlertCircle, Users, Activity, 
  Heart, ShieldCheck, MapPin, Zap, MessageSquare, ArrowLeft 
} from 'lucide-react';
import { StorageService } from '../services/storageService';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const donors = StorageService.getDonors();
  
  const stats = [
    { label: 'Registered Donors', value: donors.length + 420, icon: Users, color: 'text-blue-600' },
    { label: 'Blood Units Ready', value: donors.filter(d => d.available).length + 85, icon: Heart, color: 'text-red-600' },
    { label: 'Emergency Response', value: '98%', icon: ShieldCheck, color: 'text-green-600' },
    { label: 'Cities Covered', value: '24', icon: MapPin, color: 'text-orange-600' },
  ];

  const faqs = [
    { q: "Who can donate blood?", a: "Anyone between 18-60 years of age, weighing over 50kg, and in good health." },
    { q: "How often can I donate?", a: "Healthy individuals can donate whole blood every 90 days." },
    { q: "Is my data secure?", a: "Yes, LifeLink uses medical-grade encryption to protect donor privacy." }
  ];

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 transition-colors relative">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold text-sm mb-6 animate-pulse">
                <Zap size={16} className="mr-2" />
                CRITICAL EMERGENCY NETWORK ACTIVE
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 tracking-tighter">
                Saving Lives Through <br />
                <span className="text-red-600 underline decoration-red-200 dark:decoration-red-900 underline-offset-8">Intelligent Matching.</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-lg leading-relaxed font-medium">
                LifeLink is an open smart network connecting donors to hospitals in real-time. No login required to search or request.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/emergency" className="px-8 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200 dark:shadow-none flex items-center gap-2 transform hover:-translate-y-1 transition-all uppercase tracking-widest text-sm">
                  <AlertCircle size={20} /> Request Blood
                </Link>
                <Link to="/search" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-black rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm flex items-center gap-2 transform hover:-translate-y-1 transition-all uppercase tracking-widest text-sm">
                  <Search size={20} /> Search Donors
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-red-100 dark:bg-red-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-100 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <img 
                src="https://images.unsplash.com/photo-1579154235884-332c4110103b?auto=format&fit=crop&q=80&w=800" 
                alt="Healthcare Tech" 
                className="relative rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 rotate-1"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className={`mx-auto w-12 h-12 ${s.color} mb-4`}><s.icon size={48} strokeWidth={1.5} /></div>
              <div className="text-4xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">{s.value}</div>
              <div className="text-sm font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <h2 className="text-4xl font-black text-center mb-16 dark:text-white tracking-tighter">The LifeLink Protocol</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="relative p-10 rounded-[2.5rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg rotate-12">1</div>
             <h3 className="font-black text-xl mb-4 mt-4 dark:text-white uppercase tracking-tighter">Open Registry</h3>
             <p className="text-gray-500 dark:text-gray-400 font-medium">Browse available donors instantly. Transparency ensures speed in critical moments.</p>
          </div>
          <div className="relative p-10 rounded-[2.5rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg -rotate-6">2</div>
             <h3 className="font-black text-xl mb-4 mt-4 dark:text-white uppercase tracking-tighter">AI Matching</h3>
             <p className="text-gray-500 dark:text-gray-400 font-medium">During emergency, Gemini AI analyzes compatibility and distance instantly.</p>
          </div>
          <div className="relative p-10 rounded-[2.5rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg rotate-3">3</div>
             <h3 className="font-black text-xl mb-4 mt-4 dark:text-white uppercase tracking-tighter">Instant Alerts</h3>
             <p className="text-gray-500 dark:text-gray-400 font-medium">SMS and Push notifications are sent to the highest priority donors first.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16 dark:text-white tracking-tighter">Common Questions</h2>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-3 mb-3 text-lg uppercase tracking-tighter">
                  <MessageSquare size={20} className="text-red-600" /> {f.q}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 pl-8 font-medium">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Disclaimer Note */}
      <div className="bg-red-600 py-4 text-center text-white text-[10px] font-black uppercase tracking-widest px-4">
        LifeLink is for emergency coordination. In case of immediate life threat, always contact emergency services (911/112) first.
      </div>
    </div>
  );
};

export default Home;
