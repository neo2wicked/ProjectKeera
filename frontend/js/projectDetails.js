document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectDetailsForm');
    const interviewRoundsContainer = document.getElementById('interviewRounds');
    const addInterviewRoundBtn = document.getElementById('addInterviewRoundBtn');

    addInterviewRoundBtn.addEventListener('click', function() {
        const newRound = document.createElement('div');
        newRound.className = 'interview-round';
        newRound.innerHTML = `
            <h3>Interview Round ${document.querySelectorAll('.interview-round').length + 1}</h3>
            <div class="form-group">
                <label for="summary">Summary of Interview Goals:</label>
                <textarea id="summary" name="summary"></textarea>
            </div>
            <div class="form-group">
                <label for="questions">List of Questions:</label>
                <textarea id="questions" name="questions"></textarea>
            </div>
            <div class="form-group">
                <label for="startDate">Start Date:</label>
                <input type="date" id="startDate" name="startDate">
            </div>
            <div class="form-group">
                <label for="endDate">End Date:</label>
                <input type="date" id="endDate" name="endDate">
            </div>
            <div class="form-group">
                <label for="contact">Point of Contact:</label>
                <input type="text" id="contact" name="contact">
            </div>
            <div class="form-group">
                <label for="video">Cover/Overview Video (optional):</label>
                <input type="file" id="video" name="video" accept="video/*">
            </div>
        `;
        interviewRoundsContainer.appendChild(newRound);
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Because we're too cool for traditional form submission

        // Grab that sweet, sweet data
        const formData = new FormData(form);
        const details = formData.get('details'); // Assuming 'details' is the name of your input
        const projectId = formData.get('projectId'); // Make sure you have an input with name 'projectId'

        const data = { details, projectId };

        try {
            // Let's pretend we're doing something useful with it
            const response = await fetch('/api/projectDetails', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' // Needed if you send JSON
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Houston, we have a problem: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Details added successfully:', result);
            // Here's where you'd typically handle what happens next
            // Redirect to a confirmation page, or clear the form, or show a success message
            alert('Project details submitted successfully!');
            window.location.href = '/interview.html'; // Redirect somewhere meaningful
        } catch (error) {
            console.error('Oops, failed to add details:', error);
            alert('Failed to submit project details. Please try again.');
        }
    });
});