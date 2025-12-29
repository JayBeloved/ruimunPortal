import { Timestamp } from "firebase/firestore";

// Defines the possible payment statuses for a delegate
export type PaymentStatus = 'Unverified' | 'Verified';
export type AssignmentStatus = 'Assigned' | 'Unassigned';

// Represents a single committee and country preference from a delegate
export interface DelegatePreference {
    committeeId: string;
    country: string;
    order: number;
}

// The primary data structure for a delegate's registration document
export interface Delegate {
  id: string; // Corresponds to Firebase Auth UID

  // Personal Information
  name: string;
  email: string;
  phone: string;
  gender: string;
  delegate_type: string; 

  // Additional Information
  affiliation: string;
  position?: string;
  department?: string;
  matric_num?: string;
  city?: string;
  state?: string;
  country: string;
  zipcode?: string;
  
  // Other Information
  mun_experience?: string;
  advert?: string;
  tshirt_size?: string;
  medical?: string;
  diet?: string;
  referral?: string;

  // Registration & Preferences
  createdAt: Timestamp;
  preferences: DelegatePreference[];

  // Admin-managed Fields
  paymentStatus: PaymentStatus;
  assignmentStatus?: AssignmentStatus;
  assignedCommitteeId: string | null;
  assignedCountry: string | null;
}

// The data structure for a document in the 'committees' collection
export interface Committee {
  id: string; 
  name: string; 
  countries: string[];
}
