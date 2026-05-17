const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const goalRoutes = require('./routes/goal.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const escalationRoutes = require('./routes/escalation.routes');
const escalationService = require('./services/escalationService');

const app = express();
connectDB();
escalationService.initializeDefaultRules();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/escalations', escalationRoutes);
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// Shared Error Pipeline Fallback
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || 'Fatal Internal Server Exception Instance' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Performance Server Running dynamically across port:${PORT}`));
}
module.exports = app;