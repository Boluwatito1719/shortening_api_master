const historyContainer = document.getElementById("historyContainer");
const email = localStorage.getItem("userEmail");

// Helper function to render history items
function renderHistory() {
    // Clear out container first
    historyContainer.innerHTML = "";

    if (!email) {
        historyContainer.innerHTML = `
            <div class="bg-white p-6 rounded-xl text-center">
                <p class="text-gray-500">Please login to view your history.</p>
            </div>
        `;
        return;
    }

    // Get this user's history
    const history = JSON.parse(localStorage.getItem(`history_${email}`)) || [];

    if (history.length === 0) {
        historyContainer.innerHTML = `
            <div class="bg-white p-6 rounded-xl text-center">
                <p class="text-gray-500">You haven't shortened any links yet.</p>
            </div>
        `;
        return;
    }

    // 1. Create and Add the "Delete All" button wrapper at the very top
    const topBar = document.createElement("div");
    topBar.className = "flex justify-end mb-4 w-full max-w-4xl mx-auto";
    topBar.innerHTML = `
        <button id="deleteAllBtn" class="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors border border-red-200 shadow-sm text-sm">
            <span class="material-symbols-outlined text-lg">delete_sweep</span>
            Delete All History
        </button>
    `;
    historyContainer.appendChild(topBar);

    // Attach click handler to the Delete All Button
    document.getElementById("deleteAllBtn").addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your entire link history?")) {
            localStorage.removeItem(`history_${email}`);
            renderHistory(); // Refresh view
        }
    });

    // 2. Loop through history (Show newest links first)
    const reversedHistory = [...history].reverse();

    reversedHistory.forEach((item, reversedIndex) => {
        // Calculate original index positions accurately
        const originalIndex = history.length - 1 - reversedIndex;

        const div = document.createElement("div");
        div.className = "bg-white p-5 rounded-xl shadow-sm mt-3 relative w-full max-w-4xl mx-auto";

        div.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pr-10">
                <div class="flex-1">
                    <p class="text-sm text-gray-500">Original URL</p>
                    <p class="font-medium break-all">${item.originalUrl}</p>
                </div>

                <div class="flex-1">
                    <p class="text-sm text-gray-500">Short URL</p>
                    <a href="${item.shortUrl}" target="_blank" class="text-cyan-600 font-semibold break-all">
                        ${item.shortUrl}
                    </a>
                </div>

                <div>
                    <p class="text-xs text-gray-400">${item.date}</p>
                </div>
            </div>

            <!-- Single Item Delete Button -->
            <button class="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors delete-btn" data-index="${originalIndex}">
                <span class="material-symbols-outlined text-xl">delete</span>
            </button>
        `;

        historyContainer.appendChild(div);
    });

    // Add event listeners to all single delete buttons
    const deleteButtons = historyContainer.querySelectorAll(".delete-btn");
    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const indexToDelete = parseInt(btn.getAttribute("data-index"));
            deleteHistoryItem(indexToDelete);
        });
    });
}

// Function to handle single item deletion
function deleteHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem(`history_${email}`)) || [];
    history.splice(index, 1);
    localStorage.setItem(`history_${email}`, JSON.stringify(history));
    renderHistory();
}

// Initial execution load
renderHistory();
