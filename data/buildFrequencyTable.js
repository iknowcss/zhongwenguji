const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sqlite3 = require('sqlite3');
const TableManager = require('./TableManager');
const Estimator = require('./Estimator');

const DB_FILE_PATH = './characters.sqlite';
const CHARACTER_FREQUENCY_FILE_PATH = path.join(__dirname, '../server/all-characters.txt');

if (!fs.existsSync(DB_FILE_PATH)) {
  console.info('Database does not exist!');
  process.exit(1);
}

const isRebuild = process.argv.indexOf('--rebuild') >= 0;

console.info('Connect to database');
const db = new sqlite3.Database(DB_FILE_PATH);

db.serialize(async () => {
  const table = new TableManager(db, 'simpFrequency');

  /// - Ensure table exists ------------------------------------------------------------------------

  if (isRebuild && await table.isExists()) {
    try {
      console.info('Drop table simpFrequency');
      await table.drop();
    } catch (error) {
      console.error('Failed to drop table simpFrequency', error);
      process.exit(1);
    }
  }

  if (!(await table.isExists())) {
    console.info('Create table simpFrequency');
    try {
      await table.create(`
        id INTEGER PRIMARY KEY,
        freq BIGINT,
        char NCHAR(1),
        pinyin VARCHAR(255),
        def TEXT
      `);
    } catch (error) {
      console.error('Failed to create table simpFrequency', error);
      process.exit(1);
    }
  } else {
    console.info('Table simpFrequency already exists');
  }

  /// - Abort operation if data already exists -----------------------------------------------------

  if (await table.hasRows()) {
    console.warn('There is already data in table simpFrequency - exit');
    process.exit(1);
  }

  /// - Abort operation if data already exists -----------------------------------------------------

  const selectByTradStatement = db.prepare('SELECT * FROM character WHERE trad = ?');
  const selectBySimpStatement = db.prepare('SELECT * FROM character WHERE simp = ?');
  const selectByTrad = promisify(selectByTradStatement.all.bind(selectByTradStatement));
  const selectBySimp = promisify(selectBySimpStatement.all.bind(selectBySimpStatement));

  console.info('Load character frequency data from', CHARACTER_FREQUENCY_FILE_PATH);
  const allCharacters = fs
    .readFileSync(CHARACTER_FREQUENCY_FILE_PATH)
    .toString()
    .split('\n')
    .map(x => {
      const [id, char, freq, , pinyin, def] = x.split('\t');
      return { id, char, freq, pinyin, def };
    });

  console.info('Compose with frequency list and insert to simpFrequency');
  const allCharLength = allCharacters.length;

  const stepIncrement = 250;
  const progressEstimator = new Estimator(stepIncrement, allCharLength);

  const stmt = db.prepare('INSERT INTO simpFrequency VALUES (?, ?, ?, ?, ?)');
  const insertValues = promisify(stmt.run.bind(stmt));

  for (let i = 0; i < allCharLength; i++) {
    const { id, char, freq, pinyin, def } = allCharacters[i];
    if (!char) {
      console.debug('Frequency list entry missing character - skip ');
      continue;
    }
    let cedictEntry = await selectByTrad(char);
    if (cedictEntry.length === 0) {
      cedictEntry = await selectBySimp(char);
    }

    const values = [id, freq];
    if (cedictEntry.length === 0) {
      console.debug(`  ! No entry in CEDICT for character "${char}"`);
      if (pinyin && def) {
        console.debug('  * Use frequency list entry as fallback');
        values.push(char);
        values.push(pinyin);
        values.push(def);
      } else {
        console.debug('  x Cannot use frequency entry as fallback - skip');
        continue;
      }
    } else {
      values.push(cedictEntry[0].simp);
      values.push(cedictEntry.reduce((result, { pinyin }) => {
        result.push(pinyin);
        return result;
      }, []).join('/'));
      values.push(cedictEntry.reduce((result, { def }) => {
        result.push(def);
        return result;
      }, []).join('/'));
    }

    const insertPromise = insertValues(values);
    if ((i + 1) % stepIncrement === 0 || i + 1 === allCharLength) {
      console.info(`Time remaining ~ ${progressEstimator.estimateTime(i + 1)}`);
      await insertPromise;
    }
  }

  console.info('Progress ~ 100%');
});
