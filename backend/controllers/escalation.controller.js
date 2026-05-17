const EscalationRule = require('../models/EscalationRule');
const EscalationLog = require('../models/EscalationLog');
const escalationService = require('../services/escalationService');

exports.getRules = async (req, res) => {
  try {
    const rules = await EscalationRule.find();
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRule = async (req, res) => {
  const { id } = req.params;
  const { thresholdDays, isEnabled } = req.body;
  try {
    const rule = await EscalationRule.findById(id);
    if (!rule) {
      return res.status(404).json({ message: 'Escalation rule not found' });
    }

    if (thresholdDays !== undefined) rule.thresholdDays = thresholdDays;
    if (isEnabled !== undefined) rule.isEnabled = isEnabled;

    await rule.save();
    res.json({ message: 'Rule updated successfully', rule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await EscalationLog.find()
      .populate('employeeId', 'name email department')
      .populate('managerId', 'name email')
      .populate('ruleId', 'name triggerCondition')
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.triggerScanner = async (req, res) => {
  try {
    const result = await escalationService.checkAndTriggerEscalations();
    res.json({ message: 'Manual escalation scan initiated', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
