document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectDetailsForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Because we're too cool for traditional form submission

        // Grab that sweet, sweet data
        const formData = new FormData(form);

        try {
            // Let's pretend we're doing something useful with it
            const response = await fetch('/api/projectDetails', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    // No 'Content-Type' needed, FormData is smart
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Houston, we have a problem: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Details added successfully:', result);
            // Here's where you'd typically handle what happens next
            // Redirect to a confirmation page, or clear the form, or show a success message
            alert('Project details submitted successfully!');
            window.location.href = '/someConfirmationPage.html'; // Redirect somewhere meaningful
        } catch (error) {
            console.error('Oops, failed to add details:', error);
            alert('Failed to submit project details. Please try again.');
        }
    });
});