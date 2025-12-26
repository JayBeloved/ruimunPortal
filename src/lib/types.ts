import { Timestamp } from "firebase/firestore";

// Defines the possible payment statuses for a delegate
export type PaymentStatus = 'Unverified' | 'Verified';

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
  affiliation: string; // Formerly 'institution'
  countryOfResidence: string;
  gender: 'Male' | 'Female' | 'Other';

  // Registration & Preferences
  createdAt: Timestamp; // Formerly 'registrationDate'
  munExperience: string;
  preferences: DelegatePreference[]; // Formerly 'committeePreferences'

  // Admin-managed Fields
  paymentStatus: PaymentStatus;
  assignedCommitteeId: string | null; // Flattened from 'assignment' object
  assignedCountry: string | null;   // Flattened from 'assignment' object
}

// The data structure for a document in the 'committees' collection
export interface Committee {
  id: string; // The URL-friendly slug (e.g., "unsc")
  name: string; // The full name (e.g., "United Nations Security Council (UNSC)")
  countries: string[];
}
