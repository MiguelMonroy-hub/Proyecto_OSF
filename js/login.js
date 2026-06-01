document.addEventListener("DOMContentLoaded", function () {
  if (typeof initSupabase === "function") {
    initSupabase();
  }
});

async function entrar() {
  var correo = document.getElementById("email").value;
  var pass = document.getElementById("pass").value;
  var btn = document.querySelector(".btn-submit");
  var errBox = document.getElementById("login-error");
  var btnLabel = btn ? btn.textContent : "";

  function mostrarError(msg) {
    if (!errBox) {
      if (msg) {
        window.alert(msg);
      }
      return;
    }
    if (msg) {
      errBox.textContent = msg;
      errBox.hidden = false;
    } else {
      errBox.hidden = true;
      errBox.textContent = "";
    }
  }

  mostrarError("");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Entrando…";
  }

  function restaurarBoton() {
    if (btn) {
      btn.disabled = false;
      btn.textContent = btnLabel;
    }
  }

  if (typeof authIniciarSesion !== "function" || typeof initSupabase !== "function") {
    mostrarError("Supabase no está configurado.");
    restaurarBoton();
    return;
  }

  try {
    await initSupabase();
    var resultado = await authIniciarSesion(correo, pass);
    if (resultado.perfil.rol === "MAESTRO") {
      if (typeof gruposInicializar === "function") {
        await gruposInicializar();
      }
      window.location.href =
        typeof pagina === "function"
          ? pagina("teacher-dashboard.html")
          : "teacher-dashboard.html";
      return;
    }
    await redirigirAlumnoTrasLogin(correo);
  } catch (e) {
    mostrarError(
      typeof authTraducirError === "function"
        ? authTraducirError(e, "login")
        : e.message || "No se pudo iniciar sesión."
    );
    restaurarBoton();
  }
}
