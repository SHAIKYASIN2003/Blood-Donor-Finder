
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, MapPin, Loader2, Zap, HeartPulse, ShieldCheck } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { BloodGroup, Donor } from '../types';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [locLoading, setLocLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: 18,
    gender: 'Male',
    bloodGroup: 'O+' as BloodGroup,
    phone: '',
    email: '',
    city: '',
    state: '',
    password: '',
    lat: 37.7749, 
    lng: -122.4194
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchLocation = () => {
    setLocLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude }));
          setLocLoading(false);
        },
        () => {
          setError("Precision location denied. System will use city centroid data.");
          setLocLoading(false);
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.age < 18 || formData.age > 65) {
      setError('Regulatory Age Limit: Donors must be between 18 and 65.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Security Alert: Access key must be at least 6 characters.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      try {
        // Fix: Added responseRate property which was missing and causing a type error.
        const newDonor: Donor = {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
          available: true,
          role: 'donor',
          isVerified: false,
          reliabilityScore: 85,
          responseRate: 100,
          lastDonation: '',
          nextEligibleDate: '',
          totalDonations: 0,
          donationHistory: []
        };

        StorageService.saveDonor(newDonor);
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2500);
      } catch (err: any) {
        setError(err.message || "Protocol Failure. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 1200);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 p-12 md:p-20 rounded-[4rem] shadow-2xl text-center max-w-2xl w-full border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-[2.8rem] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-100 dark:shadow-none">
            <ShieldCheck size={56} />
          </div>
          <h2 className="text-5xl font-black mb-6 tracking-tighter text-gray-900 dark:text-white leading-tight">Identity <br />Stored.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-10">
            Your profile has been synchronized with the emergency ledger. <br />
            Redirecting to secure login to open the website...
          </p>
          <div className="flex justify-center items-center gap-3">
             <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce delay-75"></div>
             <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce delay-150"></div>
             <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce delay-225"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-gray-50 dark:bg-gray-950 transition-colors relative overflow-hidden">
      {/* Back Key in every space */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-[90] p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-400 hover:text-red-600 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all hover:scale-110 active:scale-95 group"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-[4rem] shadow-2xl flex flex-col md:flex-row max-w-6xl w-full overflow-hidden border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom-8 duration-700">
        <div className="hidden md:flex md:w-2/5 bg-red-600 p-16 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-[1.8rem] flex items-center justify-center mb-10 backdrop-blur-md border border-white/20">
              <HeartPulse size={32} className="text-white" />
            </div>
            <h2 className="text-5xl font-black mb-8 tracking-tighter leading-tight">Join the <br />LifeLink <br />Protocol.</h2>
            <p className="text-red-100 text-lg mb-8 leading-relaxed font-medium">
              We coordinate real-time blood delivery using high-fidelity GPS tracking.
            </p>
          </div>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4 bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <MapPin className="text-red-200" size={24} />
              <div className="text-xs font-black uppercase tracking-widest">Global GPS Sync</div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <Zap className="text-yellow-300" size={24} />
              <div className="text-xs font-black uppercase tracking-widest">Instant Emergency Broadcast</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-10 md:p-20 relative">
          <div className="flex items-center justify-between mb-12 mt-12 md:mt-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <UserPlus size={24} />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">Registry</h1>
            </div>
            <Link to="/login" className="text-xs font-black text-red-600 uppercase tracking-widest hover:underline">Already member?</Link>
          </div>

          {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-[2rem] mb-10 text-sm font-bold border-2 border-red-100 dark:border-red-900/30 animate-in slide-in-from-top-4">{error}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="col-span-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-3 block tracking-widest">Legal Identity</label>
              <input 
                required type="text" 
                className="w-full px-6 py-4.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all dark:text-white font-medium"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-3 block tracking-widest">Blood Type</label>
              <select 
                required className="w-full px-6 py-4.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-black dark:text-white transition-all"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value as BloodGroup})}
              >
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-3 block tracking-widest">Age Group</label>
              <input 
                required type="number" 
                className="w-full px-6 py-4.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all dark:text-white font-medium"
                min="18" max="65"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-3 block tracking-widest">Global Email</label>
              <input 
                required type="email" 
                className="w-full px-6 py-4.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all dark:text-white font-medium"
                placeholder="email@lifelink.org"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-3 block tracking-widest">Phone Link</label>
              <input 
                required type="tel" 
                className="w-full px-6 py-4.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all dark:text-white font-medium"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="col-span-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-3 block tracking-widest">Protocol Sync</label>
              <button 
                type="button" 
                onClick={fetchLocation}
                className="w-full px-6 py-4.5 bg-gray-900 dark:bg-black text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-widest text-xs"
              >
                {locLoading ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} className="text-red-500" />}
                Sync Coordinates
              </button>
            </div>

            <div className="col-span-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-3 block tracking-widest">Access Key (Password)</label>
              <input 
                required type="password" 
                className="w-full px-6 py-4.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all dark:text-white font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="col-span-2 mt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 text-white font-black py-6 rounded-2xl hover:bg-red-700 shadow-2xl shadow-red-100 dark:shadow-none transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : "JOIN EMERGENCY NETWORK"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
