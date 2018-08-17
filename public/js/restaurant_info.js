let restaurant;var map;window.initMap=(()=>{fetchRestaurantFromURL()}),fetchRestaurantFromURL=(()=>{if(self.restaurant)return void console.log("Already Fetched");const e=getParameterByName("id");e?DBHelper.fetchRestaurantById(e).then(e=>{self.restaurant=e,self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:self.restaurant.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map),e?(fillRestaurantHTML(),bindFavoriteRestaurant(),bindReviewForm()):console.error(error)}):(error="No restaurant id in URL",console.error(error))}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img");t.className="restaurant-img",t.src=DBHelper.imageUrlForRestaurant(e);let[r,n]=t.src.split(".",2);document.getElementById("restaurant-img-source").setAttribute("srcset",`${r}-small.${n}`),document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let r in e){const n=document.createElement("tr"),a=document.createElement("td");a.innerHTML=r,n.appendChild(a);const s=document.createElement("td");s.innerHTML=e[r],n.appendChild(s),t.appendChild(n)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container"),r=document.createElement("h2");if(r.innerHTML="Reviews",t.appendChild(r),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const n=document.getElementById("reviews-list");e.forEach((e,t)=>{n.appendChild(createReviewHTML(e,t))}),t.appendChild(n)}),createReviewHTML=((e,t)=>{const r=document.createElement("li");r.setAttribute("tabIndex",0);const n=document.createElement("p");n.innerHTML=e.name,r.appendChild(n);const a=document.createElement("p"),s=new Date(e.createdAt),i=new Date(s).getDate(),l=new Date(s).getMonth()+1+"/"+i+"/"+new Date(s).getFullYear();a.innerHTML=l,r.appendChild(a);const o=document.createElement("p");o.innerHTML=`Rating: ${e.rating}`,r.appendChild(o);const d=document.createElement("p");return d.innerHTML=e.comments,r.appendChild(d),r}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),r=document.createElement("li");r.innerHTML=e.name,t.appendChild(r)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const r=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null}),bindFavoriteRestaurant=((e=self.restaurant)=>{const t=document.querySelector(".restaurant-fav-toggle");let r;"true"==e.is_favorite?(t.classList.add("fav"),t.setAttribute("title","Mark this Unfavorite."),r=!1):(t.classList.remove("fav"),t.setAttribute("title","Mark this Favorite."),r=!0),t.addEventListener("click",function(n){n.preventDefault(),DBHelper.toggleFavoriteRestaurant(e,r,t).then(e=>{(r=e)?t.setAttribute("title","Mark this Favorite."):t.setAttribute("title","Mark this Unfavorite.")})})}),bindReviewForm=((e=self.restaurant)=>{const t=document.querySelector("form#reviewForm"),r=t.querySelector("button"),n=t.querySelector(".success");t.addEventListener("submit",function(a){a.preventDefault(),n.style.visibility="hidden",r.innerHTML="SUBMITTING...",r.setAttribute("disabled",!0);const s=new FormData(t);DBHelper.postRestaurantReview(e,s)&&(t.reset(),r.innerHTML="SUBMIT",r.removeAttribute("disabled"),n.style.visibility="visible")})});