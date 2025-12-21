import { admin } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const body = await req.json();

    const db = admin.firestore();
    
    // Use the UID as the document ID in the 'registrations' collection
    const registrationRef = db.collection('registrations').doc(uid);

    // Set the data, including the UID and a server timestamp
    await registrationRef.set({
      ...body,
      id: uid,
      user_id: uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return NextResponse.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error submitting registration:', error);
    if (error.code === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'Token expired, please log in again.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'An error occurred during registration.' }, { status: 500 });
  }
}
