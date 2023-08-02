"use strict";
const FILTER_REGEX = /\?user$/;

/**
 * @param {import('../utils/config').ResolvedWorkerConfig} config
 * @returns {import('esbuild').Plugin} Esbuild plugin
 */
function sideEffectsPlugin() {
  /**
   * @param {import('esbuild').PluginBuild} build
   */
  async function setup(build) {
    /** @type {(args: import('esbuild').OnResolveArgs) => import('esbuild').OnResolveResult} */
    const onResolve = ({ path }) => ({
      path: path.replace(FILTER_REGEX, ""),
      sideEffects: true,
    });
    /** @type {(args: import('esbuild').OnResolveArgs) => Promise<import('esbuild').OnResolveResult>} */
    const onLoad = async () => ({ loader: "js" });

    build.onResolve({ filter: FILTER_REGEX }, onResolve);
    build.onLoad({ filter: FILTER_REGEX }, onLoad);
  }

  return {
    name: "sw-side-effects",
    setup,
  };
}

module.exports = sideEffectsPlugin;
