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
  // Retrieve the stargazers from the json file.
  const stargazers = JSON.parse(fs.readFileSync("data/stargazers.json"));

  // Get info about the stargazers.
  console.log("Retrieving info of stargazers...");
  const info = [];
  for (const stargazer of stargazers) {
    try {
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

      // Get total commits.
      const totalCommits = await totalCommitsFetcher(stargazer);

      // Store info.
      info.push({
        name: stargazer,
        yearCommits: data.user.contributionsCollection.totalCommitContributions,
        totalCommits: totalCommits,
        prs: data.user.pullRequests.totalCount,
        issues:
          data.user.openIssues.totalCount + data.user.closedIssues.totalCount,
        repos: data.user.repositories.totalCount,
        stars: totalStars,
        followers: data.user.followers.totalCount,
        reviews:
          data.user.contributionsCollection.totalPullRequestReviewContributions,
        discussionsStarted: data.user.repositoryDiscussions.totalCount,
        discussionsAnswered: data.user.repositoryDiscussionComments.totalCount,
      });

      // Store the info about the stargazer.
    } catch (error) {
      console.log(error.errors[0].message);
    }

    // Print the number of the stargazer every 1000 stargazers.
    if (
      (stargazers.indexOf(stargazer) + 1) % 100 === 0 &&
      stargazers.indexOf(stargazer) !== 0
    ) {
      console.log(
        `Info retrieved for '${stargazers.indexOf(stargazer) + 1}' stargazers.`
      );
    }
  }

  // Store the reviews in a json file.
  console.log("Storing stargazers info in a json file...");
  fs.writeFileSync("data/stargazers-info.json", JSON.stringify(info));
};

main();
