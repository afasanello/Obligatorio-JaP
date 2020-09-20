//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL)
    .then((res) => {
        if(res.status == "ok"){
            var info = res.data;
            var product = `
                <div class="row justify-content-around">
            `;

            // Carrusel y precio
            product += `
                <div class="card col-4 py-2">
                    <div id="carousel" class="carousel slide">
                        <ol class="carousel-indicators">
                            <li data-target="#carousel" data-slide-to="${i}" class="active"></li>
            `;
            for(var i = 1; i < info.images.length; i++){
                product += `<li data-target="#carousel" data-slide-to="${i}"></li>`;
            }
            product += `
                    </ol>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img class="d-block w-100" src="${info.images[0]}">
                        </div>
                `;

            for(var i = 1; i < info.images.length; i++){
                product += `
                    <div class="carousel-item">
                        <img class="d-block w-100" src="${info.images[i]}">
                    </div>
                `;
            }
            product += `
                            </div>
                        <a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div>
                    <div class="row my-2 mx-1">
                        <div class="col text-center">
                            <h2><span class="badge badge-dark">${info.currency} ${info.cost}</span></h2>
                        </div>
                    </div>
                    <div class="row mx-1">
                        <div class="col text-center">
                            <h4 class="badge badge-light">${info.soldCount} vendidos</h4>
                        </div>
                    </div>
                </div>
            `;

            // Contenido
            product += `
                        <div class="col-7">
                            <div class="card">
                                <div class="card-header">
                                    ${info.category} / ${info.name}
                                </div>
                                <div class="card-body">
                                    <p align="justify">${info.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Productos relacionados
            product += `
                <div class="row my-2">
                    <div class="col">
                        <div class="card">
                            <div class="card-header">
                                Productos relacionados
                            </div>
                            <div class="card-body">
                               <div class="row" id="related">
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById("product").innerHTML = product;

            getJSONData(PRODUCTS_URL)
            .then((res) => {
                if(res.status == "ok"){
                    var rel = res.data;
                    var divRel = document.getElementById("related");
                    for(var i = 0; i < info.relatedProducts.length; i++){
                        divRel.innerHTML += `
                            <div class="col-4">
                                <div class="card">
                                    <div class="card-header">
                                        ${rel[info.relatedProducts[i]].name}
                                    </div>
                                    <div class="card-body" onclick="window.location = 'product-info.html?prod=${info.relatedProducts[i]}'">
                                        <img src="${rel[info.relatedProducts[i]].imgSrc}" class="col-12"><br />
                                        <div class="col text-center">
                                            <h3><span class="badge badge-dark">${rel[info.relatedProducts[i]].currency} ${rel[info.relatedProducts[i]].cost}</span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }

                }
            });
        }
    });

    // Comentarios
    getJSONData(PRODUCT_INFO_COMMENTS_URL)
    .then((res) => {
        if(res.status == "ok"){
            var comm = res.data;
            comm.sort(function(a, b){
                if(a.dateTime < b.dateTime) return 1;
                else return -1;
            })
            var comments = ``;
            for(var i = 0; i < comm.length; i++){
                var stars = "";
                for(var j = 0; j < comm[i].score; j++){
                    stars += `<span class="fa fa-star checked mx-2"></span>`;
                }
                for(var j = comm[i].score; j < 5; j++){
                    stars += `<span class="fa fa-star mx-2"></span>`;
                }
                comments += `
                    <div class="card my-3">
                        <div class="card-header text-white bg-dark">
                            <div class="row justify-content-around">
                                <div class="col-6">${comm[i].user}</div>
                                <div class="col-6 text-right">${comm[i].dateTime}</div>
                            </div>
                        </div>
                        <div class="card-body align-middle">
                            <p align="justify">${comm[i].description}<p>
                        </div>
                        <div class="card-footer text-center">${stars}</div>
                    </div>
                `;
            }

            document.getElementById("comments").innerHTML = comments;

        }
    });
});

function sendComment(){
    var text = document.getElementById("comment").value;
    var rate = document.getElementById("rate").value;
    var cmtMsg = document.getElementById("commentErr");
    var rtMsg = document.getElementById("starErr");
    var successMsg = document.getElementById("succ");
    var err = false;

    var date = new Date();
    var dateStr = "";

    //Año
    dateStr += date.getFullYear() + "-";

    //Mes
    if(date.getMonth() < 10){
        dateStr += "0";
    }
    dateStr += date.getMonth() + "-";

    //Día
    if(date.getDate() < 10){
        dateStr += "0";
    }
    dateStr += date.getDate() + " ";

    //Horas
    if(date.getHours() < 10){
        dateStr += "0";
    }
    dateStr += date.getHours() + ":";

    //Minutos
    if(date.getMinutes() < 10){
        dateStr += "0";
    }
    dateStr += date.getMinutes() + ":";
    //Segundos
    if(date.getSeconds() < 10){
        dateStr += "0";
    }
    dateStr += date.getSeconds();

    if(text == ""){
        err = true;
        cmtMsg.innerHTML = "Faltó el mensaje.";
        cmtMsg.style.display = "block";
        setTimeout(() => {
            cmtMsg.style.display = "none";
            cmtMsg.innerHTML = "";
        }, 3000);
    }

    if(rate == ""){
        err = true;
        rtMsg.style.display = "block";
        rtMsg.innerHTML = "Faltó una puntuación.";
        setTimeout(() => {
            rtMsg.style.display = "none";
            rtMsg.innerHTML = "";
        }, 3000);
    }

    if(!err){
        successMsg.style.display = "block";
        successMsg.innerHTML = "El mensaje se envió con éxito.";
        setTimeout(() => {
            successMsg.style.display = "none";
            successMsg.innerHTML = "";
        }, 3000);

        var stars = "";
        for(var j = 0; j < rate; j++){
            stars += `<span class="fa fa-star checked mx-2"></span>`;
        }
        for(var j = rate; j < 5; j++){
            stars += `<span class="fa fa-star mx-2"></span>`;
        }

        // Agrego el comentario
        var newComment = `
            <div class="card my-3">
                <div class="card-header text-white bg-dark">
                    <div class="row justify-content-around">
                        <div class="col-6">${localStorage.getItem("user")}</div>
                        <div class="col-6 text-right">${dateStr}</div>
                    </div>
                </div>
                <div class="card-body align-middle">
                    <p align="justify">${text}<p>
                </div>
                <div class="card-footer text-center">${stars}</div>
            </div>
        `;

        newComment += document.getElementById("comments").innerHTML;
        document.getElementById("comments").innerHTML = newComment;

        // Vacío el formulario
        document.getElementById("sendComment").reset();
        for(var i = 1; i <= 5; i++){
            document.getElementById("star" + i).className = "fa fa-star";
        }
        document.getElementById("length").innerHTML = "200";
    }
}

function rate(stars){
    for(var i = 1; i <= 5; i++){
        document.getElementById("star" + i).className = "fa fa-star";
    }

    for(var i = 1; i <= stars; i++){
        document.getElementById("star" + i).className = "fa fa-star checked";
    }

    document.getElementById("rate").value = stars;
}

document.getElementById("comment").addEventListener("keyup", (e) => {
    var comment = document.getElementById("comment");
    var count = document.getElementById("length");
    count.innerHTML = (200 - comment.value.length);
});