
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2, HeartPulse, Building2, UserCircle } from 'lucide-react';
import { StorageService } from '../services/storageService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const donors = StorageService.getDonors();
      const hospitals = StorageService.getHospitals();
      
      const user = donors.find(d => d.email === email && d.password === password) || 
                   hospitals.find(h => h.email === email && h.password === password);

      if (user) {
        StorageService.setCurrentUser(user);
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'hospital') navigate('/hospital');
        else navigate('/dashboard');
        window.location.reload();
      } else {
        setError('Verification Failure. Access Denied.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[4rem] p-12 md:p-16 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-red-600 text-white rounded-[2.2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-100 animate-pulse">
            <HeartPulse size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter dark:text-white uppercase leading-none">Identity Access</h1>
          <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest text-[10px]">LifeLink Enterprise Portal</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-xs font-black uppercase text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-6 top-5 text-gray-400" size={20} />
            <input required type="email" placeholder="email@lifelink.org" className="w-full pl-16 pr-6 py-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-red-600 rounded-3xl outline-none transition-all dark:text-white font-bold" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="relative">
            <Lock className="absolute left-6 top-5 text-gray-400" size={20} />
            <input required type="password" placeholder="••••••••" className="w-full pl-16 pr-6 py-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-red-600 rounded-3xl outline-none transition-all dark:text-white font-bold" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-black py-6 rounded-3xl uppercase tracking-widest text-xs shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <>Sign In & Open Portal <ArrowRight size={18}/></>}
          </button>
        </form>

        <div className="mt-12 grid grid-cols-2 gap-4">
           <Link to="/register" className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl hover:bg-gray-100 transition-colors">
              <UserCircle size={24} className="text-red-600 mb-2" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Donor Join</span>
           </Link>
           <button className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl hover:bg-gray-100 transition-colors">
              <Building2 size={24} className="text-blue-600 mb-2" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Hosp Register</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
