/**
 * Muestra en Temas los niveles creados por el maestro para el grupo del alumno.
 */
(function () {
  "use strict";

  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pintar() {
    if (typeof nivelMaestroParaGrupo !== "function") {
      return;
    }
    var seccion = document.getElementById("topics-maestro-niveles");
    var lista = document.getElementById("topics-maestro-list");
    if (!seccion || !lista) {
      return;
    }
    var email =
      typeof alumnoSesionEmail === "function" ? alumnoSesionEmail() : "";
    var vinculo =
      typeof alumnoObtenerGrupoVinculado === "function"
        ? alumnoObtenerGrupoVinculado(email)
        : null;
    if (!vinculo || !vinculo.grupoId) {
      seccion.hidden = true;
      return;
    }
    var niveles = nivelMaestroParaGrupo(vinculo.grupoId);
    if (!niveles.length) {
      seccion.hidden = true;
      return;
    }
    seccion.hidden = false;
    lista.innerHTML = "";
    for (var i = 0; i < niveles.length; i++) {
      var n = niveles[i];
      var asig = n.grupos[vinculo.grupoId] || {};
      var fechaTxt = nivelMaestroEtiquetaFecha(asig.fechaLimite);
      var meta = nivelMaestroEtiquetaResumen(n);
      var card = document.createElement("article");
      card.className = "topics-maestro-card";
      card.innerHTML =
        '<div class="topics-maestro-card-body">' +
        "<h3>" +
        escHtml(n.titulo) +
        "</h3>" +
        '<p class="topics-maestro-meta">' +
        escHtml(meta) +
        "</p>" +
        '<p class="topics-maestro-fecha">' +
        escHtml(fechaTxt) +
        "</p></div>" +
        '<a class="level-btn level-facil topics-maestro-play" href="quiz.html?tn=' +
        encodeURIComponent(n.id) +
        '"><span class="lvl-badge">★</span><span class="lvl-label">Jugar</span><span class="lvl-go">→</span></a>';
      lista.appendChild(card);
    }
  }

  function iniciar() {
    pintar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
  window.addEventListener("pageshow", pintar);
})();
