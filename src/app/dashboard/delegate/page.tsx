'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { DelegateRegistrationForm } from '@/components/dashboard/delegate/registration-form';
import { StatusCards } from '@/components/dashboard/delegate/status-cards';
import type { Delegate, Committee } from '@/lib/types';
import { committees as allCommittees } from '@/lib/data';

export default function DelegateDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [delegate, setDelegate] = useState<Delegate | null>(null);
  const [committee, setCommittee] = useState<Committee | null>(null);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "registrations", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const delegateData = docSnap.data() as Delegate;
          setDelegate(delegateData);
          setHasRegistered(true);
          if (delegateData.committeeId) {
            const assignedCommittee = allCommittees.find(c => c.id === delegateData.committeeId);
            setCommittee(assignedCommittee || null);
          }
        } else {
          setHasRegistered(false);
        }
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!user) {
    return null; // The redirect is handled in useEffect
  }
  
  if (hasRegistered) {
    return <StatusCards delegate={delegate} committee={committee} />;
  }

  return (
      <DelegateRegistrationForm />
  );
}
