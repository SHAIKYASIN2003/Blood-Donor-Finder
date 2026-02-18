
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, PlusCircle, Activity, MapPin, 
  CheckCircle2, FileText, User, Navigation, 
  ArrowLeft, Send, Loader2, Award, Zap, Stethoscope
} from 'lucide-react';
import { StorageService, calculateSmartScore } from '../services/storageService';
import { Hospital, EmergencyRequest, BloodGroup, Donor, MedicalStats, MedicalHistory } from '../types';

const HospitalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = StorageService.getCurrentUser();
    if (!user || user.role !== 'hospital') {
      navigate('/login');
      return;
    }
    setHospital(user as Hospital);
    setDonors(StorageService.getDonors());
    setRequests(StorageService.getRequests().filter(r => r.hospitalId === user.id));
  }, []);

  const handleCreateRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    
    const newReq: EmergencyRequest = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: data.get('patientName') as string,
      bloodGroup: data.get('bloodGroup') as BloodGroup,
      hospital: hospital!.name,
      hospitalId: hospital!.id,
      contact: data.get('contact') as string,
      location: hospital!.location,
      lat: hospital!.lat,
      lng: hospital!.lng,
      urgency: data.get('urgency') as any,
      requiredWithin: data.get('within') as string,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };

    setTimeout(() => {
      StorageService.saveRequest(newReq);
      setRequests(prev => [newReq, ...prev]);
      setLoading(false);
      setShowModal(false);
    }, 1000);
  };

  const handleCompleteFull = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!showCompleteModal) return;

    const data = new FormData(e.currentTarget);
    const reqId = showCompleteModal;
    const req = requests.find(r => r.id === reqId);
    if (!req || !req.acceptedBy) return;

    const medicalStats: MedicalStats = {
      hemoglobin: data.get('hemoglobin') as string,
      bloodPressure: data.get('bp') as string,
      pulse: data.get('pulse') as string,
      weight: data.get('weight') as string,
      status: data.get('healthStatus') as any || 'Normal'
    };

    // Simulate Completion
    const certId = `CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const donor = donors.find(d => d.id === req.acceptedBy);

    if (donor) {
      const historyDate = new Date().toISOString().split('T')[0];
      
      // 1. Update Legacy Dashboard History
      const newHistory = {
        id: Math.random().toString(36).substr(2, 9),
        date: historyDate,
        hospital: hospital!.name,
        hospitalId: hospital!.id,
        certificateId: certId,
        donorName: donor.name,
        medicalStats
      };

      StorageService.updateDonor(donor.id, {
        totalDonations: donor.totalDonations + 1,
        lastDonation: historyDate,
        reliabilityScore: Math.min(100, donor.reliabilityScore + 5),
        donationHistory: [...donor.donationHistory, newHistory]
      });

      // 2. NEW: Save to Secure Global Medical History Vault
      const vaultRecord: MedicalHistory = {
        id: `MH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        donorId: donor.id,
        donorName: donor.name,
        bloodGroup: donor.bloodGroup,
        hemoglobinLevel: parseFloat(medicalStats.hemoglobin || '0'),
        bloodPressure: medicalStats.bloodPressure || 'N/A',
        weight: parseFloat(medicalStats.weight || '0'),
        eligibilityStatus: 'Eligible',
        medicalNotes: `Verified donation at ${hospital?.name}. Patient ${req.patientName}.`,
        testDate: historyDate,
        hospitalName: hospital!.name,
        hospitalId: hospital!.id,
        verifiedBy: hospital?.contactPerson || 'Authorized Medical Staff',
        createdAt: new Date().toISOString()
      };
      StorageService.saveMedicalHistory(vaultRecord);
    }

    StorageService.updateRequest(reqId, { status: 'Fulfilled' });
    setRequests(StorageService.getRequests().filter(r => r.hospitalId === hospital?.id));
    setShowCompleteModal(null);
    alert(`Success: Donation processed and clinical report generated for ${req.acceptedByName}.`);
  };

  if (!hospital) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative dark:text-white">
      <button 
        onClick={() => navigate('/')}
        className="fixed top-24 left-6 z-[90] p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-400 hover:text-red-600 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all hover:scale-110"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase">{hospital.name}</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Healthcare Partnership Portal</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-xl shadow-red-100 dark:shadow-none uppercase tracking-widest text-xs transition-transform hover:-translate-y-1"
        >
          <PlusCircle size={20} /> Broadcast New Need
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Activity className="text-red-600" /> Active Emergency Tracking
          </h3>
          
          <div className="space-y-6">
            {requests.filter(r => r.status === 'Pending' || r.status === 'Accepted').length > 0 ? (
              requests.filter(r => r.status === 'Pending' || r.status === 'Accepted').map(req => (
                <div key={req.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest ${req.urgency === 'Critical' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {req.urgency}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Patient Identity</div>
                      <div className="text-xl font-black dark:text-white mb-4">{req.patientName} <span className="text-red-600 text-sm ml-2">({req.bloodGroup})</span></div>
                      
                      {req.status === 'Accepted' ? (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
                          <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                            <User size={20} />
                            <div className="font-black text-sm uppercase tracking-tighter">{req.acceptedByName} En Route</div>
                          </div>
                          <div className="mt-3 flex items-center gap-3 text-xs text-green-600/70 font-bold uppercase">
                            <Navigation size={14} className="animate-pulse" /> ETA: 14 mins • 4.2km away
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Loader2 size={16} className="animate-spin" />
                          <span className="text-xs font-black uppercase tracking-widest">Scanning nearby donors...</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-end gap-3">
                      {req.status === 'Accepted' ? (
                        <button 
                          onClick={() => setShowCompleteModal(req.id)}
                          className="w-full py-4 bg-gray-900 dark:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-colors"
                        >
                          <CheckCircle2 size={16} /> Mark Donation Complete
                        </button>
                      ) : (
                        <button className="w-full py-4 bg-gray-50 dark:bg-gray-700 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] cursor-not-allowed">
                          Waiting for Acceptance
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-gray-800">
                <Send size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No active broadcasts for this facility</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-20"><Award size={100} /></div>
             <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Verification Stats</h3>
             <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-xs font-bold uppercase tracking-widest opacity-60">Success Rate</span>
                   <span className="font-black">98.2%</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-xs font-bold uppercase tracking-widest opacity-60">Avg Response</span>
                   <span className="font-black">8.4 Min</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-xs font-bold uppercase tracking-widest opacity-60">Verified Units</span>
                   <span className="font-black text-2xl">{requests.filter(r => r.status === 'Fulfilled').length}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {showCompleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                <Stethoscope size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Complete Donation</h2>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">Enter medical results for the donor report</p>
              </div>
            </div>
            <form onSubmit={handleCompleteFull} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Hemoglobin (g/dL)</label>
                  <input name="hemoglobin" placeholder="e.g. 14.5" className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Blood Pressure</label>
                  <input name="bp" placeholder="e.g. 120/80" className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Pulse (bpm)</label>
                  <input name="pulse" placeholder="e.g. 72" className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Weight (kg)</label>
                  <input name="weight" placeholder="e.g. 70" className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Clinical Status</label>
                <select name="healthStatus" className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none font-black uppercase text-xs">
                  <option value="Normal">Normal Range</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Needs Attention">Needs Attention</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowCompleteModal(null)} className="flex-1 py-5 bg-gray-100 dark:bg-gray-800 text-gray-400 font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-5 bg-green-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-green-100">
                   Generate Report & Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase">Broadcast Emergency</h2>
            <form onSubmit={handleCreateRequest} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Patient Name</label>
                  <input required name="patientName" className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Blood Type</label>
                  <select name="bloodGroup" className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none font-black">
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Urgency</label>
                  <select name="urgency" className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none">
                    <option>Normal</option>
                    <option>Urgent</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Required Within</label>
                  <input required name="within" placeholder="e.g. 2 Hours" className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-400 font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-red-100">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Start Matching'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard;
