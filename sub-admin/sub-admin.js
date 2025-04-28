// Authentication check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('subAdminLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

// DOM Elements
const navLinks = document.querySelectorAll('.nav-links li');
const contentAreas = document.querySelectorAll('.content-area');
const logoutBtn = document.querySelector('.logout');
const adminName = document.querySelector('.admin-name');

// Set admin name from localStorage
if (adminName) {
    const username = localStorage.getItem('subAdminUsername');
    adminName.textContent = username || 'Tracking Manager';
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

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
        
        // Hide all content areas
        contentAreas.forEach(area => area.classList.add('hidden'));
        
        // Show selected content area
        const pageId = link.getAttribute('data-page');
        document.getElementById(pageId).classList.remove('hidden');
        
        // Update header title
        document.querySelector('header h1').textContent = link.querySelector('span').textContent;
    });
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // Clear authentication data
        localStorage.removeItem('subAdminLoggedIn');
        localStorage.removeItem('subAdminUsername');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
});

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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // Check authentication before loading dashboard
    loadTableData();
    addButtonListeners();
});

// Add CSS for additional elements
const style = document.createElement('style');
style.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
    }

    .modal-content h2 {
        margin-bottom: 20px;
        color: var(--primary-color);
    }

    .close-btn {
        background-color: var(--danger-color);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
    }

    .save-btn {
        background-color: var(--success-color);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
    }

    .priority-item {
        background-color: white;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .priority-info {
        margin-bottom: 10px;
    }

    .priority-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .priority {
        padding: 3px 8px;
        border-radius: 3px;
        font-size: 0.8rem;
    }

    .priority.high {
        background-color: var(--danger-color);
        color: white;
    }

    .priority.medium {
        background-color: var(--warning-color);
        color: white;
    }

    .priority.low {
        background-color: var(--success-color);
        color: white;
    }

    .priority-order-item {
        background-color: white;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .order-details {
        margin-bottom: 10px;
    }

    .order-details p {
        margin: 5px 0;
    }

    .order-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    .change-priority-btn {
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
    }

    .no-results {
        text-align: center;
        color: #666;
        padding: 20px;
    }
`;
document.head.appendChild(style); 