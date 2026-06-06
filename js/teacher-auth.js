/**
 * Guard de rutas maestro: delega en authExigirMaestro.
 * Lo usan teacher-dashboard, niveles y otras páginas del panel.
 */
// Inicia Supabase y comprueba sesión MAESTRO; si no, redirige a login.
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
