// Track Order Page JavaScript
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

    // Handle order search form submission
    const searchForm = document.querySelector('.order-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleOrderSearch);
    }
});

async function handleOrderSearch(event) {
    event.preventDefault();
    
    const form = event.target;
    const orderNumber = form.querySelector('input[name="order_number"]').value;
    const email = form.querySelector('input[name="email"]').value;

    try {
        const response = await fetch(`http://localhost:3000/api/orders/${orderNumber}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            updateOrderStatus(data);
        } else {
            showNotification(data.error || 'Order not found', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Order search error:', error);
    }
}

function updateOrderStatus(order) {
    const statusSection = document.querySelector('.order-status');
    const detailsSection = document.querySelector('.order-details');
    const itemsSection = document.querySelector('.order-items');

    if (statusSection) {
        // Update status badge
        const statusBadge = statusSection.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.className = `status-badge ${order.status}`;
            statusBadge.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);
        }

        // Update timeline
        const timeline = statusSection.querySelector('.timeline');
        if (timeline) {
            const stages = ['Order Placed', 'Printing', 'Shipping', 'Delivered'];
            timeline.innerHTML = stages.map(stage => `
                <div class="timeline-stage ${order.status.toLowerCase() === stage.toLowerCase() ? 'active' : ''}">
                    <div class="stage-dot"></div>
                    <div class="stage-label">${stage}</div>
                </div>
            `).join('');
        }
    }

    if (detailsSection) {
        detailsSection.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Order Date:</span>
                <span class="detail-value">${new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value">₱${order.total_amount.toFixed(2)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">${order.payment_method}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Shipping Address:</span>
                <span class="detail-value">${order.shipping_address}</span>
            </div>
        `;
    }

    if (itemsSection) {
        itemsSection.innerHTML = order.items.map(item => `
            <div class="order-item">
                <div class="item-info">
                    <h4>${item.product_name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: ₱${item.price.toFixed(2)}</p>
                </div>
            </div>
        `).join('');
    }
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