// =====================
// USER AUTH & SIDEBAR
// =====================

// Handles login form submission and alerts if username/password is missing
document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function (event) {
            let enteredUsername = document.getElementById("floatingInput");
            let enteredPassword = document.getElementById("floatingPassword");
            if (!enteredUsername.value || !enteredPassword.value) {
                alert("Please enter username and password to continue.");
                event.preventDefault(); // Prevent navigation
                return;
            }
            window.location.href = 'weekndintro.html';
        });
    }
});

// Handles sidebar expand/collapse toggle
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    if (sidebar && toggleBtn) {
        // Ensure only one sidebar state class is present on load
        sidebar.classList.remove('sidebar-collapsed');
        sidebar.classList.add('sidebar-expanded');
        toggleBtn.addEventListener('click', function () {
            if (sidebar.classList.contains('sidebar-collapsed')) {
                sidebar.classList.remove('sidebar-collapsed');
                sidebar.classList.add('sidebar-expanded');
            } else {
                sidebar.classList.remove('sidebar-expanded');
                sidebar.classList.add('sidebar-collapsed');
            }
        });
    }
});

// Highlights the current page in the sidebar
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('#sidebar .nav-link');
    const currentPage = window.location.pathname.split('/').pop();

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http')) {
            if (href === currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        }
    });
});

// Function for displaying a random image upon loading the page:

// 1) randomize the selection of images
// 2) upon logging in, save a randomized pic into local storage - make sure the pic is the same on all pages
// 3) get the pic from local storage & insert into profile area
// 4) when relogging, set a new profile pic




const profileOption = [
    "https://i.pinimg.com/736x/22/2f/19/222f190d4a0aa3f1e5ab3b5536dc7207.jpg",
    "https://i.pinimg.com/1200x/0b/90/90/0b9090022b709d2f3167ecdc13ad05b1.jpg",
    "https://i.pinimg.com/736x/9e/12/8c/9e128c54e403cee5e439b458ff222170.jpg",
    "https://i.pinimg.com/736x/fe/2a/bf/fe2abff0e834bc78ebe6b4f805477087.jpg",
    "https://i.pinimg.com/736x/19/69/e5/1969e57e63e4c7546852446cb8b9a497.jpg",
]

function getRandomProfilePic() {
    return profileOption [Math.floor(Math.random() * profileOption.length)];
}


// Saves the username to local storage
function saveUsername() {
    let username = document.getElementById("floatingInput").value;
    localStorage.setItem('username', username);

    // Set and save a new random profile pic on login
    const pic = getRandomProfilePic();
    localStorage.setItem('profilePic', pic);

    const profilePic = document.getElementById('profile-icon');
    if (profilePic) {
        profilePic.src = pic;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const profilePic = document.getElementById('profile-icon');
    if (profilePic) {
        const savedPic = localStorage.getItem('profilePic');
        if (savedPic) {
            profilePic.src = savedPic;
        }
    }
});

// Displays a console message on weekndintro.html if username is saved
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.endsWith('weekndintro.html')) {
        let savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            console.log("Username saved successfully!");
        } else {
            console.log("No username found in local storage.");
        }
    }
});

// Displays the saved username in the sidebar
document.addEventListener('DOMContentLoaded', function displayUsername() {
    let savedUsername = localStorage.getItem('username');
    let usernameSB = document.getElementById("username-sb");
    if (savedUsername && usernameSB) {
        usernameSB.innerHTML = savedUsername;
    }
});

// =====================
// CONCERT SEARCH & COUNTDOWN
// =====================

// Your Ticketmaster API key
const TICKETMASTER_API_KEY = 'GA2FqVRSAqwgz8SI2bZHt81KCGiIKzk9';

// US state mapping: full names and abbreviations
const US_STATES = {
    "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR", "california": "CA",
    "colorado": "CO", "connecticut": "CT", "delaware": "DE", "florida": "FL", "georgia": "GA",
    "hawaii": "HI", "idaho": "ID", "illinois": "IL", "indiana": "IN", "iowa": "IA",
    "kansas": "KS", "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
    "massachusetts": "MA", "michigan": "MI", "minnesota": "MN", "mississippi": "MS", "missouri": "MO",
    "montana": "MT", "nebraska": "NE", "nevada": "NV", "new hampshire": "NH", "new jersey": "NJ",
    "new mexico": "NM", "new york": "NY", "north carolina": "NC", "north dakota": "ND", "ohio": "OH",
    "oklahoma": "OK", "oregon": "OR", "pennsylvania": "PA", "rhode island": "RI", "south carolina": "SC",
    "south dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT", "vermont": "VT",
    "virginia": "VA", "washington": "WA", "west virginia": "WV", "wisconsin": "WI", "wyoming": "WY",
    // Abbreviations as keys too
    "al": "AL", "ak": "AK", "az": "AZ", "ar": "AR", "ca": "CA", "co": "CO", "ct": "CT", "de": "DE",
    "fl": "FL", "ga": "GA", "hi": "HI", "id": "ID", "il": "IL", "in": "IN", "ia": "IA", "ks": "KS",
    "ky": "KY", "la": "LA", "me": "ME", "md": "MD", "ma": "MA", "mi": "MI", "mn": "MN", "ms": "MS",
    "mo": "MO", "mt": "MT", "ne": "NE", "nv": "NV", "nh": "NH", "nj": "NJ", "nm": "NM", "ny": "NY",
    "nc": "NC", "nd": "ND", "oh": "OH", "ok": "OK", "or": "OR", "pa": "PA", "ri": "RI", "sc": "SC",
    "sd": "SD", "tn": "TN", "tx": "TX", "ut": "UT", "vt": "VT", "va": "VA", "wa": "WA", "wv": "WV",
    "wi": "WI", "wy": "WY"
};

// List of all valid locations for typo suggestions
const ALL_LOCATIONS = [
    ...Object.keys(US_STATES),
    // Add major US cities for better suggestions
    "new york", "los angeles", "chicago", "houston", "phoenix", "philadelphia", "san antonio", "san diego", "dallas", "san jose"
];

// Calculates the Levenshtein distance between two strings (for typo correction)
function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

// Suggests the closest valid location if the user input is a typo
function suggestLocation(input) {
    input = input.toLowerCase();
    let minDist = Infinity, suggestion = null;
    for (const loc of ALL_LOCATIONS) {
        const dist = levenshtein(input, loc);
        if (dist < minDist) {
            minDist = dist;
            suggestion = loc;
        }
    }
    // Only suggest if typo is small
    return minDist <= 2 ? suggestion : null;
}

// Fills the search input with the suggestion and triggers a new search
function useSuggestion(suggestion) {
    document.getElementById('concert-search-input').value = suggestion;
    searchConcerts();
}

// Checks if the input is a valid US state (full or abbreviation) or a major city
function isValidLocation(input) {
    return US_STATES.hasOwnProperty(input) || ALL_LOCATIONS.includes(input);
}

// Formats a date string as "Sep 17, 2025"
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Main function: searches for concerts using the Ticketmaster API and displays results
async function searchConcerts() {
    const inputRaw = document.getElementById('concert-search-input').value.trim();
    const input = inputRaw.toLowerCase();
    const resultsDiv = document.getElementById('concert-results');
    resultsDiv.innerHTML = '';

    if (!input) {
        resultsDiv.innerHTML = '<div class="alert alert-warning">Please enter a city or area.</div>';
        return;
    }

    // Build the API URL based on whether the input is a state or city
    const stateCode = US_STATES[input];
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&keyword=The%20Weeknd&classificationName=music`;

    if (stateCode) {
        url += `&stateCode=${stateCode}`;
    } else {
        url += `&city=${encodeURIComponent(inputRaw)}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        // If no concerts found, show appropriate message or suggestion
        if (!data._embedded || !data._embedded.events || data._embedded.events.length === 0) {
            if (isValidLocation(input)) {
                // Input is a valid location, but no concerts found
                resultsDiv.innerHTML = '<div class="alert alert-danger">No concerts are found.</div>';
            } else {
                // Input is not a valid location, suggest correction if possible
                const suggestion = suggestLocation(input);
                if (suggestion) {
                    resultsDiv.innerHTML = `
                        <div class="alert alert-warning">
                            No concerts found. Did you mean 
                            <a href="#" onclick="useSuggestion('${suggestion.replace(/'/g, "\\'")}'); return false;"><b>${suggestion}</b></a>?
                        </div>`;
                } else {
                    resultsDiv.innerHTML = '<div class="alert alert-danger">No concerts are found.</div>';
                }
            }
            return;
        }

        // Render concert cards for each event
        resultsDiv.innerHTML = data._embedded.events.map(event => {
            const eventId = event.id;
            return `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${event.name}</h5>
                        <p class="card-text">
                            Venue: ${event._embedded.venues[0].name}<br>
                            City: ${event._embedded.venues[0].city.name}<br>
                            Date: ${formatDate(event.dates.start.localDate)}<br>
                            ${event.priceRanges && event.priceRanges[0].min ? `Prices start at $${event.priceRanges[0].min}<br>` : ''}
                            <span id="countdown-${eventId}"></span><br>
                            <a href="${event.url}" target="_blank" class="btn btn-success btn-sm mt-2">Buy Tickets</a>
                        </p>
                    </div>
                </div>
            `;
        }).join('');

        // Start countdown timers for each event
        data._embedded.events.forEach(event => {
            // Use localDate and, if available, localTime for more accuracy
            let dateTime = event.dates.start.localDate;
            if (event.dates.start.localTime) {
                dateTime += 'T' + event.dates.start.localTime;
            }
            startCountdown(event.id, dateTime);
        });
    } catch (error) {
        resultsDiv.innerHTML = '<div class="alert alert-danger">Error fetching concert data. Please try again later.</div>';
        console.error(error);
    }
}

// Starts and updates a live countdown timer for a concert event
function startCountdown(eventId, eventDate) {
    const countdownElem = document.getElementById(`countdown-${eventId}`);
    if (!countdownElem) return;

    function updateCountdown() {
        const now = new Date();
        const target = new Date(eventDate);
        const diff = target - now;

        if (diff <= 0) {
            countdownElem.textContent = "Concert is happening now!";
            clearInterval(timer);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        countdownElem.textContent = `Countdown: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
}

// =====================
// NEWS SLIDER
// =====================

// Try multiple news APIs that work better with GitHub Pages
const NEWS_API_KEY = '6092404c1e3a41e681e9592538da5cdc';
const NEWS_APIS = [
    // Billboard RSS feed (no API key needed, works with GitHub Pages)
    'https://api.rss2json.com/v1/api.json?rss_url=https://www.billboard.com/feed/rss/news',
    // NewsAPI with CORS proxy
    `https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?q=The%20Weeknd&sortBy=publishedAt&language=en&pageSize=30&apiKey=${NEWS_API_KEY}`,
    // Alternative: GNews API (more GitHub Pages friendly)
    `https://gnews.io/api/v4/search?q=The%20Weeknd&lang=en&country=us&max=30&apikey=YOUR_GNEWS_API_KEY`
];

function isDirectlyAboutWeeknd(article) {
    const keyword = /the weeknd|abel tesfaye/i;
    // Check if "The Weeknd" or "Abel Tesfaye" is in the title or description
    return keyword.test(article.title) || (article.description && keyword.test(article.description.slice(0, 300)));
}

async function fetchNews() {
    for (let i = 0; i < NEWS_APIS.length; i++) {
        try {
            console.log(`Trying API ${i + 1}...`);
            const response = await fetch(NEWS_APIS[i]);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Handle different API response formats
            let articles = [];
            if (data.articles) {
                // NewsAPI format
                articles = data.articles;
            } else if (data.items) {
                // RSS2JSON format
                articles = data.items.map(item => ({
                    title: item.title,
                    description: item.description,
                    url: item.link,
                    urlToImage: item.thumbnail || getRandomWeekndImage(),
                    source: { name: 'Billboard' },
                    publishedAt: item.pubDate
                }));
            } else if (data.articles && Array.isArray(data.articles)) {
                // GNews format
                articles = data.articles;
            }
            
            if (articles && articles.length > 0) {
                displayNews(articles);
                return; // Success, exit the function
            } else {
                throw new Error('No articles found');
            }
        } catch (error) {
            console.error(`API ${i + 1} failed:`, error);
            if (i === NEWS_APIS.length - 1) {
                // All APIs failed, show error
                const slider = document.getElementById('news-slider');
                if (slider) {
                    slider.innerHTML = `
                        <div class="swiper-slide">
                            <div class="card h-100 weeknd-news-card">
                                <div class="card-body text-center">
                                    <h5 class="card-title text-danger">News Loading Error</h5>
                                    <p class="card-text">Unable to load real-time news at this time. This might be due to:</p>
                                    <ul class="text-start">
                                        <li>CORS restrictions on GitHub Pages</li>
                                        <li>API key issues or rate limiting</li>
                                        <li>Network connectivity problems</li>
                                        <li>Service temporarily unavailable</li>
                                    </ul>
                                    <button class="btn btn-primary" onclick="fetchNews()">Try Again</button>
                                </div>
                            </div>
                        </div>
                    `;
                }
                console.error('All APIs failed:', error);
            }
        }
    }
}

const WEEKND_IMAGES = [
    "https://wallpaperaccess.com/full/840998.jpg",
    "https://wallpaperaccess.com/full/809771.jpg",
    "https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/73e17b7108350cce8423aeb2dc12ff98.png",
    "https://wallpapers.com/images/featured/the-weeknd-after-hours-3cedl88oh962sybq.jpg",
    "https://4kwallpapers.com/images/wallpapers/the-weeknd-canadian-1920x1080-9582.jpg"
    // Add more URLs as you like
];



function getRandomWeekndImage() {
    return WEEKND_IMAGES[Math.floor(Math.random() * WEEKND_IMAGES.length)];
}

function displayNews(articles) {
    const slider = document.getElementById('news-slider');
    if (!slider) return; // Prevent error if element is missing
    // Filter and limit to 10
    const filtered = articles.filter(isDirectlyAboutWeeknd).slice(0, 10);
    if (filtered.length === 0) {
        slider.innerHTML = '<div class="text-danger">No direct news about The Weeknd found.</div>';
        return;
    }
    slider.innerHTML = filtered.map(article => `
        <div class="swiper-slide">
            <div class="card h-100 weeknd-news-card">
                <img src="${article.urlToImage || getRandomWeekndImage()}" class="card-img-top" alt="News Image">
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="${article.url}" target="_blank" rel="noopener" style="text-decoration:none;">${article.title}</a>
                    </h5>
                    <p class="card-source mb-1"><strong>${article.source && article.source.name ? article.source.name : ''}</strong></p>
                    <p class="card-text"><small class="text-muted">${new Date(article.publishedAt).toLocaleDateString()}</small></p>
                    <p class="card-text">${article.description || ''}</p>
                </div>
            </div>
        </div>
    `).join('');
    // Swiper initialization (see below for arrow changes)
    new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        autoHeight: false, // keep all slides same height
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
    setInterval(fetchNews, 5 * 60 * 1000); // refresh every 5 minutes
});

// =====================
// COMMENT SECTION FUNCTIONALITY
// =====================

// Initialize comment functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCommentSection();
});

// Initialize the comment section
function initializeCommentSection() {
    console.log('Initializing comment section...');
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        console.log('Comment form found, adding event listener');
        commentForm.addEventListener('submit', handleCommentSubmit);
        loadComments(); // Load existing comments
        console.log('Comment section initialized successfully');
    } else {
        console.log('Comment form not found - comment section not available on this page');
    }
}

// Handle comment form submission
function handleCommentSubmit(event) {
    event.preventDefault();
    console.log('Comment form submitted');
    
    // Get form data
    const name = document.getElementById('commenter-name').value.trim();
    const venue = document.getElementById('concert-venue').value.trim();
    const date = document.getElementById('concert-date').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const comment = document.getElementById('comment-text').value.trim();
    
    console.log('Form data collected:', { name, venue, date, rating, comment });
    
    // Validate form
    if (!name || !venue || !date || !rating || !comment) {
        console.log('Form validation failed - missing fields');
        alert('Please fill in all fields including the rating.');
        return;
    }
    
    // Create comment object
    const newComment = {
        id: Date.now(), // Use timestamp as unique ID
        name: name,
        venue: venue,
        date: date,
        rating: parseInt(rating),
        comment: comment,
        timestamp: new Date().toISOString()
    };
    
    console.log('New comment object created:', newComment);
    
    // Save to localStorage
    saveComment(newComment);
    
    // Reset form
    event.target.reset();
    
    // Reload comments to show the new one
    loadComments();
    
    // Show success message
    showSuccessMessage('Thank you for sharing your experience!');
}

// Save comment to localStorage
function saveComment(comment) {
    console.log('Saving comment to localStorage...');
    let comments = JSON.parse(localStorage.getItem('weekndComments') || '[]');
    console.log('Existing comments loaded:', comments.length);
    
    comments.unshift(comment); // Add to beginning of array
    console.log('Comment added to array. Total comments now:', comments.length);
    
    // Keep only the last 50 comments to prevent localStorage from getting too large
    if (comments.length > 50) {
        comments = comments.slice(0, 50);
        console.log('Comments trimmed to 50. New total:', comments.length);
    }
    
    localStorage.setItem('weekndComments', JSON.stringify(comments));
    console.log('Comments saved to localStorage successfully');
    console.log('Current localStorage data:', localStorage.getItem('weekndComments'));
}

// Load and display comments
function loadComments() {
    console.log('Loading comments from localStorage...');
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) {
        console.log('Comments list element not found');
        return;
    }
    
    const comments = JSON.parse(localStorage.getItem('weekndComments') || '[]');
    console.log('Comments loaded from localStorage:', comments.length, 'comments found');
    
    if (comments.length === 0) {
        console.log('No comments found, showing empty state');
        commentsList.innerHTML = `
            <div class="no-comments">
                <i class="fas fa-comments"></i>
                <h5>No experiences shared yet</h5>
                <p>Be the first to share your amazing The Weeknd concert experience!</p>
            </div>
        `;
        return;
    }
    
    console.log('Rendering', comments.length, 'comments');
    commentsList.innerHTML = comments.map(comment => createCommentHTML(comment)).join('');
    console.log('Comments rendered successfully');
}

// Create HTML for a single comment
function createCommentHTML(comment) {
    const stars = '★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating);
    const formattedDate = new Date(comment.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const initials = comment.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return `
        <div class="comment-card">
            <div class="comment-header">
                <div class="commenter-info">
                    <div class="commenter-avatar">${initials}</div>
                    <div class="commenter-details">
                        <h5>${escapeHtml(comment.name)}</h5>
                        <small>${formattedDate}</small>
                    </div>
                </div>
                <div class="comment-rating">
                    <span class="stars">${stars}</span>
                    <span>(${comment.rating}/5)</span>
                </div>
            </div>
            <div class="comment-content">
                ${escapeHtml(comment.comment)}
            </div>
            <div class="comment-venue">
                <i class="fas fa-map-marker-alt me-1"></i>
                ${escapeHtml(comment.venue)}
            </div>
            <div class="comment-date">
                <i class="fas fa-calendar me-1"></i>
                Concert Date: ${new Date(comment.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </div>
        </div>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show success message
function showSuccessMessage(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    successDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

// Clear all comments (for testing purposes)
function clearAllComments() {
    if (confirm('Are you sure you want to delete all comments? This action cannot be undone.')) {
        localStorage.removeItem('weekndComments');
        loadComments();
        showSuccessMessage('All comments have been cleared.');
    }
}