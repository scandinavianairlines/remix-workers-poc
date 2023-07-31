import * as build from '@remix-pwa/build/magic'
// import { matchLoaderRequest, isLoaderRequest } from '@remix-pwa/sw'

// if the user export a `defaultFetchHandler` inside the entry.worker.js, we use that one as default handler
const defaultHandler = build.entry.module.defaultFetchHandler || ((event) => event.responseWith(fetch(event.request.clone())));

console.log(build.routes)
// build.entry.module.register(self)
// TODO add fetch event listener per each route here
self.addEventListener("fetch", (event) => {
  console.log(build.routes)
  console.log(event)
  console.log(event.request.url)
  console.log(event.request.url.searchParams.get('_data'))
  const url = new URL(event.request.url)
  const data = url.searchParams.get('_data')
  // loaders & actions --> GET ?_data={route.id} & POST ?_data={route.id}

  const route = build.routes.find(route => route.id === data)
  console.log(route)
  if (route.hasWorkerLoader) {
    const handler = route.module.workerLoader
    return event.respondWith(handler(event))
  } else {
    return event.respondWith(defaultHandler(event))
  }
});





console.log(build.routes)
