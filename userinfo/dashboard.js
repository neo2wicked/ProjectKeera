document.addEventListener('DOMContentLoaded', function() {
    // This function could be expanded to fetch user-specific data
    // For example, fetching the user's name to display on the dashboard
    // For now, it's a placeholder to show where such functionality could be implemented

    // Placeholder for user's name. In a real application, this would come from the server
    const userName = 'User'; // This should be dynamically set based on logged-in user data

    // Update the dashboard greeting with the user's name
    const greetingElement = document.querySelector('.dashboard-content h2');
    if (greetingElement) {
        greetingElement.textContent = `Welcome, ${userName}`;
    }

    // Here you could also add event listeners or additional functionality
    // For managing change requests, settings, or logging out
    // For example:
    // document.getElementById('logoutButton').addEventListener('click', function() {
    //     // Handle logout
    // });
});
