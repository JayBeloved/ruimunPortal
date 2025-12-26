
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark, CheckCircle2, CircleDollarSign } from "lucide-react";
import type { Delegate, Committee } from "@/lib/types";

interface StatusCardsProps {
  delegate: Delegate | null;
  committee: Committee | null;
}

export function StatusCards({ delegate, committee }: StatusCardsProps) {
  if (!delegate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delegate Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We could not find your registration details.</p>
        </CardContent>
      </Card>
    );
  }

  const getPaymentBadgeVariant = (status: Delegate['paymentStatus']) => {
    switch (status) {
      case "Verified":
        return "success";
      case "Unverified":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registration Status</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Complete</div>
          <p className="text-xs text-muted-foreground">
            Thank you for registering!
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Badge variant={getPaymentBadgeVariant(delegate.paymentStatus)} className="text-lg">
            {delegate.paymentStatus}
          </Badge>
          <p className="text-xs text-muted-foreground">
            {delegate.paymentStatus === 'Verified' ? "Your payment is confirmed." : "Awaiting payment verification."}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Committee Assignment</CardTitle>
          <Landmark className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {committee ? committee.name : "Pending"}
          </div>
          <p className="text-xs text-muted-foreground">
            {committee ? `Country: ${delegate.assignedCountry}` : "Assignment is in progress."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
