// Authentication check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('superAdminLoggedIn');
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
    checkAuth(); // Check authentication before loading dashboard
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
`;
document.head.appendChild(style); 