
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, MapPin, ArrowLeft, Phone, Calendar, Heart, ShieldCheck, Zap } from 'lucide-react';
import { StorageService, calculateDistance } from '../services/storageService';
import { BloodGroup, Donor } from '../types';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<(Donor & { distance?: number })[]>([]);
  const [userPos, setUserPos] = useState<{lat: number, lng: number} | null>(null);
  
  const [filters, setFilters] = useState({
    bloodGroup: '' as string,
    location: '',
    radius: 50,
    verifiedOnly: false
  });

  useEffect(() => {
    const data = StorageService.getDonors();
    setDonors(data);
    setFilteredDonors(data.filter(d => d.role === 'donor'));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log("Location access denied")
      );
    }
  }, []);

  const handleSearch = () => {
    let result: (Donor & { distance?: number })[] = donors.filter(d => d.role === 'donor' && d.available);
    
    if (filters.bloodGroup) {
      result = result.filter(d => d.bloodGroup === filters.bloodGroup);
    }
    
    if (filters.verifiedOnly) {
      result = result.filter(d => d.isVerified);
    }

    if (userPos) {
      result = result.map(d => ({
        ...d,
        distance: calculateDistance(userPos.lat, userPos.lng, d.lat, d.lng)
      }));
      
      result = result.filter(d => d.distance! <= filters.radius);
      result.sort((a, b) => a.distance! - b.distance!);
    }
    
    setFilteredDonors(result);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Unified Floating Back Key */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-24 left-6 z-[90] p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-400 hover:text-red-600 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 transition-all hover:scale-110 active:scale-95 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="mb-10 flex items-center gap-6 mt-8 md:mt-0">
        <div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">Advanced Donor Search</h1>
          <p className="text-gray-500 mt-2 font-medium">Filter the LifeLink network to find compatible life-savers nearby.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <label className="text-xs font-black text-gray-400 uppercase mb-3 block tracking-widest">Blood Type</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-black dark:text-white transition-all"
              value={filters.bloodGroup}
              onChange={(e) => setFilters({...filters, bloodGroup: e.target.value})}
            >
              <option value="">All Groups</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          
          <div>
            <label className="text-xs font-black text-gray-400 uppercase mb-3 block tracking-widest">Search Radius (KM)</label>
            <div className="flex items-center gap-6 pt-2">
               <input 
                type="range" min="1" max="500"
                className="w-full accent-red-600"
                value={filters.radius}
                onChange={(e) => setFilters({...filters, radius: parseInt(e.target.value)})}
              />
              <span className="font-black text-gray-900 dark:text-white text-lg min-w-[3rem]">{filters.radius}km</span>
            </div>
          </div>

          <div className="flex items-center pt-8">
            <label className="relative flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters({...filters, verifiedOnly: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              <span className="ml-4 text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">Verified Only</span>
            </label>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleSearch}
              className="w-full h-full bg-red-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-700 shadow-xl shadow-red-100 dark:shadow-none transition-all uppercase tracking-widest text-xs"
            >
              <SearchIcon size={20} /> Update Results
            </button>
          </div>
        </div>
      </div>

      {filteredDonors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDonors.map((donor) => (
            <div key={donor.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-[1.5rem] flex items-center justify-center font-black text-2xl relative shadow-sm">
                    {donor.bloodGroup}
                    {donor.isVerified && <ShieldCheck size={20} className="absolute -top-1 -right-1 text-green-500 bg-white dark:bg-gray-800 rounded-full p-0.5" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{donor.name}</h3>
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-1 mt-1">
                      <MapPin size={14} className="text-red-500" /> {donor.city}, {donor.state}
                    </p>
                  </div>
                </div>
                {donor.distance !== undefined && (
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    {donor.distance} km
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-400">Reliability Score</span>
                  <span className="text-gray-900 dark:text-white">{donor.reliabilityScore}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500" style={{width: `${donor.reliabilityScore}%`}}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a href={`tel:${donor.phone}`} className="py-4 bg-red-600 text-white rounded-2xl font-black text-center hover:bg-red-700 transition-colors shadow-lg shadow-red-100 dark:shadow-none uppercase tracking-widest text-[10px]">Call Hub</a>
                <button className="py-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-black text-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors uppercase tracking-widest text-[10px]">Notify</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 dark:bg-gray-900/50 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-gray-800">
          <MapPin size={64} className="mx-auto text-gray-200 dark:text-gray-800 mb-6" />
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Out of Range</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2 font-medium">Try increasing your search radius or searching for a different blood group.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
