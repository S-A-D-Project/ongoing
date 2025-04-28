// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

// Check if user is already logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('superAdminLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = 'index.html';
    }
}

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // For demo purposes, using hardcoded credentials
    // In a real application, this should be handled by a secure backend
    if (username === 'admin' && password === 'admin123') {
        // Set login status
        localStorage.setItem('superAdminLoggedIn', 'true');
        localStorage.setItem('superAdminUsername', username);
        
        // Redirect to dashboard
        window.location.href = 'index.html';
    } else {
        // Show error message
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Invalid username or password';
        
        // Clear password field
        passwordInput.value = '';
    }
});

// Check authentication status on page load
checkAuth(); 