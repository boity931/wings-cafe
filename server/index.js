const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./router');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable JSON parsing and CORS
app.use(express.json());
app.use(cors({ origin: '*' }));

// API routes
app.use('/api', router);

// Serve React build from server/build
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// Catch-all for React Router (must come after API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving React app:', err);
      res.status(500).send('React app not found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


