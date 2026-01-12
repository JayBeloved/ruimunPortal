import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { Delegate } from '@/lib/types';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

// Connect to the correct Firestore database instance
const db = getFirestore(admin.app(), 'legacydb');
const mailCollection = db.collection('mail');

// Helper to get delegate UIDs based on a filter
async function getDelegateUids(filter: (delegate: Delegate) => boolean): Promise<string[]> {
  const snapshot = await db.collection('registrations').get();
  const uids: string[] = [];
  snapshot.forEach(doc => {
    const delegate = { id: doc.id, ...doc.data() } as Delegate;
    if (filter(delegate)) {
      uids.push(doc.id);
    }
  });
  return uids;
}

// Main API handler
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const isAdmin = decodedToken.admin === true;

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { action, recipientGroup, subject, message } = body;

    let uids: string[] = [];

    if (action === 'send-custom') {
      switch (recipientGroup) {
        case 'all':
          uids = await getDelegateUids(() => true);
          break;
        case 'assigned':
          uids = await getDelegateUids(d => d.assignmentStatus === 'Assigned');
          break;
        case 'verified':
          uids = await getDelegateUids(d => d.paymentStatus === 'Verified');
          break;
        case 'unverified':
          uids = await getDelegateUids(d => d.paymentStatus === 'Unverified');
          break;
        case 'run':
          uids = await getDelegateUids(d => d.delegate_type === 'redeemer');
          break;
        default:
          return NextResponse.json({ error: 'Invalid recipient group' }, { status: 400 });
      }

      if (uids.length === 0) {
        return NextResponse.json({ error: 'No recipients found for this group.' }, { status: 404 });
      }

      await mailCollection.add({
        toUids: uids,
        template: {
            name: 'custom', // A generic template for custom messages
            data: {
                subject: subject,
                html: message, // Assuming the message from textarea is safe HTML
            },
        },
      });

      return NextResponse.json({ message: 'Custom email queued successfully', count: uids.length });

    } else if (action === 'send-assignment-notification') {
      const assignedDelegatesSnapshot = await db.collection('registrations').where('assignmentStatus', '==', 'Assigned').get();
      if (assignedDelegatesSnapshot.empty) {
        return NextResponse.json({ error: 'No assigned delegates to notify.' }, { status: 404 });
      }

      const batch = db.batch();
      let count = 0;

      for (const doc of assignedDelegatesSnapshot.docs) {
        const delegate = { id: doc.id, ...doc.data() } as Delegate;
        
        // Fetch committee name from the committees collection
        let committeeName = 'N/A';
        if (delegate.assignedCommitteeId) {
            const committeeDoc = await db.collection('committees').doc(delegate.assignedCommitteeId).get();
            if(committeeDoc.exists) {
                committeeName = committeeDoc.data()?.name || 'N/A';
            }
        }

        const mailDocRef = mailCollection.doc(); // Create a new doc ref in the batch
        batch.set(mailDocRef, {
            to: [delegate.email], // Send to individual email to use personalized data
            template: {
                name: 'assignment', // Specific template for assignment notifications
                data: {
                    name: delegate.name,
                    committee: committeeName,
                    country: delegate.assignedCountry,
                },
            },
        });
        count++;
      }
      
      await batch.commit();

      return NextResponse.json({ message: 'Assignment notifications queued successfully', count });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred' }, { status: 500 });
  }
}
