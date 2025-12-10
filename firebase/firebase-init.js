/**
 * Firebase Initialization File
 * 
 * This file initializes the Firebase app and services.
 * It imports the Firebase SDK and creates instances of Firebase services
 * that can be used throughout the application.
 * 
 * Services initialized:
 * - Firebase App
 * - Firestore Database
 * - Authentication (optional, commented out)
 * 
 * TODO: Install Firebase SDK before using this file
 */

// Import Firebase SDK modules
// NOTE: You need to include Firebase SDK in your HTML or install it via npm
// 
// Option 1: Add to index.html (before this script):
// <script type="module">
//   import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
//   import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
// </script>
//
// Option 2: If using npm/build tools:
// npm install firebase

// For CDN usage (recommended for this project):
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Optional: Import Authentication if needed
// import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Import your Firebase configuration
import firebaseConfig from './firebase-config.js';

/* ============================================
   INITIALIZE FIREBASE
   ============================================ */

let app;
let db;
// let auth; // Uncomment if using authentication

try {
    // Initialize Firebase App
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase App initialized successfully');
    
    // Initialize Firestore Database
    db = getFirestore(app);
    console.log('✅ Firestore Database initialized successfully');
    
    // Initialize Authentication (optional)
    // auth = getAuth(app);
    // console.log('✅ Firebase Authentication initialized successfully');
    
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.error('Please check your firebase-config.js file and ensure all credentials are correct.');
}

/* ============================================
   FIRESTORE HELPER FUNCTIONS
   ============================================ */

/**
 * Add a new document to a collection
 * @param {string} collectionName - Name of the collection
 * @param {Object} data - Data to add
 * @returns {Promise<DocumentReference>} Reference to the created document
 */
export async function addDocument(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: new Date()
        });
        console.log('Document written with ID:', docRef.id);
        return docRef;
    } catch (error) {
        console.error('Error adding document:', error);
        throw error;
    }
}

/**
 * Get a single document by ID
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<Object>} Document data
 */
export async function getDocument(collectionName, docId) {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting document:', error);
        throw error;
    }
}

/**
 * Get all documents from a collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Array>} Array of documents
 */
export async function getAllDocuments(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const documents = [];
        
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        
        return documents;
    } catch (error) {
        console.error('Error getting documents:', error);
        throw error;
    }
}

/**
 * Update a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Object} data - Data to update
 * @returns {Promise<void>}
 */
export async function updateDocument(collectionName, docId, data) {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date()
        });
        console.log('Document updated successfully');
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
}

/**
 * Delete a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<void>}
 */
export async function deleteDocument(collectionName, docId) {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        console.log('Document deleted successfully');
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
}

/* ============================================
   EXPORTS
   ============================================ */

// Export Firebase instances for use in other modules
export {
    app,
    db,
    // auth, // Uncomment if using authentication
    // Also export Firestore functions for convenience
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit
};

/* ============================================
   EXAMPLE USAGE IN OTHER FILES
   ============================================ */

/*
// In your other JavaScript files, import like this:

import { db, collection, addDoc } from './firebase/firebase-init.js';

// Add a trip
const tripData = {
    name: "Summer Trip 2025",
    destination: "Tokyo",
    members: ["user1", "user2"],
    startDate: new Date("2025-06-15"),
    endDate: new Date("2025-06-22")
};

const docRef = await addDoc(collection(db, 'trips'), tripData);
console.log('Trip created with ID:', docRef.id);

// Get all trips
const tripsRef = collection(db, 'trips');
const snapshot = await getDocs(tripsRef);
snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
});
*/
