'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase/provider';
import { collection, getDocs } from 'firebase/firestore';
import { AdminPageLoader } from '@/components/dashboard/admin/loader';
import { CommitteeAssignments } from '@/components/dashboard/admin/committees/assignments';
import { Delegate, Committee } from '@/lib/types';
import { toast, Toaster } from 'sonner';

export default function CommitteesPage() {
    const db = useFirestore();
    const [delegates, setDelegates] = useState<Delegate[]>([]);
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!db) return;
            setLoading(true);
            try {
                // Fetch Delegates
                const delegatesSnapshot = await getDocs(collection(db, 'delegates'));
                const delegatesData = delegatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Delegate[];
                setDelegates(delegatesData);

                // Fetch Committees
                const committeesSnapshot = await getDocs(collection(db, 'committees'));
                const committeesData = committeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Committee[];
                setCommittees(committeesData);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError('Failed to load committee data. Please try refreshing the page.');
                toast.error('Failed to load committee data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [db]);

    if (loading) {
        return <AdminPageLoader />;
    }

    if (error) {
        return <p className="text-red-500 p-4">{error}</p>;
    }

    return (
        <div className="p-4 md:p-6">
            <Toaster richColors />
            <h1 className="text-2xl font-bold mb-4">Committee Assignments</h1>
            <CommitteeAssignments committees={committees} delegates={delegates} />
        </div>
    );
}
