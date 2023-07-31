/// <reference lib="WebWorker" />
// NOTE: if we import from @remix-pwa/sw, the bundle will be too big ass is not tree-shakable apparently
import { PrecacheHandler } from '@remix-pwa/sw/lib/message/precacheHandler.js';

const PAGES = "page-cache";
const DATA = "data-cache";
const ASSETS = "assets-cache";
const STATIC_ASSETS = ["/build/", "/icons/", "/favicon.ico"];

const precacheHandler = new PrecacheHandler({
  dataCacheName: DATA,
  documentCacheName: PAGES,
  assetCacheName: ASSETS,
});

// let self;

// export const defaultFetchHandler = (event) => {
//   //
//   console.log(event);
// }

// export const register = (self) => {
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  event.waitUntil(precacheHandler.handle(event));
});

// self.addEventListener("fetch", (event) => {
//   console.log("entry")
//   event.respondWith(defaultHandler(event));
// });
