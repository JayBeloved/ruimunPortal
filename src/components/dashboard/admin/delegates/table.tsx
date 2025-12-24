'use client';

import { useState } from 'react';
import { 
    Table, 
    TableHeader, 
    TableRow, 
    TableHead, 
    TableBody, 
    TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Delegate, Committee } from '@/lib/types';
import { MoreHorizontal, Edit, CheckCircle, XCircle } from 'lucide-react';

interface TableProps {
    delegates: Delegate[];
    committees: Committee[];
    onUpdatePayment: (delegateId: string, status: 'Verified' | 'Unverified') => void;
    onAssignCommittee: (delegateId: string, committeeId: string) => void;
}

export function DelegatesTable({ delegates, committees, onUpdatePayment, onAssignCommittee }: TableProps) {
    const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(null);
    const [selectedCommittee, setSelectedCommittee] = useState<string>('');

    const handleOpenAssignDialog = (delegate: Delegate) => {
        setSelectedDelegate(delegate);
        setSelectedCommittee(delegate.committee || '');
    };

    const handleConfirmAssignment = () => {
        if (selectedDelegate && selectedCommittee) {
            onAssignCommittee(selectedDelegate.id, selectedCommittee);
            // Close dialog logic can be handled here or by the Dialog component itself
        }
    };

    const getCommitteeName = (committeeId: string) => {
        const committee = committees.find(c => c.id === committeeId);
        return committee ? committee.name : 'Not Assigned';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Delegates</CardTitle>
                <CardDescription>View and manage all registered delegates.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Institution</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead>Committee</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {delegates.map((delegate) => (
                            <TableRow key={delegate.id}>
                                <TableCell className="font-medium">{delegate.fullName}</TableCell>
                                <TableCell>{delegate.institution}</TableCell>
                                <TableCell>
                                    <Badge variant={delegate.paymentStatus === 'Verified' ? 'success' : 'destructive'}>
                                        {delegate.paymentStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>{getCommitteeName(delegate.committee)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => onUpdatePayment(delegate.id, 'Verified')}>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Verified
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => onUpdatePayment(delegate.id, 'Unverified')}>
                                                <XCircle className="mr-2 h-4 w-4" /> Mark as Unverified
                                            </DropdownMenuItem>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" className="w-full justify-start p-2" onClick={() => handleOpenAssignDialog(delegate)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Assign Committee
                                                    </Button>
                                                </DialogTrigger>
                                                {selectedDelegate && (
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Assign Committee for {selectedDelegate.fullName}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <Select onValueChange={setSelectedCommittee} value={selectedCommittee}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a committee" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {committees.map((committee) => (
                                                                    <SelectItem key={committee.id} value={committee.id}>{committee.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button onClick={handleConfirmAssignment}>Confirm Assignment</Button>
                                                </DialogContent>
                                                )}
                                            </Dialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
