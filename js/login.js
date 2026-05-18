function entrar() {
  var correo = document.getElementById("email").value;
  var pass = document.getElementById("pass").value;

  if (typeof esCredencialMaestro === "function" && esCredencialMaestro(correo, pass)) {
    if (typeof teacherIniciarSesion === "function") {
      teacherIniciarSesion();
    }
    window.location.href = "teacher-dashboard.html";
    return;
  }

  if (typeof redirigirAlumnoTrasLogin === "function") {
    redirigirAlumnoTrasLogin(correo);
  } else {
    window.location.href = "topics.html";
  }
}
