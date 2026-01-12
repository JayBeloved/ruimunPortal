'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/firebase/provider';
import { toast } from 'sonner';
import { Delegate } from '@/lib/types';

interface CommunicationHubProps {
  delegates: Delegate[];
}

type RecipientGroup = 'all' | 'assigned' | 'verified' | 'unverified' | 'run';

export function CommunicationHub({ delegates }: CommunicationHubProps) {
  const { user } = useAuth();
  const [recipientGroup, setRecipientGroup] = useState<RecipientGroup>('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSendingCustom, setIsSendingCustom] = useState(false);
  const [isSendingAssignments, setIsSendingAssignments] = useState(false);

  const handleSendCustomEmail = async () => {
    if (!subject || !message) {
      toast.error('Subject and message are required.');
      return;
    }
    setIsSendingCustom(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          action: 'send-custom',
          recipientGroup,
          subject,
          message,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email.');
      }

      toast.success(`Email queued for ${result.count} recipients in the '${recipientGroup}' group.`);
      setSubject('');
      setMessage('');

    } catch (error: any) {
      toast.error('Failed to send email', { description: error.message });
    } finally {
      setIsSendingCustom(false);
    }
  };

  const handleSendAssignmentEmails = async () => {
    setIsSendingAssignments(true);
    try {
        const idToken = await user?.getIdToken();
        const response = await fetch('/api/admin/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
                action: 'send-assignment-notification'
            }),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to send notifications.');
        }

        toast.success(`Assignment notifications queued for ${result.count} delegates.`);

    } catch (error: any) {
        toast.error('Failed to send notifications', { description: error.message });
    } finally {
        setIsSendingAssignments(false);
    }
  };


  return (
    <div className="grid gap-8 mt-8 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Communication Hub</CardTitle>
          <CardDescription>Send emails to targeted delegate groups.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                 <div className="grid gap-2">
                    <Label htmlFor="recipient-group">Recipient Group</Label>
                    <Select onValueChange={(value) => setRecipientGroup(value as RecipientGroup)} value={recipientGroup}>
                        <SelectTrigger id="recipient-group">
                            <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Registered Delegates</SelectItem>
                            <SelectItem value="assigned">All Assigned Delegates</SelectItem>
                            <SelectItem value="verified">All Verified Payments</SelectItem>
                            <SelectItem value="unverified">All Unverified Payments</SelectItem>
                            <SelectItem value="run">All Redeemer's University Students</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Email Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message here. You can use HTML for formatting, for example: <a href='...' target='_blank'>Click here</a>" value={message} onChange={(e) => setMessage(e.target.value)} rows={8}/>
            </div>

            <Button onClick={handleSendCustomEmail} disabled={isSendingCustom || isSendingAssignments}>
                {isSendingCustom ? 'Sending...' : 'Send Custom Email'}
            </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Assignment Notifications</CardTitle>
          <CardDescription>Notify delegates about their committee and country assignments.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">
                This will send a personalized email to every delegate who has been assigned a committee and country. The email will contain their specific assignment details.
            </p>
             <Button onClick={handleSendAssignmentEmails} disabled={isSendingAssignments || isSendingCustom} variant="outline">
                {isSendingAssignments ? 'Sending Notifications...' : 'Send Assignment Notifications'}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
