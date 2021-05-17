// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: dice;
const Core = importModule("modice/core.js");

const fileManager = FileManager.local();
const cachePath = fileManager.joinPath(
  fileManager.documentsDirectory(),
  "modice.json"
);

function load() {
  if (fileManager.fileExists(cachePath)) {
    try {
      return new Core(JSON.parse(fileManager.readString(cachePath)));
    } catch (e) {
      console.error(e);
    }
  }
  return new Core();
}

function save(core) {
  fileManager.writeString(cachePath, JSON.stringify(core));
}

function getSpokenRoll(core) {
  const wordy = new Core({
    ...core,
    symbols: ["единицу", "двойку", "тройку", "четвёрку", "пятёрку", "шестёрку"],
  });

  let nth = 0;

  for (const entry of core.history) {
    if (core.lastRoll === entry) {
      nth = nth + 1;
    } else {
      break;
    }
  }

  const numeralWord = [
    "",
    "",
    "второй",
    "третий",
    "четвёртый",
    "пятый",
    "шестой",
    "седьмой",
    "восьмой",
    "девятый",
    "десятый",
  ][nth];
  return numeralWord
    ? `Кубик ${numeralWord} раз показал ${wordy.pretty().lastRoll}`
    : `Кубик показал ${wordy.pretty().lastRoll}`;
}

const core = load();

core.roll();

save(core);

const response = getSpokenRoll(core);

console.log(response);

if (config.runsWithSiri) {
  Speech.speak(response);
}
