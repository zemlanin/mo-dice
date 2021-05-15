import cookie from "cookie";
import Core from "./core.js";

addEventListener("fetch", function (event) {
  const { request } = event;
  const response = handleRequest(request).catch(handleError);
  event.respondWith(response);
});

async function handleRequest(request) {
  let response, core;

  switch (new URL(request.url).pathname) {
    case "/":
      core = load(request);
      core.roll();
      response =
        core.lastRoll === 0 ? await luckyResponse() : rollAgainResponse(core);
      break;

    case "/clear":
      core = load(request);
      core.clear();
      response = clearResponse();
      break;
  }

  if (response) {
    return save(core, response);
  }

  return new Response(null, { status: 204 });
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

async function luckyResponse() {
  return (
    fetch("https://zemlan.in/")
      // create mutable `Response` based on fetch's unmutable one
      .then((response) => new Response(response.body, response))
  );
}

function rollAgainResponse(core) {
  return new Response(
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
}

function clearResponse() {
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/",
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

function save(core, response) {
  const headerFriendlyCore = new Core({
    ...core,
    symbols: ["[1]", "[2]", "[3]", "[4]", "[5]", "[6]"],
  });
  response.headers.set(
    "Modice-Last-Roll",
    headerFriendlyCore.pretty().lastRoll
  );
  response.headers.set(
    "Set-Cookie",
    cookie.serialize("modice", JSON.stringify(core), { httpOnly: true })
  );

  return response;
}
