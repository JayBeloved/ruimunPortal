'use client';

import { useMemo } from 'react';
import { Delegate, Committee } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface SummarySectionProps {
  delegates: Delegate[];
  committees: Committee[];
  loading: boolean;
}

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

export function SummarySection({ delegates, committees, loading }: SummarySectionProps) {

    const delegateStats = useMemo(() => {
        const redeemer = delegates.filter(d => d.delegate_type === 'redeemer').length;
        const nigerian = delegates.filter(d => d.delegate_type === 'nigerian').length;
        const international = delegates.filter(d => d.delegate_type === 'international').length;
        const total = delegates.length;
        
        const assigned = delegates.filter(d => d.assigned_committee && d.assigned_country).length;
        const verifiedPayments = delegates.filter(d => d.payment_status === 'verified').length;

        return { redeemer, nigerian, international, total, assigned, verifiedPayments };
    }, [delegates]);

    const committeeDistribution = useMemo(() => {
        const distribution = new Map<string, number>();
        delegates.forEach(delegate => {
            if (delegate.committee1) {
                distribution.set(delegate.committee1, (distribution.get(delegate.committee1) || 0) + 1);
            }
        });
        return Array.from(distribution, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    }, [delegates]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Delegates" value={delegateStats.total} loading={loading} />
                <StatCard title="Redeemer's Delegates" value={delegateStats.redeemer} loading={loading} />
                <StatCard title="Nigerian Delegates" value={delegateStats.nigerian} loading={loading} />
                <StatCard title="International Delegates" value={delegateStats.international} loading={loading} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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
