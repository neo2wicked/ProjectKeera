// sidebar-component.js
class Sidebar extends HTMLElement {
    constructor() {
        super(); // Always call super first in constructor
        this.attachShadow({mode: 'open'}); // Attach a shadow DOM tree to the element
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                .sidebar {
                    width: 250px;
                    height: 100vh;
                    background-color: #2C3E50;
                    color: white;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .profile-img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    margin-bottom: 20px;
                }
                .user-name, .user-email {
                    margin: 5px 0;
                }
            </style>
            <div class="sidebar">
                <img src="path_to_your_profile_image.jpg" alt="Profile Image" class="profile-img">
                <p class="user-name" id="userName">User Name</p>
                <p class="user-email" id="userEmail">email@example.com</p>
                <a href="dashboard.html">Dashboard</a>
                <a href="loops.html">Loops</a>
                <a href="settings.html">Settings</a>
            </div>
        `;

        // Add click event listeners to links
        const links = this.shadowRoot.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent the default link behavior
                // Dispatch a custom event with the href value
                this.dispatchEvent(new CustomEvent('navigate', {
                    bubbles: true, // This allows the event to bubble up through the shadow boundary
                    composed: true, // This allows the event to reach the outer document
                    detail: { href: link.getAttribute('href') }
                }));
            });
        });
    }
}

customElements.define('custom-sidebar', Sidebar);