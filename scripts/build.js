const esbuild = require("esbuild");
const { flatRoutes } = require("@remix-run/dev/dist/config/flat-routes");

console.log(flatRoutes("app"));
const config = {
  appDirectory: "app",
  routes: flatRoutes("app"),
  entryClientFilePath: "./app/entry-client",
  entryWorkerFilePath: "./app/entry.worker.js",
  assetsBuildDirectory: "public",
};

function createEsbuildConfig({ config }) {}

const compiler = esbuild
  .context({ ...createEsbuildConfig({ config }), metafile: true })
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
