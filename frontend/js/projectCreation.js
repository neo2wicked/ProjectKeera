document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Stop the form from submitting the old-fashioned way

        // Here's where we align our stars
        const formData = {
            organizationName: document.getElementById('organizationId').value, // Use the correct field for organization name
            name: document.getElementById('projectName').value,
        };

        try {
            // Off into the void
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Something went wrong: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Project created successfully:', result);
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    });
});