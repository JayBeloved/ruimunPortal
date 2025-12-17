
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserCheck, UserX, Landmark } from "lucide-react";
import type { Delegate, Committee } from "@/lib/types";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface SummarySectionProps {
  delegates: Delegate[];
  committees: Committee[];
}

export function SummarySection({ delegates, committees }: SummarySectionProps) {
  const totalDelegates = delegates.length;
  const verifiedPayments = delegates.filter(d => d.paymentStatus === 'Verified').length;
  const assignedDelegates = delegates.filter(d => d.committeeId !== null).length;
  const unassignedDelegates = totalDelegates - assignedDelegates;

  const committeeAssignments = committees.map(committee => ({
    name: committee.name.split(' ')[0], // Shorten name for chart
    delegates: delegates.filter(d => d.committeeId === committee.id).length,
  }));
  
  const chartConfig = {
    delegates: {
      label: "Delegates",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDelegates}</div>
            <p className="text-xs text-muted-foreground">Total delegates registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Payments</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedPayments}</div>
            <p className="text-xs text-muted-foreground">
              {((verifiedPayments / totalDelegates) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Delegates</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedDelegates}</div>
            <p className="text-xs text-muted-foreground">
                {((assignedDelegates / totalDelegates) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Delegates</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedDelegates}</div>
             <p className="text-xs text-muted-foreground">
                Awaiting committee assignment
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Committee Assignments</CardTitle>
          <CardDescription>Number of delegates assigned to each committee.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={committeeAssignments}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="delegates" fill="var(--color-delegates)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
