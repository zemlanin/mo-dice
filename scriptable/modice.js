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

function getNthWord(core) {
  let nth = 0;

  for (const entry of core.history) {
    if (core.lastRoll === entry) {
      nth = nth + 1;
    } else {
      break;
    }
  }

  return [
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
}

function renderWidget(core) {
  const widget = new ListWidget();
  widget.refreshAfterDate = new Date(60 * 60 * 1000 + new Date());
  widget.backgroundColor = Color.dynamic(Color.white(), Color.black());

  const lastRollText = widget.addText(core.pretty().lastRoll);
  lastRollText.font = new Font("SanFranciscoDisplay-Black", 80);
  lastRollText.color = Color.dynamic(Color.black(), Color.white());

  const nthWord = getNthWord(core);

  if (nthWord) {
    const nthInARowText = widget.addText(`${nthWord} раз подряд!`);
    nthInARowText.font = Font.caption1();
    nthInARowText.textColor = Color.dynamic(
      Color.darkGray(),
      Color.lightGray()
    );
  }

  widget.addSpacer(null);

  const lastUpdateText = widget.addDate(new Date());
  lastUpdateText.font = Font.caption2();
  lastUpdateText.applyRelativeStyle();
  lastUpdateText.textColor = Color.dynamic(Color.lightGray(), Color.darkGray());

  return widget;
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

if (config.runsInWidget) {
  renderWidget(core);
} else if (config.runsWithSiri) {
  Speech.speak(getSpokenRoll(core));
} else if (config.runsInApp) {
  const widget = renderWidget(core);
  widget.presentSmall();
  console.log(getSpokenRoll(core));
}
