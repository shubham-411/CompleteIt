const express = require('express');
const router = express.Router();
const { getDepartmentHeatmap, getGoalDistribution, getQoQTrends, getManagerEffectiveness } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes with JWT middleware
router.use(protect);

router.get('/heatmap', getDepartmentHeatmap);
router.get('/distribution', getGoalDistribution);
router.get('/trends', getQoQTrends);
router.get('/manager-effectiveness', getManagerEffectiveness);

module.exports = router;
