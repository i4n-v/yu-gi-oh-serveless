import { FastifyInstance } from "fastify";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from "graphql-helix";
import schema from "./_schema";

export default function router(server: FastifyInstance) {
  server.get("/api", (request, response) => {
    response.send({
      active: true,
      system: "yu-gi-oh-serveless",
      region: process.env.VERCEL_REGION ?? "Não indentificada",
    });
  });

  server.get("/api/graphql", (request, response) => {
    if (shouldRenderGraphiQL(request)) {
      response.header("Content-Type", "text/html");
      response.send(
        renderGraphiQL({
          endpoint: "/graphql",
        })
      );
    }
  });

  server.post("/graphql", async (request, response) => {
    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      request,
      schema,
      operationName,
      query,
      variables,
    });

    sendResult(result, response.raw);
  });
}
