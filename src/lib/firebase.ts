
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Added Firestore
import { getStorage } from "firebase/storage"; // Added Storage for completeness

// --- BEGIN DIAGNOSTIC LOGGING ---
// console.log("--- Firebase Configuration Attempting to Load ---");
// console.log("API Key (NEXT_PUBLIC_FIREBASE_API_KEY):", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
// console.log("Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN):", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
// console.log("Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID):", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
// console.log("Storage Bucket (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET):", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
// console.log("Messaging Sender ID (NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID):", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
// console.log("App ID (NEXT_PUBLIC_FIREBASE_APP_ID):", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn(
    "WARNING: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or undefined. " +
    "Please ensure it is correctly set in your .env.local file and that you have " +
    "RESTARTED your development server (npm run dev)."
  );
}
// console.log("-------------------------------------------------");
// console.log("ACTION REQUIRED: Please CAREFULLY COMPARE the 'Project ID' and 'Auth Domain' logged above with the values in your Firebase project settings (Project settings > General > Your apps > Web app > SDK setup and configuration). They MUST match EXACTLY. Also, ensure 'localhost' is listed under Authentication > Sign-in method > Authorized domains for THIS specific project.");
// console.log("-------------------------------------------------");
// --- END DIAGNOSTIC LOGGING ---


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Added measurementId
};


// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app); // Initialized Firestore
const storage = getStorage(app); // Initialized Storage

export { app, auth, db, storage };
