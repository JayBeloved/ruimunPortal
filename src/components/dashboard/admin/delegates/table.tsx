'use client';

import { useState, useMemo } from 'react';
import { Delegate, Committee } from '@/lib/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Props {
    delegates: Delegate[];
    committees: Committee[];
    onAssignCommittee: (delegateId: string, committeeId: string, country: string) => Promise<void>;
}

export function DelegatesTable({ delegates, committees, onAssignCommittee }: Props) {
    const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(null);
    const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');

    const committeeMap = useMemo(() => new Map(committees.map(c => [c.id, c.name])), [committees]);

    const handleOpenDialog = (delegate: Delegate) => {
        setSelectedDelegate(delegate);
        setSelectedCommitteeId(delegate.assignedCommitteeId || '');
        setSelectedCountry(delegate.assignedCountry || '');
    };

    const handleSubmit = async () => {
        if (selectedDelegate && selectedCommitteeId && selectedCountry) {
            await onAssignCommittee(selectedDelegate.id, selectedCommitteeId, selectedCountry);
            setSelectedDelegate(null);
        }
    };

    const getAvailableCountries = (committeeId: string): string[] => {
        const committee = committees.find(c => c.id === committeeId);
        if (!committee) return [];

        const assignedCountries = delegates
            .filter(d => d.assignedCommitteeId === committeeId)
            .map(d => d.assignedCountry);
            
        return committee.countries.filter(country => !assignedCountries.includes(country!));
    };

    const isAssignmentDisabled = (delegate: Delegate) => {
        return delegate.paymentStatus !== 'Verified';
    };

    const handleCommitteeChange = (committeeId: string) => {
        setSelectedCommitteeId(committeeId);
        setSelectedCountry(''); // Reset country selection
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Affiliation</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Assigned Committee</TableHead>
                        <TableHead>Assigned Country</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {delegates.map((delegate) => (
                        <TableRow key={delegate.id}>
                            <TableCell>{delegate.name}</TableCell>
                            <TableCell>{delegate.affiliation}</TableCell>
                            <TableCell>
                                <Badge variant={delegate.paymentStatus === 'Verified' ? 'success' : 'destructive'}>
                                    {delegate.paymentStatus}
                                </Badge>
                            </TableCell>
                            <TableCell>{committeeMap.get(delegate.assignedCommitteeId || '') || 'N/A'}</TableCell>
                            <TableCell>{delegate.assignedCountry || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                                <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedDelegate(null)}>
                                    <DialogTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleOpenDialog(delegate)}
                                            disabled={isAssignmentDisabled(delegate)}
                                        >
                                            {delegate.assignedCommitteeId ? 'Edit Assignment' : 'Assign'}
                                        </Button>
                                    </DialogTrigger>
                                    {selectedDelegate?.id === delegate.id && (
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Assign Committee for {selectedDelegate.name}</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="text-sm">
                                                    <h4 className="font-semibold mb-2">Preferences:</h4>
                                                    {selectedDelegate.preferences?.length > 0 ? (
                                                        <ul className="list-decimal list-inside text-gray-600">
                                                            {selectedDelegate.preferences.sort((a,b) => a.order - b.order).map(pref => (
                                                                <li key={pref.order}>{committeeMap.get(pref.committeeId)} - {pref.country}</li>
                                                            ))}
                                                        </ul>
                                                    ) : <p>No preferences submitted.</p>}
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Committee</label>
                                                    <Select onValueChange={handleCommitteeChange} value={selectedCommitteeId}>
                                                        <SelectTrigger><SelectValue placeholder="Select a committee" /></SelectTrigger>
                                                        <SelectContent>
                                                            {committees.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Country</label>
                                                    <Select onValueChange={setSelectedCountry} value={selectedCountry} disabled={!selectedCommitteeId}>
                                                        <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
                                                        <SelectContent>
                                                            {getAvailableCountries(selectedCommitteeId).map(country => <SelectItem key={country} value={country}>{country}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <Button onClick={handleSubmit} className="w-full" disabled={!selectedCommitteeId || !selectedCountry}>
                                                    Confirm Assignment
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    )}
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
