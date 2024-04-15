// Ah, the sweet smell of modular JavaScript in the morning.
export async function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    // Look at this, making network requests like a pro.
    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            // Redirecting with the grace of a gazelle.
            window.location.href = '/';
        } else {
            // Using alert? How quaint. Let's keep it for the nostalgia.
            alert('Failed to signup. Please try again.');
        }
    } catch (error) {
        console.error('Signup failed:', error);
        alert('Something went wrong. Please try again.');
    }
}

// And here's how you'd wire it up in your HTML file, which I'm sure exists somewhere in a parallel universe.
document.getElementById('signupForm').addEventListener('submit', handleSignup);