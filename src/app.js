const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const path    = require('path');

const app = express();


// 🔹 Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 🔹 API Routes
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/moods',  require('./routes/moods'));
app.use('/api/tracks', require('./routes/tracks'));

// 🔹 Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 🔹 Serve Frontend (IMPORTANT FIX)
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 🔹 Handle unknown routes (optional but clean)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;