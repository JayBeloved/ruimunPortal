'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { SummarySection } from "@/components/dashboard/admin/summary-section";
import { Delegate } from '@/lib/types';
import { delegates, committees } from "@/lib/data"; // Keeping for placeholder/fallback

export default function AdminDashboardPage() {
  const db = useFirestore();
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [loading, setLoading] = useState(true);
  const allCommittees = committees; // Keep using static data for now

  useEffect(() => {
    if (!db) return;
    setLoading(true);
    
    const delegatesCollection = collection(db, 'registrations');
    
    const unsubscribe = onSnapshot(delegatesCollection, (snapshot) => {
      const fetchedDelegates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Delegate[];
      setDelegates(fetchedDelegates);
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch delegates:", error);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [db]);


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
            <p className="text-muted-foreground">
                A high-level overview of RUIMUN '26 statistics.
            </p>
        </div>
      </div>
      <SummarySection delegates={delegates} committees={allCommittees} loading={loading} />
    </div>
  );
}
