const express = require('express');
const session = require('express-session');
require('dotenv').config();

const router = express.Router();

router.use(session({
  secret: 'card_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // set to true only with HTTPS
}));

const CARD_PASSWORDS = {
  destinations: process.env.DESTINATION_PASS,
  packages: process.env.PACKAGE_PASS,
  blogs: process.env.BLOG_PASS,
  enquiries: process.env.ENQUIRY_PASS,
};

router.post('/card-login/:cardKey', (req, res) => {
  const { cardKey } = req.params;
  const { password } = req.body;

  const correct = CARD_PASSWORDS[cardKey];
  if (!correct) return res.status(400).json({ error: 'Invalid card' });
  if (password !== correct) return res.status(401).json({ error: 'Wrong password' });

  req.session[`auth_${cardKey}`] = true;
  res.json({ success: true });
});

router.get('/card-status/:cardKey', (req, res) => {
  const { cardKey } = req.params;
  const isAuthed = !!req.session[`auth_${cardKey}`];
  res.json({ authenticated: isAuthed });
});

module.exports = router;
