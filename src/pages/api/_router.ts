import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from "graphql-helix";
import schema from "./_schema";
import { VercelRequest, VercelResponse } from "@vercel/node";
import contextFactory from "./_context";
import crypto from "crypto";
import { kv } from "@vercel/kv";

const router = [
  {
    path: "/api",
    method: "GET",
    handler: async (request: VercelRequest, response: VercelResponse) => {
      response.json({
        active: true,
        system: "yu-gi-oh-serveless",
        region: process.env.VERCEL_REGION ?? "Não indentificada",
      });
    },
  },
  {
    path: "/api/graphql",
    method: "GET",
    handler: async (request: VercelRequest, response: VercelResponse) => {
      if (shouldRenderGraphiQL(request as any)) {
        response.setHeader("Content-Type", "text/html");
        response.send(
          renderGraphiQL({
            endpoint: "/api",
          })
        );
      }
    },
  },
  {
    path: "/api/graphql",
    method: "POST",
    handler: async (request: VercelRequest, response: VercelResponse) => {
      const { operationName, query, variables } = getGraphQLParameters(request as any);

      const keyString = JSON.stringify({ operationName, query, variables });
      const redisKey = crypto.createHash("md5").update(keyString).digest("hex");
      const redisResult = await kv.get<string | undefined>(redisKey);

      if (redisResult) {
        console.log("======================= RETURNING REDIS RESULT ==========================");
        return response.json(redisResult);
      }

      const result = await processRequest({
        request: request as any,
        schema,
        operationName,
        query,
        variables,
        contextFactory,
      });

      console.log("======================= SAVING DATA ON REDIS ==========================");
      const resultToStore = JSON.stringify(result.payload);
      await kv.set(redisKey, resultToStore);

      sendResult(result, response);
    },
  },
];

export default router;
