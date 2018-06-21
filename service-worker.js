(function() {
  'use strict';

  const staticCacheName = 'cacheFile-mws-stage1-v1.2';
  const cacheFiles = [
    '/',
    '/restaurant.html?id=',
    '/img/',
    'css/styles.css',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
  ]

  function createDB() {
    //console.log(self.restaurants);
    
    // let openRequest = indexedDB.open('mws-restaurant-db', 1);

    // openRequest.onupgradeneeded = function (e) {
    //   console.log('UpgradeNeeded Running..');
    //   db = e.target.result;
    //   if (!db.objectStoreNames.contains('restaurants')) {
    //     let objectStore = db.createObjectStore('restaurants');
    //   }
    // }

    // openRequest.onsuccess = function (e) {
    //   console.log('Success');
    //   db = e.target.result;

    //   // Add to DB
    //   let transaction = db.transaction(['restaurants'], "readwrite");
    //   let store = transaction.objectStore("restaurants");

    //   if (self.restaurants !== undefined) {
    //     let request = store.add(self.restaurants, 1);
    //     request.onerror = function (e) {
    //       console.log("Error", e.target.error.name);
    //     }

    //     request.onsuccess = function (e) {
    //       console.log('Added Successfully');
    //     }
    //   }

    //   // Get from DB
    //   let transactionGet = db.transaction(['restaurants'], "readonly");
    //   let storeGet = transactionGet.objectStore("restaurants");
    //   let requestGet = storeGet.get(1);
    //   requestGet.onsuccess = function (e) {
    //     let result = e.target.result;
    //     console.log(result);
    //   }      
    // }
  }

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
      //createDB()
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
          return fetch(request);
        })
    );
  });

  
})();
