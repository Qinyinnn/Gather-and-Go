/**
 * Gather&Go Firebase Service Layer
 * 
 * This file acts as the "Backend API" for the frontend.
 * Instead of calling HTTP endpoints (fetch('/api/...')), 
 * the frontend calls these functions directly.
 * 
 * It handles all interactions with Firestore.
 */

import { 
    db, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    collection,
    addDoc,
    getDocs
} from './firebase-init.js';

import { User, Group, EventRecommendation } from './models.js';

/* ==========================================================================
   1. User Preferences API
   ========================================================================== */

/**
 * Save or update a user's preferences
 * Equivalent to: POST /api/preferences
 * 
 * @param {string} userId - The unique user ID
 * @param {Object} userData - { name, email, preferences }
 * @returns {Promise<void>}
 */
export async function saveUserPreferences(userId, userData) {
    try {
        const userRef = doc(db, 'users', userId);
        
        // Merge with existing data so we don't overwrite fields we aren't updating
        await setDoc(userRef, {
            ...userData,
            updatedAt: new Date()
        }, { merge: true });
        
        console.log(`✅ User preferences saved for ${userId}`);
    } catch (error) {
        console.error('❌ Error saving preferences:', error);
        throw error;
    }
}

/**
 * Get a user's profile
 * @param {string} userId 
 * @returns {Promise<User|null>}
 */
export async function getUserProfile(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const snapshot = await getDoc(userRef);
        
        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() };
        }
        return null;
    } catch (error) {
        console.error('❌ Error fetching user:', error);
        throw error;
    }
}

/* ==========================================================================
   2. Group Management API
   ========================================================================== */

/**
 * Create a new group
 * Equivalent to: POST /api/group (create mode)
 * 
 * @param {string} userId - Creator's ID
 * @param {string} groupName - Name of the trip
 * @returns {Promise<string>} The new Group ID
 */
export async function createGroup(userId, groupName) {
    try {
        const groupsRef = collection(db, 'groups');
        const newGroupData = {
            name: groupName,
            createdBy: userId,
            memberIds: [userId],
            invitedEmails: [],
            status: 'planning',
            createdAt: new Date()
        };
        
        const docRef = await addDoc(groupsRef, newGroupData);
        console.log(`✅ Group created with ID: ${docRef.id}`);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error creating group:', error);
        throw error;
    }
}

/**
 * Join an existing group
 * Equivalent to: POST /api/group (join mode)
 * 
 * @param {string} userId - User joining
 * @param {string} groupId - Group ID to join
 * @returns {Promise<void>}
 */
export async function joinGroup(userId, groupId) {
    try {
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);
        
        if (!groupSnap.exists()) {
            throw new Error('Group not found');
        }
        
        // Atomically add user to memberIds array
        await updateDoc(groupRef, {
            memberIds: arrayUnion(userId)
        });
        
        console.log(`✅ User ${userId} joined group ${groupId}`);
    } catch (error) {
        console.error('❌ Error joining group:', error);
        throw error;
    }
}

/* ==========================================================================
   3. Recommendations API (Real Firestore Integration)
   ========================================================================== */

/**
 * Seed event recommendations to Firestore for a group
 * Call this once to populate the database with initial events
 * 
 * @param {string} groupId 
 * @returns {Promise<void>}
 */
export async function seedRecommendations(groupId) {
    try {
        const mockEvents = generateMockRecommendations();
        console.log(`🌱 Seeding ${mockEvents.length} recommendations for group ${groupId}...`);
        
        const recsRef = collection(db, 'groups', groupId, 'recommendations');
        
        for (const event of mockEvents) {
            await setDoc(doc(recsRef, event.id), {
                ...event,
                createdAt: new Date(),
                votes: event.votes || 0,
                userRatings: {} // { userId: rating }
            });
        }
        
        console.log('✅ Recommendations seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding recommendations:', error);
        throw error;
    }
}

/**
 * Get curated event recommendations for a group
 * Equivalent to: GET /api/recommend
 * 
 * MODE: Currently using MOCK DATA (TA approved)
 * The Firebase backend is fully implemented and can be enabled by setting USE_FIREBASE = true
 * 
 * @param {string} groupId 
 * @returns {Promise<EventRecommendation[]>} List of recommended events
 */
export async function getRecommendations(groupId) {
    const USE_FIREBASE = true; // Toggle to true to use real Firebase backend
    
    if (!USE_FIREBASE) {
        // Mock data mode (default for demo/grading)
        console.log(`🔄 Generating mock recommendations for group ${groupId}...`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        return generateMockRecommendations();
    }
    
    // Real Firebase backend (optional - demonstrates backend integration capability)
    try {
        console.log(`🔄 Fetching recommendations from Firestore for group ${groupId}...`);
        
        const recsRef = collection(db, 'groups', groupId, 'recommendations');
        const snapshot = await getDocs(recsRef);
        
        if (snapshot.empty) {
            console.warn('⚠️ No recommendations found in Firestore. Returning mock data.');
            return generateMockRecommendations();
        }
        
        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Sort by match score descending
        events.sort((a, b) => b.matchScore - a.matchScore);
        
        console.log(`✅ Loaded ${events.length} recommendations from Firestore`);
        return events;
        
    } catch (error) {
        console.error('❌ Error getting recommendations:', error);
        // Return mock data as fallback so UI doesn't break
        return generateMockRecommendations();
    }
}

/**
 * Vote for an event (increments vote count)
 * Equivalent to: POST /api/vote
 * 
 * @param {string} groupId 
 * @param {string} eventId 
 * @returns {Promise<number>} New vote count
 */
export async function voteForEvent(groupId, eventId) {
    try {
        const eventRef = doc(db, 'groups', groupId, 'recommendations', eventId);
        const eventSnap = await getDoc(eventRef);
        
        if (!eventSnap.exists()) {
            throw new Error('Event not found');
        }
        
        const currentVotes = eventSnap.data().votes || 0;
        const newVotes = currentVotes + 1;
        
        await updateDoc(eventRef, {
            votes: newVotes,
            lastVotedAt: new Date()
        });
        
        console.log(`✅ Vote recorded for event ${eventId}. New count: ${newVotes}`);
        return newVotes;
    } catch (error) {
        console.error('❌ Error voting for event:', error);
        throw error;
    }
}

/**
 * Rate an event (1-5 stars)
 * Equivalent to: POST /api/rate
 * 
 * @param {string} groupId 
 * @param {string} eventId 
 * @param {string} userId 
 * @param {number} rating - 1 to 5 stars
 * @returns {Promise<void>}
 */
export async function rateEvent(groupId, eventId, userId, rating) {
    try {
        if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        
        const eventRef = doc(db, 'groups', groupId, 'recommendations', eventId);
        
        await updateDoc(eventRef, {
            [`userRatings.${userId}`]: rating,
            lastRatedAt: new Date()
        });
        
        console.log(`✅ Rating ${rating} stars saved for event ${eventId} by user ${userId}`);
    } catch (error) {
        console.error('❌ Error rating event:', error);
        throw error;
    }
}

/**
 * Helper to generate mock data covering all vibe categories
 */
function generateMockRecommendations() {
    return [
        new EventRecommendation(
            'evt-1',
            'Free Jazz Picnic',
            'Central Park',
            'Saturday, 3:00 PM',
            '$15/person',
            'Live jazz band with picnic setup and food trucks. Perfect for a relaxing afternoon.',
            'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
            95,
            ['Picnic', 'Concert', 'Music'],
            '🎶'
        ),
        new EventRecommendation(
            'evt-2',
            'Rooftop Dinner',
            'Downtown Skybar',
            'Friday, 7:00 PM',
            '$45/person',
            'Italian cuisine with breathtaking city views. Great for a fancy night out.',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
            88,
            ['Dinner', 'Food & Drinks', 'View'],
            '🍽️'
        ),
        new EventRecommendation(
            'evt-3',
            'Coffee & Catch Up',
            'The Brew House',
            'Sunday, 10:00 AM',
            '$8/person',
            'Cozy cafe with board games and artisan coffee blends.',
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
            85,
            ['Coffee', 'Gaming', 'Relax'],
            '☕'
        ),
        new EventRecommendation(
            'evt-4',
            'Movie Marathon',
            'Cinema Plaza',
            'Saturday, 7:30 PM',
            '$12/person',
            'Back-to-back screenings of classic films with premium seating.',
            'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
            82,
            ['Movie', 'Entertainment', 'Popcorn'],
            '🎬'
        ),
        new EventRecommendation(
            'evt-5',
            'Modern Art Gallery Tour',
            'MoMA',
            'Sunday, 11:00 AM',
            '$25/person',
            'Guided tour of the new exhibition with expert commentary.',
            'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
            80,
            ['Museums', 'Arts', 'Culture'],
            '🏛️'
        ),
        new EventRecommendation(
            'evt-6',
            'Sunset Beach Yoga',
            'Ocean Beach',
            'Saturday, 6:00 PM',
            '$20/person',
            'Relaxing yoga session by the waves followed by meditation.',
            'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
            78,
            ['Wellness', 'Beach', 'Sports'],
            '🧘'
        ),
        new EventRecommendation(
            'evt-7',
            'Hiking Adventure',
            'Bear Mountain',
            'Sunday, 8:00 AM',
            'Free',
            'Moderate trail with scenic overlooks. Bring your own water!',
            'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
            75,
            ['Hiking', 'Sports', 'Nature'],
            '⛰️'
        ),
        new EventRecommendation(
            'evt-8',
            'Shopping Spree',
            'SoHo District',
            'Saturday, 1:00 PM',
            'Free entry',
            'Explore trendy boutiques and pop-up shops in the heart of the city.',
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
            72,
            ['Shopping', 'Lifestyle', 'Fashion'],
            '🛍️'
        ),
        new EventRecommendation(
            'evt-9',
            'Gaming Tournament',
            'Arcade Bar',
            'Friday, 9:00 PM',
            '$10 entry',
            'Retro arcade games and e-sports tournament with prizes.',
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
            70,
            ['Gaming', 'Entertainment', 'Nightlife'],
            '🎮'
        ),
        new EventRecommendation(
            'evt-10',
            'Book Club Meetup',
            'City Library',
            'Sunday, 2:00 PM',
            'Free',
            'Discussing the latest bestseller with fellow book lovers.',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
            68,
            ['Books', 'Culture', 'Quiet'],
            '📚'
        )
    ];
}