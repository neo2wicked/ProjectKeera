document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Stop the form from submitting the old-fashioned way

        // Gather your form data like it's harvest season
        const formData = {
            organizationName: document.getElementById('organizationName').value,
            projectName: document.getElementById('projectName').value,
            // Add more fields as necessary. It's like picking apples; you want the good ones.
        };

        try {
            // Send your data off into the great unknown
            const response = await fetch('/api/projects', { // Assuming you have an endpoint set up here
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers your API requires. Dress for the occasion.
                },
                body: JSON.stringify(formData), // Convert your form data into JSON, because we're fancy like that
            });

            if (!response.ok) {
                // If something goes wrong, throw a tantrum... or an error
                throw new Error(`Something went wrong: ${response.statusText}`);
            }

            const result = await response.json(); // Assuming your backend is polite and responds
            console.log('Project created successfully:', result);
            // Here, you might want to redirect the user or display a success message
            // It's like getting a gold star in kindergarten; everyone needs a little validation
        } catch (error) {
            console.error('Failed to create project:', error);
            // Display an error message or handle the failure gracefully
            // It's like falling off your bike; just get back up and pretend everything is fine
        }
    });
});