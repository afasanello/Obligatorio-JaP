//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL)
    .then((res) => {
        if(res.status == "ok"){
            var prod = res.data;
            var list = document.getElementById("prods");
            var content = ``;
            for(var i = 0; i < prod.length; i++){
                content += `
                    <tr>
                        <td>
                            <img class="img-thumbnail" src="${prod[i].imgSrc}" width="300" alt="${prod[i].description}">
                        </td>
                        <td style="padding: 20px;">
                            <h4>${prod[i].name} <span class="badge badge-info">${prod[i].currency} ${prod[i].cost}</span></h4>
                            <p>${prod[i].description}</p> 
                        </td>
                        <td>
                            <h4><span class="badge badge-info">Se vendieron ${prod[i].soldCount} unidades</span></h4>
                        </td>
                    </tr>`;
            }
            list.innerHTML = content;
        }
    });
});

// Función principal que filtra los productos por cualquier criterio.
function filterProducts(){
    var min = document.getElementById("pMin").value;
    var max = document.getElementById("pMax").value;
    var cost = document.getElementById("cost").value;
    var relevance = document.getElementById("relevance").value;
    var search = document.getElementById("search").value;

    getJSONData(PRODUCTS_URL)
    .then((res) => {
        if(res.status == "ok"){
            var prod = res.data;
            var list = document.getElementById("prods");
            var content = ``;

            // Bandera booleana cuyo valor es true si el producto cumple con los criterios
            // de filtro.
            var filter;

            if(cost == "asc")
                // Ordena de forma ascendente
                prod.sort(function(a, b){
                    return a.cost - b.cost;
                });
            else if(cost == "desc")
                // Ordena de forma descendente
                prod.sort(function(a, b){
                    return b.cost - a.cost;
                });

            if(relevance)
                prod.sort(function(a, b){
                    // Ordena descendentemente por cantidad de vendidos.
                    return b.soldCount - a.soldCount;
                });

            if(search != "")
                // Filtra por búsqueda, ya sea por nombre o por descripción, sin importar
                // si se escribe en mayúsculas o minúsculas.
                prod = prod.filter(a => {
                    var desc = a.description.toLowerCase();
                    var name = a.name.toLowerCase();

                    var s = search.toLowerCase();

                    return desc.indexOf(s) != -1 || name.indexOf(s) != -1;
                });

            for(var i = 0; i < prod.length; i++){
                filter = true;

                // Si el mínimo está definido, se aplica un criterio para el mínimo.
                if(min !== "")
                    filter = filter && prod[i].cost >= parseInt(min);

                // Si el máximo está definido, se aplica un criterio para el máximo.
                if(max !== "")
                    filter = filter && prod[i].cost <= parseInt(max);

                // Si la bandera booleana de filtro es verdadera, el producto cumple con
                // los filtros. Se despliega el producto.
                if(filter){
                    var name = prod[i].name;
                    var desc = prod[i].description;
                    if(search != ""){
                        var nAux = name.toLowerCase();
                        var dAux = desc.toLowerCase();
                        var sAux = search.toLowerCase();

                        var nIndex = nAux.indexOf(sAux);
                        var dIndex = dAux.indexOf(sAux);

                        // Resalta la primera coincidencia en el nombre.
                        if(nIndex != -1){
                            name = name.substring(0, nIndex)
                                + "<span style='background-color: yellow'>"
                                + name.substring(nIndex, nIndex + search.length)
                                + "</span>"
                                + name.substring(nIndex + search.length, nAux.length);
                        }

                        // Resalta la primera coincidencia en la descripción.
                        if(dIndex != -1){
                            desc = desc.substring(0, dIndex)
                                + "<span style='background-color: yellow'>"
                                + desc.substring(dIndex, dIndex + search.length)
                                + "</span>"
                                + desc.substring(dIndex + search.length, dAux.length);
                        }

                    }
                    content += `
                        <tr>
                            <td>
                                <img class="img-thumbnail" src="${prod[i].imgSrc}" width="300" alt="${prod[i].description}">
                            </td>
                            <td style="padding: 20px;">
                                <h4>${name} <span class="badge badge-info">${prod[i].currency} ${prod[i].cost}</span></h4>
                                <p>${desc}</p> 
                            </td>
                            <td>
                                <h4><span class="badge badge-info">Se vendieron ${prod[i].soldCount} unidades</span></h4>
                            </td>
                        </tr>`;
                }

            }
            list.innerHTML = content;
        }
    });
}

// Ordena por costo. Define los parámetros para que se ejecute en la función principal.
function orderByCost(){
    document.getElementById("relevance").value = "";
    document.getElementById("relevanceBtn").innerHTML = "Ordenar por relevancia";

    if(document.getElementById("cost").value == "asc"){
        document.getElementById("cost").value = "desc";
        document.getElementById("costBtn").innerHTML = "Ordenar por precio ↓";
    }else{
        document.getElementById("cost").value = "asc";
        document.getElementById("costBtn").innerHTML = "Ordenar por precio ↑";
    }
    
    filterProducts();
}

// Ordena por relevancia. Define los parámetros para que se ejecute en la función principal.
function orderByRelevance(){
    document.getElementById("cost").value = "";
    document.getElementById("relevance").value = "desc";
    
    document.getElementById("costBtn").innerHTML = "Ordenar por precio";
    document.getElementById("relevanceBtn").innerHTML = "Ordenar por relevancia ↑";

    filterProducts();
}

// Reinicia los valores del formulario, y muestra todos los productos sin criterios de búsqueda.
function resetValues(){
    document.getElementById("pMin").value = "";
    document.getElementById("pMax").value = "";
    document.getElementById("cost").value = "";
    document.getElementById("relevance").value = "";
    document.getElementById("search").value = "";
    
    document.getElementById("costBtn").innerHTML = "Ordenar por precio";
    document.getElementById("relevanceBtn").innerHTML = "Ordenar por relevancia";

    filterProducts();
}