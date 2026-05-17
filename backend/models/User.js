const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function () { return !this.entraId; } },
  role: { type: String, enum: ['Employee', 'Manager', 'Admin'], default: 'Employee' },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  department: { type: String, required: true },
  entraId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password') || this.entraId) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.entraId) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);