"use strict";
const esbuild = require("esbuild");
const minimist = require("minimist");
const { readConfig } = require("./utils/config.js");
const {
  emptyModulesPlugin,
} = require("@remix-run/dev/dist/compiler/plugins/emptyModules");
const path = require("path");
const entryModulePlugin = require("./plugins/entry-module.js");
const routesModulesPlugin = require("./plugins/routes-module.js");
const sideEffectsPlugin = require("./plugins/side-effects.js");
const { NODE_ENV } = process.env;
const TIME_LABEL = "💿 Built in";
const MODE = NODE_ENV === "production" ? "production" : "development";
const { watch } = minimist(process.argv.slice(2));

/**
 * Creates the esbuild config object.
 * @param {import('./utils/config.js').ResolvedWorkerConfig} config
 * @returns {import("esbuild").BuildOptions}
 */
function createEsbuildConfig(config) {
  return {
    entryPoints: {
      "service-worker": "./scripts/service-worker.js",
    },
    globalName: "remix",
    outdir: config.workerBuildDirectory,
    platform: "browser",
    format: "esm",
    bundle: true,
    logLevel: "error",
    splitting: true,
    sourcemap: false,
    // As pointed out by https://github.com/evanw/esbuild/issues/2440, when tsconfig is set to
    // `undefined`, esbuild will keep looking for a tsconfig.json recursively up. This unwanted
    // behavior can only be avoided by creating an empty tsconfig file in the root directory.
    // tsconfig: ctx.config.tsconfigPath,
    mainFields: ["browser", "module", "main"],
    treeShaking: true,
    minify: config.workerMinify,
    chunkNames: "_shared/sw/[name]-[hash]",
    plugins: [
      // nodeModulesPolyfillPlugin(),
      emptyModulesPlugin({ config }, /\.server(\.[jt]sx?)?$/),
      // assuming that we dont need react at all in the worker (we dont want to SWSR for now at least)
      emptyModulesPlugin({ config }, /^react(-dom)?(\/.*)?$/, {
        includeNodeModules: true,
      }),
      // TODO we need to see if we need this for the responses helpers
      emptyModulesPlugin(
        { config },
        /^@remix-run\/(deno|cloudflare|node)(\/.*)?$/,
        { includeNodeModules: true }
      ),
      // This plugin will generate a list of routes based on the remix `flatRoutes` output and inject them in the bundled `service-worker`.
      entryModulePlugin(config),
      // for each route imported with`?worker` suffix this plugin will only keep the `workerAction` and `workerLoader` exports
      routesModulesPlugin(config),
      // we need to tag the user entry.worker as sideEffect so esbuild will not remove it
      sideEffectsPlugin(),
    ],
    supported: {
      "import-meta": true,
    },
  };
}

readConfig(path.resolve("./"), "production").then((remixConfig) => {
  console.time(TIME_LABEL);
  // @TODO: Support for multiple entry.worker.js files.
  // We should run the esbuild for each entry.worker.js file.
  esbuild
    .context({
      ...createEsbuildConfig(remixConfig),
      metafile: true,
      write: true,
    })
    .then((context) => {
      console.log(`Building service-worker app in ${MODE} mode`);
      return context
        .watch()
        .then(() => {
          console.timeEnd(TIME_LABEL);
          if (!watch) {
            return context.dispose();
          }
          console.log("Watching for changes in the service-worker");
        })
        .catch(console.error);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
});
