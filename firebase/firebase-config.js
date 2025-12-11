/**
 * Firebase Configuration File
 * 
 * This file contains your Firebase project configuration.
 * You need to replace the placeholder values with your actual Firebase project credentials.
 * 
 * HOW TO GET YOUR FIREBASE CONFIG:
 * 1. Go to https://console.firebase.google.com/
 * 2. Select your project (or create a new one)
 * 3. Click the gear icon (Project Settings)
 * 4. Scroll down to "Your apps" section
 * 5. Click the web icon (</>) to add a web app
 * 6. Copy the config object and paste it below
 * 
 * IMPORTANT: Keep this file secure and never commit real credentials to public repositories!
 */

// Firebase configuration object
// TODO: Replace these placeholder values with your actual Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

// Export the config for use in firebase-init.js
export default firebaseConfig;
