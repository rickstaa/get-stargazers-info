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

  // Retrieve all stargazers of a given repository.
  console.log("Retrieving stargazers...");
  const stargazers = [];
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
  }

  // Store the stargazers in a json file.
  console.log("Storing stargazers in a json file...");
  fs.writeFileSync("data/stargazers.json", JSON.stringify(stargazers));
};

main();
