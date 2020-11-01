var loadedImg;

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    loadData();
});



// Carga la información si no fue guardada antes.
function loadData(){
    document.getElementById("pfp").value = null;
    var prof = localStorage.getItem("prof");
    if(prof){
        prof = JSON.parse(prof);
        document.getElementById("firstName").value = prof.firstName;
        document.getElementById("lastName").value = prof.lastName;
        document.getElementById("age").value = prof.age;
        document.getElementById("email").value = prof.email;
        document.getElementById("tel").value = prof.tel;
        if(prof.pfp){
            if(prof.pfp.url != ""){
                document.getElementById("img").style.display = "block";
                document.getElementById("img").setAttribute("src", prof.pfp.url);
            }
        }
    }else{
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("age").value = "";
        document.getElementById("email").value = "";
        document.getElementById("tel").value = "";
    }
}

// Guarda la información personal del perfil, obtenida a partir de los input.
function saveData(){
    var prof = {};
    prof.firstName = document.getElementById("firstName").value;
    prof.lastName = document.getElementById("lastName").value;
    prof.age = document.getElementById("age").value;
    prof.email = document.getElementById("email").value;
    prof.tel = document.getElementById("tel").value;
    prof.pfp = {};
    prof.pfp.url = "";

    // API que permite subir la imagen a un servidor.
    if(document.getElementById("pfp").files.length != 0){
        showSpinner();
        var file = document.getElementById("pfp");
        var apiURL = "https://api.imgbb.com/1/upload?expiration=2678400&name=" + sessionStorage.getItem("user") + "&key=ca9e5c25334591ff9aa3f8d4510c6f0e";
        var formData = new FormData();
        formData.append("image", file.files[0])
        
        fetch(apiURL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:', response);
            prof.pfp.url = response.data.image.url;
            
            document.getElementById("img").style.display = "block";
            document.getElementById("img").setAttribute("src", prof.pfp.url);
            document.getElementById("pfp").value = null;
    
            prof = JSON.stringify(prof);
            localStorage.setItem("prof", prof);
            hideSpinner();
            showMessage("Los cambios se guardaron con éxito.", "success", 5);
        });
    }else{
        prof = JSON.stringify(prof);
        localStorage.setItem("prof", prof);
        showMessage("Los cambios se guardaron con éxito.", "success", 5);
    }
}

// Se envía el formulario, validando que los campos no estén vacíos.
function sendForm(){
    var err = false;

    // Validación del nombre
    if(document.getElementById("firstName").value == ""){
        err = true;
        showMessage("Se requiere de un nombre.", "danger", 0);
    }

    // Validación del apellido
    if(document.getElementById("lastName").value == ""){
        err = true;
        showMessage("Se requiere de un apellido.", "danger", 1);
    }

    // Validación de la edad
    if(document.getElementById("age").value == ""){
        err = true;
        showMessage("Se requiere de una edad.", "danger", 2);
    }

    // Validación del email
    if(document.getElementById("email").value == ""){
        err = true;
        showMessage("Se requiere de un correo electrónico.", "danger", 3);
    }

    // Validación del teléfono
    if(document.getElementById("tel").value == ""){
        err = true;
        showMessage("Se requiere de un teléfono.", "danger", 4);
    }


    // Mensaje de éxito y guardado de información.
    if(!err){
        saveData();
    }

}

// Función auxiliar que despliega un mensaje de error/éxito por cinco segundos.
// Los parámetros son los mensajes, tipo de mensaje, y el número de caja a mostrar.
function showMessage(msg, type, box){
    var msgBox = document.getElementsByClassName("msgBox");
    msgBox[box].innerHTML = `
    <div class="alert alert-${type}" role="alert" style="position: relative; width: auto; top: 5px;">
        ${msg}
    </div>
    `;
    msgBox[box].style.display = "block";
    setTimeout(() => {
        msgBox[box].innerHTML = ``;
        msgBox[box].style.display = "none";
    }, 5000);
}

// Función que hace una petición a la API de imgBB para la subida de imágenes.
function loadFile(){
    
}