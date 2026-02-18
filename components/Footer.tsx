
import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-red-600 fill-red-600" />
              <span className="text-xl font-bold text-gray-900">BloodLink</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-6">
              Our mission is to save lives by bridging the gap between blood donors and recipients in real-time. We leverage technology to make blood donation efficient and accessible for everyone.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="/" className="hover:text-red-600">Home</a></li>
              <li><a href="#/search" className="hover:text-red-600">Find Donors</a></li>
              <li><a href="#/register" className="hover:text-red-600">Join as Donor</a></li>
              <li><a href="#/emergency" className="hover:text-red-600">Emergency Request</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-gray-500">
              <li className="flex items-center gap-2"><Mail size={16} /> support@bloodlink.org</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +1 (800) SAVE-LIFE</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> Medical Center Pkwy</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-sm text-gray-400 mb-2">
            &copy; {new Date().getFullYear()} BloodLink. All rights reserved.
          </p>
          <div className="text-xs text-gray-400 max-w-2xl mx-auto px-4">
            <strong>Disclaimer:</strong> BloodLink is a connection platform and does not facilitate financial transactions or guarantee medical outcomes. Always consult with certified medical professionals and verify donor health status at authorized blood banks.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
