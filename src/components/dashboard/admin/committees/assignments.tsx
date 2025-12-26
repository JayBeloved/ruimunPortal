'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Delegate, Committee } from '@/lib/types';
import { useMemo } from 'react';

interface AssignmentsProps {
    committees: Committee[];
    delegates: Delegate[];
}

export function CommitteeAssignments({ committees, delegates }: AssignmentsProps) {

    const getDelegatesByCommittee = (committeeId: string) => {
        return delegates.filter(d => d.assignedCommitteeId === committeeId);
    };

    const countryAssignments = useMemo(() => {
        const assignments: { [country: string]: { delegate: Delegate, committeeName: string }[] } = {};
        delegates.forEach(delegate => {
            if (delegate.assignedCommitteeId && delegate.assignedCountry) {
                const committee = committees.find(c => c.id === delegate.assignedCommitteeId);
                if (!assignments[delegate.assignedCountry]) {
                    assignments[delegate.assignedCountry] = [];
                }
                assignments[delegate.assignedCountry].push({ delegate, committeeName: committee?.name || 'N/A' });
            }
        });
        return assignments;
    }, [delegates, committees]);

    return (
        <Tabs defaultValue={committees.length > 0 ? committees[0].id : 'country-view'}>
            <TabsList className="h-auto flex-wrap justify-start">
                {committees.map((committee) => (
                    <TabsTrigger key={committee.id} value={committee.id} className="m-1">{committee.name}</TabsTrigger>
                ))}
                <TabsTrigger value="country-view" className="m-1">View by Country</TabsTrigger>
            </TabsList>

            {committees.map((committee) => (
                <TabsContent key={committee.id} value={committee.id}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{committee.name}</CardTitle>
                            <CardDescription>
                                {`A list of delegates assigned to the ${committee.name} committee.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Country</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getDelegatesByCommittee(committee.id).map(delegate => (
                                        <TableRow key={delegate.id}>
                                            <TableCell>{delegate.name}</TableCell>
                                            <TableCell>{delegate.assignedCountry}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {getDelegatesByCommittee(committee.id).length === 0 && (
                                <p className="p-4 text-center text-muted-foreground">No delegates assigned to this committee yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}

            <TabsContent value="country-view">
                <Card>
                    <CardHeader>
                        <CardTitle>Assignments by Country</CardTitle>
                        <CardDescription>View all committee assignments grouped by country.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {Object.keys(countryAssignments).sort().map(country => (
                            <div key={country} className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">{country}</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Delegate</TableHead>
                                            <TableHead>Committee</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {countryAssignments[country].map(({ delegate, committeeName }) => (
                                            <TableRow key={delegate.id}>
                                                <TableCell>{delegate.name}</TableCell>
                                                <TableCell>{committeeName}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                        {Object.keys(countryAssignments).length === 0 && (
                            <p className="p-4 text-center text-muted-foreground">No delegates have been assigned to any committee yet.</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
