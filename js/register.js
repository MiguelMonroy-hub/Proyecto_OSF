function crearCuenta() {
  var correo = document.getElementById("email");
  var email = correo ? correo.value : "";
  if (typeof redirigirAlumnoTrasLogin === "function") {
    redirigirAlumnoTrasLogin(email);
    return;
  }
  window.location.href = "topics.html";
}
