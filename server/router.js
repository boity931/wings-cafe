const express = require('express');
const router = express.Router();

// In-memory data (replace with DB later)
let products = [
  { id: 1, name: 'Spicy Wings', price: 12.99, quantity: 50 },
  { id: 2, name: 'Classic Wings', price: 10.99, quantity: 30 },
  { id: 3, name: 'Fries', price: 4.99, quantity: 100 },
  { id: 4, name: 'Soda', price: 2.99, quantity: 200 }
];

let transactions = [
  { id: 1, item: 'Spicy Wings', quantity: 2, total: 25.98, date: '2025-09-25' },
  { id: 2, item: 'Fries', quantity: 1, total: 4.99, date: '2025-09-25' }
];

// GET /api/products
router.get('/products', (req, res) => res.json(products));

// POST /api/products/:id (update quantity)
router.post('/products/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const product = products.find(p => p.id === parseInt(id));
  if (product) {
    product.quantity = quantity;
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// GET /api/transactions
router.get('/transactions', (req, res) => res.json(transactions));

// POST /api/transactions (add sale)
router.post('/transactions', (req, res) => {
  const newTrans = { id: transactions.length + 1, ...req.body, date: new Date().toISOString().split('T')[0] };
  transactions.push(newTrans);
  // Reduce stock
  const product = products.find(p => p.name === req.body.item);
  if (product) product.quantity -= req.body.quantity;
  res.json(newTrans);
});

module.exports = router;
