document.addEventListener('DOMContentLoaded', function() {
    toggleProjectActions(); // Run on initial load
});

function toggleProjectActions() {
    const projectSelect = document.getElementById('projectSelect');
    const duplicateBtn = document.getElementById('duplicateBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    // Check if the selected value is empty
    if (projectSelect.value) {
        duplicateBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'inline-block';
    } else {
        duplicateBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
    }
}