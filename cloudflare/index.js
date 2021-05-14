import cookie from "cookie";
import Core from "./core.js";

addEventListener("fetch", function (event) {
  const { request } = event;
  const response = handleRequest(request).catch(handleError);
  event.respondWith(response);
});

async function handleRequest(request) {
  switch (new URL(request.url).pathname) {
    case "/":
      return respondRoll(request);
    case "/clear":
      return respondClear(request);
  }

  return new Response(null, { status: 204 });
}

function applyHeaders(resp, core) {
  const headerFriendlyCore = new Core({
    ...core,
    symbols: ["[1]", "[2]", "[3]", "[4]", "[5]", "[6]"],
  });
  resp.headers.set("Modice-Last-Roll", headerFriendlyCore.pretty().lastRoll);
  resp.headers.set("Set-Cookie", serialize(core));
}

async function respondRoll(request) {
  const core = load(request);

  core.roll();

  if (core.lastRoll === 0) {
    return fetch("https://zemlan.in/").then((resp) => {
      resp = new Response(resp.body, resp);
      applyHeaders(resp, core);
      return resp;
    });
  }

  const resp = new Response(
    `<title>Try Again</title>
      <style>body {text-align: center} code {font-size: 80px} a {display: block}</style>
      <img src="https://http.cat/403" width="403">
      <hr>
      <code>${core.pretty().history.join(" ")}</code>
      <a href="/clear">🚮</a>`,
    {
      status: 403,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );

  applyHeaders(resp, core);
  return resp;
}

async function respondClear(request) {
  const core = load(request);
  core.clear();

  const resp = new Response(null, {
    status: 303,
    headers: {
      Location: new URL("/", request.url).toString(),
      "Set-Cookie": serialize(core),
    },
  });

  resp.headers.set("Set-Cookie", serialize(core));

  return resp;
}

function handleError(error) {
  console.error("Uncaught error:", error);

  const { stack } = error;
  return new Response(stack || error, {
    status: 500,
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  });
}

function load(request) {
  try {
    const state = JSON.parse(
      cookie.parse(request.headers.get("Cookie")).modice
    );
    return new Core(state);
  } catch (e) {
    console.error(e);
  }
  return new Core();
}

function serialize(core) {
  return cookie.serialize("modice", JSON.stringify(core), { httpOnly: true });
}
