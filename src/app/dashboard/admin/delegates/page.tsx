'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore } from '@/firebase/provider';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { SummarySection } from '@/components/dashboard/admin/delegates/summary';
import { DelegatesTable } from '@/components/dashboard/admin/delegates/table';
import { AdminPageLoader } from '@/components/dashboard/admin/loader';
import { Delegate, Committee } from '@/lib/types';
import { toast, Toaster } from 'sonner';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { DelegateDetailsModal } from '@/components/dashboard/admin/delegates/details-modal';

export default function DelegatesPage() {
    const db = useFirestore();
    const [delegates, setDelegates] = useState<Delegate[]>([]);
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(null);

    const DELEGATES_PER_PAGE = 20;

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

            setDelegates(prev => prev.map(d => d.id === delegateId ? { ...d, assignedCommitteeId: committeeId, assignedCountry: country, assignmentStatus: 'Assigned' } : d));
            toast.success(`Assigned ${country} in ${selectedCommittee.name} to delegate.`);

        } catch (error) {
            console.error("Error assigning committee:", error);
            toast.error("Failed to assign committee.");
        }
    };

    const handleViewDetails = (delegate: Delegate) => {
        setSelectedDelegate(delegate);
    };

    const handleCloseModal = () => {
        setSelectedDelegate(null);
    };

    const filteredDelegates = useMemo(() => {
        return delegates
            .filter(delegate => {
                const searchTermLower = searchTerm.toLowerCase();
                return delegate.name.toLowerCase().includes(searchTermLower) || delegate.email.toLowerCase().includes(searchTermLower);
            })
            .filter(delegate => {
                if (paymentFilter === 'all') return true;
                return delegate.paymentStatus === paymentFilter;
            })
            .filter(delegate => {
                if (assignmentFilter === 'all') return true;
                if (assignmentFilter === 'assigned') return !!delegate.assignedCommitteeId;
                if (assignmentFilter === 'unassigned') return !delegate.assignedCommitteeId;
                return true;
            })
            .filter(delegate => {
                if (departmentFilter === 'all') return true;
                if (departmentFilter === 'his') {
                    const department = delegate.department?.toLowerCase().trim();
                    return delegate.delegate_type === 'redeemer' && (department === 'history and international studies' || department === 'his' || department === 'history and international relations');
                }
                return true;
            });
    }, [delegates, searchTerm, paymentFilter, assignmentFilter, departmentFilter]);

    const paginatedDelegates = useMemo(() => {
        const startIndex = (currentPage - 1) * DELEGATES_PER_PAGE;
        const endIndex = startIndex + DELEGATES_PER_PAGE;
        return filteredDelegates.slice(startIndex, endIndex);
    }, [filteredDelegates, currentPage]);

    const totalPages = Math.ceil(filteredDelegates.length / DELEGATES_PER_PAGE);

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
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <Input 
                        placeholder="Search by name or email..." 
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="max-w-sm"
                    />
                    <Select value={paymentFilter} onValueChange={(value) => { setPaymentFilter(value); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by payment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Payment Statuses</SelectItem>
                            <SelectItem value="Verified">Verified</SelectItem>
                            <SelectItem value="Unverified">Unverified</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select value={assignmentFilter} onValueChange={(value) => { setAssignmentFilter(value); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by assignment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Assignments</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={departmentFilter} onValueChange={(value) => { setDepartmentFilter(value); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Delegates</SelectItem>
                            <SelectItem value="his">RUN HIS Students</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                    Showing {paginatedDelegates.length} of {filteredDelegates.length} delegates.
                </div>
                <DelegatesTable 
                    delegates={paginatedDelegates} 
                    committees={committees} 
                    onAssignCommittee={handleAssignCommittee}
                    onViewDetails={handleViewDetails}
                />
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm">Page {currentPage} of {totalPages || 1}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </Button>
                </div>
            </div>
            {selectedDelegate && (
                <DelegateDetailsModal
                    delegate={selectedDelegate}
                    isOpen={!!selectedDelegate}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
