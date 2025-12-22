import { admin } from '@/lib/firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('Register delegate endpoint hit');
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      console.error('Authorization header missing or invalid');
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token.' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];
    if (!idToken) {
        console.error('ID token is empty after splitting from Bearer.');
        return NextResponse.json({ error: 'Unauthorized: Empty token.' }, { status: 401 });
    }
    console.log('Received ID token.');

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('Successfully verified ID token for UID:', decodedToken.uid);
    } catch (error: any) {
      console.error('Error verifying ID token:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token.', details: error.message }, { status: 401 });
    }
    
    const uid = decodedToken.uid;
    
    let body;
    try {
      body = await req.json();
      console.log('Successfully parsed request body for UID:', uid);
    } catch (error: any) {
      console.error('Error parsing request body:', error);
      return NextResponse.json({ error: 'Bad Request: Could not parse JSON body.', details: error.message }, { status: 400 });
    }

    const db = getFirestore(admin.app(), 'legacydb');
    console.log('Firestore instance retrieved for legacydb.');
    
    const registrationRef = db.collection('registrations').doc(uid);
    console.log(`Created document reference for path: ${registrationRef.path}`);

    try {
      await registrationRef.set({
        ...body,
        id: uid,
        user_id: uid,
        timestamp: FieldValue.serverTimestamp()
      });
      console.log('Successfully wrote registration data to Firestore for UID:', uid);
    } catch (error: any) {
      console.error(`Firestore write error for UID ${uid}:`, error);
      // This is where a NOT_FOUND error from Firestore would likely be caught.
      if (error.code === 5 || (error.details && error.details.includes('NOT_FOUND'))) {
        console.error('Firestore service or database not found. Check project/database configuration.');
      }
      return NextResponse.json({ error: 'Database error: Could not save registration.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Registration successful' });
  } catch (error: any) {
    console.error('Unhandled error in register delegate endpoint:', error);
    if (error.code === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'Token expired, please log in again.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred during registration.', details: error.message }, { status: 500 });
  }
}
