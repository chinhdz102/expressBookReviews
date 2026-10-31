# Coursera AI-Graded Submission: Node.js and Express

This repository contains the implementation for the IBM Online Book Review final project.

## Create genuine evidence files

On a PC with Bash (Windows: WSL), Node.js 18+, npm and curl:

```bash
git clone https://github.com/chinhdz102/expressBookReviews.git
cd expressBookReviews/final_project
bash capture_submission.sh
```

The script installs dependencies if needed, starts the Express server, executes real HTTP requests, tests the Axios functions, and writes results to `grading_outputs/`. It cleans up the server process on exit.

| Task | File or answer |
| --- | --- |
| 1 | `grading_outputs/githubrepo` — check `fork: true` and `parent.full_name: ibm-developer-skills-network/expressBookReviews` |
| 2 | `grading_outputs/getallbooks` |
| 3 | `grading_outputs/getbooksbyISBN` |
| 4 | `grading_outputs/getbooksbyauthor` |
| 5 | `grading_outputs/getbooksbytitle` |
| 6 | `grading_outputs/getbookreview` |
| 7 | `grading_outputs/register` |
| 8 | `grading_outputs/login` |
| 9 | `grading_outputs/reviewadded` |
| 10 | `grading_outputs/deletereview` |
| 11 | https://github.com/chinhdz102/expressBookReviews/blob/main/final_project/router/general.js |

The Axios demonstration output is saved to `grading_outputs/axios_demo_output`.

**Important:** The assignment introduction mentions 14 tasks, but the provided scoring table explicitly lists 11 items totaling 30 points. The script covers those 11 visible items. GitHub's official API is used to verify whether the repository is truly a fork; do not assume that merely having a matching name proves Task 1. Never fabricate command output. Avoid publishing tokens and cookies from `grading_outputs/`, and remember that the sample server stores accounts and reviews in memory.
