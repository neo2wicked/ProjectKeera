let questions = [];

function addQuestion() {
    const questionInput = document.getElementById('question');
    questions.push(questionInput.value);
    questionInput.value = ''; // Clear input after adding
    document.getElementById('questionsList').innerText = questions.join(', ');
}

function generateLink() {
    const link = 'http://yourapp.com/interviewee_interface.html?session=' + encodeURIComponent(JSON.stringify(questions));
    document.getElementById('linkOutput').innerHTML = `Link: ${link} <br> QR Code: [Insert QR Code Here]`;
    // You would use a library like `qrcode.js` to generate a QR code here.
}