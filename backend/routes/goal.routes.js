const express = require('express');
const router = express.Router();
const { createGoal, submitGoalSheet, updateAchievement, getMyGoals, getTeamGoals, updateGoalStatus } = require('../controllers/goal.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/my-goals', getMyGoals);
router.get('/team-goals', getTeamGoals);
router.put('/:id/status', updateGoalStatus);
router.post('/', createGoal);
router.post('/submit', submitGoalSheet);
router.put('/:id/achievement', updateAchievement);

module.exports = router;
