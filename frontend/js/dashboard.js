document.addEventListener('DOMContentLoaded', async function() {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');

    if (!userNameElement || !userEmailElement) {
        console.error('User elements not found. Check your HTML, genius.');
        return;
    }

    try {
        const response = await fetch('/dashboard', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user info. Status: ${response.status}`);
        }

        const { firstName, email } = await response.json(); // Ensure backend sends 'email'

        if (firstName) {
            userNameElement.textContent = firstName;
        } else {
            console.error('First name not provided in response. Is your backend asleep?');
            userNameElement.textContent = 'User'; // Fallback to default name if firstName is missing
        }

        if (email) {
            userEmailElement.textContent = email;
        } else {
            console.error('Email not provided in response. Maybe check your backend again?');
            userEmailElement.textContent = 'No email on file.'; // Informative fallback if email is missing
        }
    } catch (error) {
        console.error(`Something went wrong: ${error}`);
        userNameElement.textContent = 'User'; // Fallback to default name on error
        userEmailElement.textContent = 'No email on file.'; // Fallback if error occurs
    }
});
