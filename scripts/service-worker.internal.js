import * as build from "@remix-pwa/build/magic";
import { handleRequest } from "./utils/handle-request";

// NOTE: Inject a `serverFetch` and the original `event` in the context.
function createContext(event) {
  const request = event.request.clone();
  // getLoadContext is a function exported by the `entry.worker.js`
  const context = build.entry.module.getLoadContext?.(event) || {};
  return {
    event,
    fetchFromServer: (req = request) => fetch(req),
    // NOTE: we want the user to override the above properties if needed.
    ...context,
  };
}

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
      loadContext: createContext(event),
    });
    return event.respondWith(response);
  }
);
