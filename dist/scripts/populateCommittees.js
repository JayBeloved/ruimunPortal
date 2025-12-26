"use strict";
// scripts/populateCommittees.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const committees_1 = require("../lib/committees");
// CORRECTED PATH: Build path from the project root to the correct key location.
const serviceAccountPath = path.join(process.cwd(), 'src/lib/serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
// CORRECTED DATABASE: Connect to the 'legacydb' database.
const firestoreDb = (0, firestore_1.getFirestore)(admin.app(), 'legacydb');
async function populateCommittees() {
    console.log('Starting population of committees collection...');
    if (!committees_1.committees || committees_1.committees.length === 0) {
        console.warn('No committees found in lib/committees.ts. Aborting.');
        return;
    }
    const committeesCollectionRef = firestoreDb.collection('committees');
    let successCount = 0;
    let errorCount = 0;
    for (const committeeData of committees_1.committees) {
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
        }
        catch (error) {
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
