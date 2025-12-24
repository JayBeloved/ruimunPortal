export interface Delegate {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    country: string;
    gender: string;
    previousMUNs: string;
    committee: string; // This will be the committee ID
    paymentStatus: 'Verified' | 'Unverified';
    registrationDate: any; // Consider using a more specific type like firebase.firestore.Timestamp
}

export interface Committee {
    id: string;
    name: string;
    description: string;
    // Add any other committee-specific fields here
}
