const STEP_FASTER_MULTIPLIER = 1.2;
const STEP_SLOWER_MULTIPLIER = 0.5;

/**
 * @callback ModelFunction
 * @param {number[]} parameters - Adjustable coefficients used to calculate the output value.
 * @param {number} independentVariable - The input value.
 * @returns {number} - The calculated output value.
 */

/**
 * @typedef FitModelToDataOptions
 * @property {number} [iterationCount] - The total number of iterations to perform during the fit. Defaults to {1000}.
 * @property {number[]} [initialParameterStep] - The initial step sizes for each of the model parameters. If no value is
 *    specified, the step size for each parameter will be 1/100th of that parameter's starting value.
 */

/**
 * Perform an iterative, non-linear regression to fit the curve of the given model function as closely to the given
 * data as possible.
 *
 * Adapted from: https://github.com/jonasalmeida/fminsearch
 *
 * @param {ModelFunction} modelFunction - The model function which we will try to fit to the data.
 * @param {number[]} initialParameters - The model parameters to start adjusting from.
 * @param {number[]|number[][]} independentValues - The set of values which represent the model's independent variable.
 * @param {number[]} dependentValues - The set of values which represent the model's dependent variable.
 * @param {FitModelToDataOptions|undefined} [options]
 * @returns {number[]} - The parameter values found to fit the data best.
 */
function fitModelToData(
  modelFunction,
  initialParameters,
  independentValues,
  dependentValues,
  options,
) {
  const { initialParameterStep, iterationCount } = normalizeOptions(initialParameters, options);
  initialParameters.forEach((p) => {
    if (p === 0) {
      console.warn(`The initial value for parameter ${p} is 0. It is best to start with a non-zero value.`);
    }
  });

  const parameterCount = initialParameters.length;
  const parameterStep = [...initialParameterStep];
  const totalError = testParameters => residualSquaredSum(
    dependentValues,
    independentValues.map(x => modelFunction(testParameters, x)),
  );

  let bestParameters = [...initialParameters];
  for (let iteration = 0; iteration < iterationCount; iteration++) {
    for (let parameterIndex = 0; parameterIndex < parameterCount; parameterIndex++) {
      // Step the current coefficient
      const testParameters = [...bestParameters];
      testParameters[parameterIndex] += parameterStep[parameterIndex];

      if (totalError(testParameters) < totalError(bestParameters)) {
        // The total error decreased, so use the new parameter value and step faster in that direction next time.
        parameterStep[parameterIndex] *= STEP_FASTER_MULTIPLIER;
        bestParameters = [...testParameters];
      } else {
        // The total error increased, so keep the current parameter value and step slower in the opposite direction
        // next time.
        parameterStep[parameterIndex] *= -STEP_SLOWER_MULTIPLIER;
      }
    }
  }

  return bestParameters;
}

module.exports = fitModelToData;


/**
 * Extract and adjust the options given to {fitModelToData} as needed.
 *
 * @private
 * @param {number[]} initialParameters - The model parameters to start adjusting from.
 * @param {FitModelToDataOptions|undefined} options
 * @returns {FitModelToDataOptions}
 */
function normalizeOptions(initialParameters, options) {
  let { initialParameterStep = [], iterationCount = 1000 } = options || {};
  initialParameterStep = initialParameters.map((p, i) => initialParameterStep[i] || p / 100)
  return { initialParameterStep, iterationCount };
}

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
