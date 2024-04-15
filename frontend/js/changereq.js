document.getElementById('changeRequestForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Let's not refresh the page, shall we?

    const title = document.getElementById('requestTitle').value;
    const description = document.getElementById('requestDescription').value;

    if (!title || !description) {
        alert('Both title and description are required, genius.'); // Basic validation, because users.
        return;
    }

    const listItem = document.createElement('li');
    listItem.textContent = `${title}: ${description}`;
    document.getElementById('requestsList').appendChild(listItem);

    // Clear the form fields, because we're not animals.
    document.getElementById('requestTitle').value = '';
    document.getElementById('requestDescription').value = '';
});