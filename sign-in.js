function registrar() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;

    if (nombre && apellido && email) {
        alert("Registro exitoso");
        window.location.href = "pantalla_inicio.html";
    } else {
        alert("Completa todos los campos");
    }
}

function volver() {
    window.location.href = "pantalla_inicio.html";
}