/**
 * Small helper function to fetch the total number of commits of a user using the GitHub
 * REST API.
 */

const axios = require("axios");
const rateLimit = require("axios-rate-limit");

require("dotenv").config();

// Ensure that we stay below the rate limit of the GitHub API.
// See:
const http = rateLimit(axios.create(), {
  maxRequests: 3.5,
});

/**
 * Fetch all the commits for all the repositories of a given username.
 *
 * @param {*} username GitHub username.
 * @returns {Promise<number>} Total commits.
 *
 * @description Done like this because the GitHub API does not provide a way to fetch all the commits. See
 * #92#issuecomment-661026467 and #211 for more information.
 */
const totalCommitsFetcher = async (username) => {
  // https://developer.github.com/v3/search/#search-commits
  const fetchTotalCommits = (user, token) => {
    return http.get("https://api.github.com/search/commits", {
      params: {
        q: `author:${user}`,
        per_page: 1,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github.cloak-preview",
        Authorization: `token ${token}`,
      },
    });
  };

  try {
    let res = await fetchTotalCommits(username, process.env.GITHUB_TOKEN);
    let total_count = res.data.total_count;
    if (!!total_count && !isNaN(total_count)) {
      return res.data.total_count;
    }
  } catch (err) {
    logger.log(err);
  }

  // just return 0 if there is something wrong so that
  // we don't break the data collection process
  return 0;
};

module.exports = totalCommitsFetcher;
