'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@/firebase/provider';
import { SummarySection } from "@/components/dashboard/admin/summary-section";
import { Delegate, Committee } from '@/lib/types';
import { AdminPageLoader } from '@/components/dashboard/admin/loader';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CommunicationHub } from '@/components/dashboard/admin/communication-hub';

export default function AdminDashboardPage() {
  const { db, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

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

    const fetchData = async () => {
        setLoading(true);
        try {
            const [delegatesSnapshot, committeesSnapshot] = await Promise.all([
                getDocs(collection(db, 'registrations')),
                getDocs(collection(db, 'committees'))
            ]);

            const fetchedDelegates = delegatesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Delegate[];

            const fetchedCommittees = committeesSnapshot.docs.map(doc => doc.data() as Committee);

            setDelegates(fetchedDelegates);
            setCommittees(fetchedCommittees);

        } catch (error: any) {
            console.error("Failed to fetch admin data:", error);
            toast.error("Failed to fetch dashboard data.", { description: error.message });
        } finally {
            setLoading(false);
        }
    }

    fetchData();

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
      <SummarySection delegates={delegates} committees={committees} loading={loading} />
      <CommunicationHub delegates={delegates} />
    </div>
  );
}
