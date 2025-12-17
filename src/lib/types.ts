
export type Delegate = {
  id: string;
  name: string;
  email: string;
  university: string;
  country: string;
  paymentStatus: 'Verified' | 'Pending' | 'Not Paid';
  committeeId: string | null;
  registrationDate: string;
};

export type Committee = {
  id: string;
  name: string;
  description: string;
  topic: string;
};
