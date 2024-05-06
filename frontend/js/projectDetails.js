document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectDetailsForm');
    const interviewRoundsContainer = document.getElementById('interviewRounds');
    const addInterviewRoundBtn = document.getElementById('addInterviewRoundBtn');

    addInterviewRoundBtn.addEventListener('click', function() {
        const roundNumber = document.querySelectorAll('.interview-round').length + 1;
        const newRound = document.createElement('div');
        newRound.className = 'interview-round';
        newRound.innerHTML = `
            <h3>Interview Round ${roundNumber}</h3>
            <div class="form-group">
                <label for="summary${roundNumber}">Summary of Interview Goals:</label>
                <textarea id="summary${roundNumber}" name="summary${roundNumber}"></textarea>
            </div>
            <div class="form-group">
                <label for="questions${roundNumber}">List of Questions:</label>
                <textarea id="questions${roundNumber}" name="questions${roundNumber}"></textarea>
            </div>
            <div class="form-group">
                <label for="startDate${roundNumber}">Start Date:</label>
                <input type="date" id="startDate${roundNumber}" name="startDate${roundNumber}">
            </div>
            <div class="form-group">
                <label for="endDate${roundNumber}">End Date:</label>
                <input type="date" id="endDate${roundNumber}" name="endDate${roundNumber}">
            </div>
            <div class="form-group">
                <label for="contact${roundNumber}">Point of Contact:</label>
                <input type="text" id="contact${roundNumber}" name="contact${roundNumber}">
            </div>
            <div class="form-group">
                <label for="video${roundNumber}">Cover/Overview Video (optional):</label>
                <input type="file" id="video${roundNumber}" name="video${roundNumber}" accept="video/*">
            </div>
        `;
        interviewRoundsContainer.appendChild(newRound);
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        // Here you would typically also handle the generation of links and QR codes for each interview round
        // For now, let's just log the formData to see what we've got
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            const response = await fetch('/api/projectDetails', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            if (!response.ok) {
                throw new Error(`Houston, we have a problem: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Details added successfully:', result);
            alert('Project details submitted successfully!');
            window.location.href = '/interview.html'; // Redirect somewhere meaningful
        } catch (error) {
            console.error('Oops, failed to add details:', error);
            alert('Failed to submit project details. Please try again.');
        }
    });
});