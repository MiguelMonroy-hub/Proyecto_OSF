(function () {
  "use strict";

  function iniciar() {
    if (typeof alumnoSesionEmail !== "function") {
      return;
    }
    var email = alumnoSesionEmail();
    if (!email) {
      return;
    }
    if (
      typeof alumnoTieneGrupoVinculado === "function" &&
      !alumnoTieneGrupoVinculado(email)
    ) {
      window.location.href = "join-group.html";
      return;
    }
    var banner = document.getElementById("topics-grupo-banner");
    if (banner && typeof alumnoObtenerGrupoVinculado === "function") {
      var v = alumnoObtenerGrupoVinculado(email);
      if (v && v.nombreGrupo) {
        banner.textContent = "Tu grupo: " + v.nombreGrupo;
        banner.hidden = false;
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
