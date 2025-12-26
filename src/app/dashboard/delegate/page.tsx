'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

import { useAuth, useFirestore } from '@/firebase/provider';
import { StatusCards } from '@/components/dashboard/delegate/status-cards';
import type { Delegate, Committee } from '@/lib/types';
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
    if (authLoading || !db) {
      return;
    }

    if (!user) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const delegateDocRef = doc(db, "registrations", user.uid);
        const committeesCollectionRef = collection(db, "committees");

        const [delegateDocSnap, committeesSnapshot] = await Promise.all([
            getDoc(delegateDocRef),
            getDocs(committeesCollectionRef)
        ]);

        if (delegateDocSnap.exists()) {
          const delegateData = delegateDocSnap.data() as Delegate;
          setDelegate(delegateData);

          const committeesData = committeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Committee[];

          if (delegateData.assignedCommitteeId) {
            const assignedCommittee = committeesData.find(c => c.id === delegateData.assignedCommitteeId);
            setCommittee(assignedCommittee || null);
          }
        } else {
          router.push('/dashboard/delegate/registration');
        }
      } catch (err) {
        console.error("Firestore error:", err);
        router.push('/dashboard/delegate/registration');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [user, authLoading, db, router]);

  if (loading || authLoading) {
    return <DashboardLoading />;
  }
  
  if (delegate) {
    return <StatusCards delegate={delegate} committee={committee} />;
  }
  
  return <DashboardLoading />;
}
