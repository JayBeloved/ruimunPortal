import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Check if the necessary environment variables are set
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error('Missing Firebase Admin SDK credentials in environment variables.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key must be properly formatted
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export { admin };
