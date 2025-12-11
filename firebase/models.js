/**
 * Gather&Go Data Models (Firestore Schema)
 * 
 * This file documents the structure of data stored in Firestore.
 * Since Firestore is NoSQL, these are conceptual models enforced by our code.
 */

/**
 * @typedef {Object} Availability
 * @property {string[]} dates - Array of ISO date strings (e.g., "2025-07-15")
 * @property {string} timeRange - e.g., "18:00-22:00"
 */

/**
 * @typedef {Object} UserPreferences
 * @property {Object} budget - Budget preferences
 * @property {number} budget.min - Minimum budget per person
 * @property {number} budget.max - Maximum budget per person
 * @property {string} budget.currency - e.g., "USD"
 * @property {string[]} interests - Array of "vibes" or activity types (e.g., "hiking", "jazz", "foodie")
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
        this.createdBy = createdBy; // ID of User who created the group
        this.memberIds = [createdBy]; // Array of User IDs
        this.status = 'planning'; // 'planning', 'finalized'
        this.createdAt = new Date();
    }
}

/**
 * Event Recommendation Object
 * (Generated dynamically or stored in 'recommendations' sub-collection)
 */
export class EventRecommendation {
    constructor(id, title, location, time, price, description, imageUrl, matchScore, tags, emoji, votes = 0) {
        this.id = id;
        this.title = title;
        this.location = location;
        this.time = time;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.matchScore = matchScore;
        this.tags = tags;
        this.emoji = emoji;
        this.votes = votes;
        this.rating = { average: 4.5, count: 10 }; // Mock rating
    }
}
