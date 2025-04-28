// Services Page JavaScript
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

    // Initialize search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    // Load products
    loadProducts();

    // Initialize service category buttons
    const categoryButtons = document.querySelectorAll('.category-content .btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.closest('.service-category').querySelector('h2').textContent;
            loadProducts(category);
        });
    });

    // Add hover effects to service categories
    const serviceCategories = document.querySelectorAll('.service-category');
    serviceCategories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            category.style.transform = 'translateY(-5px)';
            category.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });

        category.addEventListener('mouseleave', () => {
            category.style.transform = 'translateY(0)';
            category.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        });
    });

    // Add click handlers for service categories
    serviceCategories.forEach(category => {
        const link = category.querySelector('a');
        category.addEventListener('click', (e) => {
            if (e.target !== link) {
                link.click();
            }
        });
    });

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
            animation: slideIn 0.3s ease-out;
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
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .search-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 2rem;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
        }

        .search-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .search-container {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            position: relative;
        }

        .search-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #666;
            cursor: pointer;
        }

        .search-input {
            width: 100%;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            margin-bottom: 1rem;
        }

        .search-results {
            max-height: 400px;
            overflow-y: auto;
        }

        .search-result-item {
            padding: 1rem;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .search-result-item:hover {
            background-color: #f8f9fa;
        }

        .search-result-item h3 {
            margin: 0 0 0.5rem 0;
            color: #333;
        }

        .search-result-item p {
            margin: 0;
            color: #666;
        }
    `;
    document.head.appendChild(style);
});

async function loadProducts(category = null) {
    try {
        const url = category 
            ? `http://localhost:3000/api/products?category=${encodeURIComponent(category)}`
            : 'http://localhost:3000/api/products';
        
        const response = await fetch(url);
        const products = await response.json();

        if (response.ok) {
            displayProducts(products);
        } else {
            showNotification('Error loading products', 'error');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Error loading products', 'error');
    }
}

function displayProducts(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span>₱${product.price.toFixed(2)}</span>
                    <button class="btn btn-outline add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function addToCart(productId) {
    try {
        // Get product details
        const product = await getProductDetails(productId);
        if (!product) {
            showError('Product not found', 'PRODUCT_NOT_FOUND');
            return;
        }

        // Get current cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            // Update quantity if product exists
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            cart.push({
                id: productId,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image_url,
                quantity: 1
            });
        }

        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart UI
        updateCartCount(cart.length);
        showNotification('Item added to cart', 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError(error.message, error.code || 'UNKNOWN_ERROR');
    }
}

async function getProductDetails(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw new Error('Failed to fetch product details');
    }
}

function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

function handleSearch() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="search-container">
            <button class="search-close">
                <i class="fas fa-times"></i>
            </button>
            <input type="text" class="search-input" placeholder="Search services...">
            <div class="search-results"></div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.classList.add('active');

    const closeBtn = modal.querySelector('.search-close');
    const searchInput = modal.querySelector('.search-input');
    const searchResults = modal.querySelector('.search-results');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });

    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/services/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (response.ok) {
                searchResults.innerHTML = data.map(service => `
                    <div class="search-result-item" data-id="${service.id}">
                        <h3>${service.name}</h3>
                        <p>${service.description}</p>
                    </div>
                `).join('');

                // Add click handlers to results
                searchResults.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const serviceId = item.dataset.id;
                        window.location.href = `services/${serviceId}.html`;
                    });
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            showNotification('Error performing search', 'error');
        }
    });
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

function showError(message, code) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-notification';
    errorContainer.innerHTML = `
        <div class="error-header">
            <i class="fas fa-exclamation-circle"></i>
            <span>Error Code: ${code}</span>
        </div>
        <div class="error-message">${message}</div>
        <button class="error-details-btn">Show Details</button>
        <div class="error-stack" style="display: none;">
            <pre>${new Error().stack}</pre>
        </div>
    `;

    // Add error notification styles if not already present
    if (!document.querySelector('#error-styles')) {
        const style = document.createElement('style');
        style.id = 'error-styles';
        style.textContent = `
            .error-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #fff;
                border-left: 4px solid #dc3545;
                padding: 15px;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 1000;
                max-width: 400px;
            }
            .error-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
                color: #dc3545;
            }
            .error-message {
                margin-bottom: 10px;
                color: #333;
            }
            .error-details-btn {
                background: none;
                border: none;
                color: #007bff;
                cursor: pointer;
                padding: 5px 0;
                font-size: 12px;
            }
            .error-stack {
                margin-top: 10px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 4px;
                font-size: 12px;
                max-height: 200px;
                overflow-y: auto;
            }
            .error-stack pre {
                margin: 0;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
        `;
        document.head.appendChild(style);
    }

    // Add click handler for details button
    const detailsBtn = errorContainer.querySelector('.error-details-btn');
    const stackElement = errorContainer.querySelector('.error-stack');
    
    detailsBtn.addEventListener('click', () => {
        const isHidden = stackElement.style.display === 'none';
        stackElement.style.display = isHidden ? 'block' : 'none';
        detailsBtn.textContent = isHidden ? 'Hide Details' : 'Show Details';
    });

    document.body.appendChild(errorContainer);

    // Remove error notification after 10 seconds
    setTimeout(() => {
        errorContainer.remove();
    }, 10000);
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

    async addToCart(productId, quantity = 1) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                showNotification('Please login to add items to cart', 'error');
                return;
            }

            const response = await fetch('http://localhost:3000/api/cart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, quantity })
            });

            if (response.ok) {
                const data = await response.json();
                this.cart = data;
                this.updateCartUI();
                showNotification('Item added to cart', 'success');
            } else {
                showNotification('Error adding item to cart', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showNotification('Error adding item to cart', 'error');
        }
    }
} 