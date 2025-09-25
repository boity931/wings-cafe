
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

// Load db.json
const dbPath = path.join(__dirname, 'db.json');
let db = { products: [], transactions: [] };
try {
  db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
} catch (err) {
  console.error('Error loading db.json:', err.message);
  db = {
    products: [
      { id: 1, name: 'Spicy Wings', price: 12.99, quantity: 50 },
      { id: 2, name: 'Classic Wings', price: 10.99, quantity: 30 },
      { id: 3, name: 'Fries', price: 4.99, quantity: 100 },
      { id: 4, name: 'Soda', price: 2.99, quantity: 200 }
    ],
    transactions: [
      { id: 1, item: 'Spicy Wings', quantity: 2, total: 25.98, date: '2025-09-25' },
      { id: 2, item: 'Fries', quantity: 1, total: 4.99, date: '2025-09-25' }
    ]
  };
}

// API routes
app.get('/api/products', (req, res) => res.json(db.products));
app.get('/api/transactions', (req, res) => res.json(db.transactions));

app.post('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = db.products.find(p => p.id === id);
  if (product && req.body.quantity !== undefined) {
    product.quantity = req.body.quantity;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/api/transactions', (req, res) => {
  const newTrans = { id: (db.transactions.length || 0) + 1, ...req.body, date: new Date().toISOString().split('T')[0] };
  db.transactions.push(newTrans);
  const product = db.products.find(p => p.name === req.body.item);
  if (product) product.quantity -= req.body.quantity;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json(newTrans);
});

// Serve React build
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all for React Router
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'build', 'index.html');
  console.log(`Serving: ${req.url} -> ${filePath}`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Serve error:', err.message);
      res.status(404).send('Error: Build folder missing or inaccessible');
    }
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));


