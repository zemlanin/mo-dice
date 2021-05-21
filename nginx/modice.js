import Core from "./core.js";

function load(r) {
  try {
    return new Core(
      JSON.parse(
        decodeURIComponent(
          // using nginx's predefined `cookie_` variables
          r.variables.cookie_modice
        )
      )
    );
  } catch (e) {
    ngx.log(ngx.ERR, e);
  }
  return new Core();
}

function save(r, core) {
  r.headersOut["Set-Cookie"] = `modice=${encodeURIComponent(
    JSON.stringify(core)
  )}`;
}

function luckyResponse(r) {
  // Only the `http://` scheme is supported, redirects are not handled
  ngx
    .fetch("http://zemlan.in/", {
      max_response_body_size: 64 * 1024,
    })
    .then((reply) => {
      return reply.text().then((body) => {
        r.headersOut["Content-Type"] = reply.headers.get("Content-Type");
        r.return(reply.status, body);
      });
    })
    .catch((e) => r.return(500, e.toString()));
}

function rollAgainResponse(r, core) {
  r.headersOut["Content-Type"] = "text/html; charset=utf-8";

  r.return(
    403,
    `<title>Try Again</title>
    <style>body {text-align: center} code {font-size: 80px} a {display: block}</style>
    <img src="https://http.cat/403" width="403">
    <hr>
    <code>${core.pretty().history.join(" ")}</code>
    <a href="/clear">🚮</a>`
  );
}

function index(r) {
  var core = load(r);

  core.roll();

  save(r, core);

  if (core.lastRoll === 0) {
    luckyResponse(r);
  } else {
    rollAgainResponse(r, core);
  }
}

function clear(r) {
  var core = load();

  core.clear();

  save(r, core);

  r.return(303, r.headersIn.referer);
}

export default { index, clear };
