
import type { Delegate, Committee } from '@/lib/types';

export const committees: Committee[] = [
  { id: 'c1', name: 'United Nations Security Council (UNSC)', topic: 'The Situation in the Middle East', description: 'Addressing conflicts and security threats in the Middle East, including terrorism and regional instability.' },
  { id: 'c2', name: 'Disarmament and International Security (DISEC)', topic: 'Cyber Warfare and International Security', description: 'Developing norms and regulations for state conduct in cyberspace to prevent conflicts.' },
  { id: 'c3', name: 'Social, Humanitarian & Cultural Issues (SOCHUM)', topic: 'Protecting the Rights of Refugees and Migrants', description: 'Ensuring the protection and integration of refugees and migrants worldwide.' },
  { id: 'c4', name: 'Economic and Financial Committee (ECOFIN)', topic: 'Global Economic Recovery Post-Pandemic', description: 'Strategies for sustainable and inclusive economic growth in the wake of the COVID-19 pandemic.' },
  { id: 'c5', name: 'Special Political and Decolonization Committee (SPECPOL)', topic: 'The Question of Western Sahara', description: 'Seeking a peaceful and lasting resolution to the conflict in Western Sahara.' },
];

export const delegates: Delegate[] = [
  { id: 'd001', name: 'Adebayo Adekunle', email: 'delegate1@ruimun.com', university: "Redeemer's University", country: 'Nigeria', paymentStatus: 'Verified', committeeId: 'c1', registrationDate: '2025-10-15' },
  { id: 'd002', name: 'Chiamaka Nwosu', email: 'delegate2@ruimun.com', university: 'University of Lagos', country: 'Nigeria', paymentStatus: 'Verified', committeeId: 'c2', registrationDate: '2025-10-16' },
  { id: 'd003', name: 'Kwame Osei', email: 'delegate3@ruimun.com', university: 'University of Ghana', country: 'Ghana', paymentStatus: 'Pending', committeeId: 'c1', registrationDate: '2025-10-18' },
  { id: 'd004', name: 'Emily White', email: 'delegate4@ruimun.com', university: 'Harvard University', country: 'United States', paymentStatus: 'Verified', committeeId: 'c4', registrationDate: '2025-10-20' },
  { id: 'd005', name: 'David Lee', email: 'delegate5@ruimun.com', university: 'University of Toronto', country: 'Canada', paymentStatus: 'Not Paid', committeeId: null, registrationDate: '2025-10-21' },
  { id: 'd006', name: 'Fatima Al-Jamil', email: 'delegate6@ruimun.com', university: 'American University of Sharjah', country: 'UAE', paymentStatus: 'Verified', committeeId: 'c3', registrationDate: '2025-10-22' },
  { id: 'd007', name: 'Kenji Tanaka', email: 'delegate7@ruimun.com', university: 'University of Tokyo', country: 'Japan', paymentStatus: 'Pending', committeeId: null, registrationDate: '2025-10-24' },
  { id: 'd008', name: 'Sofia Rossi', email: 'delegate8@ruimun.com', university: 'Bocconi University', country: 'Italy', paymentStatus: 'Verified', committeeId: 'c5', registrationDate: '2025-10-25' },
  { id: 'd009', name: 'James Adebayo', email: 'delegate@ruimun.com', university: "Redeemer's University", country: 'Nigeria', paymentStatus: 'Verified', committeeId: 'c2', registrationDate: '2025-10-12' },
  { id: 'd010', name: 'New Delegate', email: 'new@ruimun.com', university: 'New York University', country: 'United States', paymentStatus: 'Pending', committeeId: null, registrationDate: '2025-10-28' },
];
