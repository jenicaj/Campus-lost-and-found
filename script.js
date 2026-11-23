
const itemForm = document.getElementById("itemForm");
const itemsGrid = document.getElementById("itemsGrid");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const typeFilter = document.getElementById("typeFilter");

// Load saved data from browser
let items = JSON.parse(localStorage.getItem("campusItems")) || [];

// Sample items for first-time users
if (items.length === 0) {
    items = [
        {
            id: 1,
            name: "Wireless Earbuds",
            category: "Electronics",
            type: "Lost",
            location: "Library",
            date: "2026-11-20",
            description: "Black earbuds in a small case.",
            image: "",
            contact: ""
        },
        {
            id: 2,
            name: "Blue Water Bottle",
            category: "Other",
            type: "Found",
            location: "Cafeteria",
            date: "2026-11-21",
            description: "Blue bottle left on a table.",
            image: "",
            contact: ""
        },
        {
            id: 3,
            name: "Programming Book",
            category: "Books",
            type: "Lost",
            location: "Block 2",
            date: "2026-11-19",
            description: "Java programming textbook.",
            image: "",
            contact: ""
        }
    ];

    saveItems();
}

// Save data
function saveItems() {
    localStorage.setItem("campusItems", JSON.stringify(items));
}

// Display items
function displayItems(data) {
    itemsGrid.innerHTML = "";

    if (data.length === 0) {
        itemsGrid.innerHTML = "<p>No items found.</p>";
        return;
    }

    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";

        const image = item.image || 
            "https://placehold.co/600x400?text=Item+Image";

        card.innerHTML = `
            <img src="${image}" alt="Item image">

            <div class="item-content">
                <span class="status ${item.type}">
                    ${item.type}
                </span>

                <h3>${item.name}</h3>

                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Location:</strong> ${item.location}</p>
                <p><strong>Date:</strong> ${item.date}</p>
                <p>${item.description}</p>

                ${
                    item.contact
                    ? `<p><strong>Contact:</strong> ${item.contact}</p>`
                    : ""
                }

                <button class="delete-btn" data-id="${item.id}">
                    Delete Listing
                </button>
            </div>
        `;

        itemsGrid.appendChild(card);
    });

    updateStats();
}

// Update dashboard statistics
function updateStats() {
    document.getElementById("totalItems").textContent = items.length;

    document.getElementById("lostCount").textContent =
        items.filter(item => item.type === "Lost").length;

    document.getElementById("foundCount").textContent =
        items.filter(item => item.type === "Found").length;
}

// Search and filter
function filterItems() {
    const searchText = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const type = typeFilter.value;

    const filteredItems = items.filter(item => {

        const matchesSearch =
            item.name.toLowerCase().includes(searchText) ||
            item.location.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText);

        const matchesCategory =
            category === "All" || item.category === category;

        const matchesType =
            type === "All" || item.type === type;

        return matchesSearch && matchesCategory && matchesType;
    });

    displayItems(filteredItems);
}

// Add new listing
itemForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newItem = {
        id: Date.now(),
        name: document.getElementById("itemName").value.trim(),
        category: document.getElementById("itemCategory").value,
        type: document.getElementById("itemType").value,
        location: document.getElementById("itemLocation").value.trim(),
        date: document.getElementById("itemDate").value,
        image: document.getElementById("itemImage").value.trim(),
        description: document.getElementById("itemDescription").value.trim(),
        contact: document.getElementById("contactInfo").value.trim()
    };

    items.unshift(newItem);

    saveItems();
    filterItems();

    itemForm.reset();

    alert("Item reported successfully!");
});

// Delete listing
itemsGrid.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        const id = Number(event.target.dataset.id);

        items = items.filter(item => item.id !== id);

        saveItems();
        filterItems();
    }
});

// Search events
searchInput.addEventListener("input", filterItems);
categoryFilter.addEventListener("change", filterItems);
typeFilter.addEventListener("change", filterItems);

// Initial display
filterItems();
 