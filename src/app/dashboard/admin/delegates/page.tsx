'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase/provider';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
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

    // --- Data Fetching --- 
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
                setError('Failed to load data. Please try refreshing the page.');
                toast.error('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [db]);

    // --- Event Handlers for Table Actions ---
    const handleUpdatePayment = async (delegateId: string, newStatus: 'Verified' | 'Unverified') => {
        if (!db) return;
        try {
            const delegateRef = doc(db, 'delegates', delegateId);
            const batch = writeBatch(db);
            batch.update(delegateRef, { paymentStatus: newStatus });
            await batch.commit();

            // Update local state for immediate UI feedback
            setDelegates(prev => prev.map(d => d.id === delegateId ? { ...d, paymentStatus: newStatus } : d));
            toast.success(`Payment status updated for delegate.`);

        } catch (error) {
            console.error("Error updating payment status:", error);
            toast.error("Failed to update payment status.");
        }
    };

    const handleAssignCommittee = async (delegateId: string, committeeId: string) => {
        if (!db) return;
        try {
            const delegateRef = doc(db, 'delegates', delegateId);
            const batch = writeBatch(db);
            batch.update(delegateRef, { committee: committeeId });
            await batch.commit();

            setDelegates(prev => prev.map(d => d.id === delegateId ? { ...d, committee: committeeId } : d));
            toast.success("Delegate successfully assigned to committee.");

        } catch (error) {
            console.error("Error assigning committee:", error);
            toast.error("Failed to assign committee.");
        }
    };

    // --- Render Logic ---
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
                    onUpdatePayment={handleUpdatePayment} 
                    onAssignCommittee={handleAssignCommittee} 
                />
            </div>
        </div>
    );
}
