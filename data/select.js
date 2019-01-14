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
  const selectByTradStatement = db.prepare('SELECT * FROM character WHERE trad = ?');
  const selectBySimpStatement = db.prepare('SELECT * FROM character WHERE simp = ?');

  const selectByTrad = promisify(selectByTradStatement.all.bind(selectByTradStatement));
  const selectBySimp = promisify(selectBySimpStatement.all.bind(selectBySimpStatement));

  const allCharacters = fs
    .readFileSync(path.join(__dirname, '../server/all-characters.txt'))
    .toString()
    .split('\n')
    .map(x => {
      const [i, c, , , p, d] = x.split('\t');
      return { i, c, p, d };
    });

  let missingCharacter = 0;
  for (let i = 0; i < allCharacters.length; i++) {
    const x = allCharacters[i];
    if (!x.c) continue;
    let cedictEntry = await selectByTrad(x.c);
    if (cedictEntry.length === 0) {
      cedictEntry = await selectBySimp(x.c);
    }
    if (cedictEntry.length === 0) {
      missingCharacter++;
      process.stdout.write(x.c);
      if (missingCharacter % 40 === 0) process.stdout.write('\n');
      // console.log('Could not find character', x.c);
    } else {
      x.c = cedictEntry[0].simp;
    }
  }
  process.stdout.write('\n');

  console.log('missingCharacter', missingCharacter)
  console.log('allCharacters.length', allCharacters.length)
});
