require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./config/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymongo = require('paymongo')(process.env.PAYMONGO_SECRET_KEY);
const paymentService = require('./server/paymentService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await db.execute({
      sql: 'INSERT INTO users (id, email, password, name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      args: [userId, email, hashedPassword, name, phone, address]
    });

    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT id, email, name, phone, address FROM users WHERE id = ?',
      args: [req.user.id]
    });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create Customized Order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const {
      product_id,
      paper_type,
      paper_size,
      quantity,
      color_mode,
      binding_type,
      special_instructions,
      shipping_address,
      payment_method
    } = req.body;

    // Get product base price
    const productResult = await db.execute({
      sql: 'SELECT base_price FROM products WHERE id = ?',
      args: [product_id]
    });

    if (!productResult.rows[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const basePrice = productResult.rows[0].base_price;
    
    // Calculate total amount based on customization
    let totalAmount = basePrice * quantity;
    
    // Apply price multipliers based on customization
    if (color_mode === 'color') {
      totalAmount *= 1.5; // 50% more for color printing
    }
    
    if (paper_type === 'premium') {
      totalAmount *= 1.3; // 30% more for premium paper
    }
    
    if (binding_type === 'hardcover') {
      totalAmount *= 1.4; // 40% more for hardcover binding
    }

    const orderId = uuidv4();
    const orderNumber = `ORD-${Date.now()}`;
    
    // Create order with customization details
    await db.execute({
      sql: `INSERT INTO orders (
        id, user_id, order_number, status, total_amount, payment_method, 
        shipping_address, customization_details, paper_type, paper_size, 
        quantity, color_mode, binding_type, special_instructions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        orderId,
        req.user.id,
        orderNumber,
        'pending',
        totalAmount,
        payment_method,
        shipping_address,
        JSON.stringify(req.body),
        paper_type,
        paper_size,
        quantity,
        color_mode,
        binding_type,
        special_instructions
      ]
    });

    res.status(201).json({ 
      orderId, 
      orderNumber,
      totalAmount,
      customization: {
        paper_type,
        paper_size,
        quantity,
        color_mode,
        binding_type,
        special_instructions
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Order Status
app.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    const result = await db.execute({
      sql: `
        SELECT o.*, p.name as product_name, p.base_price
        FROM orders o
        JOIN products p ON o.product_id = p.id
        WHERE o.order_number = ?
      `,
      args: [req.params.orderNumber]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = result.rows[0];
    res.json({
      order_number: order.order_number,
      status: order.status,
      total_amount: order.total_amount,
      payment_method: order.payment_method,
      shipping_address: order.shipping_address,
      created_at: order.created_at,
      customization: {
        paper_type: order.paper_type,
        paper_size: order.paper_size,
        quantity: order.quantity,
        color_mode: order.color_mode,
        binding_type: order.binding_type,
        special_instructions: order.special_instructions
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Products
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM products';
    let args = [];

    if (category) {
      sql += ' WHERE category = ?';
      args.push(category);
    }

    const result = await db.execute({ sql, args });
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create Payment Intent
app.post('/api/payment/create', authenticateToken, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const paymentIntent = await paymentService.createPaymentIntent(amount, 'php', paymentMethod);
    res.json(paymentIntent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify Payment
app.post('/api/payment/verify', authenticateToken, async (req, res) => {
  try {
    const { paymentId, paymentMethod } = req.body;
    const isVerified = await paymentService.verifyPayment(paymentId, paymentMethod);
    res.json({ verified: isVerified });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Order with Payment
app.post('/api/orders/:orderId/payment', authenticateToken, async (req, res) => {
  try {
    const { paymentId, paymentMethod, status } = req.body;
    const orderId = req.params.orderId;

    await db.execute({
      sql: 'UPDATE orders SET payment_id = ?, payment_method = ?, payment_status = ? WHERE id = ? AND user_id = ?',
      args: [paymentId, paymentMethod, status, orderId, req.user.id]
    });

    res.json({ message: 'Payment status updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Payment configuration
const paymentConfig = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  },
  paymongo: {
    secretKey: process.env.PAYMONGO_SECRET_KEY,
    publishableKey: process.env.PAYMONGO_PUBLISHABLE_KEY
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 