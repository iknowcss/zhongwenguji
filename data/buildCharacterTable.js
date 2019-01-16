const fs = require('fs');
const { promisify } = require('util');
const sqlite3 = require('sqlite3');
const TableManager = require('./TableManager');
const Estimator = require('./Estimator');

const CC_CEDICT_FILE_PATH = './cedict_ts.u8';
const DB_FILE_PATH = './characters.sqlite';

if (!fs.existsSync(DB_FILE_PATH)) {
  console.info('Database does not exist!');
  process.exit(1);
}

const isRebuild = process.argv.indexOf('--rebuild') >= 0;

console.info('Connect to database');
const db = new sqlite3.Database(DB_FILE_PATH);

db.serialize(async () => {
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
      def TEXT
    );
    
    CREATE INDEX character_trad ON character (trad);
    CREATE INDEX character_simp ON character (simp);
  `);

  const ASDF_REGEXP = /^(\S+)\s+(\S+)\s+\[([^\]]+)]\s+\/(.+)\/$/;
  const IGNORE_LINE_REGEXP = /^[a-zA-Z0-9#%]|Japanese variant of|\[xx/;

  let addCount = 0;
  const allRows = fs.readFileSync(CC_CEDICT_FILE_PATH).toString().split(/\r?\n/);
  const totalRowCount = allRows.length;

  console.info('Process file rows', totalRowCount);
  const stepIncrement = 250;
  const progressEstimator = new Estimator(stepIncrement, totalRowCount);
  let insertCharacterStatement;
  let insertCharacter;
  for (let i = 0; i < totalRowCount; i++) {
    const row = allRows[i];
    if (IGNORE_LINE_REGEXP.test(row)) continue;
    if (ASDF_REGEXP.test(row)) {
      if (!insertCharacterStatement || !insertCharacter) {
        insertCharacterStatement = db.prepare(`
          INSERT INTO character 
          (id, trad, simp, pinyin, def) 
          VALUES 
          (?, ?, ?, ?, ?)
        `);
        insertCharacter = promisify(insertCharacterStatement.run.bind(insertCharacterStatement));
      }
      insertCharacter([addCount + 1].concat(row.match(ASDF_REGEXP).slice(1)));
      if ((addCount + 1) % stepIncrement === 0) {
        await promisify(insertCharacterStatement.finalize.bind(insertCharacterStatement))();
        console.info(`Time remaining ~ ${progressEstimator.estimateTime(addCount + 1)}`);
        insertCharacterStatement = null;
      }
      addCount++;
    }
  }

  console.info(`Finished adding ${addCount} characters`);
});
