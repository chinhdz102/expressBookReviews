'use strict';
const {
  getAllBooksAsync,
  getBookByISBNAsync,
  getBooksByAuthorPromise,
  getBooksByTitlePromise
} = require('../router/general.js');

(async () => {
  try {
    console.log('All books:', JSON.stringify(await getAllBooksAsync(), null, 2));
    console.log('ISBN 1:', JSON.stringify(await getBookByISBNAsync('1'), null, 2));
    console.log('Author Unknown:', JSON.stringify(await getBooksByAuthorPromise('Unknown'), null, 2));
    console.log('Title Things Fall Apart:', JSON.stringify(await getBooksByTitlePromise('Things Fall Apart'), null, 2));
  } catch (error) {
    console.error('Axios request failed:', error.response?.data || error.message);
    process.exitCode = 1;
  }
})();
