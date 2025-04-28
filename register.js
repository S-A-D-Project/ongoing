document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Initialize cart system
    const cartSystem = new CartSystem();

    // Initialize password visibility toggles
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    togglePasswordButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const type = passwordInputs[index].getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInputs[index].setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });

    // Handle form submission
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 4px;
            color: white;
            z-index: 1000;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification.success {
            background-color: #28a745;
        }
        
        .notification.error {
            background-color: #dc3545;
        }
        
        .notification.info {
            background-color: #17a2b8;
        }
        
        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        
        .form-group.error input,
        .form-group.error textarea {
            border-color: #dc3545;
        }
    `;
    document.head.appendChild(style);
});

async function handleRegistration(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Validate form data
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
        displayErrors(errors);
        return;
    }

    // Show loading state
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                password: formData.get('password')
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token
            localStorage.setItem('token', data.token);
            showNotification('Registration successful! Redirecting...', 'success');
            
            // Redirect to home page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showNotification(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('An error occurred during registration', 'error');
    } finally {
        // Remove loading state
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
    }
}

function validateForm(formData) {
    const errors = {};
    
    // Name validation
    if (!formData.get('name').trim()) {
        errors.name = 'Name is required';
    }

    // Email validation
    const email = formData.get('email');
    if (!email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phone = formData.get('phone');
    if (!phone) {
        errors.phone = 'Phone number is required';
    } else if (!isValidPhone(phone)) {
        errors.phone = 'Please enter a valid phone number';
    }

    // Address validation
    if (!formData.get('address').trim()) {
        errors.address = 'Address is required';
    }

    // Password validation
    const password = formData.get('password');
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    const confirmPassword = formData.get('confirm-password');
    if (password !== confirmPassword) {
        errors['confirm-password'] = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.get('terms')) {
        errors.terms = 'You must agree to the terms and conditions';
    }

    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

function displayErrors(errors) {
    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));

    // Add new error messages
    Object.entries(errors).forEach(([field, message]) => {
        const formGroup = document.querySelector(`[name="${field}"]`).closest('.form-group');
        formGroup.classList.add('error');
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        formGroup.appendChild(errorMessage);
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add show class after a small delay to trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
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