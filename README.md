# Get Stargazer Info

Contains some scripts that can be used to get information about the stargazers of a GitHub repository.

## How to use

1. Install the npm dependencies with `npm install`.
2. Create a `.env` file with the following content:

```env
GITHUB_TOKEN=YOUR_GITHUB_TOKEN
REPO=REPOSITORY_NAME
OWNER=REPOSITORY_OWNER
```

3. Run the `get-stargazers.js` script with `npm run get-stargazers`.
4. Run other scripts with `npm run <SCRIPT_NAME>`. The available scripts found in the `package.json` file.
