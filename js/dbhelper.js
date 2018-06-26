/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants() {

    return new Promise(function(resolve, reject) {
      let db;
      let openRequest = indexedDB.open('mws-restaurant-db', 6);
      openRequest.onupgradeneeded = function (e) {
        console.log('UpgradeNeeded Running..');
        db = e.target.result;
        if (!db.objectStoreNames.contains('restaurants')) {
          let objectStore = db.createObjectStore('restaurants');
        }
      }
      openRequest.onsuccess = function (e) {
        db = e.target.result;
        // Get from DB
        let transactionGet = db.transaction(['restaurants'], "readonly");
        let storeGet = transactionGet.objectStore("restaurants");
        let requestGet = storeGet.get(1);

        requestGet.onsuccess = function (e) {
          let result = e.target.result;          
          if (result !== undefined) {          
            // If its in cache
            console.log('Getting JSON from: IndexedDB');            
            resolve(result);
          } else {
            // else request from network
            resolve(fetch(DBHelper.DATABASE_URL)
              .then(response => {
                return response;
              })
              .then(result => {
                let resultJson = result.json();
                DBHelper.createDB(db, resultJson);
                console.log('Getting JSON from: Network');
                return resultJson;
              })
              .catch(error => {
                console.log(`Error: ${error}`);
              }));
          }
        }

        requestGet.onerror = function(e) {
          console.log('On Error');
          // reject can be here
        }
      }   
    });
  }

  static createDB(db, restaurantsPromise) {
    restaurantsPromise
      .then(restaurants => {
        //Add to DB
        let transaction = db.transaction(['restaurants'], "readwrite");
        let store = transaction.objectStore("restaurants");
        let request = store.add(restaurants, 1);
        request.onerror = function (e) {
          console.log("Error", e.target.error.name);
        }
        request.onsuccess = function (e) {
          console.log('Added Successfully');
        }
      })
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id) {
    // fetch all restaurants with proper error handling.
    return DBHelper.fetchRestaurants()
      .then(restaurants => {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          return restaurant;
        } else { // Restaurant does not exist inthe database
         console.log('Restaurant does not exist');
        }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine) {
    // Fetch all restaurants  with proper error handling
    return DBHelper.fetchRestaurants()
    .then(restaurants => {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        return results;
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
    .then(restaurants => {      
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        return results;
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
      .then(restaurants => {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        return results;
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods() {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
    .then(restaurants => {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        //callback(null, uniqueNeighborhoods);
        return uniqueNeighborhoods;
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines() {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
      .then(restaurants => {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        
        return uniqueCuisines;
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.id}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
