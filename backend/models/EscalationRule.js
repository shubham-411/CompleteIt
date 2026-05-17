const mongoose = require('mongoose');

const EscalationRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  triggerCondition: { 
    type: String, 
    enum: ['NotSubmitted', 'NotApproved', 'CheckInOverdue'], 
    required: true 
  },
  thresholdDays: { type: Number, required: true },
  isEnabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EscalationRule', EscalationRuleSchema);
