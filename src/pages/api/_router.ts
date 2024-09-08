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

      const result = await processRequest({
        request: request as any,
        schema,
        operationName,
        query,
        variables,
        contextFactory,
      });

      sendResult(result, response);
    },
  },
];

export default router;
