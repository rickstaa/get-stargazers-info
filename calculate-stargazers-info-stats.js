/*
 * Small script that calculates some statistics about the stargazers of the set
 * repository.
 */

const fs = require("fs");
const { mean, median, standardDeviation } = require("simple-statistics");

require("dotenv").config();

const main = async () => {
  const repo = process.env.REPO;
  const owner = process.env.OWNER;
  const getTotalCommits = process.env.GET_TOTAL_COMMITS === "true";
  const fileName = getTotalCommits
    ? `data/total-commits-${owner}-${repo}-stargazers-info.json`
    : `data/${owner}-${repo}-stargazers-info.json`;

  // Retrieve the stargazers from the json file.
  let infoData;
  try {
    infoData = JSON.parse(fs.readFileSync(fileName));
  } catch (e) {
    console.error(
      `Could not load data from previous run. Check if the info '${fileName}' file exists.`
    );
    return;
  }
  console.log(`Retrieved info of ${infoData.info.length} stargazers.`);
  const stargazersInfo = infoData.info;

  // Retrieve yearCommits from the stargazersInfo.
  const stars = stargazersInfo.map((stargazerInfo) => stargazerInfo.stars);
  const yearCommits = stargazersInfo.map(
    (stargazerInfo) => stargazerInfo.yearCommits
  );
  const prs = stargazersInfo.map((stargazerInfo) => stargazerInfo.prs);
  const issues = stargazersInfo.map((stargazerInfo) => stargazerInfo.issues);
  const repos = stargazersInfo.map((stargazerInfo) => stargazerInfo.repos);
  const reviews = stargazersInfo.map((stargazerInfo) => stargazerInfo.reviews);
  const followers = stargazersInfo.map(
    (stargazerInfo) => stargazerInfo.followers
  );
  const discussionsAnswered = stargazersInfo.map(
    (stargazerInfo) => stargazerInfo.discussionsAnswered
  );
  const discussionsStarted = stargazersInfo.map(
    (stargazerInfo) => stargazerInfo.discussionsStarted
  );
  const totalCommits = stargazersInfo.map(
    (stargazerInfo) => stargazerInfo.totalCommits
  );

  // Calculate mean, median and standard deviation.
  const meanStars = mean(stars);
  const medianStars = median(stars);
  const standardDeviationStars = standardDeviation(stars);
  const maxStars = Math.max(...stars);
  const meanYearCommits = mean(yearCommits);
  const medianYearCommits = median(yearCommits);
  const standardDeviationYearCommits = standardDeviation(yearCommits);
  const maxYearCommits = Math.max(...yearCommits);
  const meanPrs = mean(prs);
  const medianPrs = median(prs);
  const standardDeviationPrs = standardDeviation(prs);
  const maxPrs = Math.max(...prs);
  const meanIssues = mean(issues);
  const medianIssues = median(issues);
  const standardDeviationIssues = standardDeviation(issues);
  const maxIssues = Math.max(...issues);
  const meanRepos = mean(repos);
  const medianRepos = median(repos);
  const standardDeviationRepos = standardDeviation(repos);
  const maxRepos = Math.max(...repos);
  const meanReviews = mean(reviews);
  const medianReviews = median(reviews);
  const standardDeviationReviews = standardDeviation(reviews);
  const maxReviews = Math.max(...reviews);
  const meanFollowers = mean(followers);
  const medianFollowers = median(followers);
  const standardDeviationFollowers = standardDeviation(followers);
  const maxFollowers = Math.max(...followers);
  const meanDiscussionsAnswered = mean(discussionsAnswered);
  const medianDiscussionsAnswered = median(discussionsAnswered);
  const standardDeviationDiscussionsAnswered =
    standardDeviation(discussionsAnswered);
  const maxDiscussionsAnswered = Math.max(...discussionsAnswered);
  const meanDiscussionsStarted = mean(discussionsStarted);
  const medianDiscussionsStarted = median(discussionsStarted);
  const standardDeviationDiscussionsStarted =
    standardDeviation(discussionsStarted);
  const maxDiscussionsStarted = Math.max(...discussionsStarted);
  const meanTotalCommits = mean(totalCommits);
  const medianTotalCommits = median(totalCommits);
  const standardDeviationTotalCommits = standardDeviation(totalCommits);
  const maxTotalCommits = Math.max(...totalCommits);

  // Print the results.
  console.log(`Mean stars: ${meanStars}`);
  console.log(`Median stars: ${medianStars}`);
  console.log(`Standard deviation stars: ${standardDeviationStars}`);
  console.log(`Max stars: ${maxStars}`);
  console.log(`Mean year commits: ${meanYearCommits}`);
  console.log(`Median year commits: ${medianYearCommits}`);
  console.log(
    `Standard deviation year commits: ${standardDeviationYearCommits}`
  );
  console.log(`Max year commits: ${maxYearCommits}`);
  console.log(`Mean PRs: ${meanPrs}`);
  console.log(`Median PRs: ${medianPrs}`);
  console.log(`Standard deviation PRs: ${standardDeviationPrs}`);
  console.log(`Max PRs: ${maxPrs}`);
  console.log(`Mean issues: ${meanIssues}`);
  console.log(`Median issues: ${medianIssues}`);
  console.log(`Standard deviation issues: ${standardDeviationIssues}`);
  console.log(`Max issues: ${maxIssues}`);
  console.log(`Mean repos: ${meanRepos}`);
  console.log(`Median repos: ${medianRepos}`);
  console.log(`Standard deviation repos: ${standardDeviationRepos}`);
  console.log(`Max repos: ${maxRepos}`);
  console.log(`Mean reviews: ${meanReviews}`);
  console.log(`Median reviews: ${medianReviews}`);
  console.log(`Standard deviation reviews: ${standardDeviationReviews}`);
  console.log(`Max reviews: ${maxReviews}`);
  console.log(`Mean followers: ${meanFollowers}`);
  console.log(`Median followers: ${medianFollowers}`);
  console.log(`Standard deviation followers: ${standardDeviationFollowers}`);
  console.log(`Max followers: ${maxFollowers}`)
  console.log(`Mean discussions answered: ${meanDiscussionsAnswered}`);
  console.log(`Median discussions answered: ${medianDiscussionsAnswered}`);
  console.log(
    `Standard deviation discussions answered: ${standardDeviationDiscussionsAnswered}`
  );
  console.log(`Max discussions answered: ${maxDiscussionsAnswered}`);
  console.log(`Mean discussions started: ${meanDiscussionsStarted}`);
  console.log(`Median discussions started: ${medianDiscussionsStarted}`);
  console.log(
    `Standard deviation discussions started: ${standardDeviationDiscussionsStarted}`
  );
  console.log(`Max discussions started: ${maxDiscussionsStarted}`);
  console.log(`Mean total commits: ${meanTotalCommits}`);
  console.log(`Median total commits: ${medianTotalCommits}`);
  console.log(
    `Standard deviation total commits: ${standardDeviationTotalCommits}`
  );
  console.log(`Max total commits: ${maxTotalCommits}`);
};

main();
