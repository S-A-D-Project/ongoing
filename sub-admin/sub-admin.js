// Authentication check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('subAdminLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const headerLeft = document.querySelector('.header-left');
const notificationBtn = document.querySelector('.notification-btn');
const badge = notificationBtn.querySelector('.badge');
const searchInput = document.querySelector('.search-container input');
const dashboardSection = document.querySelector('.dashboard-section');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const tooltipElements = document.querySelectorAll('[data-tooltip]');
const adminName = localStorage.getItem('adminName');
const logoutBtn = document.querySelector('.logout');
const userProfile = document.querySelector('.user-profile');

// State
let notifications = [];
let currentUser = {
    name: 'Admin User',
    role: 'Super Admin',
    avatar: 'https://via.placeholder.com/40'
};

// Create and configure hamburger button
const hamburger = document.createElement('button');
hamburger.className = 'hamburger';
hamburger.innerHTML = '<i class="fas fa-bars"></i>';
hamburger.setAttribute('aria-label', 'Toggle sidebar');
headerLeft.insertBefore(hamburger, headerLeft.firstChild);

// Mobile Sidebar Toggle
function toggleSidebar() {
    sidebar.classList.toggle('sidebar-open');
    sidebarOverlay.style.display = sidebar.classList.contains('sidebar-open') ? 'block' : 'none';
}

hamburger.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', toggleSidebar);

// Close sidebar when clicking outside on desktop
document.addEventListener('click', (e) => {
    if (window.innerWidth >= 1024 && !sidebar.contains(e.target) && !e.target.closest('.hamburger')) {
        sidebar.classList.remove('sidebar-open');
        sidebarOverlay.style.display = 'none';
    }
});

// Responsive adjustments
function handleResize() {
    if (window.innerWidth >= 1024) {
        sidebar.style.transform = 'none';
        sidebarOverlay.style.display = 'none';
    }
}

window.addEventListener('resize', handleResize);
handleResize();

// Notification System
function updateNotificationCount() {
    const count = Math.floor(Math.random() * 10);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
}

setInterval(updateNotificationCount, 30000);
updateNotificationCount();

// Table Interactions
const tableRows = document.querySelectorAll('.data-table tbody tr');
tableRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.transform = 'translateX(5px)';
    });
    row.addEventListener('mouseleave', () => {
        row.style.transform = 'translateX(0)';
    });
});

// Status Badge Styling
const statusBadges = document.querySelectorAll('.status');
statusBadges.forEach(badge => {
    const status = badge.textContent.toLowerCase();
    switch (status) {
        case 'completed':
            badge.style.backgroundColor = 'var(--success-color)';
            break;
        case 'processing':
            badge.style.backgroundColor = 'var(--warning-color)';
            break;
        case 'cancelled':
            badge.style.backgroundColor = 'var(--danger-color)';
            break;
    }
});

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Loading States
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Simulate loading state
showLoading(dashboardSection);
setTimeout(() => hideLoading(dashboardSection), 1500);

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navigation and Active States
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Tooltip System
tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
    });
    
    element.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});

// Add CSS for tooltips
const style = document.createElement('style');
style.textContent = `
    .tooltip {
        position: fixed;
        background: var(--text-color);
        color: var(--white);
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.2s, transform 0.2s;
    }
    .tooltip.show {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// User Management
if (adminName) {
    document.querySelector('.admin-name').textContent = adminName;
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminName');
        window.location.href = '../login.html';
    });
}

// Sample data (replace with actual API calls)
const sampleData = {
    trackingUpdates: [
        { 
            id: 'TRK001', 
            orderId: 'ORD001',
            customer: 'John Doe', 
            date: '2024-03-15', 
            status: 'Pending',
            location: 'Processing Center',
            lastUpdate: '2024-03-15 10:30 AM',
            updatedBy: 'Tracking Manager',
            priority: 'high'
        },
        { 
            id: 'TRK002', 
            orderId: 'ORD002',
            customer: 'Jane Smith', 
            date: '2024-03-14', 
            status: 'In Transit',
            location: 'Manila Hub',
            lastUpdate: '2024-03-15 02:15 PM',
            updatedBy: 'Tracking Manager',
            priority: 'medium'
        },
        { 
            id: 'TRK003', 
            orderId: 'ORD003',
            customer: 'Bob Johnson', 
            date: '2024-03-13', 
            status: 'Delivered',
            location: 'Customer Address',
            lastUpdate: '2024-03-14 11:45 AM',
            updatedBy: 'Tracking Manager',
            priority: 'low'
        }
    ],
    recentUpdates: [
        { 
            id: 'TRK001', 
            orderId: 'ORD001',
            status: 'Pending',
            location: 'Processing Center',
            lastUpdate: '2024-03-15 10:30 AM',
            priority: 'high'
        },
        { 
            id: 'TRK002', 
            orderId: 'ORD002',
            status: 'In Transit',
            location: 'Manila Hub',
            lastUpdate: '2024-03-15 02:15 PM',
            priority: 'medium'
        },
        { 
            id: 'TRK003', 
            orderId: 'ORD003',
            status: 'Delivered',
            location: 'Customer Address',
            lastUpdate: '2024-03-14 11:45 AM',
            priority: 'low'
        }
    ],
    updateHistory: [
        {
            id: 'TRK001',
            orderId: 'ORD001',
            status: 'Pending',
            location: 'Processing Center',
            timestamp: '2024-03-15 10:30 AM',
            updatedBy: 'Tracking Manager',
            notes: 'Order received at processing center',
            priority: 'high'
        },
        {
            id: 'TRK002',
            orderId: 'ORD002',
            status: 'In Transit',
            location: 'Manila Hub',
            timestamp: '2024-03-15 02:15 PM',
            updatedBy: 'Tracking Manager',
            notes: 'Package in transit to delivery hub',
            priority: 'medium'
        }
    ]
};

// Load data into tables
function loadTableData() {
    // Load priority orders in dashboard
    const priorityOrders = document.querySelector('.priority-orders');
    if (priorityOrders) {
        const highPriorityOrders = sampleData.trackingUpdates
            .filter(update => update.priority === 'high')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        priorityOrders.innerHTML = highPriorityOrders.map(update => `
            <div class="priority-item">
                <div class="priority-info">
                    <h4>${update.orderId}</h4>
                    <p>${update.location}</p>
                </div>
                <div class="priority-details">
                    <span class="status ${update.status.toLowerCase()}">${update.status}</span>
                    <span class="priority high">High Priority</span>
                </div>
            </div>
        `).join('');
    }

    // Load recent updates in dashboard
    const recentUpdates = document.querySelector('.recent-updates');
    if (recentUpdates) {
        recentUpdates.innerHTML = sampleData.recentUpdates.map(update => `
            <div class="update-item">
                <div class="update-info">
                    <h4>${update.orderId}</h4>
                    <p>${update.location}</p>
                </div>
                <div class="update-details">
                    <span class="status ${update.status.toLowerCase()}">${update.status}</span>
                    <span class="priority ${update.priority}">${update.priority.charAt(0).toUpperCase() + update.priority.slice(1)} Priority</span>
                    <span class="time">${update.lastUpdate}</span>
                </div>
            </div>
        `).join('');
    }
}

// Add event listeners for buttons
function addButtonListeners() {
    // Quick action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.textContent.trim();
            if (action === 'New Tracking') {
                showNewTrackingForm();
            } else if (action === 'Bulk Update') {
                showBulkUpdateForm();
            } else if (action === 'Set Priority') {
                showPriorityForm();
            }
        });
    });

    // Search button in tracking section
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const orderId = document.getElementById('orderId').value;
            const status = document.getElementById('orderStatus').value;
            const priority = document.getElementById('orderPriority').value;
            searchTracking(orderId, status, priority);
        });
    }

    // Priority section filters
    const prioritySearchBtn = document.querySelector('#priority .search-btn');
    if (prioritySearchBtn) {
        prioritySearchBtn.addEventListener('click', () => {
            const priorityLevel = document.getElementById('priorityLevel').value;
            const sortBy = document.getElementById('sortBy').value;
            loadPriorityOrders(priorityLevel, sortBy);
        });
    }
}

// Show priority form
function showPriorityForm() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Set Order Priority</h2>
            <form class="priority-form">
                <div class="form-group">
                    <label>Order ID</label>
                    <input type="text" id="priorityOrderId" required>
                </div>
                <div class="form-group">
                    <label>Priority Level</label>
                    <select id="priorityLevel" required>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Reason</label>
                    <textarea id="priorityReason" required></textarea>
                </div>
                <button type="submit" class="save-btn">Set Priority</button>
                <button type="button" class="close-btn">Cancel</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Handle form submission
    const form = modal.querySelector('.priority-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const orderId = document.getElementById('priorityOrderId').value;
        const priority = document.getElementById('priorityLevel').value;
        const reason = document.getElementById('priorityReason').value;
        
        // Set priority (in a real application, this would be an API call)
        console.log('Setting priority:', { orderId, priority, reason });
        
        modal.remove();
        loadTableData(); // Refresh the table
    });

    // Close modal
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
}

// Load priority orders
function loadPriorityOrders(priorityLevel = 'all', sortBy = 'priority') {
    const priorityResults = document.querySelector('.priority-results');
    if (!priorityResults) return;

    let filteredOrders = [...sampleData.trackingUpdates];
    
    // Filter by priority level
    if (priorityLevel !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.priority === priorityLevel);
    }

    // Sort orders
    switch (sortBy) {
        case 'priority':
            filteredOrders.sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
            break;
        case 'date':
            filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'status':
            filteredOrders.sort((a, b) => a.status.localeCompare(b.status));
            break;
    }

    if (filteredOrders.length === 0) {
        priorityResults.innerHTML = '<p class="no-results">No orders found</p>';
    } else {
        priorityResults.innerHTML = filteredOrders.map(order => `
            <div class="priority-order-item">
                <div class="order-header">
                    <h3>${order.orderId}</h3>
                    <span class="priority ${order.priority}">${order.priority.charAt(0).toUpperCase() + order.priority.slice(1)} Priority</span>
                </div>
                <div class="order-details">
                    <p><strong>Customer:</strong> ${order.customer}</p>
                    <p><strong>Status:</strong> <span class="status ${order.status.toLowerCase()}">${order.status}</span></p>
                    <p><strong>Location:</strong> ${order.location}</p>
                    <p><strong>Last Update:</strong> ${order.lastUpdate}</p>
                </div>
                <div class="order-actions">
                    <button class="update-btn" data-id="${order.id}">Update</button>
                    <button class="change-priority-btn" data-id="${order.id}">Change Priority</button>
                </div>
            </div>
        `).join('');
    }
}

// Search tracking
function searchTracking(orderId, status, priority) {
    const results = sampleData.trackingUpdates.filter(update => {
        const matchesId = !orderId || update.orderId.includes(orderId);
        const matchesStatus = status === 'all' || update.status.toLowerCase() === status;
        const matchesPriority = priority === 'all' || update.priority === priority;
        return matchesId && matchesStatus && matchesPriority;
    });

    const trackingResults = document.querySelector('.tracking-results');
    if (trackingResults) {
        if (results.length === 0) {
            trackingResults.innerHTML = '<p class="no-results">No tracking updates found</p>';
        } else {
            trackingResults.innerHTML = results.map(update => `
                <div class="tracking-item">
                    <div class="tracking-header">
                        <h3>${update.orderId}</h3>
                        <span class="status ${update.status.toLowerCase()}">${update.status}</span>
                        <span class="priority ${update.priority}">${update.priority.charAt(0).toUpperCase() + update.priority.slice(1)} Priority</span>
                    </div>
                    <div class="tracking-details">
                        <p><strong>Customer:</strong> ${update.customer}</p>
                        <p><strong>Location:</strong> ${update.location}</p>
                        <p><strong>Last Update:</strong> ${update.lastUpdate}</p>
                        <p><strong>Updated By:</strong> ${update.updatedBy}</p>
                    </div>
                    <div class="tracking-actions">
                        <button class="update-btn" data-id="${update.id}">Update</button>
                        <button class="change-priority-btn" data-id="${update.id}">Change Priority</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Product Management Functions
const productManagement = {
    // Add new product
    addProduct: async function(productData) {
        try {
            showLoading(document.querySelector('.products-grid'));
            
            // Validate product data
            if (!this.validateProductData(productData)) {
                throw new Error('Invalid product data');
            }

            // Create product object
            const newProduct = {
                id: this.generateProductId(),
                ...productData,
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // In a real application, this would be an API call
            // For now, we'll store in localStorage
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));

            // Update UI
            this.updateProductsGrid();
            this.showNotification('Product added successfully', 'success');
            
            return newProduct;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        } finally {
            hideLoading(document.querySelector('.products-grid'));
        }
    },

    // Update product status
    updateProductStatus: async function(productId, newStatus) {
        try {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const productIndex = products.findIndex(p => p.id === productId);
            
            if (productIndex === -1) {
                throw new Error('Product not found');
            }

            // Validate status
            if (!['active', 'inactive', 'out_of_stock'].includes(newStatus)) {
                throw new Error('Invalid status');
            }

            // Update product
            products[productIndex] = {
                ...products[productIndex],
                status: newStatus,
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem('products', JSON.stringify(products));
            
            // Update UI
            this.updateProductsGrid();
            this.showNotification('Product status updated successfully', 'success');
            
            return products[productIndex];
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    },

    // Validate product data
    validateProductData: function(data) {
        const requiredFields = ['name', 'price', 'description', 'category', 'stock'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (isNaN(data.price) || data.price <= 0) {
            throw new Error('Invalid price');
        }

        if (isNaN(data.stock) || data.stock < 0) {
            throw new Error('Invalid stock quantity');
        }

        return true;
    },

    // Generate unique product ID
    generateProductId: function() {
        return 'PRD-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },

    // Update products grid in UI
    updateProductsGrid: function() {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const productsGrid = document.querySelector('.products-grid');
        
        if (!productsGrid) return;

        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image || 'https://via.placeholder.com/300x200'}" 
                     alt="${product.name}" 
                     class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-meta">
                        <span class="price">$${product.price.toFixed(2)}</span>
                        <span class="stock">${product.stock} in stock</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-outline status-btn" 
                                data-status="${product.status}">
                            ${this.getStatusLabel(product.status)}
                        </button>
                        <button class="btn btn-icon edit-btn" 
                                data-tooltip="Edit Product">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon delete-btn" 
                                data-tooltip="Delete Product">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to all buttons
        document.querySelectorAll('.product-card').forEach(card => {
            const productId = card.dataset.productId;
            
            // Status button
            card.querySelector('.status-btn').addEventListener('click', (e) => {
                const currentStatus = e.target.dataset.status;
                this.showStatusModal(productId, currentStatus);
            });

            // Edit button
            card.querySelector('.edit-btn').addEventListener('click', () => {
                this.showEditModal(productId);
            });

            // Delete button
            card.querySelector('.delete-btn').addEventListener('click', () => {
                this.showDeleteModal(productId);
            });
        });
    },

    // Get status label with appropriate styling
    getStatusLabel: function(status) {
        const statusConfig = {
            active: { label: 'Active', class: 'status-success' },
            inactive: { label: 'Inactive', class: 'status-warning' },
            out_of_stock: { label: 'Out of Stock', class: 'status-danger' }
        };

        const config = statusConfig[status] || { label: status, class: '' };
        return `<span class="status ${config.class}">${config.label}</span>`;
    },

    // Show status update modal
    showStatusModal: function(productId, currentStatus) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Update Product Status</h2>
                <div class="form-group">
                    <label>Current Status</label>
                    <div class="current-status">
                        ${this.getStatusLabel(currentStatus)}
                    </div>
                </div>
                <div class="form-group">
                    <label>New Status</label>
                    <select class="status-select">
                        <option value="active" ${currentStatus === 'active' ? 'selected' : ''}>Active</option>
                        <option value="inactive" ${currentStatus === 'inactive' ? 'selected' : ''}>Inactive</option>
                        <option value="out_of_stock" ${currentStatus === 'out_of_stock' ? 'selected' : ''}>Out of Stock</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-outline cancel-btn">Cancel</button>
                    <button class="btn btn-primary update-btn">Update Status</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Set current status in select
        const statusSelect = modal.querySelector('.status-select');
        statusSelect.value = currentStatus;

        // Add event listeners
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.update-btn').addEventListener('click', async () => {
            const newStatus = statusSelect.value;
            if (newStatus !== currentStatus) {
                try {
                    await this.updateProductStatus(productId, newStatus);
                    modal.remove();
                } catch (error) {
                    console.error('Failed to update status:', error);
                }
            } else {
                modal.remove();
            }
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Get notification icon based on type
    getNotificationIcon: function(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    },

    // Show edit product modal
    showEditModal: function(productId) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            this.showNotification('Product not found', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Edit Product</h2>
                <form class="edit-product-form">
                    <div class="form-group">
                        <label>Product Name</label>
                        <input type="text" name="name" value="${product.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input type="number" name="price" value="${product.price}" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" required>${product.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <input type="text" name="category" value="${product.category}" required>
                    </div>
                    <div class="form-group">
                        <label>Stock</label>
                        <input type="number" name="stock" value="${product.stock}" required>
                    </div>
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" name="image" value="${product.image || ''}">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary save-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const form = modal.querySelector('.edit-product-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const updatedProduct = {
                name: formData.get('name'),
                price: parseFloat(formData.get('price')),
                description: formData.get('description'),
                category: formData.get('category'),
                stock: parseInt(formData.get('stock')),
                image: formData.get('image') || undefined
            };

            try {
                await this.updateProduct(productId, updatedProduct);
                modal.remove();
            } catch (error) {
                console.error('Failed to update product:', error);
            }
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Update product
    updateProduct: async function(productId, updatedData) {
        try {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const productIndex = products.findIndex(p => p.id === productId);
            
            if (productIndex === -1) {
                throw new Error('Product not found');
            }

            // Validate updated data
            if (!this.validateProductData(updatedData)) {
                throw new Error('Invalid product data');
            }

            // Update product
            products[productIndex] = {
                ...products[productIndex],
                ...updatedData,
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem('products', JSON.stringify(products));
            
            // Update UI
            this.updateProductsGrid();
            this.showNotification('Product updated successfully', 'success');
            
            return products[productIndex];
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    },

    // Show delete confirmation modal
    showDeleteModal: function(productId) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Delete Product</h2>
                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                <div class="modal-actions">
                    <button class="btn btn-outline cancel-btn">Cancel</button>
                    <button class="btn btn-danger delete-btn">Delete</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.delete-btn').addEventListener('click', async () => {
            try {
                await this.deleteProduct(productId);
                modal.remove();
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Delete product
    deleteProduct: async function(productId) {
        try {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const filteredProducts = products.filter(p => p.id !== productId);
            
            if (filteredProducts.length === products.length) {
                throw new Error('Product not found');
            }

            localStorage.setItem('products', JSON.stringify(filteredProducts));
            
            // Update UI
            this.updateProductsGrid();
            this.showNotification('Product deleted successfully', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    },

    // Show add product modal
    showAddProductModal: function() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Add New Product</h2>
                <form class="add-product-form">
                    <div class="form-group">
                        <label>Product Name</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input type="number" name="price" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <input type="text" name="category" required>
                    </div>
                    <div class="form-group">
                        <label>Stock</label>
                        <input type="number" name="stock" required>
                    </div>
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" name="image">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary save-btn">Add Product</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const form = modal.querySelector('.add-product-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const productData = {
                name: formData.get('name'),
                price: parseFloat(formData.get('price')),
                description: formData.get('description'),
                category: formData.get('category'),
                stock: parseInt(formData.get('stock')),
                image: formData.get('image') || undefined
            };

            try {
                await this.addProduct(productData);
                modal.remove();
            } catch (error) {
                console.error('Failed to add product:', error);
            }
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
};

// Add CSS for modals and notifications
const style = document.createElement('style');
style.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--white);
        padding: 2rem;
        border-radius: 1rem;
        width: 90%;
        max-width: 500px;
        box-shadow: var(--shadow-lg);
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
        justify-content: flex-end;
    }

    .notification {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        background: var(--white);
        color: var(--text-color);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }

    .notification.success {
        background: var(--success-color);
        color: var(--white);
    }

    .notification.error {
        background: var(--danger-color);
        color: var(--white);
    }

    .notification.warning {
        background: var(--warning-color);
        color: var(--white);
    }

    .notification.fade-out {
        animation: fadeOut 0.3s ease forwards;
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

    @keyframes fadeOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .edit-product-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        font-weight: 500;
        color: var(--text-secondary);
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        font-size: 0.95rem;
        transition: var(--transition);
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .btn-danger {
        background: var(--danger-color);
        color: var(--white);
    }

    .btn-danger:hover {
        background: #dc2626;
        transform: translateY(-2px);
    }

    .product-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .product-meta {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
        color: var(--text-secondary);
    }

    .price {
        font-weight: 600;
        color: var(--primary-color);
    }

    .stock {
        font-size: 0.9rem;
    }
`;
document.head.appendChild(style);

// Initialize product management
document.addEventListener('DOMContentLoaded', () => {
    // Update products grid on page load
    productManagement.updateProductsGrid();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // Check authentication before loading dashboard
    loadTableData();
    addButtonListeners();
});

// Add these functions to handle all buttons
const buttonHandlers = {
    // Initialize all button handlers
    init: function() {
        this.handleSidebarButtons();
        this.handleHeaderButtons();
        this.handleDashboardButtons();
        this.handleProductButtons();
        this.handleOrderButtons();
        this.handleCustomerButtons();
        this.handleReportButtons();
        this.handleSettingsButtons();
    },

    // Sidebar navigation buttons
    handleSidebarButtons: function() {
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            });
        });

        // Logout button
        const logoutBtn = document.querySelector('.sidebar-footer .btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    },

    // Header buttons (search, notifications, profile)
    handleHeaderButtons: function() {
        // Search functionality
        const searchInput = document.querySelector('.search-container input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.handleSearch(searchTerm);
            });
        }

        // Notification button
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }

        // Profile button
        const profileBtn = document.querySelector('.user-profile');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.showProfileMenu();
            });
        }
    },

    // Dashboard action buttons
    handleDashboardButtons: function() {
        // View All buttons
        document.querySelectorAll('.section-header .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const href = btn.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            });
        });

        // View Order Details buttons
        document.querySelectorAll('.data-table .btn-outline').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const orderId = btn.closest('tr').querySelector('td:first-child').textContent;
                this.showOrderDetails(orderId);
            });
        });
    },

    // Product management buttons
    handleProductButtons: function() {
        // Add Product button
        const addProductBtn = document.querySelector('.add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                productManagement.showAddProductModal();
            });
        }

        // Product action buttons are handled in productManagement.updateProductsGrid
    },

    // Order management buttons
    handleOrderButtons: function() {
        // Order status buttons
        document.querySelectorAll('.order-status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.closest('tr').dataset.orderId;
                const currentStatus = e.target.dataset.status;
                this.showOrderStatusModal(orderId, currentStatus);
            });
        });

        // Order action buttons
        document.querySelectorAll('.order-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const orderId = e.target.closest('tr').dataset.orderId;
                this.handleOrderAction(action, orderId);
            });
        });
    },

    // Customer management buttons
    handleCustomerButtons: function() {
        // Customer action buttons
        document.querySelectorAll('.customer-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const customerId = e.target.closest('tr').dataset.customerId;
                this.handleCustomerAction(action, customerId);
            });
        });
    },

    // Report buttons
    handleReportButtons: function() {
        // Report filter buttons
        document.querySelectorAll('.report-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.applyReportFilter(filter);
            });
        });

        // Export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                this.exportReport(format);
            });
        });
    },

    // Settings buttons
    handleSettingsButtons: function() {
        // Save settings button
        const saveSettingsBtn = document.querySelector('.save-settings-btn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        // Reset settings button
        const resetSettingsBtn = document.querySelector('.reset-settings-btn');
        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', () => {
                this.resetSettings();
            });
        }
    },

    // Helper functions for button actions
    handleLogout: function() {
        localStorage.removeItem('adminName');
        window.location.href = '../login.html';
    },

    handleSearch: function(searchTerm) {
        const tableRows = document.querySelectorAll('.data-table tbody tr');
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    },

    showNotifications: function() {
        const notifications = [
            { id: 1, message: 'New order received', time: '2 minutes ago', read: false },
            { id: 2, message: 'Product stock low', time: '1 hour ago', read: true },
            { id: 3, message: 'System update available', time: '3 hours ago', read: false }
        ];

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Notifications</h2>
                <div class="notifications-list">
                    ${notifications.map(notif => `
                        <div class="notification-item ${notif.read ? 'read' : ''}">
                            <p>${notif.message}</p>
                            <span class="time">${notif.time}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary mark-all-read">Mark All as Read</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.mark-all-read').addEventListener('click', () => {
            document.querySelectorAll('.notification-item').forEach(item => {
                item.classList.add('read');
            });
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    showProfileMenu: function() {
        const menu = document.createElement('div');
        menu.className = 'profile-menu';
        menu.innerHTML = `
            <div class="menu-content">
                <div class="profile-header">
                    <img src="https://via.placeholder.com/40" alt="Admin">
                    <div class="profile-info">
                        <span class="username">${localStorage.getItem('adminName') || 'Admin User'}</span>
                        <span class="role">Super Admin</span>
                    </div>
                </div>
                <div class="menu-items">
                    <a href="profile.html" class="menu-item">
                        <i class="fas fa-user"></i>
                        <span>Profile</span>
                    </a>
                    <a href="settings.html" class="menu-item">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                    <button class="menu-item logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(menu);

        // Add event listeners
        menu.querySelector('.logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !e.target.closest('.user-profile')) {
                menu.remove();
            }
        });
    },

    showOrderDetails: function(orderId) {
        // In a real application, this would fetch order details from an API
        const orderDetails = {
            id: orderId,
            customer: 'John Doe',
            date: '2024-03-15',
            items: [
                { name: 'Product 1', quantity: 2, price: 99.99 },
                { name: 'Product 2', quantity: 1, price: 149.99 }
            ],
            total: 349.97,
            status: 'Processing',
            shipping: {
                address: '123 Main St, City, Country',
                method: 'Express'
            }
        };

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Order Details #${orderId}</h2>
                <div class="order-details">
                    <div class="detail-group">
                        <h3>Customer Information</h3>
                        <p>Name: ${orderDetails.customer}</p>
                        <p>Date: ${orderDetails.date}</p>
                    </div>
                    <div class="detail-group">
                        <h3>Order Items</h3>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orderDetails.items.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.quantity}</td>
                                        <td>$${item.price.toFixed(2)}</td>
                                        <td>$${(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3">Total</td>
                                    <td>$${orderDetails.total.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="detail-group">
                        <h3>Shipping Information</h3>
                        <p>Address: ${orderDetails.shipping.address}</p>
                        <p>Method: ${orderDetails.shipping.method}</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-outline close-btn">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
};

// Initialize button handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    buttonHandlers.init();
    productManagement.updateProductsGrid();
});

// Add CSS for new components
const style = document.createElement('style');
style.textContent = `
    /* Profile Menu */
    .profile-menu {
        position: fixed;
        top: 60px;
        right: 20px;
        background: var(--white);
        border-radius: 0.75rem;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        min-width: 250px;
        animation: slideDown 0.3s ease;
    }

    .profile-header {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .menu-items {
        padding: 0.5rem;
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        color: var(--text-color);
        text-decoration: none;
        border-radius: 0.5rem;
        transition: var(--transition);
    }

    .menu-item:hover {
        background: var(--light-gray);
    }

    .menu-item i {
        width: 1.25rem;
        text-align: center;
    }

    /* Notifications */
    .notifications-list {
        max-height: 400px;
        overflow-y: auto;
    }

    .notification-item {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        transition: var(--transition);
    }

    .notification-item.read {
        opacity: 0.7;
    }

    .notification-item:hover {
        background: var(--light-gray);
    }

    .notification-item .time {
        font-size: 0.85rem;
        color: var(--text-secondary);
    }

    /* Order Details */
    .order-details {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .detail-group {
        background: var(--light-gray);
        padding: 1rem;
        border-radius: 0.5rem;
    }

    .detail-group h3 {
        margin-bottom: 0.75rem;
        color: var(--text-color);
    }

    .items-table {
        width: 100%;
        border-collapse: collapse;
    }

    .items-table th,
    .items-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
    }

    .items-table tfoot td {
        font-weight: 600;
    }

    @keyframes slideDown {
        from {
            transform: translateY(-10px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 

// Add these functions to handle action buttons
const actionButtons = {
    // Initialize all action buttons
    init: function() {
        this.handleEditButtons();
        this.handleDeleteButtons();
        this.handleStatusButtons();
    },

    // Handle edit buttons
    handleEditButtons: function() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.productId;
                this.showEditModal(productId);
            });
        });
    },

    // Handle delete buttons
    handleDeleteButtons: function() {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.productId;
                this.showDeleteModal(productId);
            });
        });
    },

    // Handle status buttons
    handleStatusButtons: function() {
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.productId;
                const currentStatus = btn.dataset.status;
                this.showStatusModal(productId, currentStatus);
            });
        });
    },

    // Show edit modal
    showEditModal: function(productId) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            this.showNotification('Product not found', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Edit Product</h2>
                <form class="edit-product-form">
                    <div class="form-group">
                        <label>Product Name</label>
                        <input type="text" name="name" value="${product.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input type="number" name="price" value="${product.price}" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" required>${product.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <input type="text" name="category" value="${product.category}" required>
                    </div>
                    <div class="form-group">
                        <label>Stock</label>
                        <input type="number" name="stock" value="${product.stock}" required>
                    </div>
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" name="image" value="${product.image || ''}">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary save-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const form = modal.querySelector('.edit-product-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const updatedProduct = {
                name: formData.get('name'),
                price: parseFloat(formData.get('price')),
                description: formData.get('description'),
                category: formData.get('category'),
                stock: parseInt(formData.get('stock')),
                image: formData.get('image') || undefined
            };

            try {
                await productManagement.updateProduct(productId, updatedProduct);
                modal.remove();
            } catch (error) {
                console.error('Failed to update product:', error);
            }
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Show delete modal
    showDeleteModal: function(productId) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Delete Product</h2>
                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                <div class="modal-actions">
                    <button class="btn btn-outline cancel-btn">Cancel</button>
                    <button class="btn btn-danger delete-btn">Delete</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.delete-btn').addEventListener('click', async () => {
            try {
                await productManagement.deleteProduct(productId);
                modal.remove();
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Show status modal
    showStatusModal: function(productId, currentStatus) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Update Product Status</h2>
                <div class="form-group">
                    <label>Current Status</label>
                    <div class="current-status">
                        ${this.getStatusLabel(currentStatus)}
                    </div>
                </div>
                <div class="form-group">
                    <label>New Status</label>
                    <select class="status-select">
                        <option value="active" ${currentStatus === 'active' ? 'selected' : ''}>Active</option>
                        <option value="inactive" ${currentStatus === 'inactive' ? 'selected' : ''}>Inactive</option>
                        <option value="out_of_stock" ${currentStatus === 'out_of_stock' ? 'selected' : ''}>Out of Stock</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-outline cancel-btn">Cancel</button>
                    <button class="btn btn-primary update-btn">Update Status</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.update-btn').addEventListener('click', async () => {
            const newStatus = modal.querySelector('.status-select').value;
            if (newStatus !== currentStatus) {
                try {
                    await productManagement.updateProductStatus(productId, newStatus);
                    modal.remove();
                } catch (error) {
                    console.error('Failed to update status:', error);
                }
            } else {
                modal.remove();
            }
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Get status label with appropriate styling
    getStatusLabel: function(status) {
        const statusConfig = {
            active: { label: 'Active', class: 'status-success' },
            inactive: { label: 'Inactive', class: 'status-warning' },
            out_of_stock: { label: 'Out of Stock', class: 'status-danger' }
        };

        const config = statusConfig[status] || { label: status, class: '' };
        return `<span class="status ${config.class}">${config.label}</span>`;
    },

    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Get notification icon based on type
    getNotificationIcon: function(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
};

// Initialize action buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    actionButtons.init();
});

// Order Management Functions
const orderManagement = {
    // Initialize order management
    init: function() {
        this.handleOrderButtons();
        this.handleTrackingButtons();
    },

    // Handle order action buttons
    handleOrderButtons: function() {
        // Add New Order button
        document.getElementById('addOrderBtn')?.addEventListener('click', () => {
            this.showAddOrderModal();
        });

        // View Order Details buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.closest('tr').dataset.orderId;
                this.showOrderDetails(orderId);
            });
        });

        // Edit Order buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.closest('tr').dataset.orderId;
                this.showEditOrderModal(orderId);
            });
        });

        // Delete Order buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.closest('tr').dataset.orderId;
                this.showDeleteOrderModal(orderId);
            });
        });
    },

    // Handle tracking action buttons
    handleTrackingButtons: function() {
        // Add New Tracking button
        document.getElementById('addTrackingBtn')?.addEventListener('click', () => {
            this.showAddTrackingModal();
        });

        // View Tracking Details buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackingId = e.target.closest('tr').dataset.trackingId;
                this.showTrackingDetails(trackingId);
            });
        });

        // Update Tracking Status buttons
        document.querySelectorAll('.update-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackingId = e.target.closest('tr').dataset.trackingId;
                const currentStatus = e.target.closest('tr').querySelector('.status-btn').dataset.status;
                this.showTrackingUpdateModal(trackingId, currentStatus);
            });
        });

        // Delete Tracking buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackingId = e.target.closest('tr').dataset.trackingId;
                this.showDeleteTrackingModal(trackingId);
            });
        });
    },

    // Show order details modal
    showOrderDetails: function(orderId) {
        const modal = document.getElementById('orderDetailsModal');
        const orderDetails = this.getOrderDetails(orderId);
        
        modal.querySelector('.order-details').innerHTML = `
            <div class="detail-group">
                <h3>Order Information</h3>
                <p><strong>Order ID:</strong> ${orderDetails.id}</p>
                <p><strong>Customer:</strong> ${orderDetails.customer}</p>
                <p><strong>Date:</strong> ${orderDetails.date}</p>
                <p><strong>Total:</strong> ${orderDetails.total}</p>
                <p><strong>Status:</strong> ${this.getStatusLabel(orderDetails.status)}</p>
            </div>
            <div class="detail-group">
                <h3>Order Items</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderDetails.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.price.toFixed(2)}</td>
                                <td>$${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        modal.style.display = 'flex';
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    },

    // Show tracking update modal
    showTrackingUpdateModal: function(trackingId, currentStatus) {
        const modal = document.getElementById('trackingUpdateModal');
        const trackingDetails = this.getTrackingDetails(trackingId);
        
        modal.querySelector('.current-status').innerHTML = this.getStatusLabel(currentStatus);
        modal.querySelector('.status-select').value = currentStatus;
        modal.querySelector('input[name="location"]').value = trackingDetails.location || '';
        
        const form = modal.querySelector('.tracking-update-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const updateData = {
                status: formData.get('status'),
                location: formData.get('location'),
                notes: formData.get('notes')
            };
            
            try {
                await this.updateTrackingStatus(trackingId, updateData);
                modal.style.display = 'none';
                this.showNotification('Tracking status updated successfully', 'success');
            } catch (error) {
                this.showNotification('Failed to update tracking status', 'error');
            }
        });

        modal.style.display = 'flex';
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    },

    // Get order details (mock data)
    getOrderDetails: function(orderId) {
        // In a real application, this would be an API call
        return {
            id: orderId,
            customer: 'John Doe',
            date: '2024-03-15',
            total: 349.97,
            status: 'processing',
            items: [
                { name: 'Product 1', quantity: 2, price: 99.99 },
                { name: 'Product 2', quantity: 1, price: 149.99 }
            ]
        };
    },

    // Get tracking details (mock data)
    getTrackingDetails: function(trackingId) {
        // In a real application, this would be an API call
        return {
            id: trackingId,
            orderId: 'ORD001',
            status: 'in_transit',
            location: 'Manila Hub',
            lastUpdate: '2024-03-15 14:30'
        };
    },

    // Update tracking status
    updateTrackingStatus: async function(trackingId, updateData) {
        // In a real application, this would be an API call
        console.log('Updating tracking status:', { trackingId, updateData });
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
    },

    // Get status label with appropriate styling
    getStatusLabel: function(status) {
        const statusConfig = {
            pending: { label: 'Pending', class: 'status-warning' },
            processing: { label: 'Processing', class: 'status-info' },
            in_transit: { label: 'In Transit', class: 'status-primary' },
            delivered: { label: 'Delivered', class: 'status-success' },
            cancelled: { label: 'Cancelled', class: 'status-danger' }
        };

        const config = statusConfig[status] || { label: status, class: '' };
        return `<span class="status ${config.class}">${config.label}</span>`;
    },

    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Get notification icon based on type
    getNotificationIcon: function(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
};

// Initialize order management when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    orderManagement.init();
}); 