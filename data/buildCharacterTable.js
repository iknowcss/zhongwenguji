const fs = require('fs');
const sqlite3 = require('sqlite3');
const TableManager = require('./TableManager');
const Estimator = require('./Estimator');

const CC_CEDICT_FILE_PATH = './cedict_ts.u8';
const DB_FILE_PATH = './characters.sqlite';
const FREQUENCY_ROW_REGEXP = /^(\S+)\s+(\S+)\s+\[([^\]]+)]\s+\/(.+)\/$/;
const IGNORE_LINE_REGEXP = /^[a-zA-Z0-9#%]|Japanese variant of|\[xx/;

if (!fs.existsSync(DB_FILE_PATH)) {
  console.info('Database does not exist!');
  process.exit(1);
}

const isRebuild = process.argv.indexOf('--rebuild') >= 0;

console.info('Connect to database');
const db = new sqlite3.Database(DB_FILE_PATH);

db.serialize(async () => {

  /// - Create character table ------------------------------------------------

  const characterTable = new TableManager(db, 'character');

  if (isRebuild) {
    console.info('Drop table character');
    await characterTable.dropIfExists();
  }

  console.info('Create table character');
  await characterTable.createIfNotExists(({ tableName }) => `
    CREATE TABLE ${tableName} (
      id INTEGER PRIMARY KEY,
      trad NCHAR(1),
      simp NCHAR(1),
      pinyin CHAR(10),
      def TEXT,
      simpDupe BOOLEAN
    );
    
    CREATE INDEX character_trad ON character (trad);
    CREATE INDEX character_simp ON character (simp);
  `);

  /// - Abort operation if data already exists -----------------------------------------------------

  if (await characterTable.hasRows()) {
    console.warn('There is already data in table character - exit');
    process.exit(0);
  }

  /// - Read CEDICT entries into insert values --------------------------------

  const allRows = fs.readFileSync(CC_CEDICT_FILE_PATH).toString().split(/\r?\n/);
  console.info(`Process CEDICT file - ${allRows.length} entries`, );

  const insertValues = [];
  const entryMap = new Map();
  let addCount = 0;
  allRows.forEach((row) => {
    if (IGNORE_LINE_REGEXP.test(row)) return;
    if (!FREQUENCY_ROW_REGEXP.test(row)) return;
    const entry = row.match(FREQUENCY_ROW_REGEXP).slice(1).concat([false]);
    const [trad, simp] = entry;
    if (entryMap.has(simp)) {
      const oldEntry = insertValues[entryMap.get(simp)];
      if (oldEntry[1] === trad || oldEntry[2] === trad) {
        oldEntry[3] += ` ${entry[2]}`;
        oldEntry[4] += `/${entry[3]}`;
        addCount++;
        return;
      } else {
        entry[entry.length - 1] = true;
      }
    } else {
      entryMap.set(simp, insertValues.length);
    }
    insertValues.push([++addCount].concat(entry));
  });

  /// - Insert CEDICT character data into characters table --------------------

  console.info(`Insert into characters table - ${insertValues.length} rows`);
  const estimator = new Estimator(5000, insertValues.length);

  // Insert in transaction chunks for speed
  // 100 to start, then chunks of 5000
  let stepIncrement = 100;
  let chunk;
  while ((chunk = insertValues.splice(0, stepIncrement)).length) {
    if (stepIncrement > 100) {
      estimator.printEstimateTime(addCount - insertValues.length);
    }
    stepIncrement = 5000;
    await new Promise((resolve, reject) => {
      let transaction = db.exec('BEGIN TRANSACTION');
      chunk.forEach(entry => transaction = transaction.run(`
        INSERT INTO character
        (id, trad, simp, pinyin, def, simpDupe)
        VALUES
        (?, ?, ?, ?, ?, ?)
      `, entry));
      transaction.exec('COMMIT', (err) => { err ? reject(err) : resolve(); });
    });
  }

  console.info('');
  console.info(`Finished adding ${addCount} characters`);
});
