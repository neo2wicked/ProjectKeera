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
                <!-- Add other sidebar items here -->
            </div>
        `;
    }
}

customElements.define('custom-sidebar', Sidebar);