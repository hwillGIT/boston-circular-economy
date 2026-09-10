# Contributing

New to this project? Start with [Your first frontend assignment](docs/GET_STARTED.md).
It gives you one small task, a copyable AI prompt, and the team review steps.

## Choose a path

| If you need...                                | Go to...                                                    |
| --------------------------------------------- | ----------------------------------------------------------- |
| A small research or design task               | [Frontend AI assignments](docs/work-units/README.md)        |
| A prompt to plan, test, and explain work      | [Developer AI guide](docs/work-units/DEVELOPER_AI_GUIDE.md) |
| A rule for clear code and decisions           | [Code change standard](docs/CODE_CHANGE_STANDARD.md)        |
| Commands and the evidence each check provides | [CI checks](docs/CI_CHECKS.md)                              |

## Make your first change

1. Pick one ready assignment or issue.
2. Check the assignee and recent issue comments.
3. Claim an available issue and state your next check-in.
4. Read its inputs, deliverable, and acceptance criteria.
5. Create a branch with a short purpose.
6. Keep the change within the stated scope.
7. Run the checks that support the changed behavior.
8. Explain one example and one remaining uncertainty.
9. Open a pull request with the committed submission record.

For a frontend branch, use a name such as `ui/clinic-filter-copy`.

```sh
git switch -c ui/short-purpose
```

Copy the pull request template into `.github/submission.md`.
Replace inherited text with current evidence.
Commit that file with the change and copy its content into the pull request description.

Required checks must pass before merge.
The review team supplies two current approvals.
A new commit dismisses old approvals.

## Run the application

Use Node.js 22.23.2. The `.node-version` file records this version.

```sh
npm ci --no-audit --no-fund
npm run dev -w client
```

Open `http://localhost:5000` in a browser.
Start the server in a second terminal when your task uses API calls:

```sh
npm run dev -w server
```

Use [CI checks](docs/CI_CHECKS.md) before you submit code.
It explains which checks apply and what each result proves.

## Prototyping

Use `/dev/` for client experiments.
Pages in `client/src/pages/dev/` are available at `/dev/` during development.
Use prototypes to test an idea before you build production behavior.

Move an accepted prototype into the appropriate product location.
