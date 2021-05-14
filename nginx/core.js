// no const, but does have arrow functions
var R = (symbols) => symbols[parseInt(Math.random() * symbols.length)];

// no class
function Core(options) {
  options = options || {};

  this.symbols = options.symbols || Core.symbols;
  this.lastRoll =
    typeof options.lastRoll === "number"
      ? options.lastRoll
      : R(this.symbols.length);
  this.history = options.history || [];
}

Core.symbols = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

Core.prototype = {
  roll() {
    this.lastRoll = R(this.symbols.length);
    // no spread
    this.history = [this.lastRoll].concat(this.history).slice(0, 10);
  },

  pretty() {
    return {
      lastRoll: this.symbols[this.lastRoll],
      history: this.history.map((e) => this.symbols[e]),
    };
  },

  clear() {
    this.history = [];
  },
};

// but does support import/export keywords
export default Core;
