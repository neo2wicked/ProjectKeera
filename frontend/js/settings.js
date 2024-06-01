document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('settingsForm');
    const emailInput = document.getElementById('email');
    const emailNotificationsCheckbox = document.getElementById('emailNotifications');
    const darkModeCheckbox = document.getElementById('darkMode');
    const signOutButton = document.querySelector('.sign-out-button');
    const deleteAccountButton = document.querySelector('.delete-account-button');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Load the current settings from the backend and update the form
    async function loadSettings() {
        try {
            const response = await fetch('/api/settings', { credentials: 'include' });
            if (!response.ok) {
                throw new Error('Failed to load settings');
            }
            const settings = await response.json();
            if (emailInput) emailInput.value = settings.email;
            if (emailNotificationsCheckbox) emailNotificationsCheckbox.checked = settings.emailNotifications;
            if (darkModeCheckbox) darkModeCheckbox.checked = settings.darkMode;
            // Update other settings as necessary
        } catch (error) {
            console.error('Could not load settings:', error);
        }
    }

    if (form) {
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
                email: emailInput ? emailInput.value : '',
                password: password, // Added password field
                emailNotifications: emailNotificationsCheckbox ? emailNotificationsCheckbox.checked : false,
                darkMode: darkModeCheckbox ? darkModeCheckbox.checked : false,
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
    }

    // Handle tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(tab).classList.add('active');
        });
    });

    // Handle sign out
    if (signOutButton) {
        signOutButton.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/sign-out', { method: 'POST' });
                if (!response.ok) {
                    throw new Error('Failed to sign out');
                }
                window.location.href = '/';
            } catch (error) {
                console.error('Error signing out:', error);
                alert('Failed to sign out');
            }
        });
    }

    // Handle delete account
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', async function() {
            if (confirm('Are you sure you want to delete your account? This action is irreversible.')) {
                try {
                    const response = await fetch('/api/delete-account', { method: 'DELETE' });
                    if (!response.ok) {
                        throw new Error('Failed to delete account');
                    }
                    window.location.href = '/';
                } catch (error) {
                    console.error('Error deleting account:', error);
                    alert('Failed to delete account');
                }
            }
        });
    }
});

