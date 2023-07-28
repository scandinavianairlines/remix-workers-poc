
const esbuild = require("esbuild");
const { flatRoutes } = require("@remix-run/dev/dist/config/flat-routes");
const { nodeModulesPolyfillPlugin } = require('esbuild-plugins-node-modules-polyfill');
const { getRouteModuleExports } = require('@remix-run/dev/dist/compiler/utils/routeExports');
const { readConfig, findConfig } = require('@remix-run/dev/dist/config');
const { emptyModulesPlugin } = require('@remix-run/dev/dist/compiler/plugins/emptyModules');
const path = require("path");
const entryModulePlugin = require('./plugins/entry-module.js');
const routesModulesPlugin = require("./plugins/routes-module.js");

console.log(flatRoutes("app"));


readConfig(path.resolve('./'), 'production').then(remixConfig => {
  // NOTE: in case of need to merge new configurations only for workers we can do it here

  //const confFile = require(findConfig(path.resolve('./'), 'remix.config', ['.js', '.mjs', '.cjs',]));
  //const remixConfig = { ...config, ...confFile };

  function createEsbuildConfig({ config }) {
    const entryPoints = {
      'service-worker': './scripts/service-worker.js'
    };

    /** @type {Array<import("esbuild").Plugin>} */
    const plugins = [
      // nodeModulesPolyfillPlugin(),
      emptyModulesPlugin({ config }, /\.server(\.[jt]sx?)?$/),
      // assuming that we dont need react at all in the worker (we dont want to SWSR for now at least)
      emptyModulesPlugin({ config }, /^react(-dom)?(\/.*)?$/, { includeNodeModules: true }),
      // TODO we need to see if we need this for the responses helpers
      emptyModulesPlugin({ config }, /^@remix-run\/(deno|cloudflare|node)(\/.*)?$/, { includeNodeModules: true }),
      // This plugin will generate a list of routes based on the remix `flatRoutes` output and inject them in the bundled `service-worker`.
      entryModulePlugin(config),
      // for each route imported with`?worker` suffix this plugin will only keep the `workerAction` and `workerLoader` exports
      routesModulesPlugin(config),
    ]
    /** @type {import("esbuild").BuildOptions} */
    const esbuildOptions = {
      entryPoints,

      outdir: './public/build', // ctx.config.assetsBuildDirectory,
      platform: 'browser',
      format: 'esm',
      bundle: true,
      logLevel: 'error',
      splitting: true,
      sourcemap: true,
      // As pointed out by https://github.com/evanw/esbuild/issues/2440, when tsconfig is set to
      // `undefined`, esbuild will keep looking for a tsconfig.json recursively up. This unwanted
      // behavior can only be avoided by creating an empty tsconfig file in the root directory.
      // tsconfig: ctx.config.tsconfigPath,
      mainFields: ['browser', 'module', 'main'],
      treeShaking: true,
      minify: false,
      chunkNames: '_shared/sw/[name]-[hash]',
      assetNames: '_assets/sw/[name]-[hash]',
      jsx: 'preserve',
      plugins,
      supported: {
        'import-meta': true,
      },
    };

    return esbuildOptions;
  }

  const compiler = esbuild
    .context({ ...createEsbuildConfig({ config: remixConfig }), metafile: true, write: true })
    .then((m) => m.rebuild());

  compiler
    .then(() => {
      console.log("done");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
});
