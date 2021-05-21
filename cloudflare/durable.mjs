import Core from "./core";

// accessible via `env.MODICE`
export class DurableModice {
  // eslint-disable-next-line no-unused-vars
  constructor(controller, env) {
    this.controller = controller;
    this.core = null;
    this.loadPromise = null;
  }

  async load() {
    if (this.core) {
      return;
    }

    try {
      this.core = new Core(
        JSON.parse(await this.controller.storage.get("state"))
      );
      return;
    } catch (e) {
      console.error(e);
    }

    this.core = new Core();
  }

  async save() {
    await this.controller.storage.put("state", JSON.stringify(this.core));
  }

  async fetch(request) {
    if (!this.loadPromise) {
      this.loadPromise = this.load();
    }
    await this.loadPromise;

    switch (new URL(request.url).pathname) {
      case "/":
        return this.roll();
      case "/clear":
        return this.clear(request);
    }

    return new Response(null, { status: 204 });
  }

  async roll() {
    this.core.roll();
    await this.save();

    let response;

    if (this.core.lastRoll === 0) {
      response = await fetch("https://zemlan.in/")
      // create mutable `Response` based on fetch's unmutable one
      response = new Response(response.body, response);
    } else {
      response = new Response(
        `<title>Try Again</title>
          <style>body {text-align: center} code {font-size: 80px} a {display: block}</style>
          <img src="https://http.cat/403" width="403">
          <hr>
          <code>${this.core.pretty().history.join(" ")}</code>
          <a href="/clear">🚮</a>`,
        {
          status: 403,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        }
      );
    }

    return response;
  }

  async clear(request) {
    this.core.clear();
    await this.save();

    return new Response(null, {
      status: 303,
      headers: {
        Location: request.headers.get("Referer"),
      },
    });
  }
}
