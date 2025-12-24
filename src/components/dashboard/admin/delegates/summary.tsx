'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Banknote, CreditCard } from 'lucide-react';
import { Delegate } from '@/lib/types';

interface SummaryProps {
    delegates: Delegate[];
}

export function SummarySection({ delegates }: SummaryProps) {
    const totalDelegates = delegates.length;
    const assignedDelegates = delegates.filter(d => d.committee).length;
    const verifiedPayments = delegates.filter(d => d.paymentStatus === 'Verified').length;
    const unverifiedPayments = totalDelegates - verifiedPayments;

    const summaryCards = [
        {
            title: 'Total Registered',
            value: totalDelegates,
            icon: <Users className="h-5 w-5 text-muted-foreground" />,
        },
        {
            title: 'Assigned to Committee',
            value: assignedDelegates,
            icon: <UserCheck className="h-5 w-5 text-muted-foreground" />,
        },
        {
            title: 'Verified Payments',
            value: verifiedPayments,
            icon: <Banknote className="h-5 w-5 text-muted-foreground" />,
        },
        {
            title: 'Unverified Payments',
            value: unverifiedPayments,
            icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        {card.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
