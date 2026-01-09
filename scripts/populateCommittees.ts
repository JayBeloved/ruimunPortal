// scripts/populateCommittees.ts

import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { committees } from '../src/lib/committees'; // Corrected path to be relative to project root

// Initialize Firebase using Application Default Credentials
// This is the recommended and more secure method for server-side scripts
if (!admin.apps.length) {
  try {
    admin.initializeApp();
    console.log('Firebase Admin SDK initialized successfully using Application Default Credentials.');
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    process.exit(1); // Exit if initialization fails
  }
}

// Connect to the correct Firestore database
const firestoreDb = getFirestore(admin.app(), 'legacydb');

async function populateCommittees() {
  console.log('Starting population of committees collection...');

  if (!committees || committees.length === 0) {
    console.warn('No committees found in lib/committees.ts. Aborting.');
    return;
  }

  const committeesCollectionRef = firestoreDb.collection('committees');
  let successCount = 0;
  let errorCount = 0;

  for (const committeeData of committees) {
    // Ensure the ID from the local file is used as the document ID in Firestore
    const docId = String(committeeData.id);

    try {
      const docRef = committeesCollectionRef.doc(docId);
      // Set the document data, ensuring it includes the id, name, and countries
      await docRef.set({
        id: docId, // Storing the id within the document as well
        name: committeeData.committee, // Correct field name is 'committee' in the source
        countries: committeeData.countries,
      });

      console.log(`Successfully set committee: ${committeeData.committee} (ID: ${docId})`);
      successCount++;
    } catch (error) {
      console.error(`Error setting committee ${committeeData.committee} (ID: ${docId}):`, error);
      errorCount++;
    }
  }

  console.log(`\nCommittee population complete.`);
  console.log(`Successfully set/updated ${successCount} committees.`);
  console.log(`Failed on ${errorCount} committees.`);
}

populateCommittees()
  .then(() => {
    console.log('Script finished executing.');
    // Using a timeout to ensure all async logs can complete before exit
    setTimeout(() => process.exit(0), 1000);
  })
  .catch((error) => {
    console.error('Unhandled error during script execution:', error);
    setTimeout(() => process.exit(1), 1000);
  });
