import { getRecommendations } from '../firebase/services.js';

// DOM Elements
const eventsContainer = document.getElementById('events-container');
const topMatchSection = document.getElementById('top-match-section');

// Mock Group ID for this prototype
const MOCK_GROUP_ID = 'demo-group-123';

// Track user ratings in memory (in real app, would be in Firebase)
const userRatings = {};
const eventVotes = {};

/**
 * Initialize the page
 */
async function init() {
    try {
        // Fetch recommendations
        const events = await getRecommendations(MOCK_GROUP_ID);
        
        // Initialize vote tracking
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
function handleStarClick(e) {
    const star = e.currentTarget;
    const rating = parseInt(star.dataset.value);
    const starsContainer = star.parentElement;
    const eventId = starsContainer.dataset.eventId;
    
    // Store rating
    userRatings[eventId] = rating;
    
    // Update display
    updateStarDisplay(eventId, rating);
    
    // Simulate updating vote count (user has now "voted" by rating)
    if (!eventVotes[eventId + '_userVoted']) {
        eventVotes[eventId] = (eventVotes[eventId] || 0) + 1;
        eventVotes[eventId + '_userVoted'] = true;
        
        // Update vote status
        const voteStatus = document.querySelector(`.vote-status[data-event-id="${eventId}"]`);
        if (voteStatus) {
            voteStatus.textContent = `👥 ${eventVotes[eventId]}/5 voted`;
        }
    }
    
    // In a real app, persist to Firebase:
    // await updateDoc(doc(db, 'eventRatings', eventId), {
    //     [`ratings.${userId}`]: rating,
    //     totalRatings: increment(1)
    // });
    
    console.log(`⭐ User rated event ${eventId}: ${rating} stars`);
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
