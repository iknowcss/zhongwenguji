const fs = require('fs');
const sqlite3 = require('sqlite3');

const DB_FILE_PATH = './characters.sqlite';
const isRebuild = process.argv.indexOf('--rebuild') >= 0;

if (isRebuild) {
  console.info('Delete database');
  fs.existsSync(DB_FILE_PATH) && fs.unlinkSync(DB_FILE_PATH);
}

if (fs.existsSync(DB_FILE_PATH)) {
  console.info('Database exists');
} else {
  console.info('Database does not exist - create');
  new sqlite3.Database(DB_FILE_PATH);
}
