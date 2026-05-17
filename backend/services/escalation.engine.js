const cron = require('node-cron');
const Goal = require('../models/Goal');
const User = require('../models/User');
const EscalationLog = require('../models/EscalationLog');

// Runs daily at 00:00 to verify compliance cycles
cron.schedule('0 0 * * *', async () => {
  console.log('Running automated performance compliance evaluation cycle...');
  try {
    const targetWindowLimitDays = 14; 
    const criticalThresholdDate = new Date();
    criticalThresholdDate.setDate(criticalThresholdDate.getDate() - targetWindowLimitDays);

    // Identify non-compliant instances where employees have not created goals
    const usersWithDrafts = await Goal.distinct('employeeId', { status: 'Draft' });
    const outstandingEmployees = await User.find({ _id: { $notin: usersWithDrafts }, role: 'Employee' });

    for (let emp of outstandingEmployees) {
      await EscalationLog.create({
        employeeId: emp._id,
        level: 1,
        message: `System Alert: ${emp.name} has not structured or populated their mandatory cycle goal sheet within scheduled timelines.`
      });
      // Programmatic actions can run hooks here for SMTP or Manager deep link alerts
    }
  } catch (error) {
    console.error('Error executing automated escalation checks:', error.message);
  }
});