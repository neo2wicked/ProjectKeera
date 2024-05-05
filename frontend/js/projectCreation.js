document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectForm');
    const projectSelect = document.getElementById('projectSelect');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const duplicateBtn = document.getElementById('duplicateBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    projectSelect.addEventListener('change', function() {
        if (this.value) {
            loadProjectDetails(this.value);
            formTitle.textContent = 'Edit Project';
            submitBtn.textContent = 'Update Project';
            duplicateBtn.style.display = 'block';
            deleteBtn.style.display = 'block';
        } else {
            formTitle.textContent = 'Create a New Loop';
            submitBtn.textContent = 'Create Project';
            duplicateBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
        }
    });

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

    // Define loadProjectDetails, duplicateProject, deleteProject functions here
    window.addInterviewRound = function() {
        const interviewRoundsContainer = document.getElementById('interviewRounds');
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
    };
});