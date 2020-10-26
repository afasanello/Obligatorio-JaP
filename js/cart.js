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
    if(!localStorage.getItem("cart") || (localStorage.getItem("cart") == '{"articles":[]}')){
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

    loadAddress();
});

// Mostrar productos en pantalla
function showProducts(){
    var localInfo = localStorage.getItem("cart");
    var cart = "";
    if(localInfo){
        localInfo = JSON.parse(localInfo);
        
        // Para cada iteración utiliza un molde para agregar los productos.
        for(var i = 0; i < localInfo.articles.length; i++){
            cart += showElem(localInfo.articles[i], i);
        }
    }

    

    // Si el carrito no es vacío, muestra los productos. De lo contrario, muestra una alerta.
    if(cart != ""){
        document.getElementById("cart").innerHTML = cart;
        document.getElementById("send").disabled = false;
    }else{
        document.getElementById("cart").innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="alert alert-danger" class="col-12 my-2" style="position: relative; width: auto; top: 10px">
                    <span>No hay productos en el carrito de compras. Hay muchos artículos
                    que te podrían interesar.</span>
                </div>
            </div>
        </div>`;
        document.getElementById("send").disabled = true;
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

// Elimina el producto del carrito. Recibe como parámetro la posición del objeto.
function deleteProd(item){
    var cart = localStorage.getItem("cart");
    cart = JSON.parse(cart);

    cart.articles.splice(item, 1);

    cart = JSON.stringify(cart);
    localStorage.setItem("cart", cart);

    // Actualiza la lista de productos.
    showProducts();
}

// Vacía el carrito, destruyendo la lista de objetos del carrito en el localstorage.
function emptyCart(){
    localStorage.removeItem("cart");
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
        else if(ship[2].checked) tot *= 1.05;

        // Redondea la cantidad
        tot = Math.round(tot * 100) / 100;

        t.innerHTML += tot;
    }else{
        st.innerHTML += "0";
        t.innerHTML += "0";
    }
}

// Función que valida si los campos del formulario están completos.
function validateForm(){
    var addr = validateAddress();
    var ship = validateShipping();
    var paym = validatePayment();

    if(addr && ship && paym){
        saveAddress();

        document.getElementById("succ").style.display = "block";
        document.getElementById("send").disabled = true;
        setTimeout(() => {
            document.getElementById("succ").style.display = "none";
            document.getElementById("send").disabled = false;
            emptyCart();
        }, 3000)
    }
}

// Función que valida el envío
function validateShipping(){
    var typeShipping = document.getElementsByName("shipping");
    var formValid = false;

    var i = 0;
    while (!formValid && i < typeShipping.length){
        if (typeShipping[i].checked) formValid = true;
        i++;
    }

    if (!formValid){
        document.getElementById("error").style.display = "block";
        document.getElementById("error").innerHTML = "Debe seleccionar tipo de envío";
        return false;
    }else{
        document.getElementById("error").style.display = "none";
        document.getElementById("error").innerHTML = "";
        return true;
    }
}

// Función que valida la dirección
function validateAddress(){
    var addrElem = document.getElementsByClassName("req");
    var formValid = true;

    for(var i = 0; i < addrElem.length; i++){
        formValid = formValid && addrElem[i].value != "";
    }

    if(formValid == false){
        document.getElementById("error2").style.display = "block";
        document.getElementById("error2").innerHTML = "Falta llenar los campos";
        return false;
    }else{
        document.getElementById("error2").style.display = "none";
        document.getElementById("error2").innerHTML = "";
        return true;
    }
}

// Función que valida la forma de pago
function validatePayment(){
    var formValid = true;
    if(document.getElementsByName("payment")[0].checked){
        var paymentElem = document.getElementsByClassName("reqC");
        for(var i = 0; i < paymentElem.length; i++){
            formValid = formValid && paymentElem[i].value != "";
        }

        if(!formValid){
            document.getElementById("error3").style.display = "block";
            document.getElementById("error3").innerHTML = "Complete los datos de la tarjeta.";
            return false;
        }else{
            document.getElementById("error3").style.display = "none";
            document.getElementById("error3").innerHTML = "";
            return true;
        }
    }else if(document.getElementsByName("payment")[1].checked){
        var paymentElem = document.getElementsByClassName("reqB");
        for(var i = 0; i < paymentElem.length; i++){
            formValid = formValid && paymentElem[i].value != "";
        }

        if(!formValid){
            document.getElementById("error3").style.display = "block";
            document.getElementById("error3").innerHTML = "Complete los datos de la cuenta bancaria.";
            return false;
        }else{
            document.getElementById("error3").style.display = "none";
            document.getElementById("error3").innerHTML = "";
            return true;
        }
    }else{
        document.getElementById("error3").style.display = "block";
        document.getElementById("error3").innerHTML = "Seleccione un método de pago.";
        return false;
    }
}

// Función que guarda el domicilio en local.
function saveAddress(){
    var addr = {};
    addr.street = document.getElementById("street").value;
    addr.number = document.getElementById("number").value;
    addr.corner = document.getElementById("corner").value;
    addr.city = document.getElementById("city").value;
    addr.tel = document.getElementById("tel").value;
    addr.country = document.getElementById("country").value;
    addr = JSON.stringify(addr);
    localStorage.setItem("addr", addr);
}

// Función que carga el domicilio si fue previamente guardado.
function loadAddress(){
    if(localStorage.getItem("addr")){
        var addr = JSON.parse(localStorage.getItem("addr"));
        document.getElementById("street").value = addr.street;
        document.getElementById("number").value = addr.number;
        document.getElementById("corner").value = addr.corner;
        document.getElementById("city").value = addr.city;
        document.getElementById("tel").value = addr.tel;
        document.getElementById("country").value = addr.country;
    }
}