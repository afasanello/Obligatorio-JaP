//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL)
    .then((res) =>{
        if(res.status == "ok"){
            var prod = res.data;
            var list = document.getElementById("prods");
            var content = ``;
            for(var i = 0; i < prod.length; i++){
                var badgeColor;
                if(prod[i].soldCount >= 20){
                    badgeColor = "success";
                }else if(prod[i].soldCount < 20 && prod[i].soldCount > 1){
                    badgeColor = "warning";
                }else{
                    badgeColor = "danger";
                }
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
                            <h4><span class="badge badge-${badgeColor}">Quedan ${prod[i].soldCount} unidades</span></h4>
                        </td>
                    </tr>`;
            }
            list.innerHTML = content;
            console.log(prod);
        }
    });
});