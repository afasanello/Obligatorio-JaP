//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

});

document.getElementById("login").addEventListener("click", (e) => {
    var errUser = false;
    var errPass = false;
    var user = document.getElementById("user").value;
    var password = document.getElementById("password").value;
    var remember = document.getElementById("recordar").checked;

    // Cajas de mensaje de error
    var msgUserBox = document.getElementById("msgUserBox");
    var msgPassBox = document.getElementById("msgPassBox");
    var messageUser = document.getElementById("messageUser");
    var messagePass = document.getElementById("messagePass");

    msgUserBox.style.display = "none";
    messageUser.innerHTML = "";
    msgPassBox.style.display = "none";
    messagePass.innerHTML = "";

    if(user == ""){
        // Chequea si el usuario está vacío.
        errUser = true;
        messageUser.innerHTML += "<li>Creo que falta el usuario. ¿Quién es usted?</li>";
    }else{
        if(user.length < 4){
            // Chequea si el usuario tiene menos de cuatro caracteres.
            errUser = true;
            messageUser.innerHTML += "<li>El usuario tiene menos de 4 caracteres.</li>";
        }
        var regex = new RegExp("^[a-zA-Z0-9_]+$");
        if(!regex.test(user)){
            // Chequea que el usuario no contenga caracteres no alfanuméricos.
            errUser = true;
            messageUser.innerHTML += "<li>Hay símbolos extraños que no puedo reconocer. :(</li>";
        }
    }

    if(password == ""){
        // Chequea si la contraseña está vacía.
        errPass = true;
        messagePass.innerHTML += "<li>Necesito una contraseña para saber que usted es usted.</li>";
    }else if(password.length < 6){
        // Chequea si la contraseña tiene menos de seis caracteres.
        errPass = true;
        messagePass.innerHTML += "<li>La contraseña es muy insegura, tiene menos de 6 caracteres.</li>";
    }

    if(errUser || errPass){
        // Si estamos parados acá, se encontró un error. Se previene que se envíe el formulario.
        e.preventDefault();
        
        //Muestra un mensaje de error, que desaparece a los tres segundos.
        if(errUser){
            msgUserBox.style.display = "inline-block";
            setTimeout(() => {msgUserBox.style.display = "none"}, 5000);
        }

        if(errPass){
            msgPassBox.style.display = "inline-block";
            setTimeout(() => {msgPassBox.style.display = "none"}, 5000);
        }
    }else{
        //Se accede al inicio de sesión.
        if(remember){
            localStorage.setItem('user', user);
        }
        sessionStorage.setItem('user', user);
    }
});

// Entra como invitado.
function enterAsGuest(){
    sessionStorage.setItem('user', 'Invitado');
    window.location = 'index.html';
}