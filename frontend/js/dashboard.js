document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/dashboard', { // Make sure this endpoint is correct
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user info. Status: ${response.status}`);
        }

        const { firstName } = await response.json(); // Assuming the backend sends { firstName }

        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = firstName || 'User'; // Update the text content
        } else {
            console.error('User name element not found');
        }
    } catch (error) {
        console.error(`Something went wrong: ${error}`);
    }
});
