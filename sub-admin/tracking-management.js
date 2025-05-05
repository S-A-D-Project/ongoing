class TrackingManagement {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.currentOrder = null;
        this.initializeElements();
        this.initializeEventListeners();
        this.renderOrders();
    }

    initializeElements() {
        this.ordersGrid = document.getElementById('ordersGrid');
        this.statusModal = document.getElementById('statusModal');
        this.statusForm = document.getElementById('statusForm');
        this.searchOrder = document.getElementById('searchOrder');
        this.searchBtn = document.getElementById('searchBtn');
        this.statusFilter = document.getElementById('statusFilter');
        this.dateFilter = document.getElementById('dateFilter');
    }

    initializeEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchOrders());
        this.searchOrder.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchOrders();
        });
        this.statusFilter.addEventListener('change', () => this.filterOrders());
        this.dateFilter.addEventListener('change', () => this.filterOrders());
        this.statusForm.addEventListener('submit', (e) => this.handleSubmit(e));
        document.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
    }

    searchOrders() {
        const searchTerm = this.searchOrder.value.trim();
        if (!searchTerm) return;

        const order = this.orders.find(o => o.orderNumber === searchTerm);
        if (order) {
            this.openStatusModal(order);
        } else {
            alert('Order not found');
        }
    }

    filterOrders() {
        const status = this.statusFilter.value;
        const date = this.dateFilter.value;
        
        let filteredOrders = this.orders;
        
        if (status) {
            filteredOrders = filteredOrders.filter(order => order.status === status);
        }
        
        if (date) {
            const today = new Date();
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.date);
                switch (date) {
                    case 'today':
                        return orderDate.toDateString() === today.toDateString();
                    case 'week':
                        const weekStart = new Date(today);
                        weekStart.setDate(today.getDate() - today.getDay());
                        return orderDate >= weekStart;
                    case 'month':
                        return orderDate.getMonth() === today.getMonth() && 
                               orderDate.getFullYear() === today.getFullYear();
                    default:
                        return true;
                }
            });
        }
        
        this.renderOrders(filteredOrders);
    }

    openStatusModal(order) {
        this.currentOrder = order;
        this.statusModal.style.display = 'block';
        
        document.getElementById('orderNumber').value = order.orderNumber;
        document.getElementById('currentStatus').value = this.formatStatus(order.status);
        document.getElementById('newStatus').value = order.status;
        document.getElementById('statusNotes').value = '';
    }

    closeModal() {
        this.statusModal.style.display = 'none';
        this.currentOrder = null;
        this.statusForm.reset();
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const newStatus = document.getElementById('newStatus').value;
        const notes = document.getElementById('statusNotes').value;
        
        const statusUpdate = {
            date: new Date().toISOString(),
            status: newStatus,
            notes: notes
        };
        
        const orderIndex = this.orders.findIndex(o => o.orderNumber === this.currentOrder.orderNumber);
        if (orderIndex !== -1) {
            if (!this.orders[orderIndex].statusHistory) {
                this.orders[orderIndex].statusHistory = [];
            }
            this.orders[orderIndex].statusHistory.push(statusUpdate);
            this.orders[orderIndex].status = newStatus;
            
            localStorage.setItem('orders', JSON.stringify(this.orders));
            this.renderOrders();
            this.closeModal();
            
            // Update the track-order.html page if it's open
            this.updateTrackOrderPage(this.currentOrder.orderNumber);
        }
    }

    updateTrackOrderPage(orderNumber) {
        // This function would typically make an API call to update the server
        // For now, we'll just update localStorage which will be reflected when the user refreshes
        const trackOrderData = JSON.parse(localStorage.getItem('trackOrderData')) || {};
        const order = this.orders.find(o => o.orderNumber === orderNumber);
        
        if (order) {
            trackOrderData[orderNumber] = {
                status: order.status,
                statusHistory: order.statusHistory
            };
            localStorage.setItem('trackOrderData', JSON.stringify(trackOrderData));
        }
    }

    formatStatus(status) {
        const statusMap = {
            'pending': 'Pending',
            'processing': 'Processing',
            'ready': 'Ready for Pickup',
            'completed': 'Completed'
        };
        return statusMap[status] || status;
    }

    renderOrders(orders = this.orders) {
        this.ordersGrid.innerHTML = '';
        
        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.innerHTML = `
                <div class="order-header">
                    <h3>Order #${order.orderNumber}</h3>
                    <span class="status-badge ${order.status}">${this.formatStatus(order.status)}</span>
                </div>
                <div class="order-details">
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Customer:</strong> ${order.customerName}</p>
                    <p><strong>Total:</strong> ₱${order.total.toFixed(2)}</p>
                </div>
                <div class="order-actions">
                    <button class="btn btn-primary update-status" data-id="${order.orderNumber}">
                        Update Status
                    </button>
                    <button class="btn btn-outline view-details" data-id="${order.orderNumber}">
                        View Details
                    </button>
                </div>
            `;

            orderCard.querySelector('.update-status').addEventListener('click', () => {
                this.openStatusModal(order);
            });

            orderCard.querySelector('.view-details').addEventListener('click', () => {
                // This would typically open a detailed view modal
                console.log('View details for order:', order.orderNumber);
            });

            this.ordersGrid.appendChild(orderCard);
        });
    }
}

// Initialize tracking management
document.addEventListener('DOMContentLoaded', () => {
    new TrackingManagement();
}); 