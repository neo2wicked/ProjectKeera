window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const questions = JSON.parse(decodeURIComponent(params.get('session')));
    const container = document.getElementById('questionsContainer');
    questions.forEach(question => {
        const div = document.createElement('div');
        div.innerHTML = `<p>${question}</p><textarea rows="4" cols="50"></textarea>`;
        container.appendChild(div);
    });
}