const Goal = require('../models/Goal');
const AuditLog = require('../models/AuditLog');
const teamsService = require('../services/teams.service');

// Progression Calculation Engine Helper
exports.calculateProgress = (uom, target, achievement) => {
  if (!target || target === 0) return 0;
  switch (uom) {
    case 'Numeric':
    case 'Percentage':
      return Math.min(Math.round((achievement / target) * 100), 100);
    case 'Zero-based':
      return achievement === 0 ? 100 : 0;
    case 'Timeline':
      return achievement <= target ? 100 : 0; // Target maps to timestamp representation integer
    default:
      return 0;
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { title, description, thrustArea, uom, target, weightage } = req.body;

    const count = await Goal.countDocuments({ employeeId: req.user.id, status: { $ne: 'Rejected' } });
    if (count >= 8) return res.status(400).json({ message: 'Maximum limit of 8 goals reached' });

    const goal = await Goal.create({
      employeeId: req.user.id,
      title, description, thrustArea, uom, target, weightage
    });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitGoalSheet = async (req, res) => {
  try {
    const goals = await Goal.find({ employeeId: req.user.id, status: 'Draft' });
    const totalWeight = goals.reduce((acc, g) => acc + g.weightage, 0);

    if (totalWeight !== 100) {
      return res.status(400).json({ message: `Total sheet weightage must equal 100%. Current is ${totalWeight}%` });
    }

    await Goal.updateMany({ employeeId: req.user.id, status: 'Draft' }, { status: 'Pending Approval' });

    if (req.user.managerId) {
      await teamsService.sendAdaptiveCardNotification(req.user.managerId, {
        title: "Goal Sheet Submission",
        text: `${req.user.name} has submitted their goals for review.`,
        deepLink: `${process.env.FRONTEND_URL}/manager/dashboard`
      });
    }

    res.status(200).json({ message: 'Goal sheet submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { achievement } = req.body;
    const goal = await Goal.findById(id);

    if (!goal) return res.status(404).json({ message: 'Goal item not found' });

    const oldProgress = goal.progress;
    const computedProgress = exports.calculateProgress(goal.uom, goal.target, achievement);

    goal.achievement = achievement;
    goal.progress = computedProgress;
    await goal.save();

    await AuditLog.create({
      userId: req.user.id,
      action: 'UPDATE_ACHIEVEMENT',
      targetId: goal._id,
      changedField: 'achievement',
      oldValue: oldProgress,
      newValue: computedProgress
    });

    if (goal.isShared && goal.parentSharedId) {
      await Goal.updateMany(
        { parentSharedId: goal.parentSharedId, _id: { $ne: goal._id } },
        { achievement, progress: computedProgress }
      );
    }

    res.status(200).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ employeeId: req.user.id });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTeamGoals = async (req, res) => {
  try {
    const User = require('../models/User');
    const teamMembers = await User.find({ managerId: req.user.id }).select('_id name');
    const memberIds = teamMembers.map(m => m._id);
    const goals = await Goal.find({ employeeId: { $in: memberIds } }).populate('employeeId', 'name');

    const mapped = goals.map(g => ({
      ...g._doc,
      employeeName: g.employeeId ? g.employeeId.name : 'Unknown'
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGoalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const goal = await Goal.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};