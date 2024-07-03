document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('searchBar');

    searchBar.addEventListener('input', function() {
        const searchText = searchBar.value.trim();

        if (searchText.length > 2) { // Only search if user has typed more than 2 characters
            fetch(`/api/search-loops?query=${encodeURIComponent(searchText)}`, {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Search results:', data); // Update the DOM with the search results
            })
            .catch(error => {
                console.error('Failed to fetch search results:', error);
            });
        }
    });
});