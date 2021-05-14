import Core from "./core.nginx.js";

function load(r) {
  try {
    return new Core(JSON.parse(decodeURIComponent(r.variables.cookie_modice)));
  } catch (e) {
    //
  }
  return new Core();
}

function save(r, core) {
  r.headersOut["Set-Cookie"] = `modice=${encodeURIComponent(
    JSON.stringify(core)
  )}`;
}

function index(r) {
  var core = load();

  core.roll();

  save(r, core);

  r.headersOut["Content-Type"] = "text/html; charset=utf-8";
  r.headersOut["Modice-Last-Roll"] = new Core({
    ...core,
    symbols: ["[1]", "[2]", "[3]", "[4]", "[5]", "[6]"],
  }).pretty().lastRoll;

  var gotLucky = core.lastRoll === 0;

  if (gotLucky) {
    // Only the `http://` scheme is supported, redirects are not handled
    ngx
      .fetch("http://zemlan.in/")
      .then((reply) => {
        r.headersOut["Content-Type"] = reply.headers.get("Content-Type");
        return reply.text();
      })
      .then((body) => r.return(200, body))
      .catch((e) => r.return(500, e.toString()));
  } else {
    // debug
    r.return(
      403,
      `<title>Try Again</title>
      <style>body {font-size: 80px; text-align: center}</style>
      <img src="https://http.cat/403" width="403">
      <hr>
      <code>${core.pretty().history.join(" ")}</code>`
    );
  }
}

function clear(r) {
  var core = load();

  core.clear();

  save(r, core);

  r.return(303, "/");
}

export default { index, clear };
