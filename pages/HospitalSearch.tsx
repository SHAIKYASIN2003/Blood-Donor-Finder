
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Search as SearchIcon, MapPin, 
  ArrowLeft, Phone, ShieldCheck, Navigation,
  Activity, Map as MapIcon, Globe, Info
} from 'lucide-react';
import { StorageService, calculateDistance } from '../services/storageService';
import { Hospital } from '../types';

const HospitalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<(Hospital & { distance?: number })[]>([]);
  const [userPos, setUserPos] = useState<{lat: number, lng: number} | null>(null);
  
  const [filters, setFilters] = useState({
    name: '',
    radius: 50,
    verifiedOnly: false
  });

  useEffect(() => {
    const data = StorageService.getHospitals();
    setHospitals(data);
    setFilteredHospitals(data);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserPos(coords);
          applyFilters(coords, data, filters);
        },
        () => console.log("Location access denied")
      );
    }
  }, []);

  const applyFilters = (pos: {lat: number, lng: number} | null, data: Hospital[], f: typeof filters) => {
    let result: (Hospital & { distance?: number })[] = [...data];

    if (f.name) {
      result = result.filter(h => h.name.toLowerCase().includes(f.name.toLowerCase()));
    }

    if (f.verifiedOnly) {
      result = result.filter(h => h.verified);
    }

    if (pos) {
      result = result.map(h => ({
        ...h,
        distance: calculateDistance(pos.lat, pos.lng, h.lat, h.lng)
      }));
      
      result = result.filter(h => h.distance! <= f.radius);
      result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    setFilteredHospitals(result);
  };

  const handleSearch = () => {
    applyFilters(userPos, hospitals, filters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 relative dark:text-white">
      {/* Floating Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-24 left-6 z-[90] p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-400 hover:text-blue-600 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all hover:scale-110 active:scale-95 group"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-8 md:mt-0">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
                <Building2 size={32} />
             </div>
             <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Medical Facilities</h1>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <Globe className="text-blue-500" size={14} /> Global Hospital Discovery Network
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5">
            <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Facility Name</label>
            <div className="relative">
              <SearchIcon className="absolute left-4 top-4 text-gray-400" size={18} />
              <input 
                placeholder="Search hospitals..." 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold transition-all"
                value={filters.name}
                onChange={e => setFilters({...filters, name: e.target.value})}
                onKeyUp={handleSearch}
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Search Radius: {filters.radius}km</label>
            <div className="px-2 py-4">
               <input 
                type="range" min="1" max="500"
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                value={filters.radius}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFilters({...filters, radius: val});
                  applyFilters(userPos, hospitals, {...filters, radius: val});
                }}
              />
            </div>
          </div>

          <div className="md:col-span-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-transparent hover:border-blue-600/30 transition-all cursor-pointer">
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tier-1 Partners Only</span>
             <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={filters.verifiedOnly}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setFilters({...filters, verifiedOnly: val});
                    applyFilters(userPos, hospitals, {...filters, verifiedOnly: val});
                  }}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
             </label>
          </div>
        </div>
      </div>

      {filteredHospitals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredHospitals.map((h) => (
            <div key={h.id} className="bg-white dark:bg-gray-800 rounded-[3rem] p-10 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:scale-[1.02] transition-all relative overflow-hidden group flex flex-col">
              {h.verified && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck size={14} /> Tier-1 Partner
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">{h.name}</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                   <MapPin size={12} className="text-red-500" /> {h.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                   <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-200">Open 24/7</span>
                   </div>
                </div>
                {h.distance !== undefined && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <div className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">Distance</div>
                    <div className="text-sm font-black text-blue-700 dark:text-blue-400">{h.distance} KM</div>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400">
                       <Info size={18} />
                    </div>
                    <div>
                       <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contact Point</div>
                       <div className="text-sm font-bold">{h.contactPerson}</div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a 
                  href={`tel:${h.phone}`}
                  className="py-4 bg-gray-900 dark:bg-black text-white rounded-2xl font-black text-center uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-all"
                >
                  <Phone size={14} /> Call ER
                </a>
                <button 
                  className="py-4 bg-blue-600 text-white rounded-2xl font-black text-center uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all"
                >
                  <Navigation size={14} /> Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 dark:bg-gray-900/50 rounded-[5rem] border-4 border-dashed border-gray-100 dark:border-gray-800">
          <MapIcon size={64} className="mx-auto text-gray-200 dark:text-gray-700 mb-6" />
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">No Facilities in Range</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2 font-medium">Try increasing your search radius or searching by name.</p>
          <button 
            onClick={() => setFilters({...filters, radius: 500})}
            className="mt-8 px-10 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
          >
            Expand Radius to 500km
          </button>
        </div>
      )}
    </div>
  );
};

export default HospitalSearch;
