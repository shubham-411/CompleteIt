const mongoose = require('mongoose');
const User = require('../models/User');
const Goal = require('../models/Goal');
const EscalationRule = require('../models/EscalationRule');
const EscalationLog = require('../models/EscalationLog');
const notificationService = require('./notificationService');

class EscalationService {
  async initializeDefaultRules() {
    try {
      const count = await EscalationRule.countDocuments();
      if (count === 0) {
        await EscalationRule.create([
          {
            name: 'Goal Submission Overdue',
            triggerCondition: 'NotSubmitted',
            thresholdDays: 7,
            isEnabled: true
          },
          {
            name: 'Manager Goal Review Overdue',
            triggerCondition: 'NotApproved',
            thresholdDays: 5,
            isEnabled: true
          },
          {
            name: 'Quarterly Check-In Overdue',
            triggerCondition: 'CheckInOverdue',
            thresholdDays: 30,
            isEnabled: true
          }
        ]);
        console.log('\x1b[32m✔ Default Escalation Rules initialized successfully.\x1b[0m');
      }
    } catch (err) {
      console.error('Failed to initialize escalation rules:', err.message);
    }
  }

  async checkAndTriggerEscalations() {
    console.log('\n\x1b[36m=== RUNNING RULE-BASED ESCALATION CYCLE ===\x1b[0m');
    await this.initializeDefaultRules();

    try {
      const activeRules = await EscalationRule.find({ isEnabled: true });
      if (activeRules.length === 0) {
        console.log('No active escalation rules enabled. Skipping.');
        return { success: true, triggeredCount: 0 };
      }

      let triggeredCount = 0;

      for (const rule of activeRules) {
        console.log(`Evaluating Rule: \x1b[35m"${rule.name}"\x1b[0m (Threshold: ${rule.thresholdDays} days)`);

        if (rule.triggerCondition === 'NotSubmitted') {
          triggeredCount += await this._evaluateSubmissionOverdue(rule);
        } else if (rule.triggerCondition === 'NotApproved') {
          triggeredCount += await this._evaluateApprovalOverdue(rule);
        }
      }

      console.log(`\x1b[32m✔ Escalation scan complete. Triggered ${triggeredCount} escalation actions.\x1b[0m`);
      return { success: true, triggeredCount };
    } catch (err) {
      console.error('✖ Error during escalation engine cycle:', err.message);
      return { success: false, error: err.message };
    }
  }

  async _evaluateSubmissionOverdue(rule) {
    let triggers = 0;
    const employees = await User.find({ role: 'Employee' }).populate('managerId');

    for (const emp of employees) {
      const employeeGoals = await Goal.find({ employeeId: emp._id });
      const hasSubmitted = employeeGoals.some(goal => goal.status !== 'Draft');

      if (!hasSubmitted) {
        const existingLogs = await EscalationLog.find({
          employeeId: emp._id,
          ruleId: rule._id
        }).sort({ escalationLevel: -1 });

        let nextLevel = 1;
        if (existingLogs.length > 0) {
          nextLevel = existingLogs[0].escalationLevel + 1;
        }

        if (nextLevel > 3) continue;

        await this._triggerEscalationAction(rule, emp, emp.managerId, nextLevel, 'Employee goal sheet submission is overdue.');
        triggers++;
      }
    }
    return triggers;
  }

  async _evaluateApprovalOverdue(rule) {
    let triggers = 0;
    const pendingGoals = await Goal.find({ status: 'Pending Approval' }).populate('employeeId');

    for (const goal of pendingGoals) {
      const emp = goal.employeeId;
      if (!emp) continue;
      const manager = await User.findById(emp.managerId);

      const existingLogs = await EscalationLog.find({
        employeeId: emp._id,
        ruleId: rule._id
      }).sort({ escalationLevel: -1 });

      let nextLevel = 1;
      if (existingLogs.length > 0) {
        nextLevel = existingLogs[0].escalationLevel + 1;
      }

      if (nextLevel > 3) continue;

      await this._triggerEscalationAction(rule, emp, manager, nextLevel, `Manager review for goal objective "${goal.title}" is overdue.`);
      triggers++;
    }
    return triggers;
  }

  async _triggerEscalationAction(rule, employee, manager, level, details) {
    let recipient = '';
    let notificationText = '';

    if (level === 1) {
      recipient = employee.email;
      notificationText = `⚠️ Warning: Your performance goal sheet submission is currently overdue under rule "${rule.name}". Please submit your goals immediately to clear this flag.`;
      
      await notificationService.sendEmail({
        to: recipient,
        subject: `[WARNING - LEVEL 1] Goal Submission Overdue`,
        htmlBody: `<h3>Action Required</h3><p>${notificationText}</p>`
      });
    } else if (level === 2 && manager) {
      recipient = manager.email;
      notificationText = `⚠️ Escalation: Your team member ${employee.name}'s goal objective sheet is overdue. Reporting lines auto-escalated this notice to you.`;
      
      await notificationService.sendEmail({
        to: recipient,
        subject: `[ESCALATION - LEVEL 2] Team Member Goal Overdue`,
        htmlBody: `<h3>Manager Escalation Notice</h3><p>${notificationText}</p>`
      });
    } else {
      recipient = 'hr-compliance@company.com';
      notificationText = `🚨 Critical Escalation: Employee ${employee.name} and Manager ${manager ? manager.name : 'N/A'} have unresolved performance cycle blockages. Escalated to HR Compliance.`;
      
      await notificationService.sendEmail({
        to: recipient,
        subject: `[🚨 CRITICAL - LEVEL 3] Goal Portal Compliance Alert`,
        htmlBody: `<h3>HR Compliance Intervention Required</h3><p>${notificationText}</p>`
      });
    }

    await EscalationLog.create({
      ruleId: rule._id,
      employeeId: employee._id,
      managerId: manager ? manager._id : null,
      escalationLevel: level,
      conditionDetails: `${details} (Level ${level} escalation active)`,
      notificationSentTo: recipient
    });

    console.log(`  \x1b[31m✔ Level ${level} Escalation Triggered! Notification sent to: ${recipient}\x1b[0m`);
  }
}

module.exports = new EscalationService();
