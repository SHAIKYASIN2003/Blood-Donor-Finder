
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type RequestStatus = 'Pending' | 'Accepted' | 'Fulfilled' | 'Cancelled';
export type UrgencyLevel = 'Normal' | 'Urgent' | 'Critical';
export type AppLanguage = 'en' | 'hi' | 'te';
export type UserRole = 'donor' | 'hospital' | 'admin';

export interface MedicalStats {
  hemoglobin?: string;
  bloodPressure?: string;
  pulse?: string;
  weight?: string;
  status: 'Normal' | 'Needs Attention' | 'Excellent';
}

export interface MedicalHistory {
  id: string;
  donorId: string;
  donorName: string;
  bloodGroup: BloodGroup;
  hemoglobinLevel: number;
  bloodPressure: string;
  weight: number;
  eligibilityStatus: 'Eligible' | 'Not Eligible';
  medicalNotes: string;
  testDate: string;
  hospitalName: string;
  hospitalId: string;
  verifiedBy: string; // Doctor/Staff name
  createdAt: string;
}

export interface DonationRecord {
  id: string;
  date: string;
  hospital: string;
  hospitalId: string;
  certificateId: string;
  notes?: string;
  donorName?: string;
  medicalStats?: MedicalStats;
}

export interface Hospital {
  id: string;
  name: string;
  email: string;
  password?: string;
  location: string;
  lat: number;
  lng: number;
  contactPerson: string;
  phone: string;
  verified: boolean;
  role: 'hospital';
}

export interface Donor {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  lastDonation: string;
  nextEligibleDate: string;
  available: boolean;
  isVerified: boolean;
  reliabilityScore: number;
  responseRate: number;
  password?: string;
  role: 'donor' | 'admin';
  donationHistory: DonationRecord[];
  totalDonations: number;
}

export interface EmergencyRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  hospital: string;
  hospitalId?: string;
  contact: string;
  location: string;
  lat: number;
  lng: number;
  urgency: UrgencyLevel;
  requiredWithin: string;
  timestamp: string;
  status: RequestStatus;
  acceptedBy?: string;
  acceptedByName?: string;
  tracking?: {
    currentLat: number;
    currentLng: number;
    eta: string;
    distance: string;
  };
}

export interface Notification {
  id: string;
  donorId: string;
  requestId: string;
  message: string;
  type: 'Emergency' | 'System' | 'Reminder';
  isRead: boolean;
  timestamp: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}
