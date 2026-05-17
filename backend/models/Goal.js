const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  thrustArea: { type: String, required: true },
  uom: { type: String, enum: ['Numeric', 'Percentage', 'Timeline', 'Zero-based'], required: true },
  target: { type: Number, required: true },
  weightage: { type: Number, required: true, min: 10 },
  achievement: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected'], default: 'Draft' },
  isLocked: { type: Boolean, default: false },
  isShared: { type: Boolean, default: false },
  parentSharedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', default: null },
  managerComments: { type: String, default: '' },
  cycleYear: { type: Number, default: new Date().getFullYear() },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', GoalSchema);