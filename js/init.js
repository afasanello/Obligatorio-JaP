const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_INFO_URL_DES = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  // Chequea si está recordando usuario.
  var remember = localStorage.getItem('user');
  if(remember){
    sessionStorage.setItem('user', remember);
  }

  // Si no inició sesión, redirecciona al login.
  if(!sessionStorage.getItem('user') && document.URL.slice(-10) != 'login.html')
    window.location = 'login.html';

  // Si inició sesión, y se encuentra en login, redirecciona a la página principal.
  if(sessionStorage.getItem('user') && document.URL.slice(-10) == 'login.html')
    window.location = 'index.html';

  // Muestra en la esquina superior derecha el usuario, si está definido.
  if(sessionStorage.getItem('user')){
    var nav = document.getElementsByTagName("nav")[0].children[0];

    nav.innerHTML += `
    <div class="dropdown">
      <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        ${sessionStorage.getItem("user")}
      </a>

      <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <a class="dropdown-item" href="my-profile.html">Mi perfil</a>
        <a class="dropdown-item" href="cart.html">Ver carrito</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="#" onclick="logout()">Cerrar sesión</a>
      </div>
    `;
  }
});

function logout(){
  sessionStorage.removeItem('user');
  localStorage.removeItem('user');
  window.location = 'login.html';
}