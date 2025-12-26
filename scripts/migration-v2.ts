import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// --- Use the robust connection method from populateCommittees.ts ---
const serviceAccountPath = path.join(process.cwd(), 'src/lib/serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore(admin.app(), 'legacydb');

// A mapping to store committee names to their IDs (e.g., "United Nations Security Council (UNSC)" -> "unsc")
const committeeNameToIdMap = new Map<string, string>();

async function migrateRegistrations() {
    console.log('Starting database migration...');

    // 1. Fetch all committees to build the name-to-ID map
    console.log('Fetching committees to build name-to-ID map...');
    try {
        const committeesSnapshot = await db.collection('committees').get();
        committeesSnapshot.forEach(doc => {
            const committee = doc.data();
            if (committee.name && committee.id) {
                committeeNameToIdMap.set(committee.name, committee.id);
            }
        });
        console.log(`Successfully built map for ${committeeNameToIdMap.size} committees.`);
    } catch (error) {
        console.error('FATAL: Could not fetch committees collection. Ensure it is populated correctly.', error);
        return; // Stop migration if we can't build the map
    }

    if (committeeNameToIdMap.size === 0) {
        console.error('FATAL: Committee name-to-ID map is empty. Migration cannot proceed.');
        return;
    }

    // 2. Fetch all existing registration documents
    console.log('Fetching all documents from the registrations collection...');
    const registrationsRef = db.collection('registrations');
    const registrationsSnapshot = await registrationsRef.get();
    console.log(`Found ${registrationsSnapshot.size} documents to migrate.`);

    if (registrationsSnapshot.empty) {
        console.log('No registration documents found to migrate. Exiting.');
        return;
    }

    // 3. Create a batch write to update all documents atomically
    const batch = db.batch();
    let migratedCount = 0;

    registrationsSnapshot.forEach(doc => {
        const delegateData = doc.data();
        const docRef = registrationsRef.doc(doc.id);

        // --- Transform Preferences ---
        const newPreferences: { committeeId: string; country: string; order: number }[] = [];

        if (delegateData.committee1 && delegateData.country1) {
            const committeeId = committeeNameToIdMap.get(delegateData.committee1);
            if (committeeId) {
                newPreferences.push({ committeeId, country: delegateData.country1, order: 1 });
            }
        }
        if (delegateData.committee2 && delegateData.country2) {
            const committeeId = committeeNameToIdMap.get(delegateData.committee2);
            if (committeeId) {
                newPreferences.push({ committeeId, country: delegateData.country2, order: 2 });
            }
        }
        if (delegateData.committee3 && delegateData.country3) {
            const committeeId = committeeNameToIdMap.get(delegateData.committee3);
            if (committeeId) {
                newPreferences.push({ committeeId, country: delegateData.country3, order: 3 });
            }
        }

        // --- Prepare the updated document data ---
        const updatedData = {
            ...delegateData, // Keep existing data
            preferences: newPreferences, // Add new preferences array
            // Add new denormalized fields
            paymentStatus: 'Unverified',
            assignedCommitteeId: null,
            assignedCountry: null,
            assignmentStatus: 'Unassigned',
            lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),

            // Fields to remove
            committee1: admin.firestore.FieldValue.delete(),
            country1: admin.firestore.FieldValue.delete(),
            committee2: admin.firestore.FieldValue.delete(),
            country2: admin.firestore.FieldValue.delete(),
            committee3: admin.firestore.FieldValue.delete(),
            country3: admin.firestore.FieldValue.delete(),
            status: admin.firestore.FieldValue.delete(), // Replaced by assignmentStatus
            captured: admin.firestore.FieldValue.delete(),
        };
        
        batch.update(docRef, updatedData);
        migratedCount++;
    });

    // 4. Commit the batch
    try {
        console.log(`Committing batch write to update ${migratedCount} documents...`);
        await batch.commit();
        console.log('\x1b[32m%s\x1b[0m', `✅ Successfully migrated ${migratedCount} documents!`);
    } catch (error) {
        console.error('FATAL: Error committing batch write:', error);
    }
}

migrateRegistrations()
  .then(() => {
    console.log('Script finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unhandled error during script execution:', error);
    process.exit(1);
  });
