'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { StatusCards } from '@/components/dashboard/delegate/status-cards';
import type { Delegate, Committee } from '@/lib/types';
import { committees as allCommittees } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-28" />
      <Skeleton className="h-28" />
      <Skeleton className="h-28" />
    </div>
  );
}


export default function DelegateDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [delegate, setDelegate] = useState<Delegate | null>(null);
  const [committee, setCommittee] = useState<Committee | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "registrations", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const delegateData = docSnap.data() as Delegate;
            setDelegate(delegateData);
            if (delegateData.committeeId) {
              const assignedCommittee = allCommittees.find(c => c.id === delegateData.committeeId);
              setCommittee(assignedCommittee || null);
            }
          } else {
            // If no registration data, go to registration page
            router.push('/dashboard/delegate/registration');
            return; // Stop further processing
          }
        } catch (err) {
            console.error("Firestore error:", err);
            // It could be an offline error or permission error.
            // For a better UX, let's guide them to the registration page 
            // as it's the most likely next step.
            router.push('/dashboard/delegate/registration');
            return;
        }
      } else {
        // If no user, redirect to home
        router.push('/');
        return; // Stop further processing
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <DashboardLoading />;
  }
  
  if (delegate) {
    return <StatusCards delegate={delegate} committee={committee} />;
  }
  
  // This can be reached if a redirect is in progress
  return <DashboardLoading />;
}
