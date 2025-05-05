// Authentication check
// function checkAuth() {
//     const isLoggedIn = localStorage.getItem('superAdminLoggedIn');
//     if (isLoggedIn !== 'true') {
//         window.location.href = 'login.html';
//     }
// }

// DOM Elements
const navLinks = document.querySelectorAll('.nav-links li');
const contentAreas = document.querySelectorAll('.content-area');
const logoutBtn = document.querySelector('.logout');
const adminName = document.querySelector('.admin-name');

// Set admin name from localStorage
if (adminName) {
    const username = localStorage.getItem('superAdminUsername');
    adminName.textContent = username || 'Super Admin';
}

// Sample data (replace with actual API calls)
const sampleData = {
    users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' }
    ],
    orders: [
        { id: 'ORD001', customer: 'John Doe', date: '2024-03-15', amount: '₱8,500', status: 'Completed' },
        { id: 'ORD002', customer: 'Jane Smith', date: '2024-03-14', amount: '₱4,250', status: 'Processing' },
        { id: 'ORD003', customer: 'Bob Johnson', date: '2024-03-13', amount: '₱11,300', status: 'Pending' }
    ],
    products: [
        { id: 1, name: 'T-Shirt', category: 'Apparel', price: '₱1,500', stock: 100 },
        { id: 2, name: 'Mug', category: 'Accessories', price: '₱850', stock: 50 },
        { id: 3, name: 'Sticker', category: 'Accessories', price: '₱250', stock: 200 }
    ],
    activities: [
        { type: 'user', action: 'New user registered', time: '2 hours ago' },
        { type: 'order', action: 'New order placed', time: '3 hours ago' },
        { type: 'product', action: 'Product stock updated', time: '5 hours ago' }
    ],
    reviews: [
        { reviewer: 'Alice (Sub-Admin)', role: 'Sub-Admin', rating: 5, comment: 'The system is very efficient and easy to use!', date: '2024-03-10' },
        { reviewer: 'Mark (User)', role: 'User', rating: 4, comment: 'Great experience, but could use more features.', date: '2024-03-09' },
        { reviewer: 'Sophia (User)', role: 'User', rating: 5, comment: 'Support is responsive and the dashboard is clear.', date: '2024-03-08' }
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

// Reports: Generate Report functionality
const generateReportBtn = document.querySelector('.generate-report-btn');
const reportOutput = document.querySelector('.report-output');
if (generateReportBtn && reportOutput) {
    generateReportBtn.addEventListener('click', () => {
        // Detailed statistics
        const userCount = sampleData.users.length;
        const activeUsers = sampleData.users.filter(u => u.status === 'Active').length;
        const inactiveUsers = sampleData.users.filter(u => u.status === 'Inactive').length;
        // Orders and products are legacy, but keep for stats
        const orderCount = sampleData.orders.length;
        const completedOrders = sampleData.orders.filter(o => o.status === 'Completed').length;
        const processingOrders = sampleData.orders.filter(o => o.status === 'Processing').length;
        const pendingOrders = sampleData.orders.filter(o => o.status === 'Pending').length;
        const productCount = sampleData.products.length;
        const totalRevenue = sampleData.orders.reduce((sum, order) => {
            const amount = parseFloat(order.amount.replace(/[^\d.]/g, ''));
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        reportOutput.innerHTML = `
            <h3>Detailed Summary Report</h3>
            <ul>
                <li><strong>Total Users:</strong> ${userCount}</li>
                <li><strong>Active Users:</strong> ${activeUsers}</li>
                <li><strong>Inactive Users:</strong> ${inactiveUsers}</li>
                <li><strong>Total Orders:</strong> ${orderCount}</li>
                <li><strong>Completed Orders:</strong> ${completedOrders}</li>
                <li><strong>Processing Orders:</strong> ${processingOrders}</li>
                <li><strong>Pending Orders:</strong> ${pendingOrders}</li>
                <li><strong>Total Products:</strong> ${productCount}</li>
                <li><strong>Total Revenue:</strong> ₱${totalRevenue.toLocaleString()}</li>
            </ul>
        `;
    });
}

// Reviews: Load and display reviews in the Reviews section
function loadReviews() {
    const reviewsList = document.querySelector('.reviews-list');
    if (reviewsList) {
        if (!sampleData.reviews.length) {
            reviewsList.innerHTML = '<p>No reviews available.</p>';
            return;
        }
        reviewsList.innerHTML = sampleData.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="reviewer">${review.reviewer}</span>
                    <span class="role">(${review.role})</span>
                    <span class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                    <span class="date">${review.date}</span>
                </div>
                <div class="review-comment">${review.comment}</div>
            </div>
        `).join('');
    }
}

// Show reviews when Reviews section is shown
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const pageId = link.getAttribute('data-page');
        if (pageId === 'reviews') {
            loadReviews();
        }
    });
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // Clear authentication data
        localStorage.removeItem('superAdminLoggedIn');
        localStorage.removeItem('superAdminUsername');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
});

// Load data into tables
function loadTableData() {
    // Load users
    const usersTable = document.querySelector('#users .data-table tbody');
    if (usersTable) {
        usersTable.innerHTML = sampleData.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>
                    <button class="edit-btn" data-id="${user.id}">Edit</button>
                    <button class="delete-btn" data-id="${user.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Load orders
    const ordersTable = document.querySelector('#orders .data-table tbody');
    if (ordersTable) {
        ordersTable.innerHTML = sampleData.orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${order.amount}</td>
                <td>${order.status}</td>
                <td>
                    <button class="view-btn" data-id="${order.id}">View</button>
                    <button class="update-btn" data-id="${order.id}">Update</button>
                </td>
            </tr>
        `).join('');
    }

    // Load products
    const productsTable = document.querySelector('#products .data-table tbody');
    if (productsTable) {
        productsTable.innerHTML = sampleData.products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="edit-btn" data-id="${product.id}">Edit</button>
                    <button class="delete-btn" data-id="${product.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Load recent activities
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = sampleData.activities.map(activity => `
            <div class="activity-item">
                <i class="fas fa-${activity.type === 'user' ? 'user' : activity.type === 'order' ? 'shopping-cart' : 'box'}"></i>
                <div class="activity-info">
                    <p>${activity.action}</p>
                    <small>${activity.time}</small>
                </div>
            </div>
        `).join('');
    }
}

// Add event listeners for buttons
function addButtonListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            // Add edit functionality
            console.log(`Edit item with ID: ${id}`);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this item?')) {
                // Add delete functionality
                console.log(`Delete item with ID: ${id}`);
            }
        });
    });

    // View buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            // Add view functionality
            console.log(`View item with ID: ${id}`);
        });
    });

    // Update buttons
    document.querySelectorAll('.update-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            // Add update functionality
            console.log(`Update item with ID: ${id}`);
        });
    });
}

// Settings form handling
const settingsForm = document.querySelector('.settings-form');
if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add settings save functionality
        alert('Settings saved successfully!');
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // checkAuth(); // Check authentication before loading dashboard
    loadTableData();
    addButtonListeners();
});

// Add CSS for activity items
const style = document.createElement('style');
style.textContent = `
    .activity-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid var(--border-color);
    }

    .activity-item i {
        font-size: 1.2rem;
        color: var(--secondary-color);
        margin-right: 15px;
    }

    .activity-info p {
        margin: 0;
        font-size: 0.9rem;
    }

    .activity-info small {
        color: #666;
    }

    .edit-btn, .delete-btn, .view-btn, .update-btn {
        padding: 5px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        margin-right: 5px;
    }

    .edit-btn {
        background-color: var(--warning-color);
        color: white;
    }

    .delete-btn {
        background-color: var(--danger-color);
        color: white;
    }

    .view-btn {
        background-color: var(--secondary-color);
        color: white;
    }

    .update-btn {
        background-color: var(--success-color);
        color: white;
    }

    .review-item {
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 15px;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .review-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
    }
    .reviewer {
        font-weight: bold;
    }
    .role {
        color: #888;
        font-size: 0.95em;
    }
    .rating {
        color: #FFD700;
        font-size: 1.1em;
        margin-left: auto;
    }
    .date {
        color: #aaa;
        font-size: 0.9em;
        margin-left: 10px;
    }
    .review-comment {
        font-size: 1em;
        color: #333;
    }
`;
document.head.appendChild(style);

// System Administrator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-links li');
    const contentAreas = document.querySelectorAll('.content-area');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target content
            contentAreas.forEach(area => {
                area.classList.remove('active');
                if (area.id === targetPage) {
                    area.classList.add('active');
                }
            });
        });
    });

    // System Configuration
    const configForms = document.querySelectorAll('.config-form');
    configForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Configuration saved successfully', 'success');
        });
    });

    // Security Settings
    const securityForm = document.querySelector('.security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Security settings updated', 'success');
        });
    }

    // System Settings
    const settingsForms = document.querySelectorAll('.settings-form');
    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Settings saved successfully', 'success');
        });
    });

    // Reports
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const reportType = document.getElementById('reportTypeSelect').value;
            showSampleReport(reportType);
        });
    }

    // Quick Actions
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            handleQuickAction(action);
        });
    });

    // Search Functionality
    const searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.content-area').querySelector('.data-table');
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    });

    // Filter Functionality
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const filterValue = this.value;
            const table = this.closest('.content-area').querySelector('.data-table');
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    if (filterValue === 'all') {
                        row.style.display = '';
                    } else {
                        const cell = row.querySelector('td:nth-child(4)'); // Role column
                        row.style.display = cell.textContent.toLowerCase().includes(filterValue) ? '' : 'none';
                    }
                });
            }
        });
    });
});

// User Management Functions
function editUser(userId) {
    // Implement edit user functionality
    showNotification('Edit user: ' + userId, 'info');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        // Implement delete user functionality
        showNotification('User deleted successfully', 'success');
    }
}

// Report Generation
function generateReport(type) {
    // Implement report generation based on type
    const reportTypes = {
        users: 'User Statistics Report',
        system: 'System Performance Report',
        security: 'Security Audit Report',
        activity: 'Activity Log Report'
    };
    
    showNotification(`Generating ${reportTypes[type]}...`, 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showNotification('Report generated successfully', 'success');
    }, 2000);
}

// Quick Actions Handler
function handleQuickAction(action) {
    switch(action) {
        case 'Add New User':
            // Implement add user functionality
            showNotification('Opening add user form...', 'info');
            break;
        case 'System Settings':
            // Navigate to settings
            document.querySelector('[data-page="settings"]').click();
            break;
        case 'Security Check':
            // Implement security check
            showNotification('Running security check...', 'info');
            setTimeout(() => {
                showNotification('Security check completed', 'success');
            }, 2000);
            break;
        case 'Generate Report':
            // Navigate to reports
            document.querySelector('[data-page="reports"]').click();
            break;
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('fade');
    }, 3000);
    
    // Remove notification
    setTimeout(() => {
        notification.remove();
    }, 3500);
}

// System Status Check
function checkSystemStatus() {
    const statusCards = document.querySelectorAll('.status-card');
    statusCards.forEach(card => {
        const indicator = card.querySelector('.status-indicator');
        // Simulate status check
        const isOnline = Math.random() > 0.1; // 90% chance of being online
        indicator.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
        card.querySelector('p').textContent = isOnline ? 
            'All systems operational' : 
            'System check required';
    });
}

// Initialize system status check
setInterval(checkSystemStatus, 30000); // Check every 30 seconds
checkSystemStatus(); // Initial check

function showSampleReport(type) {
    const reportSummary = document.getElementById('reportSummary');
    const reportContent = document.getElementById('reportContent');
    let summaryHtml = '';
    let contentHtml = '';
    if (type === 'users') {
        summaryHtml = `
            <div class="stats-container">
                <div class="stat-card"><i class="fas fa-users"></i><div class="stat-info"><h3>Total Users</h3><p>1,234</p></div></div>
                <div class="stat-card"><i class="fas fa-user-shield"></i><div class="stat-info"><h3>Sub-Admins</h3><p>45</p></div></div>
                <div class="stat-card"><i class="fas fa-user-check"></i><div class="stat-info"><h3>Customers</h3><p>1,189</p></div></div>
                <div class="stat-card"><i class="fas fa-user-clock"></i><div class="stat-info"><h3>Inactive</h3><p>134</p></div></div>
            </div>
        `;
        contentHtml = `
            <h3>User Details</h3>
            <table class="data-table">
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                    <tr><td>1</td><td>John Doe</td><td>john@example.com</td><td><span class="status-badge completed">Sub-Admin</span></td><td><span class="status-badge completed">Active</span></td></tr>
                    <tr><td>2</td><td>Jane Smith</td><td>jane@example.com</td><td><span class="status-badge">Customer</span></td><td><span class="status-badge completed">Active</span></td></tr>
                    <tr><td>3</td><td>Bob Johnson</td><td>bob@example.com</td><td><span class="status-badge completed">Sub-Admin</span></td><td><span class="status-badge pending">Inactive</span></td></tr>
                </tbody>
            </table>
        `;
    } else if (type === 'system') {
        summaryHtml = `
            <div class="stats-container">
                <div class="stat-card"><i class="fas fa-server"></i><div class="stat-info"><h3>Uptime</h3><p>99.98%</p></div></div>
                <div class="stat-card"><i class="fas fa-tachometer-alt"></i><div class="stat-info"><h3>Avg. Response</h3><p>120ms</p></div></div>
                <div class="stat-card"><i class="fas fa-database"></i><div class="stat-info"><h3>DB Health</h3><p><span class="status-badge completed">Good</span></p></div></div>
                <div class="stat-card"><i class="fas fa-cloud-upload-alt"></i><div class="stat-info"><h3>Last Backup</h3><p>2h ago</p></div></div>
            </div>
        `;
        contentHtml = `
            <h3>System Performance Details</h3>
            <table class="data-table">
                <thead><tr><th>Metric</th><th>Value</th></tr></thead>
                <tbody>
                    <tr><td>System Uptime</td><td>99.98%</td></tr>
                    <tr><td>Average Response Time</td><td>120ms</td></tr>
                    <tr><td>Database Health</td><td><span class="status-badge completed">Good</span></td></tr>
                    <tr><td>Last Backup</td><td>2 hours ago</td></tr>
                </tbody>
            </table>
        `;
    } else if (type === 'security') {
        summaryHtml = `
            <div class="stats-container">
                <div class="stat-card"><i class="fas fa-shield-alt"></i><div class="stat-info"><h3>2FA Enabled</h3><p>100%</p></div></div>
                <div class="stat-card"><i class="fas fa-user-lock"></i><div class="stat-info"><h3>Accounts Locked</h3><p>1</p></div></div>
                <div class="stat-card"><i class="fas fa-exclamation-triangle"></i><div class="stat-info"><h3>Failed Logins (24h)</h3><p>3</p></div></div>
                <div class="stat-card"><i class="fas fa-key"></i><div class="stat-info"><h3>Last Password Change</h3><p>5d ago</p></div></div>
            </div>
        `;
        contentHtml = `
            <h3>Security Audit Details</h3>
            <table class="data-table">
                <thead><tr><th>Event</th><th>Count</th></tr></thead>
                <tbody>
                    <tr><td>Failed Login Attempts (24h)</td><td>3</td></tr>
                    <tr><td>Accounts Locked</td><td>1</td></tr>
                    <tr><td>Last Password Change</td><td>5 days ago</td></tr>
                    <tr><td>2FA Enabled</td><td>100%</td></tr>
                </tbody>
            </table>
        `;
    } else if (type === 'activity') {
        summaryHtml = `
            <div class="stats-container">
                <div class="stat-card"><i class="fas fa-user-plus"></i><div class="stat-info"><h3>New Users</h3><p>8</p></div></div>
                <div class="stat-card"><i class="fas fa-shopping-cart"></i><div class="stat-info"><h3>Orders Placed</h3><p>27</p></div></div>
                <div class="stat-card"><i class="fas fa-box"></i><div class="stat-info"><h3>Products Updated</h3><p>4</p></div></div>
                <div class="stat-card"><i class="fas fa-cogs"></i><div class="stat-info"><h3>System Changes</h3><p>2</p></div></div>
            </div>
        `;
        contentHtml = `
            <h3>Recent Activity Logs</h3>
            <ul class="activity-list" style="margin:0;padding:0;list-style:none;">
                <li class="activity-item"><i class="fas fa-user-plus"></i> <span>New user registered</span> <span style="float:right;color:#888;">2 hours ago</span></li>
                <li class="activity-item"><i class="fas fa-shopping-cart"></i> <span>Order placed</span> <span style="float:right;color:#888;">3 hours ago</span></li>
                <li class="activity-item"><i class="fas fa-box"></i> <span>Product stock updated</span> <span style="float:right;color:#888;">5 hours ago</span></li>
                <li class="activity-item"><i class="fas fa-cogs"></i> <span>System configuration changed</span> <span style="float:right;color:#888;">6 hours ago</span></li>
            </ul>
        `;
    }
    reportSummary.innerHTML = summaryHtml;
    reportContent.innerHTML = contentHtml;
} 