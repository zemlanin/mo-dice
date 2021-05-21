const R = (n) => parseInt(Math.random() * n);

class Core {
  static symbols = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  constructor(options) {
    options = options || {};

    this.symbols = options.symbols || Core.symbols;
    this.lastRoll =
      typeof options.lastRoll === "number"
        ? // 0 < options.lastRoll < this.symbols.length
          Math.max(0, Math.min(options.lastRoll, this.symbols.length - 1))
        : R(this.symbols.length);
    this.history = options.history || [];
  }

  roll() {
    this.lastRoll = R(this.symbols.length);
    this.history = [this.lastRoll, ...this.history].slice(0, 10);
  }

  pretty() {
    return {
      lastRoll: this.symbols[this.lastRoll],
      history: this.history.map((e) => this.symbols[e]),
    };
  }

  clear() {
    this.history = [];
  }
}

// 1. shares namespace
// 2. doesn't support `import`/`export` keywords nor dynamic `import()`
// export default Core;
