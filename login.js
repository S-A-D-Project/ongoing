// Login Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // Initialize cart system
    const cartSystem = new CartSystem();

    // Handle login form submission
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Password visibility toggle
    const passwordInput = document.querySelector('input[type="password"]');
    const togglePassword = document.querySelector('.toggle-password');
    
    if (passwordInput && togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // Social login buttons
    const googleLoginBtn = document.querySelector('.google-login');
    const facebookLoginBtn = document.querySelector('.facebook-login');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }
    
    if (facebookLoginBtn) {
        facebookLoginBtn.addEventListener('click', handleFacebookLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    const rememberMe = form.querySelector('input[type="checkbox"]').checked;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token in localStorage or sessionStorage based on remember me
            if (rememberMe) {
                localStorage.setItem('token', data.token);
            } else {
                sessionStorage.setItem('token', data.token);
            }

            showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showNotification(data.error || 'Login failed. Please try again.', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Login error:', error);
    }
}

function handleGoogleLogin() {
    showNotification('Redirecting to Google login...', 'info');
    // Implement Google OAuth integration here
}

function handleFacebookLogin() {
    showNotification('Redirecting to Facebook login...', 'info');
    // Implement Facebook OAuth integration here
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

class CartSystem {
    constructor() {
        this.cart = [];
        this.initializeCart();
    }

    async initializeCart() {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:3000/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.cart = data;
                this.updateCartUI();
            }
        } catch (error) {
            console.error('Error initializing cart:', error);
        }
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.total-amount');
        const cartTotalItems = document.querySelector('.cart-total-items');

        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }

        if (cartItems) {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image_url}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>₱${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            // Add event listeners to remove buttons
            cartItems.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => this.removeItem(e.target.closest('.remove-item').dataset.id));
            });
        }

        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `₱${total.toFixed(2)}`;
        }

        if (cartTotalItems) {
            cartTotalItems.textContent = `${this.cart.length} items`;
        }
    }

    async removeItem(itemId) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.cart = this.cart.filter(item => item.id !== itemId);
                this.updateCartUI();
                showNotification('Item removed from cart', 'success');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            showNotification('Error removing item from cart', 'error');
        }
    }
} 