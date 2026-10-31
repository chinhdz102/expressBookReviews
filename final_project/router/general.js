'use strict';
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const books = require('./booksdb.js');
const { isValid, users, hashPassword } = require('./auth_users.js');
const public_users = express.Router();

// Task 7: New user registration.
public_users.post('/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' ||
      !username.trim() || !password.trim()) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  const name = username.trim();
  if (isValid(name)) {
    return res.status(409).json({ message: 'Username already exists.' });
  }
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = await hashPassword(password, salt);
    // Check again after async hashing for concurrent registration requests.
    if (isValid(name)) {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    users.push({ username: name, salt, passwordHash });
    return res.status(200).json({ message: 'User successfully registered. Now you can login.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to register user.' });
  }
});

// Task 2: Retrieve all books.
public_users.get('/', (req, res) => res.status(200).json(books));

// Task 3: Retrieve a book by ISBN.
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return Object.prototype.hasOwnProperty.call(books, isbn)
    ? res.status(200).json(books[isbn])
    : res.status(404).json({ message: 'Book not found.' });
});

// Task 4: Search by author (case insensitive).
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.trim().toLocaleLowerCase();
  const results = Object.fromEntries(
    Object.entries(books).filter(([, book]) => book.author.toLocaleLowerCase() === author)
  );
  return Object.keys(results).length
    ? res.status(200).json(results)
    : res.status(404).json({ message: 'No books found for this author.' });
});

// Task 5: Search by title (case insensitive).
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.trim().toLocaleLowerCase();
  const results = Object.fromEntries(
    Object.entries(books).filter(([, book]) => book.title.toLocaleLowerCase() === title)
  );
  return Object.keys(results).length
    ? res.status(200).json(results)
    : res.status(404).json({ message: 'No books found for this title.' });
});

// Task 6: Retrieve the existing reviews for an ISBN.
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return Object.prototype.hasOwnProperty.call(books, isbn)
    ? res.status(200).json(books[isbn].reviews)
    : res.status(404).json({ message: 'Book not found.' });
});

// Task 11: Four Promise/async-await clients implemented with Axios.
// These clients are called separately from the server route handlers.
const baseURL = process.env.BOOKS_API_URL || 'http://127.0.0.1:5000';
const getAllBooksAsync = async () => (await axios.get(baseURL + '/')).data;
const getBookByISBNAsync = async isbn =>
  (await axios.get(baseURL + '/isbn/' + encodeURIComponent(isbn))).data;
const getBooksByAuthorPromise = author =>
  axios.get(baseURL + '/author/' + encodeURIComponent(author)).then(response => response.data);
const getBooksByTitlePromise = title =>
  axios.get(baseURL + '/title/' + encodeURIComponent(title)).then(response => response.data);

module.exports = {
  general: public_users,
  getAllBooksAsync,
  getBookByISBNAsync,
  getBooksByAuthorPromise,
  getBooksByTitlePromise,
  // Common assignment-style aliases for the four Axios functions.
  getAllBooks: getAllBooksAsync,
  getBookByISBN: getBookByISBNAsync,
  getBooksByAuthor: getBooksByAuthorPromise,
  getBooksByTitle: getBooksByTitlePromise
};
