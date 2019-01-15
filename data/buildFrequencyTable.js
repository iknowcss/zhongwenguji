const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sqlite3 = require('sqlite3');

const DB_FILE_PATH = './characters.sqlite';

if (!fs.existsSync(DB_FILE_PATH)) {
  console.info('Database does not exist!');
  process.exit(1);
}

console.info('Connect to database');
const db = new sqlite3.Database(DB_FILE_PATH);

db.serialize(async () => {
  const dbrun = promisify(db.run.bind(db));

  //////////////////////////////////////////////////////////////////////////////////////////////////

  console.info('Create table simpFrequency');
  await dbrun(`
    CREATE TABLE simpFrequency (
      id INTEGER PRIMARY KEY,
      freq BIGINT,
      char NCHAR(1),
      pinyin VARCHAR(255),
      def TEXT
    )
  `);

  //////////////////////////////////////////////////////////////////////////////////////////////////

  console.info('Compose and add entries from freq list');
  const selectByTradStatement = db.prepare('SELECT * FROM character WHERE trad = ?');
  const selectBySimpStatement = db.prepare('SELECT * FROM character WHERE simp = ?');

  const selectByTrad = promisify(selectByTradStatement.all.bind(selectByTradStatement));
  const selectBySimp = promisify(selectBySimpStatement.all.bind(selectBySimpStatement));

  const allCharacters = fs
    .readFileSync(path.join(__dirname, '../server/all-characters.txt'))
    .toString()
    .split('\n')
    .map(x => {
      const [id, char, freq] = x.split('\t');
      return { id, char, freq };
    });

  const allCharLength = allCharacters.length;
  for (let i = 0; i < allCharLength; i++) {
    const { id, char, freq } = allCharacters[i];
    if (!char) {
      console.debug('Skip entry missing character', id);
      continue;
    }
    let cedictEntry = await selectByTrad(char);
    if (cedictEntry.length === 0) {
      cedictEntry = await selectBySimp(char);
    }
    if (cedictEntry.length === 0) {
      console.debug(`Skip entry with unknown character "${char}"`, id);
      continue;
    }

    const insertStatement = db.prepare('INSERT INTO simpFrequency VALUES (?, ?, ?, ?, ?)');
    const values = [
      id,
      freq,
      cedictEntry[0].simp,
      cedictEntry.reduce((result, { pinyin }) => {
        result.push(pinyin);
        return result;
      }, []).join('/'),
      cedictEntry.reduce((result, { def }) => {
        result.push(def);
        return result;
      }, []).join('/')
    ];
    insertStatement.run(values);

    if ((i + 1) % 100 === 0 || i + 1 === allCharLength) {
      console.info('Finalize', i + 1);
      await promisify(insertStatement.finalize.bind(insertStatement))();
    }
  }
});
