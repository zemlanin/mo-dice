import cookie from "cookie";
export {DurableModice} from "./durable"

export default {
  async fetch(request, env) {
    try {
      const sessionIdFromCookie = cookie.parse(
        request.headers.get("Cookie") || ""
      ).session;
      let newSessionId;

      if (!sessionIdFromCookie) {
        newSessionId = Math.random().toString();
      }

      const objectId = env.MODICE.idFromName(sessionIdFromCookie || newSessionId);
      const durable = await env.MODICE.get(objectId);

      let response = await durable.fetch(request);

      if (newSessionId) {
        // create mutable `Response` based on fetch's unmutable one
        response = new Response(response.body, response)
        response.headers.set(
          "Set-Cookie",
          cookie.serialize("session", newSessionId, { httpOnly: true })
        );
      }

      return response;
    } catch (e) {
      return new Response(e.stack, {status: 500})
    }
  },
};
