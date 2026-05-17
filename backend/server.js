require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const goalRoutes = require('./routes/goal.routes');

const app = express();
connectDB();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);

// Shared Error Pipeline Fallback
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || 'Fatal Internal Server Exception Instance' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Performance Server Running dynamically across port:${PORT}`));
}
module.exports = app;