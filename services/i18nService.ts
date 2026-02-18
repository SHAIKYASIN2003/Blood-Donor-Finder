
import { AppLanguage } from '../types';

const translations = {
  en: {
    home: 'Home',
    search: 'Donor Search',
    emergency: 'Emergency',
    request_blood: 'Request Blood',
    join_network: 'Join Network',
    eligibility_ready: 'Eligible for Donation',
    eligibility_wait: 'Resting Period Active',
    days_left: 'days remaining',
    last_donation: 'Last Donation',
    total_impact: 'Lives Impacted',
    registered_donors: 'Registered Donors',
    active_now: 'Active Now',
    history: 'History',
    download_cert: 'Download Certificate',
    call_donor: 'Call Donor',
    distance: 'Distance',
    eta: 'ETA',
    blood_needed: 'Blood Needed',
    hospital: 'Hospital'
  },
  hi: {
    home: 'होम',
    search: 'दाता खोजें',
    emergency: 'आपातकालीन',
    request_blood: 'रक्त का अनुरोध करें',
    join_network: 'नेटवर्क से जुड़ें',
    eligibility_ready: 'रक्तदान के लिए पात्र',
    eligibility_wait: 'विश्राम अवधि सक्रिय',
    days_left: 'दिन शेष',
    last_donation: 'पिछला रक्तदान',
    total_impact: 'जीवन प्रभावित',
    registered_donors: 'पंजीकृत दाता',
    active_now: 'अभी सक्रिय',
    history: 'इतिहास',
    download_cert: 'प्रमाणपत्र डाउनलोड करें',
    call_donor: 'दाता को कॉल करें',
    distance: 'दूरी',
    eta: 'अनुमानित समय',
    blood_needed: 'रक्त की आवश्यकता',
    hospital: 'अस्पताल'
  },
  te: {
    home: 'హోమ్',
    search: 'దాత శోధన',
    emergency: 'అత్యవసర పరిస్థితి',
    request_blood: 'రక్తం అభ్యర్థించండి',
    join_network: 'నెట్‌వర్క్‌లో చేరండి',
    eligibility_ready: 'రక్తదానానికి అర్హులు',
    eligibility_wait: 'విశ్రాంతి సమయం',
    days_left: 'రోజులు మిగిలి ఉన్నాయి',
    last_donation: 'చివరి రక్తదానం',
    total_impact: 'కాపాడిన ప్రాణాలు',
    registered_donors: 'నమోదిత దాతలు',
    active_now: 'ప్రస్తుతం అందుబాటులో',
    history: 'చరిత్ర',
    download_cert: 'సర్టిఫికేట్ డౌన్లోడ్',
    call_donor: 'దాతకు కాల్ చేయండి',
    distance: 'దూరం',
    eta: 'చేరుకునే సమయం',
    blood_needed: 'రక్తం అవసరం',
    hospital: 'ఆసుపత్రి'
  }
};

export const i18n = {
  get: (key: string, lang: AppLanguage = 'en') => {
    return (translations[lang] as any)[key] || key;
  }
};
