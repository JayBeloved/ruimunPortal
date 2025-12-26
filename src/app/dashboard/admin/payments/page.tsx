'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase/provider';
import { collection, getDocs, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { AdminPageLoader } from '@/components/dashboard/admin/loader';
import { Delegate, PaymentStatus } from '@/lib/types';
import { toast, Toaster } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Helper to format Firestore Timestamps
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
            const batch = writeBatch(db);
            batch.update(delegateRef, { paymentStatus: newStatus });
            await batch.commit();

            // Update local state for immediate UI feedback
            setDelegates(prev => prev.map(d => d.id === delegateId ? { ...d, paymentStatus: newStatus } : d));
            toast.success(`Payment status for delegate updated to ${newStatus}.`);

        } catch (error) {
            console.error("Error updating payment status:", error);
            toast.error("Failed to update payment status.");
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
                </CardHeader>
                <CardContent>
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
                            {delegates.map(reg => (
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
                </CardContent>
            </Card>
        </div>
    );
}
