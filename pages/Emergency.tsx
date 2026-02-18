
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, Loader2, User, Building2, Phone, 
  Sparkles, ArrowLeft, ShieldAlert, Radio, Activity
} from 'lucide-react';
import { StorageService, calculateSmartScore } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { BloodGroup, EmergencyRequest, Donor } from '../types';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const Emergency: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+' as BloodGroup,
    hospital: '',
    contact: '',
    location: '',
    urgency: 'Urgent' as any,
    requiredWithin: '2 Hours'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const lat = 37.7749 + (Math.random() - 0.5) * 0.1;
    const lng = -122.4194 + (Math.random() - 0.5) * 0.1;

    const newRequest: EmergencyRequest = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      lat, lng,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };

    StorageService.saveRequest(newRequest);
    const donors = StorageService.getDonors();
    
    // AI Enhancement
    const result = await GeminiService.analyzeEmergency(newRequest, donors);
    
    // Smart Matching Calculation
    const smartMatches = donors
      .filter(d => d.bloodGroup === newRequest.bloodGroup && d.available)
      .map(d => ({ donor: d, score: calculateSmartScore(d, newRequest) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setAiAnalysis({ ...result, smartMatches });
    setLoading(false);
    setSuccess(true);
  };

  if (success && aiAnalysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-900 rounded-[4rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-12 text-white text-center">
            <Radio size={48} className="mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase">Broadcast Dispatched</h1>
            <p className="text-red-100 font-bold uppercase tracking-widest text-[10px]">Neural engine matched {aiAnalysis.smartMatches?.length || 0} high-priority responders.</p>
          </div>
          
          <div className="p-12 space-y-10">
            <div>
              <h3 className="text-xl font-black flex items-center gap-2 mb-6 uppercase tracking-tighter dark:text-white">
                <Sparkles className="text-red-600" /> Neural Match Scores
              </h3>
              <div className="space-y-4">
                {aiAnalysis.smartMatches?.map((m: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">{m.score}</div>
                       <div>
                          <div className="font-black dark:text-white text-lg">{m.donor.name}</div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reliability: {m.donor.reliabilityScore}%</div>
                       </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${m.score > 80 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                       {m.score > 80 ? 'Highly Recommended' : 'Valid Match'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-center">
              <button onClick={() => navigate('/')} className="px-12 py-5 bg-black text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:scale-105 transition-all">Exit Broadcast Suite</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <button onClick={() => navigate(-1)} className="mb-8 p-4 bg-white dark:bg-gray-800 text-gray-400 hover:text-red-600 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all hover:scale-110">
            <ArrowLeft size={20} />
          </button>
          
          <h1 className="text-6xl font-black text-gray-900 dark:text-white leading-tight mb-8 tracking-tighter uppercase">Emergency <br />Broadcast.</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 leading-relaxed font-medium">Coordinate real-time blood delivery. Our AI ranks donors by proximity, speed, and proven reliability score.</p>

          <div className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 flex gap-6">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                <Activity size={28} />
              </div>
              <div>
                <h4 className="font-black text-lg dark:text-white uppercase tracking-tighter">Smart Ranking Protocol</h4>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Bypassing standard filters for a 94% fulfillment success rate.</p>
              </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[4rem] shadow-2xl p-10 md:p-14 border border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Patient Identity</label>
                <div className="relative">
                  <User className="absolute left-4 top-4.5 text-gray-400" size={18} />
                  <input required type="text" className="w-full pl-12 pr-4 py-4.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-red-600 rounded-2xl outline-none font-bold" placeholder="Full Name" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Blood Type</label>
                <select className="w-full px-4 py-4.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-red-600 rounded-2xl outline-none font-black" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value as BloodGroup})}>
                  {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Hospital Node</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-4.5 text-gray-400" size={18} />
                <input required type="text" className="w-full pl-12 pr-4 py-4.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-red-600 rounded-2xl outline-none font-bold" placeholder="Facility Name" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Urgency</label>
                <select className="w-full px-4 py-4.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-red-600 rounded-2xl outline-none font-black" value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value as any})}>
                  <option>Normal</option><option>Urgent</option><option>Critical</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Priority Line</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-4.5 text-gray-400" size={18} />
                  <input required type="tel" className="w-full pl-12 pr-4 py-4.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-red-600 rounded-2xl outline-none font-bold" placeholder="Emergency Phone" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-black py-6 rounded-3xl uppercase tracking-widest text-xs shadow-2xl shadow-red-100 hover:bg-red-700 transition-all">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Smart Match Broadcast"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
