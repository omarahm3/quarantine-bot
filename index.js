'use strict';

// Imports dependencies and set up http server
const
  PORT        = process.env.PORT || 1337,
  express     = require('express'),
  bodyParser  = require('body-parser'),
  app         = express().use(bodyParser.json()); // creates express http server

app.post('/fb-webhook', (req, res) => {
  const fbRequestContent = req.body;

  if (fbRequestContent.object !== 'page') {
    // We're currently handling pages only
    return res.sendStatus(404);
  }

  fbRequestContent.entry.forEach(entry => {
    const webhookEvent = entry.messaging[0];
    console.log('INCOMING FB ENTRY:::', webhookEvent);
  });

  return res.status(200).send('EVENT_RECEIVED');
});

app.get('/fb-webhook', (req, res) => {
  const VERIFY_TOKEN = '1234567';

  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (!mode || !token) {
    return res.sendStatus(404);
  }

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK VERIFIED');
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Sets server port and logs message on success
app.listen(PORT, () => console.log(`webhook is working on http://localhost:${PORT}`));