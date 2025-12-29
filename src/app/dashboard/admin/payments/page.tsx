'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore } from '@/firebase/provider';
import { collection, getDocs, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { AdminPageLoader } from '@/components/dashboard/admin/loader';
import { Delegate, PaymentStatus } from '@/lib/types';
import { toast, Toaster } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';

const formatDate = (timestamp: Timestamp | Date | undefined) => {
    if (!timestamp) return 'N/A';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
};

export default function AdminPaymentsPage() {
    const db = useFirestore();
    const [delegates, setDelegates] = useState<Delegate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const PAYMENTS_PER_PAGE = 20;

    useEffect(() => {
        const fetchData = async () => {
            if (!db) return;
            setLoading(true);
            try {
                const snapshot = await getDocs(collection(db, 'registrations'));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Delegate[];
                setDelegates(data);
            } catch (err) {
                console.error("Error fetching payment data:", err);
                setError('Failed to load payment data. Please check your connection and permissions.');
                toast.error('Failed to load payment data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [db]);

    const handleStatusChange = async (delegateId: string, newStatus: PaymentStatus) => {
        if (!db) return;
        try {
            const delegateRef = doc(db, 'registrations', delegateId);
            await writeBatch(db).update(delegateRef, { paymentStatus: newStatus }).commit();
            setDelegates(prev => prev.map(d => d.id === delegateId ? { ...d, paymentStatus: newStatus } : d));
            toast.success(`Payment status for delegate updated to ${newStatus}.`);
        } catch (error) {
            console.error("Error updating payment status:", error);
            toast.error("Failed to update payment status.");
        }
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
                if (departmentFilter === 'all') return true;
                if (departmentFilter === 'his') {
                    const department = delegate.department?.toLowerCase().trim();
                    return delegate.delegate_type === 'redeemer' && (department === 'history and international studies' || department === 'his' || department === 'history and international relations');
                }
                return true;
            });
    }, [delegates, searchTerm, paymentFilter, departmentFilter]);

    const paginatedDelegates = useMemo(() => {
        const startIndex = (currentPage - 1) * PAYMENTS_PER_PAGE;
        return filteredDelegates.slice(startIndex, startIndex + PAYMENTS_PER_PAGE);
    }, [filteredDelegates, currentPage]);

    const totalPages = Math.ceil(filteredDelegates.length / PAYMENTS_PER_PAGE);

    if (loading) return <AdminPageLoader />;
    if (error) return <p className="text-red-500 p-4">{error}</p>;

    return (
        <div className="p-4 md:p-6">
            <Toaster richColors />
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Payment Management</h2>
                <p className="text-muted-foreground">
                    Update and track the payment status for all registered delegates.
                </p>
            </div>

            <Card>
                 <CardHeader>
                    <CardTitle>Registration Payments</CardTitle>
                    <CardDescription>
                        Change the payment status using the dropdown next to each delegate.
                    </CardDescription>
                     <div className="flex flex-wrap items-center gap-4 pt-4">
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
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">
                        Showing {paginatedDelegates.length} of {filteredDelegates.length} payments.
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Delegate Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Registration Date</TableHead>
                                <TableHead className="text-right">Payment Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedDelegates.map(reg => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium">{reg.name || 'N/A'}</TableCell>
                                    <TableCell>{reg.email}</TableCell>
                                    <TableCell>{formatDate(reg.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <Select
                                            value={reg.paymentStatus || 'Unverified'}
                                            onValueChange={(newValue) => handleStatusChange(reg.id, newValue as PaymentStatus)}
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue placeholder="Set Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Unverified">Unverified</SelectItem>
                                                <SelectItem value="Verified">Verified</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                </CardContent>
            </Card>
        </div>
    );
}
