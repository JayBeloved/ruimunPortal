'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';

import { useAuth, useFirestore } from '@/firebase/provider';
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
  const { user, loading: authLoading } = useAuth();
  const db = useFirestore();
  const [delegate, setDelegate] = useState<Delegate | null>(null);
  const [committee, setCommittee] = useState<Committee | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) {
      return; // Wait for authentication to complete
    }

    if (!user) {
      router.push('/');
      return;
    }
    
    if (!db) {
      return;
    }

    const docRef = doc(db, "registrations", user.uid);
    getDoc(docRef).then(docSnap => {
      if (docSnap.exists()) {
        const delegateData = docSnap.data() as Delegate;
        setDelegate(delegateData);
        if (delegateData.committeeId) {
          const assignedCommittee = allCommittees.find(c => c.id === delegateData.committeeId);
          setCommittee(assignedCommittee || null);
        }
      } else {
        router.push('/dashboard/delegate/registration');
      }
      setLoading(false);
    }).catch(err => {
      console.error("Firestore error:", err);
      // Redirect to registration on error as a fallback
      router.push('/dashboard/delegate/registration');
      setLoading(false);
    });

  }, [user, authLoading, db, router]);

  if (loading || authLoading) {
    return <DashboardLoading />;
  }
  
  if (delegate) {
    return <StatusCards delegate={delegate} committee={committee} />;
  }
  
  // This can be reached if a redirect is in progress or data is missing
  return <DashboardLoading />;
}
