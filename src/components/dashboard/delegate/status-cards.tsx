"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark, CheckCircle2, CircleDollarSign, MessageSquare } from "lucide-react";
import type { Delegate, Committee } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  
  const isAssigned = delegate.assignmentStatus === 'Assigned' && committee;

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
            {isAssigned ? committee.name : "Pending"}
          </div>
          <p className="text-xs text-muted-foreground">
            {isAssigned ? `Country: ${delegate.assignedCountry}` : "Assignment is in progress."}
          </p>
        </CardContent>
      </Card>

      {/* General Assembly WhatsApp Group Card - Visible only to verified and assigned delegates */}
      {delegate.paymentStatus === 'Verified' && isAssigned && (
        <Card className="lg:col-span-3 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">General Assembly</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold mb-2">Join the Delegate Group Chat</div>
            <p className="text-xs text-muted-foreground mb-4">
              Click the link below to join the official WhatsApp group for all assigned delegates to receive important updates.
            </p>
            <Button asChild>
                <Link href="https://chat.whatsapp.com/HAsbkrTrptV4JUgbvFExTb" target="_blank">
                    Join WhatsApp Group
                </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}