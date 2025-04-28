/**
 * OPSMS Frontend Script
 * - Handles mobile menu
 * - Manages cart functionality
 * - Handles search functionality
 */

// Sample product data
const demoProducts = [
    {
        id: '1',
        name: 'Tarpaulin / Banner',
        description: 'High-quality tarpaulins and banners for events, promotions, and advertising.',
        price: 299,
        image: 'https://via.placeholder.com/400x300',
        category: 'largeFormat',
        features: ['Weather-resistant materials', 'HD printing quality', 'Custom sizes available', 'Grommets for easy hanging', 'Fast turnaround time']
    },
    {
        id: '2',
        name: 'Sintra Board',
        description: 'Durable sintra board printing for signs, displays, and exhibitions.',
        price: 399,
        image: 'https://via.placeholder.com/400x300',
        category: 'signage',
        features: ['Lightweight material', 'Durable and rigid', 'Smooth surface finish', 'Easy to mount', 'Custom sizes available']
    },
    {
        id: '3',
        name: 'T-Shirt Printing',
        description: 'Custom t-shirt printing with various techniques and materials.',
        price: 199,
        image: 'https://via.placeholder.com/400x300',
        category: 'apparel',
        features: ['Screen printing option', 'DTF printing available', 'Various fabric choices', 'Custom sizes', 'Bulk order discounts']
    },
    {
        id: '4',
        name: 'Product Label',
        description: 'Custom product labels and stickers for your business needs.',
        price: 149,
        image: 'https://via.placeholder.com/400x300',
        category: 'labels',
        features: ['Waterproof materials', 'Custom shapes and sizes', 'Adhesive options', 'Barcode compatible', 'Bulk order discounts']
    },
    {
        id: '5',
        name: 'Sticker',
        description: 'Custom stickers in various sizes and materials.',
        price: 99,
        image: 'https://via.placeholder.com/400x300',
        category: 'stickers',
        features: ['Die-cut options', 'Waterproof materials', 'Custom shapes', 'Bulk pricing', 'Fast production']
    },
    {
        id: '6',
        name: 'Plaque',
        description: 'Custom plaques for awards, recognition, and commemorative purposes.',
        price: 499,
        image: 'https://via.placeholder.com/400x300',
        category: 'awards',
        features: ['Wood or acrylic options', 'Laser engraving', 'Custom designs', 'Mounting hardware included', 'Premium finishes']
    },
    {
        id: '7',
        name: 'Mugs',
        description: 'Custom printed mugs for promotional and personal use.',
        price: 199,
        image: 'https://via.placeholder.com/400x300',
        category: 'promotional',
        features: ['Ceramic material', 'Dishwasher safe', 'Full-color printing', 'Handle options', 'Bulk order discounts']
    },
    {
        id: '8',
        name: 'Keychain',
        description: 'Custom keychains for promotional and souvenir purposes.',
        price: 49,
        image: 'https://via.placeholder.com/400x300',
        category: 'promotional',
        features: ['Metal or plastic options', 'Custom shapes', 'Full-color printing', 'Bulk pricing', 'Fast production']
    },
    {
        id: '9',
        name: 'Eco Bag',
        description: 'Custom printed eco-friendly bags for promotional use.',
        price: 149,
        image: 'https://via.placeholder.com/400x300',
        category: 'promotional',
        features: ['Recyclable materials', 'Durable construction', 'Custom sizes', 'Handle options', 'Bulk order discounts']
    },
    {
        id: '10',
        name: 'Button Pin',
        description: 'Custom button pins for promotional and collectible purposes.',
        price: 29,
        image: 'https://via.placeholder.com/400x300',
        category: 'promotional',
        features: ['Metal construction', 'Custom designs', 'Pin back included', 'Bulk pricing', 'Fast production']
    },
    {
        id: '11',
        name: 'ID Lace / Lanyard',
        description: 'Custom printed ID laces and lanyards for identification purposes.',
        price: 79,
        image: 'https://via.placeholder.com/400x300',
        category: 'accessories',
        features: ['Durable materials', 'Custom printing', 'Breakaway options', 'Bulk pricing', 'Fast production']
    },
    {
        id: '12',
        name: 'Diploma Certificate Folder',
        description: 'Custom diploma and certificate folders for academic institutions.',
        price: 199,
        image: 'https://via.placeholder.com/400x300',
        category: 'stationery',
        features: ['Premium materials', 'Custom designs', 'Interior pockets', 'Bulk order discounts', 'Fast production']
    },
    {
        id: '13',
        name: 'Dryseal',
        description: 'Custom dryseal stamps for official documents and certificates.',
        price: 399,
        image: 'https://via.placeholder.com/400x300',
        category: 'office',
        features: ['Metal construction', 'Custom designs', 'Ink pad included', 'Replacement parts available', 'Fast production']
    },
    {
        id: '14',
        name: 'Corporate Giveaways',
        description: 'Custom corporate giveaways for events and promotions.',
        price: 99,
        image: 'https://via.placeholder.com/400x300',
        category: 'promotional',
        features: ['Various product options', 'Custom branding', 'Bulk pricing', 'Fast production', 'Quality materials']
    },
    {
        id: '15',
        name: 'Medal',
        description: 'Custom medals for sports events and recognition ceremonies.',
        price: 299,
        image: 'https://via.placeholder.com/400x300',
        category: 'awards',
        features: ['Metal construction', 'Custom designs', 'Ribbon options', 'Bulk pricing', 'Fast production']
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize cart system
    window.cartSystem = new CartSystem();
    window.cartSystem.init();
    
    // Initialize search functionality
    initSearchSystem();
    
    // Initialize notification style
    initNotificationStyle();
    
    // Initialize service cards
    initServiceCards();
});

/**
 * Mobile Menu Functions
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (mobileMenuBtn && mobileMenu && mobileMenuClose) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

/**
 * Cart System Class
 */
class CartSystem {
    constructor() {
        this.cart = {
            items: [],
            total: 0
        };
        this.loadCart();
    }
    
    init() {
        // Cart dropdown toggle
        const cartBtn = document.querySelector('.cart-btn');
        const cartDropdown = document.querySelector('.cart-dropdown');
        
        if (cartBtn && cartDropdown) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                cartDropdown.classList.toggle('show');
            });
            
            // Close cart dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.cart-container') && cartDropdown.classList.contains('show')) {
                    cartDropdown.classList.remove('show');
                }
            });
        }
        
        // Add event listeners for remove buttons in cart
        document.querySelector('.cart-items')?.addEventListener('click', (e) => {
            if (e.target.closest('.remove-item')) {
                const productId = e.target.closest('.remove-item').dataset.productId;
                this.removeFromCart(productId);
            }
        });
        
        this.updateCartUI();
    }
    
    loadCart() {
        const savedCart = localStorage.getItem('opsms-cart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
            } catch (e) {
                console.error('Error loading cart from localStorage:', e);
                this.cart = { items: [], total: 0 };
            }
        }
    }
    
    saveCart() {
        localStorage.setItem('opsms-cart', JSON.stringify(this.cart));
    }
    
    addToCart(product, quantity = 1) {
        const existingItem = this.cart.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }
        
        this.updateCartTotal();
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart`, 'success');
    }
    
    removeFromCart(productId) {
        this.cart.items = this.cart.items.filter(item => item.id !== productId);
        this.updateCartTotal();
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Item removed from cart', 'info');
    }
    
    updateCartTotal() {
        this.cart.total = this.cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    updateCartUI() {
        const cartItems = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const cartTotalItems = document.querySelector('.cart-total-items');
        const totalAmount = document.querySelector('.total-amount');
        
        if (!cartItems || !cartCount || !cartTotalItems || !totalAmount) return;
        
        // Clear cart items
        cartItems.innerHTML = '';
        
        // Calculate item count
        const itemCount = this.cart.items.reduce((count, item) => count + item.quantity, 0);
        
        // Update UI elements
        cartCount.textContent = itemCount;
        cartTotalItems.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
        totalAmount.textContent = `₱${this.cart.total.toFixed(2)}`;
        
        // Add items to cart dropdown
        this.cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₱${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <span class="cart-item-total">₱${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item" data-product-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

/**
 * Search System Functions
 */
function initSearchSystem() {
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            createSearchModal();
        });
    }
}

function createSearchModal() {
    // Check if modal already exists
    if (document.querySelector('.search-modal')) return;
    
    // Create search modal
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    
    searchModal.innerHTML = `
        <div class="search-modal-content">
            <div class="search-modal-header">
                <h3>Search Products</h3>
                <button class="search-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-modal-body">
                <div class="search-form">
                    <input type="text" class="search-input" placeholder="Search for products...">
                    <button class="search-submit btn btn-primary">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div class="search-results">
                    <!-- Search results will be populated by JavaScript -->
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(searchModal);
    
    // Show modal
    setTimeout(() => {
        searchModal.classList.add('active');
        searchModal.querySelector('.search-input').focus();
    }, 10);
    
    // Close modal event
    searchModal.querySelector('.search-modal-close').addEventListener('click', () => {
        searchModal.classList.remove('active');
        setTimeout(() => {
            searchModal.remove();
        }, 300);
    });
    
    // Handle search submission
    searchModal.querySelector('.search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchModal.querySelector('.search-input').value.trim();
        
        if (query) {
            performSearch(query, searchModal.querySelector('.search-results'));
        }
    });
    
    searchModal.querySelector('.search-submit').addEventListener('click', () => {
        const query = searchModal.querySelector('.search-input').value.trim();
        
        if (query) {
            performSearch(query, searchModal.querySelector('.search-results'));
        }
    });
}

async function performSearch(query, resultsContainer) {
    resultsContainer.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
    
    try {
        // Replace with your actual API endpoint
        const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) throw new Error('Search failed');
        
        const results = await response.json();
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
            return;
        }
        
        resultsContainer.innerHTML = '';
        
        results.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'search-result-item';
            productCard.innerHTML = `
                <div class="search-result-image">
                    <img src="${product.image || 'https://via.placeholder.com/100x100'}" alt="${product.name}">
                </div>
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p>${product.description.substring(0, 80)}${product.description.length > 80 ? '...' : ''}</p>
                    <div class="search-result-price">₱${product.price.toFixed(2)}</div>
                </div>
                <a href="product.html?id=${product.id}" class="search-result-link">View</a>
            `;
            
            resultsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = '<div class="search-error">An error occurred while searching. Please try again.</div>';
    }
}

/**
 * Notification Style
 */
function initNotificationStyle() {
    // Add notification styles to the document if not already present
    if (!document.getElementById('notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 25px;
                background-color: #333;
                color: white;
                border-radius: 4px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s, transform 0.3s;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateY(0);
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
            
            .search-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s, visibility 0.3s;
            }
            
            .search-modal.active {
                opacity: 1;
                visibility: visible;
            }
            
            .search-modal-content {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .search-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
            }
            
            .search-modal-header h3 {
                margin: 0;
            }
            
            .search-modal-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                cursor: pointer;
                color: #666;
            }
            
            .search-modal-body {
                padding: 20px;
                overflow-y: auto;
            }
            
            .search-form {
                display: flex;
                margin-bottom: 20px;
            }
            
            .search-input {
                flex: 1;
                padding: 10px 15px;
                border: 1px solid #ddd;
                border-radius: 4px 0 0 4px;
                font-size: 1rem;
            }
            
            .search-submit {
                padding: 10px 15px;
                border-radius: 0 4px 4px 0;
            }
            
            .search-results {
                display: grid;
                gap: 15px;
            }
            
            .search-result-item {
                display: grid;
                grid-template-columns: 80px 1fr auto;
                gap: 15px;
                padding: 15px;
                border: 1px solid #eee;
                border-radius: 4px;
                align-items: center;
            }
            
            .search-result-image img {
                width: 100%;
                height: 80px;
                object-fit: cover;
                border-radius: 4px;
            }
            
            .search-result-info h4 {
                margin: 0 0 5px 0;
            }
            
            .search-result-info p {
                margin: 0 0 10px 0;
                font-size: 0.9rem;
                color: #666;
            }
            
            .search-result-price {
                font-weight: bold;
                color: #007bff;
            }
            
            .search-result-link {
                padding: 8px 15px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                text-align: center;
            }
            
            .search-loading,
            .search-no-results,
            .search-error {
                padding: 20px;
                text-align: center;
                color: #666;
            }
            
            .mobile-menu {
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                width: 85%;
                max-width: 320px;
                background-color: white;
                z-index: 1001;
                transform: translateX(-100%);
                transition: transform 0.3s ease-in-out;
                box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
                overflow-y: auto;
            }
            
            .mobile-menu.active {
                transform: translateX(0);
            }
            
            .mobile-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #eee;
            }
            
            .mobile-menu-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                cursor: pointer;
            }
            
            .mobile-menu-content {
                padding: 15px;
            }
            
            .mobile-menu-content a {
                display: block;
                padding: 12px 0;
                border-bottom: 1px solid #eee;
                text-decoration: none;
                color: #333;
            }
            
            .mobile-menu-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 20px;
            }
        `;
        
        document.head.appendChild(style);
    }
}

/**
 * Initialize service cards on index page
 */
function initServiceCards() {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;
    
    // Clear any existing content
    servicesGrid.innerHTML = '';
    
    // Add demo products to the grid
    demoProducts.forEach(product => {
        const card = createServiceCard(product);
        servicesGrid.appendChild(card);
    });
}

/**
 * Create a service card element from product data
 */
function createServiceCard(product) {
    const card = document.createElement('div');
    card.className = 'service-card';
    
    const icon = document.createElement('i');
    icon.className = getProductIcon(product.category);
    
    const title = document.createElement('h3');
    title.textContent = product.name;
    
    const description = document.createElement('p');
    description.textContent = product.description.substring(0, 80) + '...';
    
    const price = document.createElement('div');
    price.className = 'service-price';
    price.textContent = `₱${product.price.toFixed(2)}`;
    
    const btnContainer = document.createElement('div');
    btnContainer.className = 'service-buttons';
    
    const detailsBtn = document.createElement('a');
    detailsBtn.href = `product.html?id=${product.id}`;
    detailsBtn.className = 'btn btn-outline';
    detailsBtn.textContent = 'View Details';
    
    // Map product id to customization page
    const customizationPages = {
        '1': 'customize-tarpaulin.html',
        '2': 'customize-sintra.html',
        '3': 'customize-tshirt.html',
        '4': 'customize-label.html',
        '5': 'customize-sticker.html',
        '6': 'customize-plaque.html',
        '7': 'customize-mug.html',
        '8': 'customize-keychain.html',
        '9': 'customize-ecobag.html',
        '10': 'customize-buttonpin.html',
        '11': 'customize-lanyard.html',
        '12': 'customize-diploma.html',
        '13': 'customize-dryseal.html',
        '14': 'customize-giveaways.html',
        '15': 'customize-medal.html'
    };
    const orderNowBtn = document.createElement('a');
    orderNowBtn.className = 'btn btn-primary order-now-btn';
    orderNowBtn.textContent = 'Order Now';
    orderNowBtn.href = customizationPages[product.id] || '#';
    orderNowBtn.target = '_self';
    
    btnContainer.appendChild(detailsBtn);
    btnContainer.appendChild(orderNowBtn);
    
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(price);
    card.appendChild(btnContainer);
    
    return card;
}

/**
 * Get an appropriate icon class for a product category
 */
function getProductIcon(category) {
    const icons = {
        'business': 'fas fa-credit-card',
        'marketing': 'fas fa-newspaper',
        'largeFormat': 'fas fa-image',
        'stationery': 'fas fa-pen',
        'packaging': 'fas fa-box',
        'promotional': 'fas fa-ad',
        'signage': 'fas fa-sign',
        'default': 'fas fa-print'
    };
    
    return icons[category] || icons.default;
}

function buyNow(productId) {
    // Find the product in demoProducts
    const product = demoProducts.find(p => p.id === productId);
    if (!product) return;

    // Create a cart with just this item
    const cart = [{
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: 1,
        image: product.image
    }];

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Redirect to checkout
    window.location.href = 'checkout.html';
}

function addToCart(productId) {
    // Find the product in demoProducts
    const product = demoProducts.find(p => p.id === productId);
    if (!product) return;

    // Get existing cart or create new one
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success notification
    showNotification('Item added to cart', 'success');
}

function viewDetails(productId) {
    // Find the product in demoProducts
    const product = demoProducts.find(p => p.id === productId);
    if (!product) return;

    // Store product details in localStorage for the product page
    localStorage.setItem('currentProduct', JSON.stringify(product));
    
    // Redirect to product page
    window.location.href = 'product.html';
} 