import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (process.env.NODE_ENV === 'development') {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } else {
        // Use service account credentials in production
        const serviceAccount = require('@/lib/serviceAccountKey.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export { admin };
