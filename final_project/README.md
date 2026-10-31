# IBM Express Book Reviews — Final Project

This is a fork of https://github.com/ibm-developer-skills-network/expressBookReviews with completed final_project Express API endpoints.

## Installation

Requires Node.js 18 or later.

```bash
cd final_project
npm install
npm start
```

The API listens on http://127.0.0.1:5000 by default.

## Assignment endpoints

| Task | HTTP | Endpoint | Purpose |
| --- | --- | --- | --- |
| 2 | GET | / | Get all books |
| 3 | GET | /isbn/1 | Get book by ISBN |
| 4 | GET | /author/Unknown | Find books by author |
| 5 | GET | /title/Things%20Fall%20Apart | Find books by title |
| 6 | GET | /review/1 | List reviews |
| 7 | POST | /register | Register a user with JSON username/password |
| 8 | POST | /customer/login | Login, saving session cookie |
| 9 | PUT | /customer/auth/review/1 | Add or edit review; requires login cookie |
| 10 | DELETE | /customer/auth/review/1 | Delete own review; requires login cookie |
| 11 | Axios | router/general.js | Four Axios Promise/async-await functions |

Run `npm run axios-demo` while the API server is running to test the Task 11 Axios helpers.

## cURL examples

```bash
curl -sS http://127.0.0.1:5000/
curl -sS http://127.0.0.1:5000/isbn/1
curl -sS http://127.0.0.1:5000/author/Unknown
curl -sS http://127.0.0.1:5000/title/Things%20Fall%20Apart
curl -sS http://127.0.0.1:5000/review/1
curl -sS -X POST http://127.0.0.1:5000/register -H 'Content-Type: application/json' -d '{"username":"learner","password":"example-password"}'
curl -sS -c cookies.txt -X POST http://127.0.0.1:5000/customer/login -H 'Content-Type: application/json' -d '{"username":"learner","password":"example-password"}'
curl -sS -b cookies.txt -X PUT http://127.0.0.1:5000/customer/auth/review/1 -H 'Content-Type: application/json' -d '{"review":"Great book!"}'
curl -sS -b cookies.txt -X DELETE http://127.0.0.1:5000/customer/auth/review/1
```

The original ten-book data is preserved in `router/booksdb.js`. Users and reviews are kept in memory and reset on restart. Do not use local demo secret defaults for a public deployment.

## Verify the official fork (Task 1)

```bash
curl -sS https://api.github.com/repos/chinhdz102/expressBookReviews | node -e "let s='';process.stdin.on('data',x=>s+=x).on('end',()=>{const d=JSON.parse(s); console.log(JSON.stringify({full_name:d.full_name,fork:d.fork,parent:d.parent?.full_name},null,2))})"
```
