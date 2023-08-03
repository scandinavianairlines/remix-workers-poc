"use strict";
const FILTER_REGEX = /@remix-pwa\/build\/magic$/;
const NAMESPACE = "entry-module";

/**
 * Creates a string representation of the routes to be imported
 * @param {Array<import('@remix-run/dev/dist/config/routes').ConfigRoute>} routes
 * @returns {string}
 */
function createRouteImports(routes) {
  return routes
    .map(
      (route, index) => `import * as route${index} from '${route.file}?worker'`
    )
    .join(";\n");
}

/**
 * Creates a string representation of each route item.
 * @param {Array<import('@remix-run/dev/dist/config/routes').ConfigRoute>} routes
 * @returns {string}
 */
function createRouteList(routes) {
  return routes
    .map(
      (route, index) =>
        `{ file: "${route.file}", path: "${route.path}", module: route${index}, id: "${route.id}", parentId: "${route.parentId}", }`
    )
    .join(",\n");
}

/**
 * @param {import('../utils/config').ResolvedWorkerConfig} config
 * @returns {import('esbuild').Plugin} Esbuild plugin
 */
function entryModulePlugin(config) {
  /**
   * @param {import('esbuild').PluginBuild} build
   */
  function setup(build) {
    /** @type {(args: import('esbuild').OnResolveArgs) => import('esbuild').OnResolveResult} */
    const onResolve = ({ path }) => ({ path, namespace: NAMESPACE });
    /** @type {(args: import('esbuild').OnResolveArgs) => import('esbuild').OnResolveResult} */
    const onLoad = () => {
      const routes = Object.values(config.routes);
      const contents = `
    ${createRouteImports(routes, config.appDirectory)}

    export const routes = [
      ${createRouteList(routes)}
    ];

    import * as entryWorker from  '${config.worker}?user';
    export const entry = { module: entryWorker };
    `;

      return {
        contents,
        resolveDir: config.appDirectory,
        loader: "js",
      };
    };

    build.onResolve({ filter: FILTER_REGEX }, onResolve);
    build.onLoad({ filter: FILTER_REGEX, namespace: NAMESPACE }, onLoad);
  }

  return {
    name: "sw-entry-module",
    setup,
  };
}

module.exports = entryModulePlugin;
