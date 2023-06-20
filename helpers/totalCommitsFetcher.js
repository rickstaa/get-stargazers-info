/**
 * Small helper function to fetch the total number of commits of a user using the GitHub
 * GraphQL API.
 */
// const axios = require("axios");
const octokit = require("./throttledOctokit");

require("dotenv").config();

/**
 * Fetch all the commits for all the repositories of a given username.
 *
 * @param {*} username GitHub username.
 * @returns {Promise<number>} Total commits.
 */
const totalCommitsFetcher = async (username) => {
  // Fetch total commits of a user. Retry 2 times if the request fails.
  try {
    const res = await octokit.rest.search.commits({
      q: `author:${username}`,
      per_page: 1,
    });
    let total_count = res.data.total_count;
    if (!!total_count && !isNaN(total_count)) {
      return res.data.total_count;
    }
  } catch (e) {
    switch (e.status) {
      case 422: // If user is not found return 0.
        console.log(
          `Total commits for user '${username}' could not be retrieved.`
        );
        return 0;
      default:
        console.log(e);
        break;
    }
  }

  // just return 0 if there is something wrong so that
  // we don't break the data collection process
  return 0;
};

module.exports = totalCommitsFetcher;
