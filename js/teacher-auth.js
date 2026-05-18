/**
 * Acceso maestro (prueba local, sin hash).
 */
var TEACHER_AUTH = {
  email: "profe@gmail.com",
  pass: "12345678"
};

var CLAVE_SESION_MAESTRO = "tec_duck_teacher_sesion";

function normalizarCorreoMaestro(correo) {
  return String(correo || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function esCredencialMaestro(correo, contrasena) {
  var c = normalizarCorreoMaestro(correo);
  var okCorreo =
    c === normalizarCorreoMaestro(TEACHER_AUTH.email) ||
    c === "profe@gmailcom";
  return okCorreo && String(contrasena) === TEACHER_AUTH.pass;
}

function teacherIniciarSesion() {
  localStorage.setItem(
    CLAVE_SESION_MAESTRO,
    JSON.stringify({
      rol: "maestro",
      email: TEACHER_AUTH.email,
      desde: Date.now()
    })
  );
}

function teacherCerrarSesion() {
  localStorage.removeItem(CLAVE_SESION_MAESTRO);
}

function teacherSesionActiva() {
  try {
    var raw = localStorage.getItem(CLAVE_SESION_MAESTRO);
    if (!raw) return false;
    var s = JSON.parse(raw);
    return s && s.rol === "maestro";
  } catch (e) {
    return false;
  }
}

function teacherExigirSesion() {
  if (!teacherSesionActiva()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}
