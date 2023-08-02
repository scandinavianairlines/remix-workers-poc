"use strict";
const esbuild = require("esbuild");
const minimist = require("minimist");
const { readConfig } = require("@remix-run/dev/dist/config");
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

readConfig(path.resolve("./"), "production").then((remixConfig) => {
  // NOTE: in case of need to merge new configurations only for workers we can do it here

  //const confFile = require(findConfig(path.resolve('./'), 'remix.config', ['.js', '.mjs', '.cjs',]));
  //const remixConfig = { ...config, ...confFile };

  function createEsbuildConfig({ config }) {
    const entryPoints = {
      "service-worker": "./scripts/service-worker.js",
    };

    /** @type {Array<import("esbuild").Plugin>} */
    const plugins = [
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
    ];
    /** @type {import("esbuild").BuildOptions} */
    const esbuildOptions = {
      entryPoints,
      globalName: "remix",
      outdir: "./public", // ctx.config.assetsBuildDirectory,
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
      minify: false,
      // chunkNames: '_shared/sw/[name]-[hash]',
      // assetNames: '_assets/sw/[name]-[hash]',
      // jsx: 'preserve',
      plugins,
      supported: {
        "import-meta": true,
      },
    };

    return esbuildOptions;
  }

  console.time(TIME_LABEL);

  esbuild
    .context({
      ...createEsbuildConfig({ config: remixConfig }),
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
