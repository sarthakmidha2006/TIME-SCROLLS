document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results-container");
    const popularEventsContainer = document.getElementById("popular-events");
    const tabLinks = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");

    const WIKIPEDIA_API_URL = "https://en.wikipedia.org/w/api.php";
    tabLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetTab = event.target.getAttribute("data-tab");
            tabContents.forEach(tab => {
                tab.classList.remove("active");
                if (tab.id === targetTab) {
                    tab.classList.add("active");
                }
            });
        });
    });

   
    async function fetchWikipediaData(query) {
        const url = `${WIKIPEDIA_API_URL}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.query.search || [];
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

   
    function displayResults(results) {
        resultsContainer.innerHTML = "";
        if (results.length === 0) {
            resultsContainer.innerHTML = "<p>No results found.</p>";
            return;
        }
        results.forEach((result) => {
            const eventCard = document.createElement("div");
            eventCard.className = "event-card";
            eventCard.innerHTML = `
                <h3>${result.title}</h3>
                <p>${result.snippet.replace(/(<([^>]+)>)/gi, '')}...</p>
                <button class="read-more" data-title="${encodeURIComponent(result.title)}">Read more</button>
            `;
            resultsContainer.appendChild(eventCard);
        });
        document.querySelectorAll(".read-more").forEach(button => {
            button.addEventListener("click", (e) => {
                const title = e.target.getAttribute("data-title");
                window.location.href = `article.html?title=${title}`;
            });
        });
    }

   
    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            resultsContainer.innerHTML = '<p>Loading...</p>';
            const results = await fetchWikipediaData(query);
            displayResults(results);
        } else {
            alert("Please enter a search term.");
        }
    });

    
    async function fetchPopularEvents() {
        const query = "Famous historical events";
        const url = `${WIKIPEDIA_API_URL}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayPopularEvents(data.query.search || []);
        } catch (error) {
            console.error("Error fetching popular events:", error);
            popularEventsContainer.innerHTML = "<p class='error'>Failed to load events.</p>";
        }
    }

   function displayPopularEvents(events) {
        popularEventsContainer.innerHTML = "";
        if (events.length === 0) {
            popularEventsContainer.innerHTML = "<p>No popular events found.</p>";
            return;
        }
        events.forEach((event) => {
            const eventCard = document.createElement("div");
            eventCard.className = "event-card";
            eventCard.innerHTML = `
                <h3>${event.title}</h3>
                <p>${event.snippet.replace(/(<([^>]+)>)/gi, '')}...</p>
                <button class="read-more" data-title="${encodeURIComponent(event.title)}">Read more</button>
            `;
            popularEventsContainer.appendChild(eventCard);
        });
        document.querySelectorAll(".read-more").forEach((button) => {
            button.addEventListener("click", () => {
                const title = button.getAttribute("data-title");
                window.location.href = `article.html?title=${encodeURIComponent(title)}`;
            });
        });
    }

   
    fetchPopularEvents();
});
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchContainer = document.querySelector(".search-container");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results-container");

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();

        if (query) {
            resultsContainer.innerHTML = '<p>Loading...</p>';
            const results = await fetchWikipediaData(query);
            displayResults(results);
            searchContainer.classList.add("small"); // Reduce size after search
        } else {
            alert("Please enter a search term.");
        }
    });
});