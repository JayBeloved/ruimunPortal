import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Initialize the SDK using Application Default Credentials
    // This is the recommended approach for Google Cloud environments like App Hosting
    admin.initializeApp();
    console.log('Firebase Admin SDK initialized successfully using Application Default Credentials.');
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    // Re-throwing the error can help in debugging if the process should not continue
    throw new Error(`Firebase admin initialization failed: ${error}`);
  }
}

export { admin };
