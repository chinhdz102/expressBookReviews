'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customerRoutes = require('./router/auth_users.js').authenticated;
const generalRoutes = require('./router/general.js').general;

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use('/customer', session({
  secret: process.env.SESSION_SECRET || 'local_session_only_replace_me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));

// Guard the authenticated review routes with the verified JWT stored in session.
app.use('/customer/auth/*', (req, res, next) => {
  const auth = req.session && req.session.authorization;
  if (!auth?.accessToken) return res.status(401).json({ message: 'Login is required.' });
  try {
    const payload = jwt.verify(
      auth.accessToken,
      process.env.JWT_SECRET || 'local_development_only_replace_me'
    );
    if (payload.username !== auth.username) {
      return res.status(403).json({ message: 'Invalid authenticated user.' });
    }
    req.username = payload.username;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expired or invalid.' });
  }
});

app.use('/customer', customerRoutes);
app.use('/', generalRoutes);

const PORT = Number(process.env.PORT || 5000);
if (require.main === module) {
  app.listen(PORT, () => console.log('Book Review API listening on port ' + PORT));
}
module.exports = app;
