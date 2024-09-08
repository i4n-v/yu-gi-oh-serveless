import type { VercelRequest, VercelResponse } from "@vercel/node";
import router from "./_router";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const route = router.find((route) => {
    return route.path.includes(request.url!) && route.method === request.method;
  });

  if (route) {
    return await route.handler(request, response);
  }

  response.status(404).json({
    status: 404,
    message: "404 route not found",
  });
}
