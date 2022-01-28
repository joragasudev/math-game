const VERSION = 'v1';

self.addEventListener('install', event => {
  event.waitUntil(precache());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  // get
  if (request.method !== 'GET') {
    return;
  }

  // look in cache
  event.respondWith(cachedResponse(request));

  // update cache
  event.waitUntil(updateCache(request));
});

async function precache() {
  const cache = await caches.open(VERSION);
  return cache.addAll([
    '/',
    '/index.html',
    '/assets/check.svg',
    '/assets/cross.svg',
    '/assets/sound_off.svg',
    '/assets/sound_on.svg',
    '/assets/twitter.svg',
  ]);
}

async function cachedResponse(request) {
try{
  const cache = await caches.open(VERSION);
  const response = await cache.match(request);
  return response || fetch(request);
}catch(err){
  console.log(err);
}
}

async function updateCache(request) {
  try{
  const cache = await caches.open(VERSION);
  const response = await fetch(request);
  return cache.put(request, response);
}catch(err){
  console.log(err);
}
}
