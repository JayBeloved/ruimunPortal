import * as admin from 'firebase-admin';
import serviceAccount from '@/lib/serviceAccountKey.json';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
      // databaseURL: `https://studio-7787230270-1a82b.firebaseio.com`
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export { admin };
