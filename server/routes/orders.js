const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        const { items, customer, payment } = req.body;

        // Create new order
        const order = new Order({
            user: req.user.userId,
            items,
            customer,
            payment,
            status: 'pending',
            trackingNumber: generateTrackingNumber()
        });

        // Save order to database
        await order.save();

        // Return success response
        res.status(201).json({
            message: 'Order created successfully',
            orderId: order._id,
            trackingNumber: order.trackingNumber
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server error during order creation' });
    }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId
        }).select('-__v');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error fetching order' });
    }
});

// Track order
router.get('/track/:trackingNumber', async (req, res) => {
    try {
        const order = await Order.findOne({
            trackingNumber: req.params.trackingNumber
        }).select('-__v');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({
            status: order.status,
            trackingNumber: order.trackingNumber,
            estimatedDelivery: order.estimatedDelivery
        });
    } catch (error) {
        console.error('Track order error:', error);
        res.status(500).json({ message: 'Server error tracking order' });
    }
});

// Generate unique tracking number
function generateTrackingNumber() {
    const prefix = 'OPS';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

module.exports = router; 