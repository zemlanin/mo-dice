/**
 * Rolls a die with custom faces.
 *
 * @param {string|Array<Array<string>>} faces The value or range of cells
 *     to use as a die faces.
 * @return A die roll.
 * @customfunction
 */
function ROLL(faces) {
  let symbols;

  if (Array.isArray(faces)) {
    symbols = faces.reduce((acc, row) => [...acc, ...row], []).filter(Boolean);
  } else if (faces) {
    symbols = faces.toString().split("");
  }
  const core = new Core({
    symbols,
  });
  core.roll();
  return core.pretty().lastRoll;
}
