require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const registerRoutes = require('./routes/register');
const diceRoutes = require('./routes/dice');

app.use('/api/register', registerRoutes);
app.use('/api/dice', diceRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the ViceOfDice API!');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
