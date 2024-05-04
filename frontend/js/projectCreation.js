document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Stop the form from submitting the old-fashioned way

        // Here's where we align our stars
        const formData = new FormData(form); // Using FormData to handle text and files
        // formData.delete('projectDetails'); // Remove project details as it will be handled on the next page

        // Log FormData contents before sending
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        try {
            // Off into the void
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    // 'Content-Type': 'application/json' is not needed because FormData sets it automatically
                },
                body: formData,
            });

            if (!response.ok) {
                const errorDetail = await response.text();  // or response.json() if the server sends JSON
                console.error('Failed to create project:', errorDetail);
                throw new Error(`Something went wrong: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Project created successfully:', result);
            // Redirect to the project details page with some identifier if needed
            window.location.href = '/projectDetails.html?projectId=' + result.projectId;
            // Redirect or update UI here
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    });
});