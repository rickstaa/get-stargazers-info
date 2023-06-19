# Get Stargazer Info

Contains scripts that can be used to get information about the stargazers of a GitHub repository.

## How to use

1.  Install the npm dependencies with `npm install`.
2.  Create a `.env` file with the following content:

```env
GITHUB_TOKEN=YOUR_GITHUB_TOKEN
REPO=REPOSITORY_NAME
OWNER=REPOSITORY_OWNER
```

3.  Run the `get-stargazers.js` script with `npm run get-stargazers` to get the stargazers of the repository.
4.  Run the `get-stargazer-info.js` script with `npm run get-stargazer-info` to get the information about the stargazers.

Data is stored in the `data` folder. The `get-stargazers.js` script will create a `stargazers.json` file with the stargazers of the repository. The `get-stargazer-info.js` script will create a `stargazer-info.json` file with the information about the stargazers.

> **Warning**
> This script uses the [@octokit/plugin-throttling](https://www.npmjs.com/package/@octokit/plugin-throttling) to avoid hitting the [GitHub API rate limit](https://docs.github.com/en/graphql/overview/resource-limitations). This is done by waiting for the time specified in the `retry-after` header. This means that if the source of interest has many stargazers, it will take a long time to get all the data.
