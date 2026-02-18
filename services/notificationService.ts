
import { Donor, EmergencyRequest, Notification } from '../types';
import { StorageService, calculateDistance } from './storageService';

export const NotificationService = {
  broadcastEmergency: (request: EmergencyRequest, radius: number = 25) => {
    const donors = StorageService.getDonors();
    
    // 1. Find matching donors
    const matchedDonors = donors.filter(donor => {
      if (donor.role !== 'donor' || !donor.available) return false;
      
      // Basic blood compatibility (O- can give to anyone, etc. - keeping it simple for now: exact match)
      const bloodMatch = donor.bloodGroup === request.bloodGroup;
      
      const distance = calculateDistance(request.lat, request.lng, donor.lat, donor.lng);
      
      return bloodMatch && distance <= radius;
    });

    // 2. Create notifications
    matchedDonors.forEach(donor => {
      const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        donorId: donor.id,
        requestId: request.id,
        message: `Urgent: Blood required (${request.bloodGroup}) at ${request.hospital}. Contact: ${request.contact}`,
        type: 'Emergency',
        isRead: false,
        timestamp: new Date().toISOString(),
        status: 'Pending'
      };
      StorageService.saveNotification(notification);
      
      // Simulate SMS/Email API call
      console.log(`[SIMULATED SMS to ${donor.phone}]: ${notification.message}`);
    });

    return matchedDonors.length;
  }
};
