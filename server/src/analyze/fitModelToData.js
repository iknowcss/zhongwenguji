/* Adapted from:
 * https://github.com/jonasalmeida/fminsearch
 */

/*
 * MIT License
 *
 * Copyright (c) Jonas Almeida.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *
 */

/**
 * @callback ModelFunction
 * @param {number[]} parameters - Adjustable coefficients used to calculate the output value.
 * @param {number} independentVariable - The input value.
 * @returns {number} - The calculated output value.
 */

/**
 *
 * @param {ModelFunction} modelFunction - The model function which we will try to fit to the data.
 * @param {number[]} initialParameters - The model parameters to start adjusting from.
 * @param {number[][]} sampleData - The set of 2D coordinates that we want our model to fit.
 * @param {object} [options] - Configurable options.
 * @param {number} [options.iterations] - The total number of iterations to perform during the fit. Defaults to {1000}.
 * @param {number[]} [options.parameterSteps] - The initial step sizes for each of the model parameters. If no value is
 *    specified, the step size for each parameter will be 1/100th of that parameter's starting value.
 */
function performRegression(
  modelFunction,
  initialParameters,
  sampleData,
  options = {},
) {
  initialParameters.forEach((p) => {
    if (p === 0) {
      console.warn(`The initial value for parameter ${p} is 0. It is best to start with a non-zero value.`);
    }
  });

  const iterations = options.iterations || 1000;
  const parameterSteps = initialParameters.map((p, i) => (options.parameterSteps && options.parameterSteps[i]) || p / 100);
  const parameterCount = initialParameters.length;
  const [sampleXValues, sampleYValues] = sampleData.reduce((result, [x, y]) => {
    result[0].push(x);
    result[1].push(y);
    return result;
  }, [[], []]);
  const parameterError = testParameters => residualSquaredSum(yValues, fittingFunction(xValues, coefficients));

}

/**
 * @param {FittingFunction} fittingFunction
 * @param {number[]} startCoefficients - Initial coefficients to use when trying to fit the data. It is best not to
 *    use {0} in any of the initial coefficients.
 * @param {number[]} xValues
 * @param {number[]} yValues
 * @param {FMinSearchOptions} [options]
 * @returns {number[]} - Coefficients that best fit the data.
 */
function fminsearch(
  fittingFunction,
  startCoefficients,
  xValues,
  yValues,
  options = {},
) {


  let bestCoefficients = [...initialParameters];
  for (let iteration = 0; iteration < totalIterations; iteration++) {
    for (let coefficientIndex = 0; coefficientIndex < coefficientCount; coefficientIndex++) {
      // Step the current coefficient
      const testCoefficients = [...bestCoefficients];
      testCoefficients[coefficientIndex] += coefficientStep[coefficientIndex];

      if (totalError(testCoefficients) < totalError(bestCoefficients)) {
        // If the total error is reduced, use the new coefficient value and step faster in that direction next time.
        coefficientStep[coefficientIndex] *= 1.2; // then go a little faster
        bestCoefficients = [...testCoefficients];
      } else {
        // If the total error increases, keep the current coefficient value and step slower in the opposite direction
        // next time.
        coefficientStep[coefficientIndex] *= -0.5; // otherwiese reverse and go slower
      }
    }
  }

  return bestCoefficients;
}

module.exports = fminsearch;

/**
 * Calculates a scalar error value for a pair of vectors of equal length using the method of least squares.
 * See https://en.wikipedia.org/wiki/Least_squares.
 *
 * @private
 * @param {number[]} y - The first vector.
 * @param {number[]} fx - the second vector.
 * @returns {number}
 */
const residualSquaredSum = (y, fx) => y
  .map((yi, i) => Math.pow((yi - fx[i]), 2))
  .reduce((a, b) => a + b);
