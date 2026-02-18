
import { Donor, Hospital, EmergencyRequest, Notification, MedicalHistory, BloodGroup } from '../types';

const KEYS = {
  DONORS: 'lifelink_donors',
  HOSPITALS: 'lifelink_hospitals',
  REQUESTS: 'lifelink_requests',
  AUTH_USER: 'lifelink_auth_user',
  AUTH_TOKEN: 'lifelink_auth_token',
  NOTIFICATIONS: 'lifelink_notifications',
  MEDICAL_HISTORY: 'lifelink_medical_history',
  THEME: 'lifelink_theme',
  LANGUAGE: 'lifelink_language'
};

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

const seedInitialData = () => {
  if (!localStorage.getItem(KEYS.DONORS)) {
    const initialDonors: Donor[] = [
      {
        id: 'donor_1',
        name: 'Alex Rivera',
        age: 28,
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '555-0101',
        email: 'alex@example.com',
        city: 'San Francisco',
        state: 'CA',
        lat: 37.7749,
        lng: -122.4194,
        lastDonation: '2023-11-15',
        nextEligibleDate: '2024-02-15',
        available: true,
        isVerified: true,
        reliabilityScore: 95,
        responseRate: 88,
        password: 'password',
        role: 'donor',
        donationHistory: [],
        totalDonations: 4
      },
      {
        id: 'admin_1',
        name: 'System Root',
        age: 35,
        gender: 'Other',
        bloodGroup: 'AB+',
        phone: '1234567890',
        email: 'admin@lifelink.org',
        city: 'Global HQ',
        state: 'NY',
        lat: 40.7128,
        lng: -74.0060,
        lastDonation: '',
        nextEligibleDate: '',
        available: true,
        isVerified: true,
        reliabilityScore: 100,
        responseRate: 100,
        password: 'admin', 
        role: 'admin',
        donationHistory: [],
        totalDonations: 0
      }
    ];
    localStorage.setItem(KEYS.DONORS, JSON.stringify(initialDonors));
  }

  if (!localStorage.getItem(KEYS.HOSPITALS)) {
    const initialHospitals: Hospital[] = [
      {
        id: 'hosp_1',
        name: 'City General Medical Center',
        email: 'ops@citygeneral.com',
        password: 'hospitaladmin',
        location: 'Downtown SF',
        lat: 37.7833,
        lng: -122.4167,
        contactPerson: 'Dr. Sarah Chen',
        phone: '555-9000',
        verified: true,
        role: 'hospital'
      },
      {
        id: 'hosp_2',
        name: 'St. Mary\'s Medical Center',
        email: 'contact@stmarys.org',
        password: 'hospitaladmin',
        location: 'Hayes Valley, SF',
        lat: 37.7740,
        lng: -122.4312,
        contactPerson: 'Nurse James Miller',
        phone: '555-8200',
        verified: true,
        role: 'hospital'
      },
      {
        id: 'hosp_3',
        name: 'UCSF Helen Diller Center',
        email: 'info@ucsf.edu',
        password: 'hospitaladmin',
        location: 'Mission Bay, SF',
        lat: 37.7679,
        lng: -122.3923,
        contactPerson: 'Protocol Officer Elena',
        phone: '555-1234',
        verified: true,
        role: 'hospital'
      },
      {
        id: 'hosp_4',
        name: 'Zuckerberg General Hospital',
        email: 'admin@zsgh.org',
        password: 'hospitaladmin',
        location: 'Potrero Hill, SF',
        lat: 37.7558,
        lng: -122.4050,
        contactPerson: 'Emergency Desk',
        phone: '555-4444',
        verified: false,
        role: 'hospital'
      }
    ];
    localStorage.setItem(KEYS.HOSPITALS, JSON.stringify(initialHospitals));
  }

  if (!localStorage.getItem(KEYS.MEDICAL_HISTORY)) {
    const initialHistory: MedicalHistory[] = [
      {
        id: 'mh_1',
        donorId: 'donor_1',
        donorName: 'Alex Rivera',
        bloodGroup: 'O+',
        hemoglobinLevel: 14.2,
        bloodPressure: '120/80',
        weight: 72,
        eligibilityStatus: 'Eligible',
        medicalNotes: 'Stable hemoglobin, ready for next donation cycle.',
        testDate: '2023-11-15',
        hospitalName: 'City General Medical Center',
        hospitalId: 'hosp_1',
        verifiedBy: 'Dr. Sarah Chen',
        createdAt: new Date('2023-11-15').toISOString()
      },
      {
        id: 'mh_2',
        donorId: 'donor_1',
        donorName: 'Alex Rivera',
        bloodGroup: 'O+',
        hemoglobinLevel: 13.8,
        bloodPressure: '118/78',
        weight: 71,
        eligibilityStatus: 'Eligible',
        medicalNotes: 'Routine screening complete.',
        testDate: '2023-08-10',
        hospitalName: 'City General Medical Center',
        hospitalId: 'hosp_1',
        verifiedBy: 'Nurse Jack',
        createdAt: new Date('2023-08-10').toISOString()
      }
    ];
    localStorage.setItem(KEYS.MEDICAL_HISTORY, JSON.stringify(initialHistory));
  }
};

seedInitialData();

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
};

export const calculateSmartScore = (donor: Donor, request: EmergencyRequest): number => {
  const dist = calculateDistance(donor.lat, donor.lng, request.lat, request.lng);
  let distScore = 0;
  if (dist <= 5) distScore = 100;
  else if (dist <= 10) distScore = 80;
  else if (dist <= 25) distScore = 60;
  else distScore = 40;

  const lastDate = donor.lastDonation ? new Date(donor.lastDonation).getTime() : 0;
  const eligibilityScore = (Date.now() - lastDate > NINETY_DAYS_MS) ? 100 : 0;
  return Math.round((distScore * 0.40) + (eligibilityScore * 0.20) + (donor.reliabilityScore * 0.20) + (donor.responseRate * 0.20));
};

export const checkEligibility = (lastDonationDate: string) => {
  if (!lastDonationDate) return { isEligible: true, daysLeft: 0 };
  const lastDate = new Date(lastDonationDate).getTime();
  const nextEligible = lastDate + NINETY_DAYS_MS;
  const now = Date.now();
  if (now >= nextEligible) return { isEligible: true, daysLeft: 0 };
  return { isEligible: false, daysLeft: Math.ceil((nextEligible - now) / (24 * 60 * 60 * 1000)) };
};

export const StorageService = {
  getDonors: (): Donor[] => JSON.parse(localStorage.getItem(KEYS.DONORS) || '[]'),
  getHospitals: (): Hospital[] => JSON.parse(localStorage.getItem(KEYS.HOSPITALS) || '[]'),
  getRequests: (): EmergencyRequest[] => JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]'),
  getNotifications: (): Notification[] => JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]'),
  
  getMedicalHistory: (currentUser: any): MedicalHistory[] => {
    const allHistory: MedicalHistory[] = JSON.parse(localStorage.getItem(KEYS.MEDICAL_HISTORY) || '[]');
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return allHistory;
    if (currentUser.role === 'hospital') return allHistory.filter(h => h.hospitalId === currentUser.id);
    return allHistory.filter(h => h.donorId === currentUser.id);
  },

  saveMedicalHistory: (record: MedicalHistory) => {
    const history = JSON.parse(localStorage.getItem(KEYS.MEDICAL_HISTORY) || '[]');
    localStorage.setItem(KEYS.MEDICAL_HISTORY, JSON.stringify([...history, record]));
  },

  saveDonor: (donor: Donor) => {
    const donors = StorageService.getDonors();
    if (donors.find(d => d.email === donor.email)) throw new Error("Identity conflict.");
    localStorage.setItem(KEYS.DONORS, JSON.stringify([...donors, donor]));
  },

  setCurrentUser: (user: any) => {
    if (user) localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
    else { localStorage.removeItem(KEYS.AUTH_USER); localStorage.removeItem(KEYS.AUTH_TOKEN); }
  },

  getCurrentUser: (): any => JSON.parse(localStorage.getItem(KEYS.AUTH_USER) || 'null'),

  saveRequest: (request: EmergencyRequest) => {
    const requests = StorageService.getRequests();
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify([...requests, request]));
  },

  updateRequest: (id: string, updates: Partial<EmergencyRequest>) => {
    const requests = StorageService.getRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx !== -1) { requests[idx] = { ...requests[idx], ...updates }; localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests)); }
  },

  saveNotification: (notif: Notification) => {
    const notifs = StorageService.getNotifications();
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([...notifs, notif]));
  },

  updateNotification: (id: string, updates: Partial<Notification>) => {
    const notifs = StorageService.getNotifications();
    const idx = notifs.findIndex(n => n.id === id);
    if (idx !== -1) { notifs[idx] = { ...notifs[idx], ...updates }; localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs)); }
  },

  updateDonor: (id: string, updates: Partial<Donor>) => {
    const donors = StorageService.getDonors();
    const idx = donors.findIndex(d => d.id === id);
    if (idx !== -1) { donors[idx] = { ...donors[idx], ...updates }; localStorage.setItem(KEYS.DONORS, JSON.stringify(donors)); }
  },

  getTheme: () => localStorage.getItem(KEYS.THEME) || 'light',
  setTheme: (t: string) => localStorage.setItem(KEYS.THEME, t),

  getLanguage: (): string => localStorage.getItem(KEYS.LANGUAGE) || 'en',
  setLanguage: (l: string) => localStorage.setItem(KEYS.LANGUAGE, l),

  exportToCSV: (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
};
