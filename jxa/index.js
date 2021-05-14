#!/usr/bin/env osascript -l JavaScript

const app = Application.currentApplication();
app.includeStandardAdditions = true;
app.strictPropertyScope = true;
app.strictCommandScope = true;

const Core = require("./core.js");

// unicode dice are too small
const core = new Core({ symbols: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"] });

function render(core) {
  const { lastRoll, history } = core.pretty();
  return app.displayDialog(history.join(""), {
    withTitle: `Mo dice ${lastRoll}`,
    buttons: ["roll", "clear", "close"],
    defaultButton: "roll",
    cancelButton: "close",
  });
}

let btn;
while ((btn = render(core).buttonReturned)) {
  switch (btn) {
    case "roll":
      core.roll();
      break;
    case "clear":
      core.clear();
      break;
  }
}

function require(path) {
  // based on https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts#emulating-npms-require
  var handle = app.openForAccess(path);
  var contents = app.read(handle);
  app.closeAccess(path);

  var module = { exports: {} };
  // eslint-disable-next-line no-unused-vars
  var exports = module.exports;
  eval(contents);

  return module.exports;
}
