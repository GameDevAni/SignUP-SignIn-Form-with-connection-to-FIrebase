const pb = new PocketBase("http://127.0.0.1:8090"); // Change this to your PocketBase URL
const submissionsContainer = document.getElementById("submissions-container");

// Function to display data
function displaySubmissions(records) {
    submissionsContainer.innerHTML = "";
    records.forEach(record => {
        const entry = document.createElement("div");
        entry.classList.add("submission");
        entry.innerHTML = `
            <p><strong>Phone:</strong> ${record.phone}</p>
            <p><strong>Location:</strong> ${record.Location}</p>
            <p><strong>Message:</strong> ${record.message}</p>
            <img src="http://127.0.0.1:8090/api/files/${record.collectionId}/${record.id}/${record.attachment}" width="200" />
            <hr>
        `;
        submissionsContainer.appendChild(entry);
    });
}

// Fetch existing submissions
async function fetchSubmissions() {
    try {
        const result = await pb.collection("help_requests").getFullList();
        displaySubmissions(result);
    } catch (error) {
        console.error("Error fetching submissions:", error);
    }
}

// Listen for real-time updates
pb.collection("help_requests").subscribe("*", function (e) {
    fetchSubmissions();
});

// Initial fetch
fetchSubmissions();
