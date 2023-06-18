# Get Stargazer Info

Contains some scripts that can be used to get information about the stargazers of a GitHub repository.

## How to use

1.  Install the npm dependencies with `npm install`.
2.  Create a `.env` file with the following content:

```env
GITHUB_TOKEN=YOUR_GITHUB_TOKEN
REPO=REPOSITORY_NAME
OWNER=REPOSITORY_OWNER
```

3.  Run the `get-stargazers.js` script with `npm run get-stargazers`.
4.  Run other scripts with `npm run <SCRIPT_NAME>`. The available scripts found in the `package.json` file.

> **Note**
> Data is stored in the `data` folder. The `get-stargazers.js` script will create a `stargazers.json` file with the stargazers of the repository.
> The other scripts will use this file to get the data.

> **Warning**
> This script uses the [@octokit/plugin-throttling](https://www.npmjs.com/package/@octokit/plugin-throttling) to avoid hitting the GitHub API rate limit. This is done
> by waiting for the time specified in the `retry-after` header. This means that if the repository of interest has a lot of stargazers, it will take a long time to get all the data.
