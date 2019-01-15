const fs = require('fs');
const sqlite3 = require('sqlite3');

const CC_CEDICT_FILE_PATH = './cedict_ts.u8';
const DB_FILE_PATH = './characters.sqlite';

if (fs.existsSync(DB_FILE_PATH)) {
  console.info('Database exists');
  process.exit(0);
}

console.info('Create database');
const db = new sqlite3.Database(DB_FILE_PATH);

db.serialize(async () => {
  console.info('Create table character');
  db.run(`
    CREATE TABLE character (
      id INTEGER PRIMARY KEY,
      trad NCHAR(1),
      simp NCHAR(1),
      pinyin CHAR(10),
      def TEXT
    )
  `);

  console.info('Add traditional character index');
  db.run(`CREATE INDEX character_trad ON character (trad)`);
  db.run(`CREATE INDEX character_simp ON character (simp)`);

  const ASDF_REGEXP = /^(\S+)\s+(\S+)\s+\[([^\]]+)]\s+\/(.+)\/$/;
  const IGNORE_LINE_REGEXP = /^[a-zA-Z0-9#%]|Japanese variant of|\[xx/;

  let addCount = 0;
  const allRows = fs.readFileSync(CC_CEDICT_FILE_PATH).toString().split(/\r?\n/);
  const totalRowCount = allRows.length;

  console.info('Process file rows', totalRowCount);
  for (let i = 0; i < totalRowCount; i++) {
    const row = allRows[i];
    if (IGNORE_LINE_REGEXP.test(row)) continue;
    if (ASDF_REGEXP.test(row)) {
      const stmt = db.prepare(`
        INSERT INTO character (id, trad, simp, pinyin, def) VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run([++addCount].concat(row.match(ASDF_REGEXP).slice(1)));
      if (addCount % 2500 === 0) {
        console.info('Write', addCount);
        await new Promise((resolve, reject) => stmt.finalize((err) => {
          if (err) {
            console.error('Error', err);
            reject(err);
          } else {
            resolve();
          }
        }));
        // break;
      }
    }
  }

  // db.get('SELECT * FROM character LIMIT 1', (err, row) => console.log(row))

  console.info('Done! Total', addCount);
});
