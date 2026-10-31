#!/usr/bin/env bash
# Run from final_project on a machine with Node.js 18+, npm and curl.
# Records REAL cURL output for Coursera Tasks 1-10; tests Axios for Task 11.
set -euo pipefail
cd "$(dirname "$0")"
PORT="$(printenv PORT || echo 5000)"
BASE="http://127.0.0.1:$PORT"
OUT="$PWD/grading_outputs"
mkdir -p "$OUT"
COOKIES="$OUT/cookies.txt"
USERNAME="learner_$(date +%s)_$$"
PASSWORD="grading-demo-password"

capture() {
  local name="$1"
  shift
  {
    printf '$'
    printf ' %q' "$@"
    printf '\n'
    "$@"
    printf '\n'
  } > "$OUT/$name" 2>&1
  echo "Saved $OUT/$name"
}

# Task 1: inspect the REAL fork/parent fields in GitHub's response.
capture githubrepo curl -fsS https://api.github.com/repos/chinhdz102/expressBookReviews

if [ ! -d node_modules ]; then npm install --no-audit --no-fund; fi
PORT="$PORT" node index.js > "$OUT/server.log" 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT
READY=0
for i in $(seq 1 30); do
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "Server exited; see $OUT/server.log" >&2
    exit 1
  fi
  if curl -fsS "$BASE/" -o /dev/null 2>/dev/null; then READY=1; break; fi
  sleep 1
done
if [ "$READY" -ne 1 ]; then echo "Server not ready" >&2; exit 1; fi

capture getallbooks curl -fsS "$BASE/"
capture getbooksbyISBN curl -fsS "$BASE/isbn/1"
capture getbooksbyauthor curl -fsS "$BASE/author/Unknown"
capture getbooksbytitle curl -fsS "$BASE/title/Things%20Fall%20Apart"
capture getbookreview curl -fsS "$BASE/review/1"
capture register curl -fsS -X POST "$BASE/register" -H 'Content-Type: application/json' -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}"
capture login curl -fsS -c "$COOKIES" -X POST "$BASE/customer/login" -H 'Content-Type: application/json' -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}"
capture reviewadded curl -fsS -b "$COOKIES" -X PUT "$BASE/customer/auth/review/1" -H 'Content-Type: application/json' -d '{"review":"This is a clear and engaging classic."}'
capture deletereview curl -fsS -b "$COOKIES" -X DELETE "$BASE/customer/auth/review/1"

node scripts/axios_demo.js > "$OUT/axios_demo_output" 2>&1
printf '%s\n' 'https://github.com/chinhdz102/expressBookReviews/blob/main/final_project/router/general.js' > "$OUT/general_js_url"
echo "DONE. Outputs are in $OUT; avoid publicly sharing login tokens or cookies."
