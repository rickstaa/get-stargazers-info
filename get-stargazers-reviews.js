/**
 * Simple script retrieves the stargazers from the `data/stargazers.json` file and retrieves
 * the reviews for each stargazer. It then calculates the mean number of reviews over all
 * stargazers.
 */
const fs = require("fs");

const octokit = require("./helpers/throttledOctokit");

require("dotenv").config();

/**
 * Main function.
 */
const main = async () => {
  // Retrieve the stargazers from the json file.
  const stargazers = JSON.parse(fs.readFileSync("data/stargazers.json"));

  // Get the total number of reviews each stargazer has made.
  console.log("Retrieving reviews info of stargazers...");
  const reviews = [];
  for (const stargazer of stargazers) {
    try {
      const data = await octokit.graphql(`
              query {
                  user(login: "${stargazer}") {
                      contributionsCollection {
                          totalPullRequestReviewContributions
                      }
                  }
              }
          `);
      reviews.push(
        data.user.contributionsCollection.totalPullRequestReviewContributions
      );
    } catch (error) {
      console.log(error.errors[0].message);
    }

    // Print the number of the stargazer every 1000 stargazers.
    if (
      (stargazers.indexOf(stargazer) + 1) % 100 === 0 &&
      stargazers.indexOf(stargazer) !== 0
    ) {
      console.log(
        `Reviews info retrieved of '${
          stargazers.indexOf(stargazer) + 1
        }' stargazers.`
      );
    }
  }

  // Store the reviews in a json file.
  console.log("Storing reviews info in a json file...");
  fs.writeFileSync("data/reviews.json", JSON.stringify(reviews));

  // Calculate the mean number of reviews.
  console.log("Calculating the mean number of reviews...");
  const meanReviews = reviews.reduce((a, b) => a + b, 0) / reviews.length;

  // Store the mean number of reviews in a json file.
  console.log("Storing the mean number of reviews in a json file...");
  fs.writeFileSync("data/mean-reviews.json", JSON.stringify(meanReviews));
};

main();
