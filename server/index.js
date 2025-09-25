const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const DB_PATH = path.join(__dirname, 'db.json');
<<<<<<< HEAD

app.use(express.json());
app.use(cors());


function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ products: [], transactions: [] }, null, 2));
  }
=======
app.use(express.json());
app.use(cors());

function readDB() {
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}


<<<<<<< HEAD

=======
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
app.get('/products', (req, res) => {
  const db = readDB();
  res.json(db.products || []);
});


app.post('/products', (req, res) => {
  const db = readDB();
<<<<<<< HEAD
  const product = { id: uuidv4(), quantity: 0, ...req.body };
=======
  const product = { id: uuidv4(), ...req.body };
  if (!db.products) db.products = [];
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
  db.products.push(product);
  writeDB(db);
  res.status(201).json(product);
});


app.put('/products/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = (db.products || []).findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
<<<<<<< HEAD

=======
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
  db.products[idx] = { ...db.products[idx], ...req.body };
  writeDB(db);
  res.json(db.products[idx]);
});


app.delete('/products/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.products = (db.products || []).filter(p => p.id !== id);
  writeDB(db);
  res.json({ message: 'Deleted' });
});

<<<<<<< HEAD

=======
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
app.post('/products/:id/transaction', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const { type, amount, note } = req.body;
<<<<<<< HEAD

=======
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
  const product = (db.products || []).find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const amt = Number(amount);
  if (Number.isNaN(amt) || amt <= 0) return res.status(400).json({ message: 'Invalid amount' });

  if (!db.transactions) db.transactions = [];
<<<<<<< HEAD

=======
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
  const transaction = {
    id: uuidv4(),
    productId: id,
    type,
    amount: amt,
    date: new Date().toISOString(),
    note: note || ''
  };

  if (type === 'add') {
    product.quantity = Number(product.quantity || 0) + amt;
  } else if (type === 'deduct') {
    product.quantity = Math.max(0, Number(product.quantity || 0) - amt);
  } else {
<<<<<<< HEAD
    return res.status(400).json({ message: 'Invalid transaction type' });
=======
    return res.status(400).json({ message: 'Invalid type' });
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
  }

  db.transactions.push(transaction);
  writeDB(db);
<<<<<<< HEAD

=======
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
  res.json({ product, transaction });
});


app.get('/transactions', (req, res) => {
<<<<<<< HEAD
=======
  console.log('GET /transactions called');
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
  const db = readDB();
  res.json(db.transactions || []);
});

<<<<<<< HEAD

=======
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
app.get('/reports/low-stock', (req, res) => {
  const threshold = Number(req.query.threshold || 5);
  const db = readDB();
  const low = (db.products || []).filter(p => Number(p.quantity || 0) <= threshold);
  res.json(low);
});


const PORT = process.env.PORT || 3001;
<<<<<<< HEAD
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
=======
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
>>>>>>> 1dbbea86 (Initial commit with backend router.js and index.js)
