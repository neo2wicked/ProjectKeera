// Wait for the document to be fully loaded to avoid trying to bind events to elements that don't exist yet.
document.addEventListener('DOMContentLoaded', function() {
    // Grab the login form using its ID.
    const loginForm = document.querySelector('#loginForm');

    // Listen for the submit event on the form.
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Stop the form from submitting the traditional way, because we're fancy and use fetch.

        // Grab the values from our form fields.
        const email = document.querySelector('#email').value; // Updated to email
        const password = document.querySelector('#password').value;

        // Attempt to talk to the server using fetch.
        try {
            const response = await fetch('/login', {
                method: 'POST', // The method, because we're sending data.
                headers: {
                    'Content-Type': 'application/json', // Telling the server we're sending JSON.
                },
                body: JSON.stringify({
                    email: email, // Updated to email
                    password: password,
                }),
            });

            // If the server responds with a redirect, follow it.
            if (response.redirected) {
                window.location.href = response.url; // Off to new lands (or pages).
            } else {
                // If something went wrong, let's tell the user, because communication is key.
                const data = await response.text(); // Assuming the server sends back something useful.
                alert(data); // Display error message from the server. Yes, we're still using alert. No, it's not the best UX.
            }
        } catch (error) {
            // If we catch an error here, it's likely network related or CORS fun.
            console.error('Login failed:', error); // Log it out for the devs.
            alert('Something went wrong. Please try again.'); // And alert the user, because something did indeed go wrong.
        }
    });
});
