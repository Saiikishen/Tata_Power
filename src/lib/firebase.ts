

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Removed GoogleAuthProvider
// import { getFirestore } from "firebase/firestore"; // Include if Firestore is needed

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// --- BEGIN DIAGNOSTIC LOGGING ---
// console.log("--- Firebase Configuration Attempting to Load ---");
// console.log("API Key (NEXT_PUBLIC_FIREBASE_API_KEY):", firebaseConfig.apiKey);
// console.log("Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN):", firebaseConfig.authDomain);
// console.log("Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID):", firebaseConfig.projectId);
// console.log("Storage Bucket (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET):", firebaseConfig.storageBucket);
// console.log("Messaging Sender ID (NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID):", firebaseConfig.messagingSenderId);
// console.log("App ID (NEXT_PUBLIC_FIREBASE_APP_ID):", firebaseConfig.appId);

if (!firebaseConfig.apiKey) {
  console.error(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
    "CRITICAL WARNING: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is MISSING or UNDEFINED.\n" +
    "Please ensure it is correctly set in your .env.local file and that you have \n" +
    "RESTARTED your development server (npm run dev).\n" +
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
}
// if (!firebaseConfig.authDomain) {
//   console.warn("WARNING: Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) appears to be missing or undefined.");
// }
// if (!firebaseConfig.projectId) {
//   console.warn("WARNING: Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) appears to be missing or undefined.");
// }
// console.log("-------------------------------------------------");
// console.log("ACTION REQUIRED: Please CAREFULLY COMPARE the 'Project ID' and 'Auth Domain' logged above with the values in your Firebase project settings (Project settings > General > Your apps > Web app > SDK setup and configuration). They MUST match EXACTLY. Also, ensure 'localhost' is listed under Authentication > Sign-in method > Authorized domains for THIS specific project.");
// console.log("-------------------------------------------------");
// --- END DIAGNOSTIC LOGGING ---

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
// const db = getFirestore(app); // Include if Firestore is needed

export { app, auth /*, db */ }; // googleProvider removed from exports
