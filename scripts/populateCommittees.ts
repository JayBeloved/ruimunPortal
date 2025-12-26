// scripts/populateCommittees.ts

import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { committees } from '../lib/committees';

// CORRECTED PATH: Build path from the project root to the correct key location.
const serviceAccountPath = path.join(process.cwd(), 'src/lib/serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// CORRECTED DATABASE: Connect to the 'legacydb' database.
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
    const docId = String(committeeData.id);

    try {
      const docRef = committeesCollectionRef.doc(docId);
      await docRef.set({
        id: docId,
        name: committeeData.committee,
        countries: committeeData.countries,
      });

      console.log(`Successfully added committee: ${committeeData.committee} (ID: ${docId})`);
      successCount++;
    } catch (error) {
      console.error(`Error adding committee ${committeeData.committee} (ID: ${docId}):`, error);
      errorCount++;
    }
  }

  console.log(`\nCommittee population complete.`);
  console.log(`Successfully added ${successCount} committees.`);
  console.log(`Failed to add ${errorCount} committees.`);
}

populateCommittees()
  .then(() => {
    console.log('Script finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unhandled error during script execution:', error);
    process.exit(1);
  });
