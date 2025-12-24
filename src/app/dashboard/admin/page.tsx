'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase/provider';
import { SummarySection } from "@/components/dashboard/admin/summary-section";
import { Delegate } from '@/lib/types';
import { committees } from "@/lib/data"; 
import { AdminPageLoader } from '@/components/dashboard/admin/loader';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export default function AdminDashboardPage() {
  const { db, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [loading, setLoading] = useState(true);
  const allCommittees = committees; 

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      router.push('/login');
      return;
    }
    if (!db) {
        toast.error("Firestore is not available.");
        setLoading(false);
        return;
    };

    const fetchDelegates = async () => {
        setLoading(true);
        try {
            const delegatesCollection = collection(db, 'registrations');
            const snapshot = await getDocs(delegatesCollection);

            const fetchedDelegates = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Delegate[];

            setDelegates(fetchedDelegates);
        } catch (error: any) {
            console.error("Failed to fetch delegates:", error);
            toast.error("Failed to fetch delegate data.", { description: error.message });
        } finally {
            setLoading(false);
        }
    }

    fetchDelegates();

  }, [db, isAdmin, authLoading, router]);


  if (loading || authLoading) {
      return <AdminPageLoader />;
  }

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
