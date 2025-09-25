const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./router');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(cors({ origin: '*' }));  // Allow all for now; tighten later

// API routes
app.use('/api', router);

// Serve static React build from server/build
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all for React (after API/static)
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'build', 'index.html');
  console.log(`Serving: ${req.url}`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Serve error:', err);
      res.status(404).send('Not found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

