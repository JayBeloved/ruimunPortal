'use client';

import { useMemo } from 'react';
import { Delegate, Committee } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface SummarySectionProps {
  delegates: Delegate[];
  committees: Committee[];
  loading: boolean;
}

// Reusable component for displaying a single statistic
function StatCard({ title, value, loading }: { title: string, value: string | number, loading: boolean }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{value}</div>}
            </CardContent>
        </Card>
    );
}

// Main component to display all summary statistics and charts
export function SummarySection({ delegates, committees, loading }: SummarySectionProps) {

    // Memoized calculation for key delegate statistics
    const delegateStats = useMemo(() => {
        const redeemer = delegates.filter(d => d.delegate_type === 'redeemer').length;
        const nigerian = delegates.filter(d => d.delegate_type === 'nigerian').length;
        const international = delegates.filter(d => d.delegate_type === 'international').length;
        const total = delegates.length;
        
        // REFACTORED: Use `assignedCommitteeId` and `paymentStatus`
        const assigned = delegates.filter(d => !!d.assignedCommitteeId).length;
        const verifiedPayments = delegates.filter(d => d.paymentStatus === 'Verified').length;

        return { redeemer, nigerian, international, total, assigned, verifiedPayments };
    }, [delegates]);

    // Memoized calculation for the distribution of 1st choice committee preferences
    const committeeDistribution = useMemo(() => {
        const distribution = new Map<string, number>();
        
        delegates.forEach(delegate => {
            // REFACTORED: Use the `preferences` array
            const firstChoice = delegate.preferences?.find(p => p.order === 1);
            if (firstChoice && firstChoice.committeeId) {
                // Find the committee name from its ID
                const committeeName = committees.find(c => c.id === firstChoice.committeeId)?.name || 'Unknown';
                distribution.set(committeeName, (distribution.get(committeeName) || 0) + 1);
            }
        });

        return Array.from(distribution, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    }, [delegates, committees]);

    return (
        <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Delegates" value={delegateStats.total} loading={loading} />
                <StatCard title="Redeemer's Delegates" value={delegateStats.redeemer} loading={loading} />
                <StatCard title="Nigerian Delegates" value={delegateStats.nigerian} loading={loading} />
                <StatCard title="International Delegates" value={delegateStats.international} loading={loading} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                 <StatCard title="Verified Payments" value={delegateStats.verifiedPayments} loading={loading} />
                 <StatCard title="Assigned Delegates" value={delegateStats.assigned} loading={loading} />
            </div>

            <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Committee Preferences (1st Choice)</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    {loading ? <Skeleton className="h-[350px] w-full" /> : 
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={committeeDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" name="1st Choice Selections" />
                            </BarChart>
                        </ResponsiveContainer>
                    }
                </CardContent>
            </Card>
        </section>
    );
}
