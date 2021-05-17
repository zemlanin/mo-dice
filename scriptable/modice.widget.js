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

function getTimeInARow(core) {
  let result = 0;

  for (const entry of core.history) {
    if (core.lastRoll === entry) {
      result = result + 1;
    } else {
      break;
    }
  }

  return result;
}

function renderWidget(core) {
  const widget = new ListWidget();
  widget.refreshAfterDate = new Date(60 * 60 * 1000 + new Date());
  widget.backgroundColor = Color.dynamic(Color.white(), Color.black());

  const lastRollText = widget.addText(core.pretty().lastRoll);
  lastRollText.font = new Font("SanFranciscoDisplay-Black", 80);
  lastRollText.color = Color.dynamic(Color.black(), Color.white());

  widget.addSpacer(null);

  const timeInARow = getTimeInARow(core);

  if (timeInARow > 1) {
    const nthInARowText = widget.addText(`×${timeInARow} COMBO!`);
    nthInARowText.font = Font.caption1();
    nthInARowText.textColor = Color.red();
  }

  return widget;
}

const core = load();

core.roll();

save(core);

const widget = renderWidget(core);

if (config.runsInApp) {
  widget.presentSmall();
}
