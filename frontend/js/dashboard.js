document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetching user info with credentials. Good, you remembered the cookies.
        const response = await fetch('/userinfo', {
            credentials: 'include'
        });

        if (!response.ok) {
            // Instead of just throwing an error, let's give a bit more context.
            throw new Error(`Failed to fetch user info. Status: ${response.status}`);
        }

        const { userName } = await response.json();

        // Let's be optimistic and assume we'll always find the element.
        const greetingElement = document.querySelector('.dashboard-content h2');
        if (!greetingElement) {
            // If there's no greeting element, that's on you. Check your HTML.
            console.error('Could not find the greeting element. Is your HTML correct?');
            return; // Exit early because we can't update what doesn't exist.
        }

        // If all is well, update the greeting.
        greetingElement.textContent = `Welcome, ${userName}`;
    } catch (error) {
        // Logging to the console is fine for developers, but consider showing the user something useful.
        console.error(`Something went wrong: ${error}`);
    }
});
