// '''
// This API route handles delegate registration. It replaces the old `/api/register_delegate` route.
// It validates the user's token, sanitizes the incoming form data to match the new schema,
// sets default status fields, and then upserts the data to the 'registrations' collection in Firestore.
// '''
import { admin } from '@/lib/firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('New registration API endpoint hit (/api/register)');
  try {
    // 1. Verify Firebase Auth Token
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token.' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log(`Token verified for UID: ${uid}`);

    // 2. Parse Request Body
    const body = await req.json();

    // 3. Connect to Firestore
    const db = getFirestore(admin.app(), 'legacydb');

    // 4. Sanitize and structure the data according to our new schema
    const registrationData = {
        // Personal Info
        name: body.name || null,
        phone: body.phone || null,
        gender: body.gender || null,
        delegate_type: body.delegate_type || null,

        // Additional Info
        affiliation: body.affiliation || null,
        position: body.position || null,
        department: body.department || null,
        matric_num: body.matric_num || null,
        city: body.city || null,
        state: body.state || null,
        country: body.country || 'Nigeria',
        zipcode: body.zipcode || null,

        // Other Info
        mun_experience: body.mun_experience || null,
        advert: body.advert || null,
        tshirt_size: body.tshirt_size || null,
        diet: body.diet || null,
        medical: body.medical || null,
        referral: body.referral || null,

        // Preferences (filter out any empty/incomplete preferences)
        preferences: (body.preferences || [])
            .filter((p: any) => p.committeeId && p.country)
            .map((p: any) => ({
                order: p.order,
                committeeId: p.committeeId,
                country: p.country,
            })),

        // Default Status Fields for new registrations
        paymentStatus: 'Unverified',
        assignmentStatus: 'Unassigned',
        assignedCommitteeId: null,
        assignedCountry: null,

        // Metadata
        id: uid,
        user_id: uid,
        email: decodedToken.email, // Use the verified email from the token
        lastUpdatedAt: FieldValue.serverTimestamp(),
    };

    // 5. Upsert the data to Firestore
    const registrationRef = db.collection('registrations').doc(uid);
    await registrationRef.set(registrationData, { merge: true }); // Use merge:true to avoid overwriting existing fields not in the form

    console.log(`Successfully wrote registration data for UID: ${uid}`);
    return NextResponse.json({ message: 'Registration successful' });

  } catch (error: any) {
    console.error('Unhandled error in /api/register endpoint:', error);
    if (error.code === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'Token expired, please log in again.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.', details: error.message }, { status: 500 });
  }
}
