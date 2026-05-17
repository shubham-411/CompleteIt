const axios = require('axios');

exports.sendAdaptiveCardNotification = async (targetUserId, payload) => {
  // If webhook integration configurations are active
  if (!process.env.TEAMS_WEBHOOK_URL) return;

  const adaptiveCard = {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": {
          "type": "AdaptiveCard",
          "body": [
            { "type": "TextBlock", "size": "Medium", "weight": "Bolder", "text": payload.title },
            { "type": "TextBlock", "text": payload.text, "wrap": true }
          ],
          "actions": [
            {
              "type": "Action.OpenUrl",
              "title": "View Portal Dashboard",
              "url": payload.deepLink
            }
          ],
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
          "version": "1.4"
        }
      }
    ]
  };

  try {
    await axios.post(process.env.TEAMS_WEBHOOK_URL, adaptiveCard);
  } catch (err) {
    console.error("Failed to forward communication payload message to Teams Gateway", err.message);
  }
};