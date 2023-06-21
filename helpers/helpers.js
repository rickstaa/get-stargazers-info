/**
 * Some helper functions.
 */

/**
 * Calculate mean of an array of numbers.
 */
const mean = (arr) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

/**
 * Calculate median of an array of numbers.
 */
const median = (arr) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

/**
 * Calculate the standard deviation of an array of numbers.
 */
const standardDeviation = (arr) => {
  const avg = mean(arr);
  return Math.sqrt(
    arr.map((x) => Math.pow(x - avg, 2)).reduce((a, b) => a + b) / arr.length
  );
};

module.exports = {
  mean,
  median,
  standardDeviation,
};
