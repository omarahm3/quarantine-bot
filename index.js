'use strict';

// Imports dependencies and set up http server
const
  PAGE_ACCESS_TOKEN = 'EAACG1GWltMABAElGWHfZBgu8sUuC2g04yL7ZAQ0iHDQBZAYgme2NrzRkfAsZBKhITZBxj1jyKuSPhJMRYipXqOet2Gc4ljyg9BZA8lvKuAJsVLZBUxAetsqU7KB3cRz3nIJft1XAtNZCuOQC1oD5LIevwRSZCXVbDHJCNO0x2EbeGZBgZDZD',
  SERVER_PORT       = process.env.PORT || 1337,
  FB_WEBHOOK        = '/fb-webhook',
  VERIFY_TOKEN      = '1234567',
  axios             = require('axios').default,
  express           = require('express'),
  bodyParser        = require('body-parser'),
  app               = express().use(bodyParser.json()); // creates express http server


app.post(FB_WEBHOOK, (req, res) => {
  const fbRequest = req.body; // JSON REQUEST

  if (fbRequest.object !== 'page') {
    return res.sendStatus(404);
  }

  const entries = fbRequest.entry;

  entries.forEach(async (entry) => {
    const message     = entry.messaging[0];

    if (message.message) {
      const senderId    = message.sender.id;
      const textMessage = message.message.text;

      if (textMessage === 'what is the time now?') {
        const fbResponse  = {
          recipient: {
            id: senderId
          },
          message: {
            text: `Time is: ${new Date()}`
          }
        };
        const response = await axios.post(`https://graph.facebook.com/v6.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, fbResponse);
      } else {
        const fbResponse  = {
          recipient: {
            id: senderId
          },
          message: {
            text: `You said: ${textMessage}`
          }
        };
    
        console.log(`Sender (${senderId}) has sent message (${textMessage})`);
    
        const response = await axios.post(`https://graph.facebook.com/v6.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, fbResponse);
      }
    }
  });

  return res.sendStatus(200);
});

app.get(FB_WEBHOOK, (req, res) => {
  const verifyToken = req.query['hub.verify_token'];
  const challenge   = req.query['hub.challenge'];
  const mode        = req.query['hub.mode'];

  if (verifyToken === VERIFY_TOKEN && mode === 'subscribe') {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Sets server port and logs message on success
app.listen(SERVER_PORT, () => console.log('Server is running on http://localhost:' + SERVER_PORT));