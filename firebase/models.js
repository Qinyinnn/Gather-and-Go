/**
 * Gather&Go Data Models (Firestore Schema)
 * 
 * This file documents the structure of data stored in Firestore.
 * Since Firestore is NoSQL, these are conceptual models enforced by our code.
 */

/**
 * @typedef {Object} Availability
 * @property {string[]} timeSlots - Array of strings like "Mon 9:00 AM"
 */

/**
 * @typedef {Object} UserPreferences
 * @property {Object} budget - Budget preferences
 * @property {number} budget.min - Minimum budget per person
 * @property {number} budget.max - Maximum budget per person
 * @property {string} budget.currency - e.g., "USD"
 * @property {string[]} activities - Array of activity types (e.g., "Dinner", "Hiking")
 * @property {string} notes - Optional notes or "vibes" description
 * @property {Availability} availability - When the user is free
 */

/**
 * Firestore Collection: 'users'
 * Document ID: User's Auth ID
 */
export class User {
    constructor(id, name, email, preferences = {}) {
        this.id = id;
        this.name = name;
        this.email = email;
        /** @type {UserPreferences} */
        this.preferences = preferences;
    }
}

/**
 * Firestore Collection: 'groups'
 * Document ID: Auto-generated or Share Code
 */
export class Group {
    constructor(id, name, createdBy) {
        this.id = id;
        this.name = name;
        this.createdBy = createdBy;
        this.memberIds = [createdBy]; // Array of User IDs
        this.invitedEmails = []; // Array of invited email strings
        this.status = 'planning'; // 'planning', 'finalized'
        this.createdAt = new Date();
    }
}

/**
 * Event Recommendation Object
 * (Generated dynamically or stored in 'recommendations' sub-collection)
 */
export class EventRecommendation {
    constructor(id, title, location, time, price, description, imageUrl, matchScore, tags, emoji) {
        this.id = id;
        this.title = title;
        this.location = location;
        this.time = time;
        this.price = price; // String format like "$15/person" to match UI
        this.description = description;
        this.imageUrl = imageUrl;
        this.matchScore = matchScore; // 0-100
        this.tags = tags; // Array of strings
        this.emoji = emoji; // Emoji icon
        this.rating = { average: 4.5, count: 5 }; // Mock rating
        this.votes = 0; // Number of votes
    }
}
