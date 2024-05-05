document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('settingsForm');

    // Load the current settings from the backend and update the form
    async function loadSettings() {
        try {
            const response = await fetch('/api/settings', { credentials: 'include' });
            if (!response.ok) {
                throw new Error('Failed to load settings');
            }
            const settings = await response.json();
            document.getElementById('email').value = settings.email;
            document.getElementById('emailNotifications').checked = settings.emailNotifications;
            document.getElementById('darkMode').checked = settings.darkMode;
            // Update other settings as necessary
        } catch (error) {
            console.error('Could not load settings:', error);
        }
    }

    loadSettings();

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the form from doing the default page reload

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return; // Stop the form submission
        }

        // Gather the settings from the form
        const formData = {
            email: document.getElementById('email').value,
            password: password, // Added password field
            emailNotifications: document.getElementById('emailNotifications').checked,
            darkMode: document.getElementById('darkMode').checked,
            // Collect other settings as necessary
        };

        try {
            // Send the updated settings to the backend
            const response = await fetch('/api/settings', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save settings');
            }

            // Maybe show a success message or something
            console.log('Settings updated successfully');
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Failed to update settings:', error);
            alert('Failed to update settings: ' + error.message);
        }
    });
});