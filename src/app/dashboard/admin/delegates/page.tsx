'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase/provider';
import { collection, getDocs, doc, writeBatch, FieldValue } from 'firebase/firestore';
import { SummarySection } from '@/components/dashboard/admin/delegates/summary';
import { DelegatesTable } from '@/components/dashboard/admin/delegates/table';
import { AdminPageLoader } from '@/components/dashboard/admin/loader';
import { Delegate, Committee } from '@/lib/types';
import { toast, Toaster } from 'sonner';

export default function DelegatesPage() {
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
                const delegatesSnapshot = await getDocs(collection(db, 'registrations'));
                const delegatesData = delegatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Delegate[];
                setDelegates(delegatesData);

                const committeesSnapshot = await getDocs(collection(db, 'committees'));
                const committeesData = committeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Committee[];
                setCommittees(committeesData);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError('Failed to load data. Please try refreshing.');
                toast.error('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [db]);

    const handleAssignCommittee = async (delegateId: string, committeeId: string, country: string) => {
        if (!db) return;
        try {
            const delegateRef = doc(db, 'registrations', delegateId);
            const selectedCommittee = committees.find(c => c.id === committeeId);
            if (!selectedCommittee) throw new Error("Selected committee not found.");

            const batch = writeBatch(db);
            batch.update(delegateRef, { 
                assignedCommitteeId: committeeId,
                assignedCountry: country,
                assignmentStatus: 'Assigned',
             });
            await batch.commit();

            // Update local state for immediate UI feedback
            setDelegates(prev => prev.map(d => d.id === delegateId ? { ...d, assignedCommitteeId: committeeId, assignedCountry: country, assignmentStatus: 'Assigned' } : d));
            toast.success(`Assigned ${country} in ${selectedCommittee.name} to delegate.`);

        } catch (error) {
            console.error("Error assigning committee:", error);
            toast.error("Failed to assign committee.");
        }
    };

    if (loading) {
        return <AdminPageLoader />;
    }

    if (error) {
        return <p className="text-red-500 p-4">{error}</p>;
    }

    return (
        <div className="p-4 md:p-6">
            <Toaster richColors />
            <h1 className="text-2xl font-bold mb-4">Delegates Management</h1>
            <SummarySection delegates={delegates} />
            <div className="mt-6">
                <DelegatesTable 
                    delegates={delegates} 
                    committees={committees} 
                    onAssignCommittee={handleAssignCommittee} 
                />
            </div>
        </div>
    );
}
