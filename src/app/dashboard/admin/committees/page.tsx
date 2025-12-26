'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore } from '@/firebase/provider';
import { collection, getDocs } from 'firebase/firestore';
import { AdminPageLoader } from '@/components/dashboard/admin/loader';
import { CommitteeAssignments } from '@/components/dashboard/admin/committees/assignments';
import { Delegate, Committee } from '@/lib/types';
import { toast, Toaster } from 'sonner';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function CommitteesPage() {
    const db = useFirestore();
    const [delegates, setDelegates] = useState<Delegate[]>([]);
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [assignmentFilter, setAssignmentFilter] = useState('all');

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
                setError('Failed to load committee data. Please try refreshing the page.');
                toast.error('Failed to load committee data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [db]);
    
    const filteredDelegates = useMemo(() => {
        return delegates
            .filter(delegate => {
                const searchTermLower = searchTerm.toLowerCase();
                return delegate.name.toLowerCase().includes(searchTermLower) || delegate.email.toLowerCase().includes(searchTermLower);
            })
            .filter(delegate => {
                if (assignmentFilter === 'all') return true;
                if (assignmentFilter === 'assigned') return !!delegate.assignedCommitteeId;
                if (assignmentFilter === 'unassigned') return !delegate.assignedCommitteeId;
                return true;
            });
    }, [delegates, searchTerm, assignmentFilter]);


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
            <div className="flex items-center gap-4 mb-4">
                <Input 
                    placeholder="Search by name or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by assignment" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Assignments</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="text-sm text-muted-foreground mb-2">
                Showing {filteredDelegates.length} of {delegates.length} delegates.
            </div>
            <CommitteeAssignments committees={committees} delegates={filteredDelegates} />
        </div>
    );
}
