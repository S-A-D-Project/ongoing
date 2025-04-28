document.addEventListener('DOMContentLoaded', function() {
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

    // Load cart data
    const cartData = localStorage.getItem('cart');
    if (!cartData) {
        showEmptyCart();
        return;
    }

    const cart = JSON.parse(cartData);
    if (!Array.isArray(cart) || cart.length === 0) {
        showEmptyCart();
        return;
    }

    // Populate order summary
    populateOrderSummary(cart);

    // Load user data if logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('fullName').value = user.fullName || '';
        document.getElementById('phone').value = user.phoneNumber || '';
        document.getElementById('address').value = user.address || '';
    }

    // Handle form submission
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', handleCheckout);
});

function showEmptyCart() {
    const checkoutGrid = document.querySelector('.checkout-grid');
    checkoutGrid.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <div class="empty-cart-actions">
                <a href="services.html" class="btn btn-primary">Browse Services</a>
                <a href="cart.html" class="btn btn-outline">View Cart</a>
            </div>
        </div>
    `;
}

function populateOrderSummary(cart) {
    const summaryItems = document.querySelector('.summary-items');
    const subtotalAmount = document.querySelector('.subtotal-amount');
    const deliveryFee = document.querySelector('.delivery-fee');
    const totalAmount = document.querySelector('.total-amount');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalItems = document.querySelector('.cart-total-items');

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 100; // Fixed delivery fee
    const total = subtotal + delivery;

    // Update cart indicators
    if (cartCount) cartCount.textContent = cart.length;
    if (cartTotalItems) cartTotalItems.textContent = `${cart.length} items`;

    // Update summary items
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="summary-item-details">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="summary-item-price">
                ₱${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');

    // Update totals
    subtotalAmount.textContent = `₱${subtotal.toFixed(2)}`;
    deliveryFee.textContent = `₱${delivery.toFixed(2)}`;
    totalAmount.textContent = `₱${total.toFixed(2)}`;
}

async function handleCheckout(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Validate form data
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
        displayErrors(errors);
        return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Order...';
    showNotification('Processing your order...', 'info');

    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const paymentMethod = formData.get('paymentMethod');
        
        // Map payment method to server format
        const paymentMethodMap = {
            'cod': 'cash_on_delivery',
            'gcash': 'gcash',
            'bank': 'bank_transfer'
        };

        const orderData = {
            items: cart.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            customer: {
                fullName: formData.get('fullName'),
                phoneNumber: formData.get('phone'),
                deliveryAddress: formData.get('address'),
                deliveryInstructions: formData.get('instructions')
            },
            payment: {
                method: paymentMethodMap[paymentMethod],
                status: 'pending'
            },
            totalAmount: calculateTotal(cart),
            deliveryFee: 100
        };

        // Get auth token
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please login to place an order');
        }

        // Send order to server
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to place order');
        }

        // Clear cart
        localStorage.removeItem('cart');
        
        // Store order ID for tracking
        localStorage.setItem('lastOrderId', data.orderId);
        
        showNotification('Order placed successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'track-order.html';
        }, 2000);
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification(error.message, 'error');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Place Order';
    }
}

function validateForm(formData) {
    const errors = {};

    // Full Name validation
    if (!formData.get('fullName').trim()) {
        errors.fullName = 'Full name is required';
    }

    // Phone validation
    const phone = formData.get('phone');
    if (!phone) {
        errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,11}$/.test(phone)) {
        errors.phone = 'Please enter a valid phone number';
    }

    // Address validation
    if (!formData.get('address').trim()) {
        errors.address = 'Delivery address is required';
    }

    // Payment method validation
    if (!formData.get('paymentMethod')) {
        errors.paymentMethod = 'Please select a payment method';
    }

    // Terms validation
    if (!formData.get('terms')) {
        errors.terms = 'Please agree to the Terms of Service and Privacy Policy';
    }

    return errors;
}

function displayErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));

    // Display new errors
    Object.entries(errors).forEach(([field, message]) => {
        const formGroup = document.querySelector(`[name="${field}"]`).closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = message;
            
            formGroup.appendChild(errorMessage);
        }
    });
}

function calculateTotal(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 100; // Fixed delivery fee
    return subtotal + delivery;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add show class after a small delay to trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Payment Processing
async function processPayment(paymentMethod, amount) {
    try {
        const response = await fetch('/api/payment/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ amount, paymentMethod })
        });

        const paymentData = await response.json();

        switch (paymentMethod) {
            case 'gcash':
                window.location.href = paymentData.redirectUrl;
                break;
            case 'card':
                // Initialize Stripe Elements
                const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
                const elements = stripe.elements();
                const card = elements.create('card');
                card.mount('#card-element');

                const { error, paymentIntent } = await stripe.confirmCardPayment(
                    paymentData.clientSecret,
                    {
                        payment_method: {
                            card: card,
                            billing_details: {
                                name: document.getElementById('fullName').value
                            }
                        }
                    }
                );

                if (error) {
                    throw new Error(error.message);
                }

                return paymentIntent.id;
            case 'bank':
                // Display bank transfer details
                displayBankDetails(paymentData.bankDetails);
                return paymentData.paymentId;
            default:
                throw new Error('Unsupported payment method');
        }
    } catch (error) {
        console.error('Payment processing failed:', error);
        throw error;
    }
}

function displayBankDetails(bankDetails) {
    const bankDetailsContainer = document.createElement('div');
    bankDetailsContainer.className = 'bank-details';
    bankDetailsContainer.innerHTML = `
        <h3>Bank Transfer Details</h3>
        <p>Bank: ${bankDetails.bank_name}</p>
        <p>Account Number: ${bankDetails.account_number}</p>
        <p>Account Name: ${bankDetails.account_name}</p>
        <p>Amount: ₱${bankDetails.amount / 100}</p>
        <p>Reference Number: ${bankDetails.reference_number}</p>
    `;
    document.querySelector('.checkout-form').appendChild(bankDetailsContainer);
}

// Update form submission handler
document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const totalAmount = parseFloat(document.querySelector('.total-amount').textContent.replace('₱', ''));

    try {
        if (paymentMethod !== 'cod') {
            const paymentId = await processPayment(paymentMethod, totalAmount);
            
            // Update order with payment details
            await fetch(`/api/orders/${currentOrderId}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    paymentId,
                    paymentMethod,
                    status: 'pending'
                })
            });
        }

        // Submit the order
        const formData = new FormData(e.target);
        const orderData = {
            items: getCartItems(),
            shipping_address: formData.get('address'),
            payment_method: paymentMethod,
            delivery_instructions: formData.get('instructions')
        };

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        
        if (result.orderId) {
            // Clear cart and redirect to order confirmation
            clearCart();
            window.location.href = `/order-confirmation.html?orderId=${result.orderId}`;
        }
    } catch (error) {
        console.error('Order submission failed:', error);
        alert('Failed to process your order. Please try again.');
    }
}); 