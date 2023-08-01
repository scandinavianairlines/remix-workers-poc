import {
  isDeferredData,
  isRedirectStatusCode,
  redirect,
  createDeferredReadableStream,
  isRedirectResponse,
  isResponse,
  json,
} from "@remix-run/server-runtime/dist/responses.js";
import {
  isRouteErrorResponse,
  UNSAFE_DEFERRED_SYMBOL,
} from "@remix-run/router";
import { isLoaderRequest } from "@remix-pwa/sw/lib/fetch/match.js";
import {
  createArgumentsFrom,
  getURLParams,
  isActionRequest,
} from "./request.js";
import { errorResponseToJson } from "./response.js";

export function handleRequest({
  routes,
  event,
  defaultHandler,
  errorHandler,
  loadContext,
}) {
  const request = event.request.clone();
  const url = new URL(request.url);
  const _data = url.searchParams.get("_data");
  const route = routes.find((route) => route.id === _data);

  try {
    if (isLoaderRequest(request) && route.module?.workerLoader) {
      return handleLoader({
        event,
        loader: route.module.workerLoader,
        routeId: route.id,
        loadContext,
      }).then(responseHandler);
    }

    if (isActionRequest(request) && route.module?.workerAction) {
      return handleAction({
        event,
        action: route.module.workerAction,
        routeId: route.id,
        loadContext,
      }).then(responseHandler);
    }
  } catch (error) {
    const handler = (error) =>
      errorHandler(error, createArgumentsFrom({ event, loadContext }));
    return _errorHandler({ error, handler });
  }

  return defaultHandler({
    request,
    params: getURLParams(request),
    context: { ...loadContext, event },
  });
}

async function handleLoader({ loader, event, routeId, loadContext }) {
  const _arguments = createArgumentsFrom({ event, loadContext });
  const result = await loader(_arguments);

  if (result === undefined) {
    throw new Error(
      `You defined a loader for route "${routeId}" but didn't return ` +
        `anything from your \`loader\` function. Please return a value or \`null\`.`
    );
  }

  if (isDeferredData(result)) {
    if (result.init && isRedirectStatusCode(result.init.status || 200)) {
      return redirect(
        new Headers(result.init.headers).get("Location"),
        result.init
      );
    }

    const body = createDeferredReadableStream(
      result,
      event.request.signal,
      "production"
    );
    const init = result.init || {};
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "text/remix-deferred");
    init.headers = headers;

    return new Response(body, init);
  }

  return isResponse(result) ? result : json(result);
}

async function handleAction({ action, event, routeId, loadContext }) {
  const _arguments = createArgumentsFrom({ event, loadContext });
  const result = await action(_arguments);

  if (result === undefined) {
    throw new Error(
      `You defined an action for route "${routeId}" but didn't return ` +
        `anything from your \`action\` function. Please return a value or \`null\`.`
    );
  }

  return isResponse(result) ? result : json(result);
}

/**
 * Takes an data route error and returns remix expected json response
 */
function _errorHandler({ error, handler: handleError }) {
  if (isResponse(error)) {
    error.headers.set("X-Remix-Catch", "yes");
    return error;
  }

  if (isRouteErrorResponse(error)) {
    if (error.error) {
      handleError(error.error);
    }
    return errorResponseToJson(error, serverMode);
  }

  let errorInstance =
    error instanceof Error ? error : new Error("Unexpected Server Error");
  handleError(errorInstance);
  return json(serializeError(errorInstance, serverMode), {
    status: 500,
    headers: {
      "X-Remix-Error": "yes",
    },
  });
}

/**
 * takes a response and returns a new response with the remix expected headers and status
 */
function responseHandler(response) {
  if (isRedirectResponse(response)) {
    // We don't have any way to prevent a fetch request from following
    // redirects. So we use the `X-Remix-Redirect` header to indicate the
    // next URL, and then "follow" the redirect manually on the client.
    let headers = new Headers(response.headers);
    headers.set("X-Remix-Redirect", headers.get("Location"));
    headers.set("X-Remix-Status", response.status);
    headers.delete("Location");
    if (response.headers.get("Set-Cookie") !== null) {
      headers.set("X-Remix-Revalidate", "yes");
    }

    return new Response(null, {
      status: 204,
      headers,
    });
  }

  // Mark all successful responses with a header so we can identify in-flight
  // network errors that are missing this header
  response.headers.set("X-Remix-Response", "yes");
  return response;
}
