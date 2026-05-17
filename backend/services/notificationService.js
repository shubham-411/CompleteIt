const path = require('path');
const fs = require('fs');

class NotificationService {
  constructor() {
    this.logFile = path.resolve(__dirname, '../logs/notifications.log');
    if (!fs.existsSync(path.dirname(this.logFile))) {
      fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
    }
  }

  _writeToLog(type, data) {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      ...data
    };
    fs.appendFileSync(this.logFile, JSON.stringify(entry) + '\n');
    console.log(`\n\x1b[35m[NOTIFICATION SENT - ${type}]\x1b[0m`);
    console.log(`  To: ${data.to || data.recipient}`);
    console.log(`  Subject/Trigger: ${data.subject || data.action}`);
  }

  generateDeepLink(goalId) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return `${baseUrl}/goals/view/${goalId}`;
  }

  async sendEmail({ to, subject, htmlBody }) {
    this._writeToLog('EMAIL', { to, subject, bodySnippet: htmlBody.substring(0, 150) + '...' });
    
    // SMTP transport can be initialized here in production (e.g. nodemailer)
    
    return { success: true, messageId: `mock-msg-${Date.now()}` };
  }

  async sendTeamsAdaptiveCard({ managerEmail, employeeName, goalId, goalTitle, action }) {
    const deepLink = this.generateDeepLink(goalId);
    
    // Adaptive Card v1.4 structure
    const adaptiveCardPayload = {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.4",
      "body": [
        {
          "type": "Container",
          "style": "emphasis",
          "items": [
            {
              "type": "TextBlock",
              "text": `🎯 Goal Objective Action: ${action}`,
              "weight": "Bolder",
              "size": "Medium",
              "color": "Accent"
            }
          ]
        },
        {
          "type": "TextBlock",
          "text": `Hello Manager, \n\nYour team member **${employeeName}** has performed an action on their quarterly performance objectives.`,
          "wrap": true
        },
        {
          "type": "FactSet",
          "facts": [
            { "title": "Employee:", "value": employeeName },
            { "title": "Goal Title:", "value": goalTitle },
            { "title": "Action Performed:", "value": action },
            { "title": "Timestamp:", "value": new Date().toLocaleString() }
          ]
        }
      ],
      "actions": [
        {
          "type": "Action.OpenUrl",
          "title": "View Goal Sheet",
          "url": deepLink
        }
      ]
    };

    this._writeToLog('TEAMS_ADAPTIVE_CARD', {
      recipient: managerEmail,
      action,
      payload: adaptiveCardPayload
    });

    return { success: true, cardSent: true };
  }

  async sendCheckInReminder(employeeEmail, employeeName, daysRemaining) {
    const subject = `⚠️ Quarterly Goal Check-in Reminder — Action Required`;
    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #dd6b20;">Quarterly Performance Update Required</h2>
        <p>Dear <strong>${employeeName}</strong>,</p>
        <p>This is an automated reminder that the current performance cycle check-in window closes in <strong>${daysRemaining} days</strong>.</p>
        <p>Please log into the CompleteIt Goal Portal to record your latest progress and submit objective achievements.</p>
        <div style="margin: 25px 0;">
          <a href="http://localhost:5173" style="background: #dd6b20; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Update Objectives Now</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #edf2f7;"/>
        <p style="font-size: 11px; color: #718096;">This is a system generated notification. Reporting hierarchy attributes synchronised dynamically with Microsoft Entra ID.</p>
      </div>
    `;
    return this.sendEmail({ to: employeeEmail, subject, htmlBody });
  }
}

module.exports = new NotificationService();
