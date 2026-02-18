
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, FileText, Download, ShieldCheck, Activity, 
  Filter, ArrowLeft, Loader2, Calendar, Hospital as HospitalIcon,
  TrendingUp, TrendingDown, AlertCircle, FileSpreadsheet, FileBarChart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StorageService } from '../services/storageService';
import { MedicalHistory, BloodGroup } from '../types';

const MedicalRecords: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = StorageService.getCurrentUser();
  const [records, setRecords] = useState<MedicalHistory[]>([]);
  const [filtered, setFiltered] = useState<MedicalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    donorName: '',
    bloodGroup: '',
    eligibility: '',
    hospital: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const data = StorageService.getMedicalHistory(currentUser);
    setRecords(data);
    setFiltered(data);
    setLoading(false);
  }, []);

  const handleSearch = () => {
    let result = records.filter(r => {
      const matchName = r.donorName.toLowerCase().includes(filters.donorName.toLowerCase());
      const matchBG = filters.bloodGroup ? r.bloodGroup === filters.bloodGroup : true;
      const matchEligible = filters.eligibility ? r.eligibilityStatus === filters.eligibility : true;
      const matchHosp = r.hospitalName.toLowerCase().includes(filters.hospital.toLowerCase());
      return matchName && matchBG && matchEligible && matchHosp;
    });
    setFiltered(result);
  };

  const trendData = filtered.slice(0, 5).reverse().map(r => ({
    date: r.testDate,
    hemoglobin: r.hemoglobinLevel
  }));

  const latestHemoglobin = filtered[0]?.hemoglobinLevel || 0;
  const prevHemoglobin = filtered[1]?.hemoglobinLevel || 0;
  const isRising = latestHemoglobin >= prevHemoglobin;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={48} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 dark:text-white relative">
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-24 left-6 z-[90] p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-400 hover:text-red-600 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all hover:scale-110"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none mb-4">Medical History</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <ShieldCheck className="text-green-500" size={16} /> Secure Health Records Repository
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => StorageService.exportToCSV(filtered, `Medical_History_${Date.now()}.csv`)}
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mb-12">
        {/* Intelligence Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                <FileBarChart className="text-red-600" /> Health Trend AI
              </h3>
              <div className="h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="hemoglobin" stroke="#ef4444" strokeWidth={4} dot={{ r: 6, fill: '#ef4444' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Latest Hb</div>
                  <div className="text-2xl font-black flex items-center gap-2">
                    {latestHemoglobin} <span className="text-xs">g/dL</span>
                    {isRising ? <TrendingUp size={16} className="text-green-500" /> : <TrendingDown size={16} className="text-red-500" />}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</div>
                  <div className={`text-xs font-black uppercase tracking-widest ${latestHemoglobin < 12.5 ? 'text-red-500' : 'text-green-500'}`}>
                    {latestHemoglobin < 12.5 ? 'Risk: Anemic' : 'Optimal'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-20"><ShieldCheck size={100} /></div>
             <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Security Clearance</h3>
             <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Your Identity</span>
                   <span className="font-black text-xs">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">System Role</span>
                   <span className="font-black text-xs uppercase">{currentUser?.role}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Visibility Scope</span>
                   <span className="font-black text-xs">Verified Matches Only</span>
                </div>
             </div>
          </div>
        </div>

        {/* Records Search & List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-4 text-gray-400" size={18} />
                <input 
                  placeholder="Search Donor Name..." 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none"
                  value={filters.donorName}
                  onChange={e => setFilters({...filters, donorName: e.target.value})}
                  onKeyUp={handleSearch}
                />
              </div>
              <select 
                className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none font-black text-xs uppercase"
                value={filters.bloodGroup}
                onChange={e => { setFilters({...filters, bloodGroup: e.target.value}); handleSearch(); }}
              >
                <option value="">Blood Group</option>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              <select 
                className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none font-black text-xs uppercase"
                value={filters.eligibility}
                onChange={e => { setFilters({...filters, eligibility: e.target.value}); handleSearch(); }}
              >
                <option value="">All Status</option>
                <option value="Eligible">Eligible</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {filtered.length > 0 ? (
              filtered.map(rec => (
                <div key={rec.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest ${rec.eligibilityStatus === 'Eligible' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {rec.eligibilityStatus}
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl flex items-center justify-center font-black text-xs">
                          {rec.bloodGroup}
                        </div>
                        <h4 className="font-black text-lg">{rec.donorName}</h4>
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold flex items-center gap-2">
                        <Calendar size={12} /> Tested on {new Date(rec.testDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Hb Level</div>
                        <div className="font-black text-sm">{rec.hemoglobinLevel} <span className="text-[10px] opacity-60 font-medium">g/dL</span></div>
                      </div>
                      <div>
                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Blood Pressure</div>
                        <div className="font-black text-sm">{rec.bloodPressure}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <HospitalIcon size={12} /> {rec.hospitalName}
                      </div>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:underline">
                        <Download size={14} /> Full PDF Report
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700 flex gap-4">
                    <AlertCircle size={16} className="text-blue-500 shrink-0" />
                    <p className="text-[10px] font-medium text-gray-500 italic">“{rec.medicalNotes}” — Verified by {rec.verifiedBy}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-gray-800">
                <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No medical records found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
