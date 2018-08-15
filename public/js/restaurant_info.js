let restaurant;var map;window.initMap=(()=>{fetchRestaurantFromURL()}),fetchRestaurantFromURL=(()=>{if(self.restaurant)return void console.log("Already Fetched");const e=getParameterByName("id");e?DBHelper.fetchRestaurantById(e).then(e=>{self.restaurant=e,self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:self.restaurant.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map),e?(fillRestaurantHTML(),bindFavoriteRestaurant(),bindReviewForm()):console.error(error)}):(error="No restaurant id in URL",console.error(error))}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img");t.className="restaurant-img",t.src=DBHelper.imageUrlForRestaurant(e);let[n,r]=t.src.split(".",2);document.getElementById("restaurant-img-source").setAttribute("srcset",`${n}-small.${r}`),document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const r=document.createElement("tr"),a=document.createElement("td");a.innerHTML=n,r.appendChild(a);const s=document.createElement("td");s.innerHTML=e[n],r.appendChild(s),t.appendChild(r)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h2");if(n.innerHTML="Reviews",t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const r=document.getElementById("reviews-list");e.forEach((e,t)=>{r.appendChild(createReviewHTML(e,t))}),t.appendChild(r)}),createReviewHTML=((e,t)=>{const n=document.createElement("li");n.setAttribute("tabIndex",0);const r=document.createElement("p");r.innerHTML=e.name,n.appendChild(r);const a=document.createElement("p"),s=new Date(e.createdAt),l=new Date(s).getDate(),i=new Date(s).getMonth()+1+"/"+l+"/"+new Date(s).getFullYear();a.innerHTML=i,n.appendChild(a);const o=document.createElement("p");o.innerHTML=`Rating: ${e.rating}`,n.appendChild(o);const d=document.createElement("p");return d.innerHTML=e.comments,n.appendChild(d),n}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}),bindFavoriteRestaurant=((e=self.restaurant)=>{const t=document.querySelector(".restaurant-fav-toggle");let n;"true"==e.is_favorite?(t.classList.add("fav"),n=!1):(t.classList.remove("fav"),n=!0),t.addEventListener("click",function(r){r.preventDefault(),DBHelper.toggleFavoriteRestaurant(e,n,t).then(e=>{n=e})})}),bindReviewForm=((e=self.restaurant)=>{const t=document.querySelector("form#reviewForm"),n=t.querySelector("button"),r=t.querySelector(".success");t.addEventListener("submit",function(a){a.preventDefault(),r.style.visibility="hidden",n.innerHTML="SUBMITTING...",n.setAttribute("disabled",!0);const s=new FormData(t);DBHelper.postRestaurantReview(e,s)&&(t.reset(),n.innerHTML="SUBMIT",n.removeAttribute("disabled"),r.style.visibility="visible")})});