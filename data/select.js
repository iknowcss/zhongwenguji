const fs = require('fs');
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
  const selectByTradStatement = db.prepare('SELECT * FROM character WHERE trad = ?');
  const selectBySimpStatement = db.prepare('SELECT * FROM character WHERE simp = ?');

  const selectByTrad = promisify(selectByTradStatement.all.bind(selectByTradStatement));
  const selectBySimp = promisify(selectBySimpStatement.all.bind(selectBySimpStatement));

  console.time('dbread');
  console.log(await selectByTrad('我'));
  console.timeEnd('dbread');

  console.time('dbread');
  console.log(await selectBySimp('在'));
  console.timeEnd('dbread');
});
