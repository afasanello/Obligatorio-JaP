const DOLAR = 40;

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

    // Si no se definió el carrito aún, agrega los productos del JSON al carrito.
    // Está hecho así a propósito, para hacerlo lo más fiel posible a la vida real.
    // Se asume que el cliente seleccionó dos productos, y tiene la posibilidad de
    // borrar los productos sin que vuelvan a aparecer.
    // En cualquier caso, muestra los productos.
    if(!localStorage.getItem("cart")){
        getJSONData(CART_INFO_URL_DES)
        .then((res) => {
            if(res.status == "ok"){
                var info = res.data;

                for(var i = 0; i < info.articles.length; i++){
                    addProd(info.articles[i]);
                }    
                
                showProducts();
            }
        });
    }else{
        showProducts();
    }
});

// Mostrar productos en pantalla
function showProducts(){
    var localInfo = localStorage.getItem("cart");
    localInfo = JSON.parse(localInfo);
    cart = "";

    // Para cada iteración utiliza un molde para agregar los productos.
    for(var i = 0; i < localInfo.articles.length; i++){
        cart += showElem(localInfo.articles[i], i);
    }

    // Si el carrito no es vacío, muestra los productos. De lo contrario, muestra una alerta.
    if(cart != "") document.getElementById("cart").innerHTML = cart;
    else{
        document.getElementById("cart").innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="alert alert-danger" class="col-12 my-2" style="position: relative; width: auto; top: 10px">
                    <span>No hay productos en el carrito de compras. Hay muchos artículos
                    que te podrían interesar.</span>
                </div>
            </div>
        </div>`;
    }

    // Refresca el monto total del carrito.
    refreshAmount();

}

// Molde para mostrar el producto en el carrito. Se pasa el producto, y la posición en la que se encuentra
// en la lista.
function showElem(obj, i){
    var currency = obj.currency;

    // Define la moneda UYU como $
    if(currency == "UYU") currency = "$";

    // La función retorna un string que sería utilizado para agregar al innerHTML de los productos.
    return `
    <div class="row my-2">
        <div class="col-3">
            <img class="img-thumbnail col" src="${obj.src}" alt="${obj.name}">
        </div>
        <div class="col-5 m-auto">
            <span> ${obj.name} </span><br />

            <span>Cantidad: </span>
            <button type="button" class="badge badge-info" onclick="changeCount(0, ${i})">-</button>
            <span id="prod${i}"> ${obj.count} </span>
            <button type="button" class="badge badge-info" onclick="changeCount(1, ${i})">+</button><br />
            
            <span>Precio unitario: ${currency} ${obj.unitCost}</span>
        </div>
        <div class="col-3 m-auto">
            <h5 id="cost${i}">${currency} ${obj.unitCost * obj.count}</h5>
        </div>
        <div class="col-1 m-auto">
            <button type="button" class="badge badge-danger" onclick="deleteProd(${i})"> x </button>
        </div>
    </div>
    `;
}

// Agrega el producto al carrito en localStorage. Se pasa como parámetro el objeto a agregar.
function addProd(obj){
    var cart = localStorage.getItem("cart");
    if(cart){ // Si el carrito está definido
        cart = JSON.parse(cart);
        var names = [];

        // Agrega los nombres de todos los artículos. El propósito de esto es buscar el nombre del
        // artículo a insertar entre los artículos. Es para no agregar el mismo producto más de una vez.
        for(var i = 0; i < cart.articles.length; i++){
            names.push(cart.articles[i].name);
        }
        // Si no se encuentra el objeto en el carrito, lo agrega.
        if(names.indexOf(obj.name) == -1){
            cart.articles.push(obj);
        }
    }else{ // Si el carrito no está definido, lo inicializa para luego ser agregado a localStorage.
        cart = {};
        cart.articles = [];
        cart.articles.push(obj);
    }

    cart = JSON.stringify(cart);

    // Agrega el carrito a localStorage.
    localStorage.setItem("cart", cart);
}

// Elimina el producto del carrito. Recibe como parámetro la posición del objeto .
function deleteProd(item){
    var cart = localStorage.getItem("cart");
    cart = JSON.parse(cart);

    cart.articles.splice(item, 1);

    cart = JSON.stringify(cart);
    localStorage.setItem("cart", cart);

    // Actualiza la lista de productos.
    showProducts();
}

// Actualiza la cantidad del producto. Recibe como parámetros la acción a realizar (0 si decrementa
// la cantidad, 1 si incrementa), y la posición del objeto a cambiar de cantidad.
function changeCount(action, i){
    var count = document.getElementById("prod" + i).innerHTML;
    var cart = localStorage.getItem("cart");

    if(action == 0){
        // El mínimo es 1. 
        if(count > 1) count--;
    }else{
        count++;
    }

    cart = JSON.parse(cart);

    cart.articles[i].count = count;

    cart = JSON.stringify(cart);
    localStorage.setItem("cart", cart);

    // Actualiza la lista de productos.
    showProducts();
}

// Actualiza el subtotal y el total
function refreshAmount(){
    var st = document.getElementById("subtotal");
    var t = document.getElementById("total");

    // Reinicia los casilleros de los montos
    st.innerHTML = "";
    t.innerHTML = "";
    
    // Define la moneda a usar
    var cur = document.getElementsByName("currency");
    if(cur[0].checked){
        st.innerHTML += "$ ";
        t.innerHTML += "$ ";
    }else{
        st.innerHTML += "USD ";
        t.innerHTML += "USD ";
    }

    // Calcula el subtotal
    if(localStorage.getItem("cart")){
        var cart = localStorage.getItem("cart");
        var tot = 0;
        cart = JSON.parse(cart);
        
        for(var i = 0; i < cart.articles.length; i++){
            if(cur[0].checked && cart.articles[i].currency == "USD"){
                // Seleccionamos pesos y el precio está en dólares
                tot += cart.articles[i].count * cart.articles[i].unitCost * DOLAR;
            }else if(cur[1].checked && cart.articles[i].currency == "UYU"){
                // Seleccionamos dólares y el precio está en pesos
                tot += cart.articles[i].count * cart.articles[i].unitCost / DOLAR;
            }else{
                tot += cart.articles[i].count * cart.articles[i].unitCost
            }
        }

        // Redondea la cantidad
        tot = Math.round(tot * 100) / 100;

        st.innerHTML += tot;

        // Calcula el total a partir del tipo de envío seleccionado

        var ship = document.getElementsByName("shipping");
        if(ship[0].checked) tot *= 1.15;
        else if(ship[1].checked) tot *= 1.07;
        else tot *= 1.05;

        // Redondea la cantidad
        tot = Math.round(tot * 100) / 100;

        t.innerHTML += tot;
    }else{
        st.innerHTML += "0";
        t.innerHTML += "0";
    }

}