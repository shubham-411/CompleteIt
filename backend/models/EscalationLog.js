const mongoose = require('mongoose');

const EscalationLogSchema = new mongoose.Schema({
  ruleId: { type: mongoose.Schema.Types.ObjectId, ref: 'EscalationRule', default: null },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  escalationLevel: { type: Number, required: true }, // 1 = Auto-notify Employee, 2 = Notify Manager, 3 = Escalate to HR/Skip-level
  conditionDetails: { type: String, required: true },
  notificationSentTo: { type: String, required: true }, // Recipient emails/names
  status: { type: String, enum: ['Sent', 'Resolved'], default: 'Sent' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EscalationLog', EscalationLogSchema);
