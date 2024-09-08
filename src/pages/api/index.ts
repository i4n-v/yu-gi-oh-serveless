import fastify from "fastify";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import router from "./_router";

const app = fastify();
router(app);

export default async function handler(request: VercelRequest, response: VercelResponse) {
  await app.ready();
  app.server.emit("request", request, response);
}
