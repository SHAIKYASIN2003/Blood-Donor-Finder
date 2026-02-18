
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, CheckCircle, Clock, MapPin, 
  Heart, Shield, Award, Download, 
  TrendingUp, Activity, Bell, Check, X, AlertCircle,
  Zap, Navigation2, ArrowLeft, UserPlus, ClipboardList, Stethoscope
} from 'lucide-react';
import { StorageService, checkEligibility } from '../services/storageService';
import { i18n } from '../services/i18nService';
import { Donor, Notification, EmergencyRequest, AppLanguage, DonationRecord } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Donor | null>(StorageService.getCurrentUser());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTracking, setActiveTracking] = useState<EmergencyRequest | null>(null);
  const [view, setView] = useState<'donations' | 'medical'>('donations');
  const lang = StorageService.getLanguage() as AppLanguage;

  const t = (key: string) => i18n.get(key, lang);

  useEffect(() => {
    let activeUser = StorageService.getCurrentUser();
    if (!activeUser) {
      const allDonors = StorageService.getDonors();
      if (allDonors.length > 0) {
        activeUser = allDonors.find(d => d.role === 'admin') || allDonors[0];
      }
    }
    setUser(activeUser);

    if (activeUser) {
      const allNotifs = StorageService.getNotifications();
      setNotifications(allNotifs.filter(n => n.donorId === activeUser?.id).sort((a,b) => b.timestamp.localeCompare(a.timestamp)));
      
      const allReqs = StorageService.getRequests();
      const accepted = allReqs.find(r => r.acceptedBy === activeUser?.id && r.status === 'Accepted');
      if (accepted) {
        setActiveTracking({
          ...accepted,
          tracking: {
            currentLat: accepted.lat + 0.005,
            currentLng: accepted.lng + 0.005,
            eta: "12 mins",
            distance: "3.4 km"
          }
        });
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <UserPlus size={64} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">No Profile Found</h2>
        <p className="text-gray-500 mt-4 max-w-md mx-auto font-medium">Register to the network to view your personalized donation dashboard and live missions.</p>
        <Link to="/register" className="inline-block mt-8 px-10 py-4 bg-red-600 text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-xl shadow-red-100">Join Protocol</Link>
      </div>
    );
  }

  const eligibility = checkEligibility(user.lastDonation);

  const toggleAvailability = () => {
    if (!eligibility.isEligible) return;
    const newStatus = !user.available;
    const updatedUser = { ...user, available: newStatus };
    StorageService.updateDonor(user.id, { available: newStatus });
    StorageService.setCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  const handleResponse = (notifId: string, status: 'Accepted' | 'Declined') => {
    const notif = notifications.find(n => n.id === notifId);
    if (!notif) return;
    StorageService.updateNotification(notifId, { status });
    if (status === 'Accepted') {
      StorageService.updateRequest(notif.requestId, { status: 'Accepted', acceptedBy: user.id });
      window.location.reload();
    }
    setNotifications(StorageService.getNotifications().filter(n => n.donorId === user.id).sort((a,b) => b.timestamp.localeCompare(a.timestamp)));
  };

  const pendingAlerts = notifications.filter(n => n.status === 'Pending' && n.type === 'Emergency');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 dark:text-white relative">
      <button 
        onClick={() => navigate('/')}
        className="fixed top-24 left-6 z-[90] p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-400 hover:text-red-600 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 transition-all hover:scale-110 active:scale-95 group flex items-center gap-2"
        title="Exit to Home"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="hidden md:block font-black text-xs uppercase tracking-widest">Home</span>
      </button>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-[3.5rem] shadow-xl border border-gray-100 dark:border-gray-700 p-12 text-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full py-2.5 text-[10px] font-black uppercase tracking-widest ${eligibility.isEligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {eligibility.isEligible ? t('eligibility_ready') : `${t('eligibility_wait')} (${eligibility.daysLeft} ${t('days_left')})`}
            </div>

            <div className="relative inline-block mb-8 mt-6">
               <div className="w-48 h-48 bg-gray-50 dark:bg-gray-700 rounded-[3.5rem] flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden group">
                  <User size={100} className="text-gray-300 group-hover:scale-110 transition-transform" />
               </div>
               <div className={`absolute -bottom-3 -right-3 w-12 h-12 rounded-[1.2rem] border-4 border-white dark:border-gray-800 flex items-center justify-center ${user.available ? 'bg-green-500 shadow-green-200' : 'bg-gray-400'} shadow-lg`}>
                  <Activity size={24} className="text-white" />
               </div>
            </div>

            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter leading-none">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 font-bold uppercase tracking-widest text-xs">{user.bloodGroup} Donor • {user.city}</p>
            
            <button 
              onClick={toggleAvailability}
              disabled={!eligibility.isEligible}
              className={`w-full py-5 rounded-[1.8rem] font-black transition-all uppercase tracking-widest text-xs h-[64px] ${!eligibility.isEligible ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : user.available ? 'bg-green-600 text-white shadow-2xl shadow-green-100 dark:shadow-none' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-green-50'}`}
            >
              {user.available ? t('active_now') : 'GO ONLINE'}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Medical Summary</div>
             <div className="space-y-6 text-sm">
                <div className="flex justify-between items-center">
                   <span className="text-gray-500 font-bold uppercase tracking-tighter">{t('last_donation')}</span>
                   <span className="font-black text-gray-900 dark:text-white">{user.lastDonation || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-gray-500 font-bold uppercase tracking-tighter">Verified Units</span>
                   <span className="font-black text-red-600 text-xl">{user.totalDonations}</span>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setView('donations')}
              className={`flex items-center gap-4 p-6 rounded-[2rem] border-2 transition-all font-black uppercase tracking-widest text-xs ${view === 'donations' ? 'bg-red-600 text-white border-red-600 shadow-xl shadow-red-100' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'}`}
            >
              <ClipboardList size={24} /> Donation History
            </button>
            <button 
              onClick={() => setView('medical')}
              className={`flex items-center gap-4 p-6 rounded-[2rem] border-2 transition-all font-black uppercase tracking-widest text-xs ${view === 'medical' ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'}`}
            >
              <Stethoscope size={24} /> Medical Results
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
           {activeTracking && (
             <div className="bg-gray-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700"><Navigation2 size={160} /></div>
                <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center animate-pulse">
                         <Zap className="text-gray-900" size={24} fill="currentColor" />
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter">Mission Live</h3>
                   </div>
                   <div className="grid md:grid-cols-3 gap-10">
                      <div>
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Arrival Point</div>
                         <div className="text-xl font-bold truncate">{activeTracking.hospital}</div>
                      </div>
                      <div>
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Estimated Window</div>
                         <div className="text-3xl font-black text-green-400">{activeTracking.tracking?.eta}</div>
                      </div>
                      <div>
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Remaining Path</div>
                         <div className="text-3xl font-black text-white">{activeTracking.tracking?.distance}</div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {pendingAlerts.length > 0 && (
             <div className="space-y-6">
                <div className="flex items-center justify-between px-6">
                   <h3 className="text-xl font-black text-red-600 flex items-center gap-3 uppercase tracking-tighter">
                      <Bell className="animate-bounce" size={24} /> Urgent Call for Units
                   </h3>
                   <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full font-black text-[10px]">{pendingAlerts.length} ACTIVE ALERT</span>
                </div>
                {pendingAlerts.map(alert => (
                  <div key={alert.id} className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-900/50 rounded-[3rem] p-10 flex flex-col md:flex-row justify-between items-center gap-8 transition-all hover:scale-[1.01]">
                     <div className="flex-1">
                        <p className="font-black text-red-900 dark:text-red-100 text-xl leading-snug tracking-tighter">{alert.message}</p>
                        <p className="text-[10px] text-red-500 font-black uppercase mt-3 tracking-widest flex items-center gap-2">
                           <Clock size={12} /> Broadcast at {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                     </div>
                     <button 
                        onClick={() => handleResponse(alert.id, 'Accepted')}
                        className="w-full md:w-auto px-12 py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-2xl shadow-red-200 dark:shadow-none uppercase tracking-widest text-xs"
                     >
                        Accept Mission
                     </button>
                  </div>
                ))}
             </div>
           )}

           {view === 'donations' ? (
             <div className="bg-white dark:bg-gray-800 rounded-[3.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-10 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Donation Log</h3>
                </div>
                <div className="p-10">
                   {user.donationHistory.length > 0 ? (
                      <div className="space-y-8">
                         {user.donationHistory.map((h, i) => (
                            <div key={i} className="flex gap-8 items-center group">
                               <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-[1.8rem] flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                                  <Shield size={28} />
                               </div>
                               <div className="flex-1">
                                  <div className="font-black text-xl dark:text-white tracking-tighter leading-none">{h.hospital}</div>
                                  <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">{h.date} • CERT: {h.certificateId}</div>
                               </div>
                               <button className="p-4 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-red-600 transition-colors rounded-2xl">
                                  <Download size={24} />
                               </button>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="text-center py-20 text-gray-300 font-black uppercase tracking-widest text-[10px]">Registry is currently empty</div>
                   )}
                </div>
             </div>
           ) : (
             <div className="bg-white dark:bg-gray-800 rounded-[3.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-10 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Medical Reports</h3>
                </div>
                <div className="p-10">
                   {user.donationHistory.some(h => h.medicalStats) ? (
                      <div className="grid md:grid-cols-2 gap-8">
                         {user.donationHistory.filter(h => h.medicalStats).map((h, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative group overflow-hidden">
                               <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[8px] font-black uppercase tracking-widest ${h.medicalStats?.status === 'Excellent' ? 'bg-green-100 text-green-700' : h.medicalStats?.status === 'Normal' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                  {h.medicalStats?.status}
                               </div>
                               <div className="flex items-center gap-4 mb-6">
                                  <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-blue-600">
                                     <Activity size={24} />
                                  </div>
                                  <div>
                                     <div className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{h.hospital}</div>
                                     <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h.date}</div>
                                  </div>
                               </div>
                               <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                  <div>
                                     <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Hemoglobin</div>
                                     <div className="font-black text-gray-900 dark:text-white">{h.medicalStats?.hemoglobin || '--'} <span className="text-[10px] text-gray-400">g/dL</span></div>
                                  </div>
                                  <div>
                                     <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Blood Pressure</div>
                                     <div className="font-black text-gray-900 dark:text-white">{h.medicalStats?.bloodPressure || '--'}</div>
                                  </div>
                                  <div>
                                     <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Pulse Rate</div>
                                     <div className="font-black text-gray-900 dark:text-white">{h.medicalStats?.pulse || '--'} <span className="text-[10px] text-gray-400">bpm</span></div>
                                  </div>
                                  <div>
                                     <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Weight</div>
                                     <div className="font-black text-gray-900 dark:text-white">{h.medicalStats?.weight || '--'} <span className="text-[10px] text-gray-400">kg</span></div>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="text-center py-20">
                         <Stethoscope size={48} className="mx-auto text-gray-200 mb-4" />
                         <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No medical results recorded on file</p>
                         <p className="text-gray-400 text-[10px] mt-2 max-w-xs mx-auto">Hospitals provide clinical summary reports after successful fulfillment.</p>
                      </div>
                   )}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
