/**
 * Simple script that retrieves the stargazers of a given repository.
 */
const fs = require("fs");

const octokit = require("./helpers/throttledOctokit");

require("dotenv").config();

/**
 * Main function.
 */
const main = async () => {
  // Retrieve all stargazers of a given repository.
  const repo = process.env.REPO;
  const owner = process.env.OWNER;
  const SAVE_FREQUENCY = process.env.SAVE_FREQUENCY || 1000;
  const useGraphQL = process.env.USE_GRAPHQL === "true";

  // Retrieve all stargazers of a given repository. Don't use pagination because of the 40 pages limit. Use graphql instead.
  const stargazers = [];
  let cursor = null;
  let hasNextPage = true;
  if (useGraphQL) {
    console.log("Retrieving stargazers using GitHub GraphQL API...");
    while (hasNextPage) {
      const response = await octokit.graphql(
        `
        query($owner: String!, $repo: String!, $cursor: String) {
          repository(owner: $owner, name: $repo) {
            stargazers(first: 100, after: $cursor) {
              nodes {
                login
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      `,
        {
          owner,
          repo,
          cursor,
        }
      );
      for (const stargazer of response.repository.stargazers.nodes) {
        stargazers.push(stargazer.login);
      }
      cursor = response.repository.stargazers.pageInfo.endCursor;
      hasNextPage = response.repository.stargazers.pageInfo.hasNextPage;

      // Store intermediate results in a json file per 1000 stargazers.
      if (stargazers.length % SAVE_FREQUENCY === 0) {
        console.log(
          `Storing '${stargazers.length}' stargazers in a json file...`
        );
        fs.writeFileSync(
          `data/${owner}-${repo}-stargazers.json`,
          JSON.stringify({
            cursor: cursor || null,
            hasNextPage: hasNextPage || null,
            stargazers: stargazers,
          })
        );
      } else if (stargazers.length % 100 === 0) {
        console.log(`Retrieved '${stargazers.length}' stargazers...`);
      }
    }
  } else {
    // Retrieve all stargazers of a given repository. Handle the 40 pages pagination limit.
    console.log("Retrieving stargazers using GitHub Rest API...");
    for await (const response of octokit.paginate.iterator(
      octokit.rest.activity.listStargazersForRepo,
      {
        owner,
        repo,
        per_page: 100,
      }
    )) {
      for (const stargazer of response.data) {
        stargazers.push(stargazer.login);
      }

      // Store intermediate results in a json file per 1000 stargazers.
      if (stargazers.length % SAVE_FREQUENCY === 0) {
        console.log(
          `Storing '${stargazers.length}' stargazers in a json file...`
        );
        fs.writeFileSync(
          `data/${owner}-${repo}-stargazers.json`,
          JSON.stringify({
            cursor: cursor || null,
            hasNextPage: hasNextPage || null,
            stargazers: stargazers,
          })
        );
      }
    }
  }

  // Store the stargazers in a json file.
  console.log(
    `Storing all '${stargazers.length}' stargazers in a json file...`
  );
  fs.writeFileSync(
    `data/${owner}-${repo}-stargazers.json`,
    JSON.stringify({
      cursor: cursor || null,
      hasNextPage: hasNextPage || null,
      stargazers: stargazers,
    })
  );
};

main();
