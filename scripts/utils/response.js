import { json } from "@remix-run/server-runtime/dist/responses.js";

export function errorResponseToJson(errorResponse) {
  return json(errorResponse.error || new Error("Unexpected Server Error"), {
    status: errorResponse.status,
    statusText: errorResponse.statusText,
    headers: {
      "X-Remix-Error": "yes",
    },
  });
}
