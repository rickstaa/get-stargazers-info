/**
 * Wraps the octokit instance with the throttling plugin. This prevents the script from
 * being blocked by GitHub's rate limit.
 */
const { Octokit } = require("@octokit/rest");
const { throttling } = require("@octokit/plugin-throttling");

const MyOctokit = Octokit.plugin(throttling);

require("dotenv").config();

/** Setup throttled octokit instance.
 * @type {import("@octokit/rest").Octokit}
 *
 * @description ensure that the octokit instance waits for the rate limit to be reset.
 */
const octokit = new MyOctokit({
  auth: process.env.GITHUB_TOKEN,
  throttle: {
    onRateLimit: (retryAfter, options, octokit, retryCount) => {
      octokit.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );

      if (retryCount < 5) {
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onSecondaryRateLimit: (retryAfter, options, octokit, retryCount) => {
      octokit.log.warn(
        `SecondaryRateLimit detected for request ${options.method} ${options.url}`
      );

      if (retryCount < 5) {
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
  },
});

module.exports = octokit;
