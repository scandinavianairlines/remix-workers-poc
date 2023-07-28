
const esbuild = require("esbuild");
const { flatRoutes } = require("@remix-run/dev/dist/config/flat-routes");
const { nodeModulesPolyfillPlugin } = require('esbuild-plugins-node-modules-polyfill');

console.log(flatRoutes("app"));
const remixConfig = {
  appDirectory: "app",
  routes: flatRoutes("app"),
  entryClientFilePath: "./app/entry-client",
  entryWorkerFilePath: "./app/entry.worker.js",
  assetsBuildDirectory: "public",
};

function createEsbuildConfig({ config }) {
  const entryPoints = {
    //'entry.worker': config.entryWorkerFilePath,
    'service-worker': './scripts/service-worker.js'
  };

  /** @type {Array<import("esbuild").Plugin>} */
  const plugins = [
    nodeModulesPolyfillPlugin(),
    // This plugin will generate a list of routes based on the remix `flatRoutes` output and inject them in the bundled `service-worker`.
    {
      name: 'service-worker-build',
      async setup(build) {
        build.onResolve({ filter: /@remix-pwa\/build\/magic$/ }, args => {
          return { path: args.path, namespace: 'service-worker-build' }
        })
        build.onLoad({ filter: /@remix-pwa\/build\/magic$/, namespace: 'service-worker-build' }, async args => {
          return {
            contents: `
            // TODO import the worker.entry file
            // import * as entryWorker from ${JSON.stringify(config.entryServerFilePath)};
            ${Object.values(config.routes).map((route, index) => {
              return `import * as route${index} from '../app/${route.file}?worker'`;
            }).join('\n')

              }
            export const routes = [
            ${Object.values(config.routes).map((route, index) => {
                return `{file: "${route.file}",
              path: "${route.path}",
              module: ${`route${index}`} ,
              id: "${route.id}",
              parentId: "${route.parentId}",},`
              }).join('\n')}
            ]`,
            resolveDir: config.appDirectory,
            loader: 'js',
          };
        })
      }
    },
    // for each route imported with`?worker` suffix this plugin will only keep the `workerAction` and `workerLoader` exports
    {
      name: 'worker-routes',
      setup(build) {
        build.onResolve({ filter: /\?worker$/ }, args => {
          return { path: args.path, namespace: 'worker-routes' }
        })
        build.onLoad({ filter: /\?worker$/, namespace: 'worker-routes' }, async args => {
          return {
            contents: `module.exports = {}`,
            resolveDir: config.appDirectory,
            loader: 'js',
          };
        })
      }

    }

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
