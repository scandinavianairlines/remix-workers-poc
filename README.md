# Remix worker actions and loaders

The main purpose of this repository is to show how to use Remix's [actions](https://remix.run/docs/en/main/guides/data-writes) and [loaders](https://remix.run/docs/en/main/guides/data-loading) in a _service worker_.
The idea comes from finding a way to use all the Remix features and capabilities totally offline.

## How does it work?

Following the same principles as the _Remix actions and loaders_, where the _loaders_ and _actions_ functions are exported from a route file and then a **compiler** process them to include them only in the server bundle and register the routes automatically.

### Compiler

We created a compiler that mimics the _remix compiler_, but for a _service worker_. The compiler is a [esbuild](https://esbuild.github.io/) node script that uses the _remix config manifest_ to know all the routes files and compile only the exported `workerActions` and `workerLoader` function from each route file. In that way, the compiler creates a `routes` list with all information needed to "register a route" and inject it in the _service worker_.
We held an interal `scripts/service-worker.js` file that is the compiler entry point and have the logic to listen to a **fetch event** and match the request with the right route `workerAction` or `workerLoader` function.
Finally, the compiler bundles everything needed for the _service worker_ in a single file and writes it to the condigure `workerBuildDirectory` in the `remix.config.js` file.

### Worker actions and loaders

The _worker actions_ and _worker loaders_ are the same as the _Remix actions_ and _Remix loaders_, but with a different name to easily identify the context where they are running. Both follows the same principles as in a normal _action_ or _loader_, recives the `request` object and returns a `response` object. The only difference is that the _worker actions_ and _worker loaders_ are executed in the _service worker_ thread and not in a Node.js server.

**workerAction**

```js
export function workerAction({ request, params, context }: ActionArgs): Promise<Response> | Response | Promise<AppData> | AppData
```

**workerLoader**

```js
export function workerLoader({ request, params, context }: LoaderArgs): Promise<Response> | Response | Promise<AppData> | AppData
```

### Context

The `context` object is the same as in a normal [Remix app](https://remix.run/docs/en/1.19.1/route/loader#contex), but with some extra properties:

- **context.event**: The _fetch event_ that was triggered.
- **context.fetchFromServer**: A function that can be used to perform the original request.

The _compiler_ also supports a way to create your own context that will be pass to all _worker actions_ and _worker loaders_. A `getLoadContext` function should be exported from the application service worker file and will be called in each fetch event.

**getLoadContext**

```js
export function getLoadContext(event: FetchEvent): AppLoadContext
```

### Default event handler

The _compiler_ also supports a way to create a default event handler that will be called if no _worker action_ or _worker loader_ matches the request. A `defaultEventHandler` function should be exported from the application service worker file.

**defaultFetchHandler**

```js
export function defaultFetchHandler({ request, params, context }: LoaderArgs): Promise<Response> | Response
```

If no `defaultFetchHandler` is exported, the _compiler_ will use a default one that will try to fetch the request from the server.

### Error handler

The _compiler_ also supports a way to create a error handler that will be called if an error is thrown in a _worker action_ or _worker loader_. A `errorHandler` function should be exported from the application service worker file.

**handleError**

```js
export function handleError(error: Error, { request, params, context }: LoaderArgs | ActionArgs)): void
```

If no `errorHandler` is exported, the _compiler_ will use a default one that will log the error to the console.

### Configuration

The _service worker_ can be configured in the `remix.config.js` file. The following options are available:

- **worker**: The path to the _service worker_ file. Defaults to `app/entry.worker.js`.
- **workerName**: The name of the _service worker_ output file without the extension. Defaults to `service-worker`.
- **workerMinify**: Whether to minify the _service worker_ file. Defaults to `false`.
- **workerBuildDirectory**: The directory to build the _service worker_ file in. Defaults to `public/`.

## Project setup

This project was bootstrapped with [Remix](https://remix.run), uses [Yarn](https://yarnpkg.com) as its package manager and [Node.js](https://nodejs.org) as its runtime.

### Install dependencies

From your terminal:

```sh
yarn install
```

### Start development mode

From your terminal:

```sh
yarn dev
```

This starts your app in development mode with a built-in _service worker_, rebuilding assets on file changes. It uses two node scripts: `dev:remix` and `dev:worker`.

- **`dev:remix`** starts the Remix development server, which serves your app at `localhost:3000`.
- **`dev:worker`** builds your _service worker_ and watches for changes to your app's assets.

### Build for production

From your terminal:

```sh
yarn build
```

This builds your app for production, including your _service worker_.

---

Created by the [Airline Digitalization Team](mailto:airlinedigitalization@flysas.com).

![SAS](https://user-images.githubusercontent.com/850110/180438296-f79396e1-cb77-4f82-93e0-1d5bf5bea6a1.svg 'SAS')
