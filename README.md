# Boston Circular Economy

This repository contains the frontend, API server, and data tools for the Boston
Circular Economy project.

## New here?

Start with [Your first frontend assignment](docs/GET_STARTED.md).
You can begin with research or design. You do not need to write production code first.

## Which guide should I read?

| If you want to...                   | Read this                                                   | Time to start |
| ----------------------------------- | ----------------------------------------------------------- | ------------- |
| Choose a small UI task              | [Frontend AI assignments](docs/work-units/README.md)        | 5 minutes     |
| Complete a guided first task        | [Your first frontend assignment](docs/GET_STARTED.md)       | 20 minutes    |
| Use AI and explain your own work    | [Developer AI guide](docs/work-units/DEVELOPER_AI_GUIDE.md) | 10 minutes    |
| Change code and open a pull request | [Contributing](CONTRIBUTING.md)                             | 10 minutes    |
| Find all checks and their limits    | [CI checks](docs/CI_CHECKS.md)                              | Reference     |

## Frontend quick start

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

Do not commit keys, passwords, or other secrets.
