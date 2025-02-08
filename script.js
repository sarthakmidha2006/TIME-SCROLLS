document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results-container");
    const popularEventsContainer = document.getElementById("popular-events");
    const searchContainer = document.querySelector(".search-container");
    const tabLinks = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");

    const WIKIPEDIA_API_URL = "https://en.wikipedia.org/w/api.php";

    // Tab Switching Logic
    tabLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetTab = event.target.getAttribute("data-tab");
            tabContents.forEach(tab => {
                tab.classList.toggle("active", tab.id === targetTab);
            });
        });
    });

    // Fetch Wikipedia Data
    async function fetchWikipediaData(query) {
        const url = `${WIKIPEDIA_API_URL}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.query?.search || [];
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    // Display Search Results
    function displayResults(results) {
        resultsContainer.innerHTML = results.length === 0 
            ? "<p>No results found.</p>" 
            : results.map(result => `
                <div class="event-card">
                    <h3>${result.title}</h3>
                    <p>${result.snippet.replace(/(<([^>]+)>)/gi, '')}...</p>
                    <button class="read-more" data-title="${encodeURIComponent(result.title)}">Read more</button>
                </div>
            `).join("");

        addReadMoreEventListeners();
    }

    // Search Form Submission
    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            resultsContainer.innerHTML = '<p>Loading...</p>';
            const results = await fetchWikipediaData(query);
            displayResults(results);
            searchContainer.classList.add("small");
        } else {
            alert("Please enter a search term.");
        }
    });

    // Fetch Popular Events
    async function fetchPopularEvents() {
        const query = "Famous historical events";
        const results = await fetchWikipediaData(query);
        displayPopularEvents(results);
    }

    // Display Popular Events
    function displayPopularEvents(events) {
        popularEventsContainer.innerHTML = events.length === 0 
            ? "<p>No popular events found.</p>" 
            : events.map(event => `
                <div class="event-card">
                    <h3>${event.title}</h3>
                    <p>${event.snippet.replace(/(<([^>]+)>)/gi, '')}...</p>
                    <button class="read-more" data-title="${encodeURIComponent(event.title)}">Read more</button>
                </div>
            `).join("");

        addReadMoreEventListeners();
    }

    // Add "Read More" Button Event Listeners
    function addReadMoreEventListeners() {
        document.querySelectorAll(".read-more").forEach(button => {
            button.addEventListener("click", (e) => {
                const title = e.target.getAttribute("data-title");
                window.location.href = `article.html?title=${title}`;
            });
        });
    }

    // Initial Load
    fetchPopularEvents();
});
