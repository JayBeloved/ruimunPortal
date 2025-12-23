import { admin } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to set a custom claim on a user account, granting them admin privileges.
 * 
 * IMPORTANT: Secure this endpoint in a production environment. 
 * You could protect it with another custom claim (e.g., `superAdmin: true`) 
 * or only enable it temporarily when you need to provision new admins.
 *
 * @param {NextRequest} req - The incoming request, expected to have a JSON body with `email`.
 */
export async function POST(req: NextRequest) {
  try {
    // Note: In a real-world scenario, you MUST protect this endpoint.
    // For now, we are leaving it open for initial setup.
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required in the request body.' }, { status: 400 });
    }

    // Get the user by email
    const user = await admin.auth().getUserByEmail(email);

    // Set the custom claim { admin: true }
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    // It's often a good idea to revoke refresh tokens to ensure the claim is applied immediately
    // on the next token refresh. The user will need to log in again.
    await admin.auth().revokeRefreshTokens(user.uid);

    console.log(`Custom claim 'admin: true' set for user ${email} (UID: ${user.uid})`);

    return NextResponse.json({ message: `Successfully granted admin privileges to ${email}.` });

  } catch (error: any) {
    console.error(`Error setting admin claim:`, error);
    if (error.code === 'auth/user-not-found') {
        return NextResponse.json({ error: `User with email ${error.email} not found.` }, { status: 404 });
    }
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
