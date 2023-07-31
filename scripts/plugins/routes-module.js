const { getRouteModuleExports } = require('@remix-run/dev/dist/compiler/utils/routeExports');
const FILTER_REGEX = /\?worker$/;
const NAMESPACE = 'routes-module';

/**
* @param {import('@remix-run/dev').ResolvedRemixConfig} config
* @returns {import('esbuild').Plugin} Esbuild plugin
*/
function routesModulesPlugin(config) {
  /**
  * @param {import('esbuild').PluginBuild} build
  */
  async function setup(build) {
    const routesByFile = Object.keys(config.routes).reduce((map, key) => {
      const route = config.routes[key];
      map.set(route.file, route);
      return map;
    }, new Map());
    /** @type {(args: import('esbuild').OnResolveArgs) => import('esbuild').OnResolveResult} */
    const onResolve = ({ path }) => ({ path, namespace: NAMESPACE });
    /** @type {(args: import('esbuild').OnResolveArgs) => Promise<import('esbuild').OnResolveResult>} */
    const onLoad = async ({ path }) => {
      const file = path.replace(/\?worker$/, '')
      const route = routesByFile.get(file);
      const sourceExports = await getRouteModuleExports(config, route.id);
      const theExports = sourceExports.filter((exp) => exp === 'workerAction' || exp === 'workerLoader');

      let contents = 'module.exports = {};';
      if (theExports.length !== 0) {
        const spec = `{ ${theExports.join(', ')} }`;
        contents = `export ${spec} from ${JSON.stringify(`./${file}`)};
          export const hasWorkerAction = ${theExports.includes('workerAction')};
          export const hasWorkerLoader = ${theExports.includes('workerLoader')}`;
      }
      return {
        contents: contents,
        resolveDir: config.appDirectory,
        loader: 'js',
      };
    };

    build.onResolve({ filter: FILTER_REGEX }, onResolve);
    build.onLoad({ filter: FILTER_REGEX, namespace: NAMESPACE }, onLoad);
  }


  return {
    name: 'sw-routes-modules',
    setup
  }
}

module.exports = routesModulesPlugin;
