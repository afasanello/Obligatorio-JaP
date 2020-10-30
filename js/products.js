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
                    <div class="col col-md-4 my-3">
                        <div class="card h-100">
                            <div class="card-header text-right">
                                ${prod[i].soldCount} vendidos
                            </div>
                            <div class="card-body">
                                <a href="product-info.html?prod=${i}" class="prod"><img class="img-thumbnail" src="${prod[i].imgSrc}" width="300" alt="${prod[i].description}"></a>
                                <h2>${prod[i].name}</h2>
                                <p align="justify">${prod[i].description}</p>
                            </div>
                            <div class="card-footer">
                                ${prod[i].currency} ${prod[i].cost} - <a href="product-info.html?prod=${i}">Ver detalles</a>
                            </div>
                        </div>
                    </div>
                `;
            }
            list.innerHTML = content;
        }
    });
});

// Función principal que filtra los productos por cualquier criterio.
function filterProducts(){
    var min = document.getElementById("pMin").value;
    var max = document.getElementById("pMax").value;
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

            if(document.getElementsByName("options")[0].checked){
                // Ordena de forma ascendente
                prod.sort(function(a, b){
                    return a.cost - b.cost;
                });
            }
            else if(document.getElementsByName("options")[1].checked){
                // Ordena de forma descendente
                prod.sort(function(a, b){
                    return b.cost - a.cost;
                });
            }
            if(document.getElementsByName("options")[2].checked){
                prod.sort(function(a, b){
                    // Ordena descendentemente por cantidad de vendidos.
                    return b.soldCount - a.soldCount;
                });
            }
            if(search != ""){
                // Filtra por búsqueda, ya sea por nombre o por descripción, sin importar
                // si se escribe en mayúsculas o minúsculas.
                prod = prod.filter(a => {
                    var desc = a.description.toLowerCase();
                    var name = a.name.toLowerCase();

                    var s = search.toLowerCase();

                    return desc.indexOf(s) != -1 || name.indexOf(s) != -1;
                });
            }
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
                        <div class="col col-md-4 my-3">
                            <div class="card h-100">
                                <div class="card-header text-right">
                                    ${prod[i].soldCount} vendidos
                                </div>
                                <div class="card-body">
                                    <a href="product-info.html?prod=${i}" class="prod"><img class="img-thumbnail" src="${prod[i].imgSrc}" width="300" alt="${prod[i].description}"></a>
                                    <h2>${name}</h2>
                                    <p align="justify">${desc}</p>
                                </div>
                                <div class="card-footer">
                                    ${prod[i].currency} ${prod[i].cost} - <a href="product-info.html?prod=${i}">Ver detalles</a>
                                </div>
                            </div>
                        </div>`;
                }

            }
            list.innerHTML = content;
        }
    });
}

// Reinicia los valores del formulario, y muestra todos los productos sin criterios de búsqueda.
function resetValues(){
    document.getElementById("pMin").value = "";
    document.getElementById("pMax").value = "";
    document.getElementById("search").value = "";
    document.getElementsByName("options")[0].checked = false;
    document.getElementsByName("options")[1].checked = false;
    document.getElementsByName("options")[2].checked = false;

    filterProducts();
}