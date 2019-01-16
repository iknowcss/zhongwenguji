const { promisify } = require('util');

class TableManager {
  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
  }

  async isExists() {
    const { tableExists } = await promisify(this.db.get.bind(this.db))(`
      SELECT count(name) AS tableExists 
      FROM sqlite_master 
      WHERE type='table' 
      AND name='${this.tableName}'
    `);
    return tableExists;
  }

  async drop() {
    await promisify(this.db.run.bind(this.db))(`DROP TABLE ${this.tableName}`);
  }

  async dropIfExists() {
    if (await this.isExists()) {
      await this.drop();
    }
  }

  async create(columnDef) {
    const query = typeof columnDef === 'function'
      ? columnDef({ tableName: this.tableName })
      : `CREATE TABLE ${this.tableName} (${columnDef})`;

    await promisify(this.db.run.bind(this.db))(query);
  }

  async createIfNotExists(columnDef) {
    if (!(await this.isExists())) {
      await this.create(columnDef);
    }
  }

  async hasRows() {
    const result = await promisify(this.db.get.bind(this.db))(`SELECT * FROM ${this.tableName} LIMIT 1`);
    return !!result;
  }
}

module.exports = TableManager;