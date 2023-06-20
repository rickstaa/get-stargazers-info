/**
 * Simple script retrieves info about the stargazers and stores it in a json file.
 */
const fs = require("fs");

const octokit = require("./helpers/throttledOctokit");
const totalCommitsFetcher = require("./helpers/totalCommitsFetcher");

require("dotenv").config();

/**
 * Main function.
 */
const main = async () => {
  const repo = process.env.REPO;
  const owner = process.env.OWNER;
  const getMainInfo = process.env.MAIN_INFO === "true";
  const getTotalCommits = process.env.TOTAL_COMMITS === "true";
  const logFrequency = process.env.LOG_FREQUENCY || 100;
  const saveFrequency = process.env.SAVE_FREQUENCY || 1000;

  // Create data folder if it doesn't exist.
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }

  // Retrieve the stargazers from the json file.
  const { stargazers } = JSON.parse(
    fs.readFileSync(`data/${owner}-${repo}-stargazers.json`)
  );

  // Get info about the stargazers.
  console.log("Retrieving info of stargazers...");
  const info = [];
  for (const stargazer of stargazers) {
    try {
      let infoTmp = { name: stargazer };
      if (getMainInfo) {
        const data = await octokit.graphql(`
              query {
                  user(login: "${stargazer}") {
                    repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
                      totalCount
                      nodes {
                        name
                        stargazers {
                          totalCount
                        }
                      }
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                    }
                    contributionsCollection {
                      totalCommitContributions,
                      totalPullRequestReviewContributions
                    }
                    repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
                      totalCount
                    }
                    pullRequests(first: 1) {
                      totalCount
                    }
                    openIssues: issues(states: OPEN) {
                      totalCount
                    }
                    closedIssues: issues(states: CLOSED) {
                      totalCount
                    }
                    followers {
                      totalCount
                    }
                    repositoryDiscussions {
                      totalCount
                    }
                    repositoryDiscussionComments(onlyAnswers: true) {
                      totalCount
                    }
                  }
                  
              }
          `);

        // Get the total number of stars.
        let totalStars = 0;
        for (const repo of data.user.repositories.nodes) {
          totalStars += repo.stargazers.totalCount;
        }

        // Store main info.
        infoTmp = {
          yearCommits:
            data.user.contributionsCollection.totalCommitContributions,
          prs: data.user.pullRequests.totalCount,
          issues:
            data.user.openIssues.totalCount + data.user.closedIssues.totalCount,
          repos: data.user.repositories.totalCount,
          stars: totalStars,
          followers: data.user.followers.totalCount,
          reviews:
            data.user.contributionsCollection
              .totalPullRequestReviewContributions,
          discussionsStarted: data.user.repositoryDiscussions.totalCount,
          discussionsAnswered:
            data.user.repositoryDiscussionComments.totalCount,
        };
      }

      // Get total commits.
      let totalCommits = {};
      if (getTotalCommits) {
        totalCommits = {
          totalCommits: await totalCommitsFetcher(stargazer),
        };

        // Store total commits.
        infoTmp = { ...infoTmp, ...totalCommits };
      }

      // Store info add total commits if 'env.process.TOTAL_COMMITS' is set to true.
      info.push(infoTmp);

      // Store the info about the stargazer.
    } catch (error) {
      console.log(error.errors[0].message);
    }

    // Log and store intermediate results.
    if (info.length % logFrequency === 0) {
      console.log(`Retrieved info about '${info.length}' stargazers...`);
    }
    if (info.length % saveFrequency === 0) {
      console.log(
        `Storing info of '${info.length}' stargazers in a json file...`
      );
      fs.writeFileSync(
        `data/${owner}-${repo}-stargazers-info.json`,
        JSON.stringify({
          lastStargazer: stargazer,
          finished: stargazer === stargazers[stargazers.length - 1],
          info: info,
        })
      );
    }
  }

  // Store the reviews in a json file.
  console.log(
    `Storing info of '${stargazers.length}' stargazers in a json file...`
  );
  fs.writeFileSync(
    `data/${owner}-${repo}-stargazers-info.json`,
    JSON.stringify({
      lastStargazer: stargazers[stargazers.length - 1],
      finished: true,
      info: info,
    })
  );
  console.log("Finished!");
};

main();
