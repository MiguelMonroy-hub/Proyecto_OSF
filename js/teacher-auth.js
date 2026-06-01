/**
 * Acceso maestro vía Supabase Auth.
 */
async function teacherExigirSesionAsync() {
  if (typeof initSupabase === "function") {
    await initSupabase();
  }
  if (typeof authExigirMaestro === "function") {
    return authExigirMaestro();
  }
  window.location.href =
    typeof pagina === "function" ? pagina("login.html") : "login.html";
  return false;
}

async function teacherCerrarSesion() {
  if (typeof authSalir === "function") {
    return authSalir("login.html");
  }
  if (typeof authCerrarSesion === "function") {
    await authCerrarSesion();
  }
}
