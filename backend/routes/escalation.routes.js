const express = require('express');
const router = express.Router();
const { getRules, updateRule, getLogs, triggerScanner } = require('../controllers/escalation.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes with JWT middleware
router.use(protect);

router.get('/rules', getRules);
router.put('/rules/:id', updateRule);
router.get('/logs', getLogs);
router.post('/scan', triggerScanner);

module.exports = router;
