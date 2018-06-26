(function() {
  'use strict';

  const staticCacheName = 'cacheFile-mws-stage1-v1.6';
  const imageCacheName = 'images';
  const cacheFiles = [
    '/',
    '/restaurant.html?id=',
    'css/styles.css',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js'
  ]

  self.addEventListener('install', installEvent => {
    console.log('Service Worker Installing');

    installEvent.waitUntil(
      caches.open(staticCacheName)
        .then( staticCache => {
          return staticCache.addAll(cacheFiles);
        })
    );
  });

  self.addEventListener('activate', activateEvent => {
    console.log('Service Worker Activating');

    activateEvent.waitUntil(
      caches.keys()
        .then( cacheNames => {
          return Promise.all(
            cacheNames.map( cacheName => {
              if (cacheName != staticCacheName) {
                return caches.delete(cacheName); // Delete the old cache
              }
            })
          )
        }),
    );
  });

  self.addEventListener('fetch', fetchEvent => {
    console.log('Service Worker is Listening');
    const request = fetchEvent.request;

      fetchEvent.respondWith(        
        caches.match(request)
        .then( responseFromCache => {
          if (responseFromCache) {
            return responseFromCache;
          }

          // Otherwise fetch from network         
          return fetch(request)
          .then(responseFromFetch => {
            // Special cache for images
            if (request.headers.get('Accept').includes('image')) {
              const copy = responseFromFetch.clone();
              fetchEvent.waitUntil(
                caches.open(imageCacheName)
                .then(imageCache => {
                  return imageCache.put(request, copy);
                })
              );
            }
            return responseFromFetch;            

          });
        })
      ); // end respondWith
  });

  
})();
