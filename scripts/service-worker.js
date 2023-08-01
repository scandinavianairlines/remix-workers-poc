import * as build from "@remix-pwa/build/magic";
import { handleRequest } from "./utils/handle-request";

// Context should be something from the build.entry.module;
const defaultContext = build.entry.module.getLoadContext?.() || {};
// if the user export a `defaultFetchHandler` inside the entry.worker.js, we use that one as default handler
const defaultHandler =
  build.entry.module.defaultFetchHandler ||
  ((event) => fetch(event.request.clone()));
// if the user export a `handleError` inside the entry.worker.js, we use that one as default handler
const defaultErrorHandler =
  build.entry.module.handleError ||
  ((error, { request }) => {
    if (!request.signal.aborted) {
      console.error(error);
    }
  });

self.addEventListener(
  "fetch",
  /**
   * @param {FetchEvent} event
   * @returns {Promise<Response>}
   */
  (event) => {
    const response = handleRequest({
      event,
      routes: build.routes,
      defaultHandler,
      errorHandler: defaultErrorHandler,
      loadContext: defaultContext,
    });
    return event.respondWith(response);
  }
);
