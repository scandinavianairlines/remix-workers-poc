var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// routes-module:root.jsx?worker
var require_root = __commonJS({
  "routes-module:root.jsx?worker"(exports, module) {
    module.exports = {};
  }
});

// empty-module:@remix-run/node
var require_node = __commonJS({
  "empty-module:@remix-run/node"(exports, module) {
    module.exports = {};
  }
});

// empty-module:react/jsx-runtime
var require_jsx_runtime = __commonJS({
  "empty-module:react/jsx-runtime"(exports, module) {
    module.exports = {};
  }
});

// routes-module:routes/_index.jsx?worker
var require_index = __commonJS({
  "routes-module:routes/_index.jsx?worker"(exports, module) {
    module.exports = {};
  }
});

// routes-module:routes/_app.jsx?worker
var require_app = __commonJS({
  "routes-module:routes/_app.jsx?worker"(exports, module) {
    module.exports = {};
  }
});

// routes-module:routes/te.jsx?worker
var require_te = __commonJS({
  "routes-module:routes/te.jsx?worker"(exports, module) {
    module.exports = {};
  }
});

// entry-module:@remix-pwa/build/magic
var route0 = __toESM(require_root());

// routes-module:routes/_app.flights.($id).jsx?worker
var app_flights_id_exports = {};
__export(app_flights_id_exports, {
  hasWorkerAction: () => hasWorkerAction,
  hasWorkerLoader: () => hasWorkerLoader,
  workerAction: () => workerAction,
  workerLoader: () => workerLoader
});

// app/routes/_app.flights.($id).jsx
var import_node = __toESM(require_node());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var workerAction = async ({ request }) => {
  console.log("hola");
};
var workerLoader = async ({ request }) => {
  console.log("hola");
};

// routes-module:routes/_app.flights.($id).jsx?worker
var hasWorkerAction = true;
var hasWorkerLoader = true;

// entry-module:@remix-pwa/build/magic
var route2 = __toESM(require_index());
var route3 = __toESM(require_app());
var route4 = __toESM(require_te());

// node_modules/@remix-pwa/sw/lib/message/message.js
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var MessageHandler = class {
  constructor({ plugins, state } = {}) {
    Object.defineProperty(this, "plugins", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "state", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.plugins = plugins || [];
    this.state = state || {};
  }
  /**
   * The method that handles the message event.
   *
   * Takes in the MessageEvent as a mandatory argument as well as an optional
   * object that can be used to pass further information/data.
   */
  handle(event, state = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this._handleMessage(event, state);
    });
  }
  /**
   * Runs the plugins that are passed in when the handler is initialised.
   */
  runPlugins(hook, env) {
    return __awaiter(this, void 0, void 0, function* () {
      for (const plugin of this.plugins) {
        if (plugin[hook]) {
          plugin[hook](env);
        }
      }
    });
  }
};

// node_modules/@remix-pwa/sw/lib/core/logger.js
var methodToColorMap = {
  debug: `#7f8c8d`,
  log: `#2ecc71`,
  info: `#3498db`,
  warn: `#f39c12`,
  error: `#c0392b`,
  groupCollapsed: `#3498db`,
  groupEnd: null
  // No colored prefix on groupEnd
};
var logger = false ? (() => {
  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);
  self.__DISABLE_PWA_DEBUG_LOGS = true;
  self.__DISABLE_PWA_DEV_LOGS = true;
  self.__DISABLE_PWA_INFO_LOGS = true;
  self.__DISABLE_PWA_WARN_LOGS = true;
  self.__DISABLE_PWA_ERROR_LOGS = true;
  for (const key of loggerMethods) {
    const method = key;
    api[method] = noop;
  }
  return api;
})() : (() => {
  let inGroup = false;
  const print = function(method, args) {
    if (self.__DISABLE_PWA_DEV_LOGS) {
      return;
    }
    if (method === "debug" && self.__DISABLE_PWA_DEBUG_LOGS) {
      return;
    }
    if (method === "info" && self.__DISABLE_PWA_INFO_LOGS) {
      return;
    }
    if (method === "warn" && self.__DISABLE_PWA_WARN_LOGS) {
      return;
    }
    if (method === "error" && self.__DISABLE_PWA_ERROR_LOGS) {
      return;
    }
    if (method === "groupCollapsed") {
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }
    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`
    ];
    const logPrefix = inGroup ? [] : ["%cremix-pwa", styles.join(";")];
    console[method](...logPrefix, ...args);
    if (method === "groupCollapsed") {
      inGroup = true;
    }
    if (method === "groupEnd") {
      inGroup = false;
    }
  };
  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);
  for (const key of loggerMethods) {
    const method = key;
    api[method] = (...args) => {
      print(method, args);
    };
  }
  return api;
})();

// node_modules/@remix-pwa/sw/lib/message/precacheHandler.js
var __awaiter2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var PrecacheHandler = class extends MessageHandler {
  constructor({ plugins, dataCacheName, documentCacheName, assetCacheName, state }) {
    super({ plugins, state: {} });
    Object.defineProperty(this, "dataCacheName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "documentCacheName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "assetCacheName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_ignoredFiles", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: null
    });
    this.dataCacheName = dataCacheName;
    this.documentCacheName = documentCacheName;
    this.assetCacheName = assetCacheName;
    this._handleMessage = this._handleMessage.bind(this);
    this._ignoredFiles = (state === null || state === void 0 ? void 0 : state.ignoredRoutes) || null;
  }
  _handleMessage(event) {
    return __awaiter2(this, void 0, void 0, function* () {
      let DATA_CACHE, DOCUMENT_CACHE, ASSET_CACHE;
      DATA_CACHE = this.dataCacheName;
      DOCUMENT_CACHE = this.documentCacheName;
      ASSET_CACHE = this.assetCacheName;
      this.runPlugins("messageDidReceive", {
        event
      });
      const cachePromises = /* @__PURE__ */ new Map();
      const [dataCache, documentCache, assetCache] = yield Promise.all([
        caches.open(DATA_CACHE),
        caches.open(DOCUMENT_CACHE),
        caches.open(ASSET_CACHE)
      ]);
      const manifest = event.data.manifest;
      const routes2 = Object.values((manifest === null || manifest === void 0 ? void 0 : manifest.routes) || {});
      for (const route of routes2) {
        if (route.id.includes("$")) {
          logger.info("Skipping parametrized route:", route.id);
          continue;
        }
        if (Array.isArray(this._ignoredFiles)) {
          if (typeof this._ignoredFiles[0] === "string") {
            const map = this._ignoredFiles.map((ignoredRoute) => {
              ignoredRoute = ignoredRoute;
              ignoredRoute = ignoredRoute.charAt(0) === "/" ? ignoredRoute : ignoredRoute = "/" + ignoredRoute;
              if (getPathname(route) == ignoredRoute) {
                logger.debug("Skipping ignored route:", route.id);
                return true;
              } else {
                return false;
              }
            });
            if (map.includes(true))
              continue;
          } else if (typeof this._ignoredFiles[0] === "function") {
            const map = this._ignoredFiles.map((ignoredRoute) => {
              ignoredRoute = ignoredRoute;
              if (ignoredRoute(route)) {
                logger.debug("Skipping ignored route:", route.id);
                return true;
              } else {
                return false;
              }
            });
            if (map.includes(true))
              continue;
          } else if (this._ignoredFiles[0] instanceof RegExp) {
            let map = this._ignoredFiles.map((ignoredRoute) => {
              ignoredRoute = ignoredRoute;
              if (ignoredRoute.test(getPathname(route))) {
                logger.debug("Skipping ignored route:", route.id);
                return true;
              } else {
                return false;
              }
            });
            if (map.includes(true))
              continue;
          } else {
            logger.error("Invalid ignoredRoutes type:", this._ignoredFiles);
          }
        } else if (typeof this._ignoredFiles === "function") {
          if (this._ignoredFiles(route)) {
            logger.debug("Skipping ignored route:", route.id);
            continue;
          }
        }
        logger.log("Precaching route:", route.id);
        cacheRoute(route);
      }
      yield Promise.all(cachePromises.values());
      function cacheRoute(route) {
        const pathname = getPathname(route);
        if (route.hasLoader) {
          cacheLoaderData(route);
        }
        if (route.module) {
          cachePromises.set(route.module, cacheAsset(route.module));
        }
        if (route.imports) {
          for (const assetUrl of route.imports) {
            logger.groupCollapsed("Caching asset: ", assetUrl);
            logger.log("Is index:", route.index || false);
            logger.log("Parent ID:", route.parentId);
            logger.log("Imports:", route.imports);
            logger.log("Module:", route.module);
            logger.groupEnd();
            if (cachePromises.has(assetUrl)) {
              continue;
            }
            cachePromises.set(assetUrl, cacheAsset(assetUrl));
          }
        }
        logger.info("Caching document:", pathname);
        cachePromises.set(pathname, documentCache.add(pathname).catch((error) => {
          if (error instanceof TypeError) {
            logger.error(`TypeError when caching document ${pathname}:`, error.message);
          } else if (error instanceof DOMException) {
            logger.error(`DOMException when caching document ${pathname}:`, error.message);
          } else {
            logger.error(`Failed to cache document ${pathname}:`, error);
          }
        }));
      }
      function cacheLoaderData(route) {
        const pathname = getPathname(route);
        const params = new URLSearchParams({ _data: route.id });
        const search = `?${params.toString()}`;
        const url = pathname + search;
        if (!cachePromises.has(url)) {
          logger.debug("caching loader data", url);
          cachePromises.set(url, dataCache.add(url).catch((error) => {
            if (error instanceof TypeError) {
              logger.error(`TypeError when caching data ${pathname}:`, error.message);
            } else if (error instanceof DOMException) {
              logger.error(`DOMException when caching data ${pathname}:`, error.message);
            } else {
              logger.error(`Failed to cache data ${pathname}:`, error);
            }
          }));
        }
      }
      function cacheAsset(assetUrl) {
        return __awaiter2(this, void 0, void 0, function* () {
          if (yield assetCache.match(assetUrl)) {
            return;
          }
          logger.debug("Caching asset:", assetUrl);
          return assetCache.add(assetUrl).catch((error) => {
            if (error instanceof TypeError) {
              logger.error(`TypeError when caching asset ${assetUrl}:`, error.message);
            } else if (error instanceof DOMException) {
              logger.error(`DOMException when caching asset ${assetUrl}:`, error.message);
            } else {
              logger.error(`Failed to cache asset ${assetUrl}:`, error);
            }
          });
        });
      }
      function getPathname(route) {
        if (route.index && route.parentId === "root")
          return "/";
        let pathname = "";
        if (route.path && route.path.length > 0) {
          pathname = "/" + route.path;
        }
        if (route.parentId) {
          const parentPath = getPathname(manifest.routes[route.parentId]);
          if (parentPath) {
            pathname = parentPath + pathname;
          }
        }
        return pathname;
      }
    });
  }
};

// app/entry.worker.js
var PAGES = "page-cache";
var DATA = "data-cache";
var ASSETS = "assets-cache";
var precacheHandler = new PrecacheHandler({
  dataCacheName: DATA,
  documentCacheName: PAGES,
  assetCacheName: ASSETS
});
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("message", (event) => {
  event.waitUntil(precacheHandler.handle(event));
});

// entry-module:@remix-pwa/build/magic
var routes = [
  { file: "root.jsx", path: "", module: route0, id: "root", parentId: "undefined" },
  { file: "routes/_app.flights.($id).jsx", path: "flights/:id?", module: app_flights_id_exports, id: "routes/_app.flights.($id)", parentId: "routes/_app" },
  { file: "routes/_index.jsx", path: "undefined", module: route2, id: "routes/_index", parentId: "root" },
  { file: "routes/_app.jsx", path: "undefined", module: route3, id: "routes/_app", parentId: "root" },
  { file: "routes/te.jsx", path: "te", module: route4, id: "routes/te", parentId: "root" }
];

// scripts/service-worker.js
var defaultHandler = (void 0).module.defaultFetchHandler || ((event) => event.responseWith(fetch(event.request.clone())));
console.log(routes);
self.addEventListener("fetch", (event) => {
  console.log(routes);
  console.log(event);
  console.log(event.request.url);
  console.log(event.request.url.searchParams.get("_data"));
  const url = new URL(event.request.url);
  const data = url.searchParams.get("_data");
  const route = routes.find((route5) => route5.id === data);
  console.log(route);
  if (route.hasWorkerLoader) {
    const handler = route.module.workerLoader;
    return event.respondWith(handler(event));
  } else {
    return event.respondWith(defaultHandler(event));
  }
});
console.log(routes);
//# sourceMappingURL=service-worker.js.map