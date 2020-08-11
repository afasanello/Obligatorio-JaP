//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

});

document.getElementById("login").addEventListener("click", (e) => {
    var err = false;
    var user = document.getElementById("user").value;
    var password = document.getElementById("password").value;

    // Caja de mensaje de error
    var msgBox = document.getElementById("msgBox");
    var message = document.getElementById("message");
    msgBox.style.display = "none";
    message.innerHTML = "";

    if(user == ""){
        // Chequea si el usuario está vacío.
        err = true;
        message.innerHTML += "<li>Ingrese un usuario.</li>";
    }else{
        if(user.length < 4){
            // Chequea si el usuario tiene menos de cuatro caracteres.
            err = true;
            message.innerHTML += "<li>El usuario tiene menos de 4 caracteres.</li>";
        }
        var regex = new RegExp("^[a-zA-Z0-9_]+$");
        if(!regex.test(user)){
            // Chequea que el usuario no contenga caracteres no alfanuméricos.
            err = true;
            message.innerHTML += "<li>El usuario solo puede contener letras, números y _</li>";
        }
    }

    if(password == ""){
        // Chequea si la contraseña está vacía.
        err = true;
        message.innerHTML += "<li>Ingrese una contraseña.</li>";
    }else if(password.length < 6){
        // Chequea si la contraseña tiene menos de seis caracteres.
        err = true;
        message.innerHTML += "<li>La contraseña tiene menos de 6 caracteres.</li>";
    }

    if(err){
        // Si estamos parados acá, se encontró un error. Se previene que se envíe el formulario.
        e.preventDefault();
        
        //Muestra un mensaje de error, que desaparece a los tres segundos.
        msgBox.style.display = "block";
        setTimeout(() => {msgBox.style.display = "none"}, 3000);
    }else{
        //Se accede al inicio de sesión.
        sessionStorage.setItem('user', user);
    }
});

// Entra como invitado.
function enterAsGuest(){
    sessionStorage.setItem('user', 'Invitado');
    window.location = 'index.html';
}