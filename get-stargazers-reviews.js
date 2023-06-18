/**
 * Simple script retrieves the stargazers from the `data/stargazers.json` file and retrieves
 * the reviews for each stargazer. It then calculates the mean number of reviews over all
 * stargazers.
 */

const octokit = require('./helpers/throttledOctokit');

const fs = require('fs');

/**
 * Main function.
 */
const main = async () => {
    // Retrieve the stargazers from the json file.
    const stargazers = JSON.parse(fs.readFileSync('data/stargazers.json'));

    // Get the total number of reviews each stargazer has made.
    const reviews = [];
    for (const stargazer of stargazers) {
        const data = await octokit.graphql(`
            query {
                user(login: "${stargazer}") {
                    contributionsCollection {
                        totalPullRequestReviewContributions
                    }
                }
            }
        `);
        reviews.push(data.user.contributionsCollection.totalPullRequestReviewContributions);
    }

    // Store the reviews in a json file.
    fs.writeFileSync('data/reviews.json', JSON.stringify(reviews));

    // Calculate the mean number of reviews.
    const meanReviews = reviews.reduce((a, b) => a + b, 0) / reviews.length;

    // Store the mean number of reviews in a json file.
    fs.writeFileSync('data/mean-reviews.json', JSON.stringify(meanReviews));
};

main();
