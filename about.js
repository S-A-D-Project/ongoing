// About Page JavaScript
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

    // Add animation to achievement numbers
    const achievementNumbers = document.querySelectorAll('.achievement-card .number');
    achievementNumbers.forEach(number => {
        const target = parseInt(number.textContent);
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const interval = duration / 50;

        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                number.textContent = target.toLocaleString();
                clearInterval(counter);
            } else {
                number.textContent = Math.floor(current).toLocaleString();
            }
        }, interval);
    });

    // Add hover effects to team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            member.style.transform = 'translateY(-5px)';
        });

        member.addEventListener('mouseleave', () => {
            member.style.transform = 'translateY(0)';
        });
    });

    // Add hover effects to value cards
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

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