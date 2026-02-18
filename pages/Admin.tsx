
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Users, AlertTriangle, CheckCircle, Trash2, 
  BarChart3, Search, Database, Download,
  Zap, FileSpreadsheet, ArrowLeft, Sparkles, TrendingUp
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { Donor, EmergencyRequest } from '../types';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'network' | 'intelligence'>('network');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setDonors(StorageService.getDonors());
    const reqs = StorageService.getRequests();
    setRequests(reqs);
    
    // Auto-run AI Prediction on load
    runAnalysis(reqs, StorageService.getDonors());
  }, []);

  const runAnalysis = async (r: EmergencyRequest[], d: Donor[]) => {
    setLoadingAi(true);
    const res = await GeminiService.predictShortages(r, d);
    setPrediction(res);
    setLoadingAi(false);
  };

  const bloodGroupStats = [
    { name: 'A+', val: donors.filter(d => d.bloodGroup === 'A+').length + 15 },
    { name: 'B+', val: donors.filter(d => d.bloodGroup === 'B+').length + 8 },
    { name: 'O+', val: donors.filter(d => d.bloodGroup === 'O+').length + 22 },
    { name: 'AB+', val: donors.filter(d => d.bloodGroup === 'AB+').length + 4 },
    { name: 'Neg', val: donors.filter(d => d.bloodGroup.includes('-')).length + 5 },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-12 mt-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Enterprise Intelligence</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">AI Predictive Engine Active</p>
        </div>
        <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button onClick={() => setActiveTab('network')} className={`px-8 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest ${activeTab === 'network' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`}>Global Network</button>
          <button onClick={() => setActiveTab('intelligence')} className={`px-8 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest ${activeTab === 'intelligence' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`}>AI Analytics</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Shortage Risk', val: prediction?.riskLevel || 'Scanning...', icon: AlertTriangle, color: 'text-red-600' },
          { label: 'Regional Reach', val: '1.4M', icon: Database, color: 'text-blue-600' },
          { label: 'Demand Load', val: prediction?.predictedShortageGroup || 'Stable', icon: TrendingUp, color: 'text-orange-600' },
          { label: 'System Health', val: '99.9%', icon: CheckCircle, color: 'text-green-600' }
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className={`${s.color} mb-4`}><s.icon size={28} /></div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{s.val}</div>
          </div>
        ))}
      </div>

      {activeTab === 'intelligence' ? (
        <div className="space-y-10">
          <div className="bg-gradient-to-br from-indigo-900 to-black rounded-[4rem] p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Sparkles size={200} /></div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-500/30">
                <Sparkles size={14} /> AI Insight Generation
              </div>
              <h2 className="text-5xl font-black tracking-tighter mb-6">Regional Shortage <br /><span className="text-red-500">Forecast Protocol.</span></h2>
              <div className="space-y-6">
                <p className="text-indigo-100/60 font-medium text-lg leading-relaxed">
                  Our neural engine predicts <strong className="text-white">{prediction?.predictedShortageGroup}</strong> will face a 
                  <strong className="text-white"> {prediction?.growthForecast}</strong> growth in demand over the next 30-day window.
                </p>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Suggested Campaign</div>
                  <div className="text-xl font-black text-white">{prediction?.campaignIdea || 'Calculating optimized intervention...'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
             <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-2xl font-black mb-10 dark:text-white uppercase tracking-tighter">Inventory Density</h3>
                <div className="h-[350px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bloodGroupStats}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 900}} />
                         <YAxis hide />
                         <Tooltip cursor={{fill: '#f8fafc'}} />
                         <Bar dataKey="val" radius={[12, 12, 0, 0]}>
                            {bloodGroupStats.map((e, i) => <Cell key={i} fill={['#ef4444', '#f87171', '#dc2626', '#b91c1c', '#fca5a5'][i % 5]} />)}
                         </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
             
             <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-2xl font-black mb-10 dark:text-white uppercase tracking-tighter">Engagement Velocity</h3>
                <div className="h-[350px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[{d:'M',v:20},{d:'T',v:45},{d:'W',v:35},{d:'T',v:60},{d:'F',v:55},{d:'S',v:80},{d:'S',v:90}]}>
                         <XAxis dataKey="d" hide />
                         <Tooltip />
                         <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={4} fill="#fee2e2" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900">
                 <tr>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Node</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Blood Group</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Smart Score</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                 {donors.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                       <td className="px-10 py-6">
                          <div className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{d.name}</div>
                          <div className="text-xs text-gray-400 font-bold">{d.city}</div>
                       </td>
                       <td className="px-10 py-6">
                          <span className="px-4 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-black text-sm">{d.bloodGroup}</span>
                       </td>
                       <td className="px-10 py-6 font-black text-lg">{d.reliabilityScore}%</td>
                       <td className="px-10 py-6 text-right"><Trash2 className="inline text-gray-300 hover:text-red-600 cursor-pointer" size={20} /></td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
