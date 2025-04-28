// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');

    mobileMenuBtn.addEventListener('click', () => {
        desktopNav.classList.toggle('show');
    });

    // Initialize cart system
    const cartSystem = new CartSystem();
    cartSystem.initialize();

    // Initialize contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Add hover effects to info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Form Submission Handler
function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    // Validate form
    if (validateForm(formValues)) {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;

            // Show success message
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
        }, 1500);
    }
}

// Form Validation
function validateForm(formData) {
    let isValid = true;
    const errors = {};

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Please enter a valid name';
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    // Phone validation (optional)
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
        isValid = false;
    }

    // Subject validation
    if (!formData.subject) {
        errors.subject = 'Please select a subject';
        isValid = false;
    }

    // Message validation
    if (!formData.message || formData.message.trim().length < 10) {
        errors.message = 'Please enter a message (minimum 10 characters)';
        isValid = false;
    }

    // Display errors
    Object.keys(errors).forEach(field => {
        const formGroup = document.querySelector(`.form-group input[name="${field}"], .form-group select[name="${field}"], .form-group textarea[name="${field}"]`).closest('.form-group');
        formGroup.classList.add('error');
        
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = errors[field];
    });

    // Remove error classes from valid fields
    document.querySelectorAll('.form-group').forEach(group => {
        const input = group.querySelector('input, select, textarea');
        if (input && !errors[input.name]) {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    });

    return isValid;
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    // Add animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Cart System Class (same as in services.js)
class CartSystem {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    initialize() {
        this.updateCartUI();
        this.initializeEventListeners();
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartTotalItems = document.querySelector('.cart-total-items');
        const totalAmount = document.querySelector('.total-amount');

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartCount.textContent = totalItems;
        cartTotalItems.textContent = `${totalItems} items`;
        totalAmount.textContent = `₱${totalPrice.toFixed(2)}`;

        this.updateCartItems();
    }

    updateCartItems() {
        const cartItems = document.querySelector('.cart-items');
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>₱${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.remove-item').dataset.id);
                this.removeFromCart(itemId);
            });
        });
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartUI();
        this.showNotification('Item removed from cart');
    }

    initializeEventListeners() {
        // Cart dropdown toggle
        const cartContainer = document.querySelector('.cart-container');
        if (cartContainer) {
            cartContainer.addEventListener('mouseenter', () => {
                document.querySelector('.cart-dropdown').style.display = 'block';
            });

            cartContainer.addEventListener('mouseleave', () => {
                document.querySelector('.cart-dropdown').style.display = 'none';
            });
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
} 