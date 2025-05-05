// Order Management JavaScript

// DOM Elements
const viewOrderModal = document.getElementById('viewOrderModal');
const ordersTableBody = document.getElementById('ordersTableBody');
const orderSearch = document.getElementById('orderSearch');
const orderFilter = document.getElementById('orderFilter');

// State
let orders = [];
let products = [];
let currentOrder = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadOrders();
    setupEventListeners();
});

function setupEventListeners() {
    // Modal Controls
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            hideModal(viewOrderModal);
        });
    });

    // Search and Filter
    orderSearch.addEventListener('input', filterOrders);
    orderFilter.addEventListener('change', filterOrders);
}

// Load Data
async function loadProducts() {
    try {
        // In a real application, this would be an API call
        products = [
            { id: 1, name: 'Tarpaulin', basePrice: 100, customizations: ['size', 'color', 'text'] },
            { id: 2, name: 'T-Shirt', basePrice: 200, customizations: ['size', 'color', 'text', 'image'] },
            { id: 3, name: 'Mug', basePrice: 150, customizations: ['color', 'text', 'image'] }
        ];
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Error loading products', 'error');
    }
}

async function loadOrders() {
    try {
        // In a real application, this would be an API call
        orders = [
            {
                id: 'ORD-001',
                customer: { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
                product: { id: 1, name: 'Tarpaulin' },
                customizations: { size: 'Large', color: 'Blue', text: 'Welcome' },
                quantity: 2,
                totalAmount: 200,
                status: 'pending',
                deliveryMethod: 'pickup',
                specialInstructions: 'Handle with care'
            }
        ];
        renderOrders();
        updateOrderStats();
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('Error loading orders', 'error');
    }
}

// UI Updates
function renderOrders() {
    ordersTableBody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer.name}</td>
            <td>${order.product.name}</td>
            <td>${formatCustomizations(order.customizations)}</td>
            <td>${order.quantity}</td>
            <td>₱${order.totalAmount.toFixed(2)}</td>
            <td><span class="status-badge ${order.status}">${formatStatus(order.status)}</span></td>
            <td class="actions">
                <button class="action-btn view-btn" onclick="viewOrder('${order.id}')" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteOrder('${order.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateOrderStats() {
    const stats = {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        ready: orders.filter(o => o.status === 'ready').length,
        completed: orders.filter(o => o.status === 'completed').length
    };

    document.getElementById('pendingOrdersCount').textContent = stats.pending;
    document.getElementById('processingOrdersCount').textContent = stats.processing;
    document.getElementById('readyOrdersCount').textContent = stats.ready;
    document.getElementById('completedOrdersCount').textContent = stats.completed;
}

// Helper Functions
function showModal(modal) {
    modal.style.display = 'flex';
}

function hideModal(modal) {
    modal.style.display = 'none';
}

function formatCustomizations(customizations) {
    return Object.entries(customizations)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
}

function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function filterOrders() {
    const searchTerm = orderSearch.value.toLowerCase();
    const statusFilter = orderFilter.value;

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.name.toLowerCase().includes(searchTerm) ||
            order.product.name.toLowerCase().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    renderOrders(filteredOrders);
}

function showNotification(message, type = 'info') {
    // Implement notification system
    console.log(`${type}: ${message}`);
}

// Order Actions
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const orderDetails = document.getElementById('orderDetails');
    orderDetails.innerHTML = `
        <div class="order-details">
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Status:</strong> ${formatStatus(order.status)}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>

            <h3>Product Information</h3>
            <p><strong>Product:</strong> ${order.product.name}</p>
            <p><strong>Quantity:</strong> ${order.quantity}</p>
            <p><strong>Customizations:</strong> ${formatCustomizations(order.customizations)}</p>
            <p><strong>Total Amount:</strong> ₱${order.totalAmount.toFixed(2)}</p>

            <h3>Delivery Information</h3>
            <p><strong>Method:</strong> ${order.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Delivery'}</p>
            ${order.deliveryMethod === 'delivery' ? `<p><strong>Address:</strong> ${order.deliveryAddress}</p>` : ''}

            ${order.specialInstructions ? `
                <h3>Special Instructions</h3>
                <p>${order.specialInstructions}</p>
            ` : ''}
        </div>
    `;

    showModal(viewOrderModal);
}

function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        orders = orders.filter(o => o.id !== orderId);
        renderOrders();
        updateOrderStats();
        showNotification('Order deleted successfully', 'success');
    }
} 