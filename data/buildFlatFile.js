const fs = require('fs');
const { promisify } = require('util');
const sqlite3 = require('sqlite3');

const DB_FILE_PATH = './characters.sqlite';
const ALL_CHARACTERS_FILE_PATH = '../server/all-characters.json';

if (!fs.existsSync(DB_FILE_PATH)) {
  console.info('Database does not exist!');
  process.exit(1);
}

console.info('Connect to database');
const db = new sqlite3.Database(DB_FILE_PATH);

db.serialize(async () => {
  console.info('Select characters from frequency table');
  const characters = await promisify(db.all.bind(db))(`
      SELECT
      id AS i,
      simp AS cs,
      trad AS ct,
      pinyin AS p,
      def AS d
    FROM frequency
  `);

  console.info('Write JSON to file',  ALL_CHARACTERS_FILE_PATH);
  const output = {
    _sourceUri: 'https://cc-cedict.org',
    _license: 'CC BY-SA 3.0',
    _licenseUri: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
    _modification: 'This flat file takes data from the CEDICT and pairs it with character frequency data from Dr. Jun Da\'s "Modern Chinese Character Frequency List (2004)" (http://lingua.mtsu.edu/chinese-computing/statistics/char/list.php?Which=MO)',
    _author: 'Paul Andrew Denisowski',
    _credits: {
      conributors: [
        'feilipu',
        'goldyn_chyld - Matic Kavcic',
        'richwarm - Richard Warmington',
        'vermillion - Julien Baley',
        'ycandau - Yves Candau',
        'Craig Brelsford, for his extensive list of bird names',
        'Erik Peterson, for his work as the editor of CEDICT',
        'and the editors who wish to remain anonymous'
      ]
    },
    characters
  };

  fs.writeFileSync(ALL_CHARACTERS_FILE_PATH, JSON.stringify(output));
});
