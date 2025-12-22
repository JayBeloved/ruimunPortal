import { Timestamp } from 'firebase/firestore';

// Defines the structure for a single delegate's registration data.
export interface Delegate {
  id: string; // Corresponds to the document ID in Firestore
  user_id: string; // Firebase Auth UID

  // Personal Information
  name: string;
  email: string;
  phone: string;
  delegate_type: 'redeemer' | 'nigerian' | 'international' | '';
  gender: 'male' | 'female' | '';
  affiliation: string;
  position: string;

  // Conditional Redeemer's University fields
  department?: string;
  matric_num?: string;

  // Location
  city: string;
  state: string;
  country: string;
  zipcode: string;

  // Preferences & Experience
  mun_experience: string;
  committee1: string;
  country1: string;
  committee2: string;
  country2: string;
  committee3: string;
  country3: string;

  // Additional Information
  advert: string;
  tshirt_size: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | '';
  medical: string;
  diet: string;
  referral: string;

  // Metadata
  timestamp: Timestamp;

  // Fields to be added for admin management
  payment_status?: 'verified' | 'pending' | 'unpaid';
  assigned_committee?: string;
  assigned_country?: string;
}

// Defines the structure for a committee.
export interface Committee {
    id: string;
    committee: string;
    countries: string[];
}
