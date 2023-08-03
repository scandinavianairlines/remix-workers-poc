import { isMethod } from "@remix-pwa/sw/lib/fetch/fetch.js";

export function clone(obj) {
  const init = {};
  for (const property in obj) {
    init[property] = obj[property];
  }
  return init;
}

export function getURLParams(request) {
  return Object.fromEntries(new URL(request.url).searchParams.entries());
}

export function stripIndexParam(request) {
  let url = new URL(request.url);
  let indexValues = url.searchParams.getAll("index");
  url.searchParams.delete("index");
  let indexValuesToKeep = [];
  for (let indexValue of indexValues) {
    if (indexValue) {
      indexValuesToKeep.push(indexValue);
    }
  }
  for (let toKeep of indexValuesToKeep) {
    url.searchParams.append("index", toKeep);
  }

  return new Request(url.href, { ...clone(request), duplex: "half" });
}

export function stripDataParam(request) {
  let url = new URL(request.url);
  url.searchParams.delete("_data");
  const init = {};
  for (const property in request) {
    init[property] = request[property];
  }

  return new Request(url.href, { ...clone(request), duplex: "half" });
}

export function createArgumentsFrom({ event, loadContext }) {
  const request = stripDataParam(stripIndexParam(event.request.clone()));
  const params = getURLParams(request);

  return {
    request,
    params,
    context: loadContext,
  };
}

export function isActionRequest(request) {
  const url = new URL(request.url);
  return (
    isMethod(request, ["post", "delete", "put", "patch"]) &&
    url.searchParams.get("_data")
  );
}
