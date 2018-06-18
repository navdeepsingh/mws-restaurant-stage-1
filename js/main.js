let restaurants,
  neighborhoods,
  cuisines,
  db
var map
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchRestaurants();
  fetchNeighborhoods();
  fetchCuisines();
  handleIndexedDBAPI();
});

handleIndexedDBAPI = () => {
  let idbSupported = false;

  if ('indexedDB' in window) {
    idbSupported = true;
  }

  if (idbSupported) {
    let openRequest = indexedDB.open('mws-restaurant-db', 1);

    openRequest.onupgradeneeded = function(e) {
      console.log('UpgradeNeeded Running..');
      db = e.target.result;
      if (!db.objectStoreNames.contains('restaurants')) {
        let objectStore = db.createObjectStore('restaurants');
      }      
    }

    openRequest.onsuccess = function(e) {
      console.log('Success');      
      db = e.target.result;

      // Add to DB
      let transaction = db.transaction(['restaurants'], "readwrite");
      let store = transaction.objectStore("restaurants");      

      let request = store.add(self.restaurants, 1);
      request.onerror = function (e) {
        console.log("Error", e.target.error.name);
      }

      request.onsuccess = function (e) {
        console.log('Added Successfully');
      }

      // Get from DB
      let transactionGet = db.transaction(['restaurants'], "readonly");
      let storeGet = transactionGet.objectStore("restaurants");
      let requestGet = storeGet.get(1);
      requestGet.onsuccess = function (e) {
        let result = e.target.result;
        console.log(result);
      }
    }
  }
}

fetchRestaurants = () => {
 DBHelper.fetchRestaurants()
  .then(restaurants => {
    self.restaurants = restaurants;
  })
  .catch(error => {
    //console.log(error, 'testtt');    
    
  })
}

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods()
  .then(neighborhoods => {    
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines()
    .then(cuisines => {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood)
    .then(restaurants => {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.setAttribute('alt', restaurant.name);
  image.setAttribute('title', restaurant.name);
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  li.append(image);

  const listWrapper = document.createElement('div');
  listWrapper.setAttribute('class', 'list-info');
  li.append(listWrapper);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  listWrapper.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  listWrapper.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  listWrapper.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  listWrapper.append(more);

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}
