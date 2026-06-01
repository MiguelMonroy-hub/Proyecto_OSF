(function () {
  "use strict";

  async function obtenerEmailAlumno() {
    if (typeof initSupabase === "function") {
      await initSupabase();
    }
    if (typeof authEmailActual === "function") {
      var desdeAuth = await authEmailActual();
      if (desdeAuth) {
        return desdeAuth;
      }
    }
    if (typeof alumnoSesionEmailSync === "function") {
      return alumnoSesionEmailSync();
    }
    if (typeof alumnoSesionEmail === "function") {
      return alumnoSesionEmail();
    }
    return "";
  }

  async function iniciar() {
    var email = "";
    try {
      email = await obtenerEmailAlumno();
    } catch (e) {
      if (typeof authLogError === "function") {
        authLogError("topics-entry-email", e);
      }
    }

    if (!email) {
      window.location.href =
        typeof pagina === "function" ? pagina("login.html") : "login.html";
      return;
    }

    if (typeof alumnoSesionGuardar === "function") {
      alumnoSesionGuardar(email);
    }

    if (typeof progresoTemasBloquearDificilCargando === "function") {
      progresoTemasBloquearDificilCargando();
    }

    if (typeof duckAvatarResolverOutfit === "function") {
      try {
        await duckAvatarResolverOutfit();
      } catch (e) {
        console.warn("[topics] avatar:", e);
      }
    }

    if (typeof duckEconomiaSyncDesdeDb === "function") {
      try {
        await duckEconomiaSyncDesdeDb();
      } catch (e) {
        console.warn("[topics] economia:", e);
      }
    }

    if (typeof quizProgressCargarDesbloqueosTemas === "function") {
      try {
        var progRes = await quizProgressCargarDesbloqueosTemas();
        if (progRes && progRes.ok === false && progRes.error) {
          console.warn("[topics] progreso:", progRes.error);
        }
      } catch (e) {
        console.warn("[topics] progreso:", e);
      }
    }

    if (typeof aplicarBloqueosTarjetas === "function") {
      aplicarBloqueosTarjetas();
    }

    var tieneGrupo = false;
    try {
      tieneGrupo =
        typeof alumnoTieneGrupoVinculadoAsync === "function"
          ? await alumnoTieneGrupoVinculadoAsync(email)
          : false;
    } catch (e) {
      console.warn("[topics] grupo:", e);
    }

    if (!tieneGrupo) {
      window.location.href =
        typeof pagina === "function" ? pagina("join-group.html") : "join-group.html";
      return;
    }

    try {
      var banner = document.getElementById("topics-grupo-banner");
      if (banner) {
        var v =
          typeof alumnoObtenerGrupoVinculadoAsync === "function"
            ? await alumnoObtenerGrupoVinculadoAsync(email)
            : null;
        if (v && v.nombreGrupo) {
          banner.textContent = "Tu grupo: " + v.nombreGrupo;
          banner.hidden = false;
        }
      }
    } catch (e) {
      console.warn("[topics] banner:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
