'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);
const books = require('./booksdb.js');
const regd_users = express.Router();

// Keep users in memory, consistent with IBM's sample application.
const users = [];
const isValid = username => users.some(user => user.username === username);

async function hashPassword(password, salt) {
  return (await scrypt(password, salt, 64)).toString('hex');
}

async function authenticatedUser(username, password) {
  const user = users.find(item => item.username === username);
  if (!user || typeof password !== 'string') return false;
  const computed = Buffer.from(await hashPassword(password, user.salt), 'hex');
  const stored = Buffer.from(user.passwordHash, 'hex');
  return computed.length === stored.length && crypto.timingSafeEqual(computed, stored);
}

regd_users.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' ||
      !username.trim() || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    if (!await authenticatedUser(username.trim(), password)) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const token = jwt.sign(
      { username: username.trim() },
      process.env.JWT_SECRET || 'local_development_only_replace_me',
      { expiresIn: '1h' }
    );
    req.session.authorization = { accessToken: token, username: username.trim() };
    return res.status(200).json({ message: 'User successfully logged in.', token });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to log in.' });
  }
});

// Add or update the review for the currently logged-in user.
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  if (!Object.prototype.hasOwnProperty.call(books, isbn)) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  const review = typeof req.body?.review === 'string' ? req.body.review : req.query.review;
  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({ message: 'A nonempty review is required.' });
  }
  books[isbn].reviews[req.username] = review.trim();
  return res.status(200).json({
    message: 'Review successfully added or updated.',
    reviews: books[isbn].reviews
  });
});

// A logged-in user may remove only their own review.
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  if (!Object.prototype.hasOwnProperty.call(books, isbn)) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  if (!Object.prototype.hasOwnProperty.call(books[isbn].reviews, req.username)) {
    return res.status(404).json({ message: 'No review by this user exists.' });
  }
  delete books[isbn].reviews[req.username];
  return res.status(200).json({
    message: 'Review successfully deleted.',
    reviews: books[isbn].reviews
  });
});

module.exports = { authenticated: regd_users, isValid, authenticatedUser, users, hashPassword };
