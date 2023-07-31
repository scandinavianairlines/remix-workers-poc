import * as build from "@remix-pwa/build/magic";
import { isLoaderRequest } from "@remix-pwa/sw/lib/fetch/match.js";
import { isMethod } from "@remix-pwa/sw/lib/fetch/fetch.js";
import { json } from "@remix-run/router";

// if the user export a `defaultFetchHandler` inside the entry.worker.js, we use that one as default handler
const defaultHandler =
  build.entry.module.defaultFetchHandler ||
  ((event) => fetch(event.request.clone()));

function isActionRequest(request) {
  const url = new URL(request.url);
  return (
    isMethod(request, ["post", "delete", "put", "patch"]) &&
    url.searchParams.get("_data")
  );
}

function isResponse(value) {
  return (
    value != null &&
    typeof value.status === "number" &&
    typeof value.statusText === "string" &&
    typeof value.headers === "object" &&
    typeof value.body !== "undefined"
  );
}

self.addEventListener(
  "fetch",
  /**
   * @param {FetchEvent} event
   * @returns {Promise<Response>}
   */
  (event) => {
    const url = new URL(event.request.url);
    if (isLoaderRequest(event.request)) {
      const _data = url.searchParams.get("_data");
      const route = build.routes.find((route) => route.id === _data);

      if (route.module?.workerLoader) {
        return event.respondWith(
          (async () => {
            // Create worker wrapper HoF that handles the response.
            const response = await route.module.workerLoader(event);
            // Here we should add logic to support redirects and deferred responses.
            return isResponse(response) ? response : json(response);
          })()
        );
      }
    }

    if (isActionRequest(event.request)) {
      const _data = url.searchParams.get("_data");
      const route = build.routes.find((route) => route.id === _data);

      if (route.module?.workerAction) {
        return event.respondWith(
          (async () => {
            const response = await route.module.workerAction(event);
            return isResponse(response) ? response : json(response);
          })()
        );
      }
    }

    return event.respondWith(defaultHandler(event));
  }
);
