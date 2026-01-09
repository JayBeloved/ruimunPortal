'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Delegate } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface DelegateDetailsModalProps {
  delegate: Delegate;
  isOpen: boolean;
  onClose: () => void;
}

export function DelegateDetailsModal({ delegate, isOpen, onClose }: DelegateDetailsModalProps) {
  if (!delegate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{delegate.name}</DialogTitle>
          <DialogDescription>
            Registration details for {delegate.email}
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-3 gap-x-6 gap-y-4 py-4 text-sm">
          
          {/* Column 1: Personal & Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base border-b pb-2">Personal Information</h4>
            <div><strong>Full Name:</strong> <p>{delegate.name}</p></div>
            <div><strong>Email:</strong> <p>{delegate.email}</p></div>
            <div><strong>Phone:</strong> <p>{delegate.phone}</p></div>
            <div><strong>Gender:</strong> <p className="capitalize">{delegate.gender}</p></div>
            <div><strong>Delegate Type:</strong> <p className="capitalize">{delegate.delegate_type?.replace('_', ' ')}</p></div>
            <div><strong>Location:</strong> <p>{`${delegate.city || 'N/A'}, ${delegate.state || 'N/A'}, ${delegate.country}`}</p></div>
          </div>

          {/* Column 2: Affiliation & Conference Choices */}
          <div className="space-y-4">
             <h4 className="font-semibold text-base border-b pb-2">Academic & Preferences</h4>
            <div><strong>Affiliation:</strong> <p>{delegate.affiliation}</p></div>
            <div><strong>Position:</strong> <p>{delegate.position || 'N/A'}</p></div>
            {delegate.delegate_type === 'redeemer' && (
              <>
                <div><strong>Department:</strong> <p>{delegate.department}</p></div>
                <div><strong>Matric No:</strong> <p>{delegate.matric_num}</p></div>
              </>
            )}
            <div>
              <strong>Committee Preferences:</strong>
              <div className="pl-2 text-gray-600">
                  {delegate.preferences?.map(p => (
                      <p key={p.order} className="text-xs">{`${p.order}. ${p.committeeId} - ${p.country || 'N/A'}`}</p>
                  ))}
              </div>
            </div>
            <div><strong>MUN Experience:</strong> <p>{delegate.mun_experience || 'N/A'}</p></div>
          </div>

          {/* Column 3: Status & Other Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base border-b pb-2">Status & Other Info</h4>
            <div className="flex items-center"><strong>Payment Status:</strong>
                <Badge variant={delegate.paymentStatus === 'Verified' ? 'success' : 'destructive'} className="ml-2">{delegate.paymentStatus}</Badge>
            </div>
             <div className="flex items-center"><strong>Assignment Status:</strong>
                <Badge variant={delegate.assignmentStatus === 'Assigned' ? 'success' : 'outline'} className="ml-2">{delegate.assignmentStatus || 'Unassigned'}</Badge>
            </div>
            {delegate.assignmentStatus === 'Assigned' && (
                <div className="pl-4 text-xs">
                    <div><strong>Assigned Committee:</strong> <p>{delegate.assignedCommitteeId}</p></div>
                    <div><strong>Assigned Country:</strong> <p>{delegate.assignedCountry}</p></div>
                </div>
            )}
            <hr/>
            <div><strong>T-Shirt Size:</strong> <p className="uppercase">{delegate.tshirt_size || 'N/A'}</p></div>
            <div><strong>Heard From:</strong> <p className="capitalize">{delegate.advert?.replace('_', ' ') || 'N/A'}</p></div>
            <div><strong>Dietary Needs:</strong> <p>{delegate.diet || 'N/A'}</p></div>
            <div><strong>Medical Info:</strong> <p>{delegate.medical || 'N/A'}</p></div>
          </div>

        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
