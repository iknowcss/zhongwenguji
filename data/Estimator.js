class Estimator {
  static formatSeconds(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds - m * 60);
    return `${m}m ${s}s`;
  }

  constructor(increment, total) {
    this.increment = increment;
    this.total = total;
    this.history = [];
  }

  addHistory(seconds) {
    if (this.history.length >= 3) {
      this.history.shift();
    }
    this.history.push(seconds);
  }

  getAverageSPI() {
    return this.history.reduce((sum, s) => sum + s, 0) / this.history.length;
  }

  estimateTime(current) {
    const now = process.hrtime();
    if (!this.lastTime) {
      this.lastTime = now;
      return 'Calculating...';
    }
    this.addHistory((now[0] - this.lastTime[0]) + 1e-9 * (now[1] - this.lastTime[1]));
    this.lastTime = now;
    return Estimator.formatSeconds(this.getAverageSPI() * (this.total - current) / this.increment);
  }

  printEstimateTime(current) {
    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);  // move cursor to beginning of line
    process.stdout.write(`Time remaining ~ ${this.estimateTime(current)}`);
  }
}

module.exports = Estimator;