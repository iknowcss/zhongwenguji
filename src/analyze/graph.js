var fs = require('fs');
var fminsearch = require('./fminsearch');

const binSize = 50;
const rowTest = /^[01]\s/;
var scoreData = fs.readFileSync('./data/cody_2018-12-08.txt', 'utf8')
  .split('\n')
  .filter(r => rowTest.test(r))
  .map(r => {
    var col = r.split(/\s/);
    return [parseInt(col[0], 10), col[2]];
  });

// const scoreRatio = 
//   scoreData
//     .reduce((result, row, i) => {
//       result[0] += row[0];
//       result[1]++;
//       return result;
//     }, [0, 0]);
// console.log(`Total: ${scoreRatio.join('/')} (${Math.round(100*scoreRatio[0]/scoreRatio[1])}%)`);

const y = 
  scoreData
    .reduce((result, row, i) => {
      const ii = Math.floor(i / binSize);
      result[ii] = (result[ii] || 0) + row[0];
      return result;
    }, []);
const x = Array.from({length: y.length}, (n, i) => (i + 1)*binSize);

// const x = [32,37,42,47,52,57,62,67,72,77,82,87,92];
// const y =[749,1525,1947,2201,2380,2537,2671,2758,2803,2943,3007,2979,2992];
// fun = (x, P) => x.map((xi) => (
//   P[0] + 1/(1/(P[1]*(xi - P[2])) + 1/P[3])
// ));

// 0

function model([A, period, xStart], xi) {
  if (xi < xStart) {
    return A;
  } else if (xi >= xStart + period) {
    return 0;
  }
  return A / 2 * (1 + Math.cos((xi - xStart) * Math.PI / period));
}

const initialParams = [binSize, 500, 100];
const fun = (x, P) => x.map(model.bind(null, P));
const calculatedParms = fminsearch(fun, initialParams, x, y);

const xFull = Array.from({ length: 2100 / binSize - 1 }, (_, i) => (i + 1) * binSize );

console.log('Estimated characters:', Math.round(xFull.reduce((sum, xi, i) => sum + model(calculatedParms, xi), 0)));

xFull.forEach((xi, i) => {
  const yi = Math.round(model(calculatedParms, xi), 0);
  console.log(`${xi}\t`, Array.from({ length: binSize + 1 }, (_, notch) => {
    if (y[i] && notch == y[i]) return 'o';
    if (notch < yi) return '-';
    return ' ';
  }).join(''));
});
