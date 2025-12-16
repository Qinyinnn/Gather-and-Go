import { getRecommendations, seedRecommendations, voteForEvent, rateEvent } from '../firebase/services.js';

// DOM Elements
const eventsContainer = document.getElementById('events-container');
const topMatchSection = document.getElementById('top-match-section');

// Mock Group ID for this prototype
const MOCK_GROUP_ID = 'demo-group-123';

// Generate or retrieve user ID (in production, use Firebase Auth)
const USER_ID = localStorage.getItem('userId') || (() => {
    const id = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', id);
    return id;
})();

// Track user ratings in memory
const userRatings = {};
const eventVotes = {};

/**
 * Initialize the page
 */
async function init() {
    try {
        // Fetch recommendations from Firebase
        let events = await getRecommendations(MOCK_GROUP_ID);
        
        // If Firestore is empty, show seed button
        // Check if data has createdAt field (Firebase seeded) vs mock data
        if (events.length === 0 || (events.length === 10 && !events[0].createdAt)) {
            showSeedPrompt();
            return;
        }
        
        // Initialize vote tracking from Firestore
        events.forEach(event => {
            eventVotes[event.id] = event.votes || 0;
        });
        
        // Render events
        renderEvents(events);
    } catch (error) {
        console.error('Failed to load recommendations:', error);
        eventsContainer.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; padding: 2rem;">
                <h3>Oops! Something went wrong.</h3>
                <p>Please try refreshing the page.</p>
            </div>
        `;
    }
}

/**
 * Show prompt to seed initial data to Firebase
 */
function showSeedPrompt() {
    eventsContainer.innerHTML = `
        <div style="text-align: center; grid-column: 1/-1; padding: 3rem; background: white; border-radius: 16px; margin: 2rem;">
            <h2 style="margin-bottom: 1rem;">🌱 First Time Setup</h2>
            <p style="color: #6b7280; margin-bottom: 2rem;">Your Firebase is empty. Click below to load event data.</p>
            <button id="seed-btn" style="padding: 1rem 2rem; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                🚀 Load Events to Firebase
            </button>
            <p style="color: #9ca3af; margin-top: 1rem; font-size: 0.875rem;">This will write 10 events to Firestore</p>
        </div>
    `;
    
    document.getElementById('seed-btn').addEventListener('click', async () => {
        const btn = document.getElementById('seed-btn');
        btn.disabled = true;
        btn.textContent = '⏳ Loading...';
        
        try {
            await seedRecommendations(MOCK_GROUP_ID);
            alert('✅ Events loaded to Firebase! Refreshing page...');
            location.reload();
        } catch (error) {
            console.error('Seed error:', error);
            alert('❌ Error: ' + error.message + '. Check console.');
            btn.disabled = false;
            btn.textContent = '🚀 Load Events to Firebase';
        }
    });
}

// Remove the old placeholder comment

/**
 * Render the list of event cards
 * @param {Array} events 
 */
function renderEvents(events) {
    eventsContainer.innerHTML = ''; // Clear loading spinner

    // Show top match
    if (events.length > 0) {
        topMatchSection.style.display = 'block';
        const topEvent = events[0];
        const topCardHTML = createEventCard(topEvent, true);
        topMatchSection.insertAdjacentHTML('beforeend', topCardHTML);
    }

    // Show remaining events
    events.slice(1).forEach(event => {
        const cardHTML = createEventCard(event, false);
        eventsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Add event listeners for star ratings
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', handleStarClick);
        star.addEventListener('mouseenter', handleStarHover);
    });

    document.querySelectorAll('.stars').forEach(container => {
        container.addEventListener('mouseleave', () => {
            const eventId = container.dataset.eventId;
            updateStarDisplay(eventId, userRatings[eventId] || 0);
        });
    });
}

/**
 * Create HTML for a single event card
 * @param {Object} event 
 * @param {boolean} isTopMatch
 * @returns {string} HTML string
 */
function createEventCard(event, isTopMatch = false) {
    const totalVoters = 5; // Mock: assume 5 people in the group
    const currentVotes = eventVotes[event.id] || 0;
    
    return `
        <div class="event-card ${isTopMatch ? 'top-match' : ''}" data-id="${event.id}">
            <div class="card-image-container">
                <img src="${event.imageUrl}" alt="${event.title}" class="card-image" onerror="this.src='https://via.placeholder.com/400x200?text=Event+Image'">
                <div class="match-badge">${event.matchScore}%</div>
            </div>
            
            <div class="card-content">
                <div class="card-header">
                    <span class="event-emoji">${event.emoji || '🎉'}</span>
                    <h3 class="event-title">${event.title}</h3>
                </div>

                <p class="event-description">${event.description}</p>

                <div class="event-details">
                    <div class="detail-item">
                        🕐 ${event.time}
                    </div>
                    <div class="detail-item">
                        📍 ${event.location}
                    </div>
                    <div class="detail-item">
                        💰 ${event.price}
                    </div>
                </div>

                <div class="vote-status" data-event-id="${event.id}">
                    👥 ${currentVotes}/${totalVoters} voted
                </div>

                <div class="rating-section">
                    <div class="rating-label">Rate your excitement:</div>
                    <div class="stars" data-event-id="${event.id}">
                        ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-value="${i}">★</span>`).join('')}
                    </div>
                    <div class="rating-display" data-event-id="${event.id}">
                        ⭐ ${event.rating?.average || 0} (${event.rating?.count || 0} ratings)
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Handle star rating click
 * @param {Event} e 
 */
async function handleStarClick(e) {
    const star = e.currentTarget;
    const rating = parseInt(star.dataset.value);
    const starsContainer = star.parentElement;
    const eventId = starsContainer.dataset.eventId;
    
    // Store rating locally
    userRatings[eventId] = rating;
    
    // Update display immediately
    updateStarDisplay(eventId, rating);
    
    // Persist to Firebase
    try {
        await rateEvent(MOCK_GROUP_ID, eventId, USER_ID, rating);
        
        // Update vote count if first time voting
        if (!eventVotes[eventId + '_userVoted']) {
            const newVoteCount = await voteForEvent(MOCK_GROUP_ID, eventId);
            eventVotes[eventId] = newVoteCount;
            eventVotes[eventId + '_userVoted'] = true;
            
            const voteStatus = document.querySelector(`.vote-status[data-event-id="${eventId}"]`);
            if (voteStatus) {
                voteStatus.textContent = `👥 ${newVoteCount}/5 voted`;
            }
        }
        
        console.log(`⭐ Rating saved to Firebase: ${rating} stars for ${eventId}`);
    } catch (error) {
        console.error('❌ Failed to save to Firebase:', error);
        alert('Error saving rating. Check Firebase config.');
    }
}

/**
 * Handle star hover
 * @param {Event} e 
 */
function handleStarHover(e) {
    const star = e.currentTarget;
    const rating = parseInt(star.dataset.value);
    const starsContainer = star.parentElement;
    const eventId = starsContainer.dataset.eventId;
    
    updateStarDisplay(eventId, rating);
}

/**
 * Update star display for an event
 * @param {string} eventId 
 * @param {number} rating 
 */
function updateStarDisplay(eventId, rating) {
    const starsContainer = document.querySelector(`.stars[data-event-id="${eventId}"]`);
    if (!starsContainer) return;
    
    const stars = starsContainer.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

// Start the app
init();
