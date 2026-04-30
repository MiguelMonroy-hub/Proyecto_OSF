function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
        alert("Inicio de sesión exitoso");
        window.location.href = "pantalla_inicio.html";
    } else {
        alert("Completa los campos");
    }
}

function volver() {
    window.location.href = "pantalla_inicio.html";
}