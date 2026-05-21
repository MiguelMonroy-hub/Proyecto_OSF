/**
 * Niveles del maestro en «Elige tu tema» — mismas tarjetas que los temas.
 */
(function () {
  "use strict";

  var RUTA_LOGO_DEFAULT = "../MAIN DUCK/BACKGROUND/Quiz_default.png";
  var RUTA_TIMEOUT = "../MAIN DUCK/BACKGROUND/Timeout.png";

  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escAttr(s) {
    return escHtml(s).replace(/'/g, "&#39;");
  }

  function urlLogoNivel(nivel) {
    if (typeof nivelMaestroUrlLogo === "function") {
      return nivelMaestroUrlLogo(nivel);
    }
    if (
      typeof nivelMaestroEsLogoValido === "function" &&
      nivelMaestroEsLogoValido(nivel && nivel.logo)
    ) {
      return nivel.logo;
    }
    return RUTA_LOGO_DEFAULT;
  }

  function quitarTarjetasMaestro(grid) {
    var previas = grid.querySelectorAll("[data-maestro-nivel]");
    for (var i = 0; i < previas.length; i++) {
      previas[i].remove();
    }
  }

  function crearTarjetaTema(nivel, vinculo) {
    var asig = nivel.grupos[vinculo.grupoId] || {};
    var vencido =
      typeof nivelMaestroFechaVencida === "function" &&
      nivelMaestroFechaVencida(nivel, vinculo.grupoId);
    var fechaTxt =
      typeof nivelMaestroEtiquetaFecha === "function"
        ? nivelMaestroEtiquetaFecha(asig.fechaLimite)
        : "";
    var meta =
      typeof nivelMaestroEtiquetaResumen === "function"
        ? nivelMaestroEtiquetaResumen(nivel)
        : "";
    var tagline = meta;
    if (fechaTxt && fechaTxt !== "Sin fecha límite") {
      tagline = tagline + " · Límite: " + fechaTxt;
    }
    var nivelHtml = "";
    if (vencido) {
      nivelHtml =
        '<span class="level-btn level-facil level-maestro-locked" role="presentation">' +
        '<span class="lvl-badge">🔒</span>' +
        '<span class="lvl-label">Jugar</span>' +
        '<span class="lvl-go">No disponible</span>' +
        "</span>";
    } else {
      nivelHtml =
        '<a href="quiz.html?tn=' +
        encodeURIComponent(nivel.id) +
        '" class="level-btn level-facil">' +
        '<span class="lvl-badge">A</span>' +
        '<span class="lvl-label">Jugar</span>' +
        '<span class="lvl-go">Jugar →</span>' +
        "</a>";
    }

    var card = document.createElement("article");
    card.className =
      "topic-card c-maestro-nivel" + (vencido ? " c-maestro-nivel--vencido" : "");
    card.setAttribute("data-maestro-nivel", nivel.id);

    card.innerHTML =
      (vencido
        ? '<span class="c-maestro-vencido-badge" aria-hidden="true">Vencido</span>'
        : "") +
      '<div class="topic-visual topic-visual--logo' +
      (vencido ? " topic-visual--timeout" : "") +
      '" aria-hidden="true">' +
      '<img class="topic-logo' +
      (vencido ? " topic-logo--timeout" : "") +
      '" src="' +
      escAttr(vencido ? RUTA_TIMEOUT : urlLogoNivel(nivel)) +
      '" alt="" width="142" height="142" />' +
      "</div>" +
      '<div class="topic-body">' +
      "<h2>Del maestro</h2>" +
      '<p class="topic-title">' +
      escHtml(nivel.titulo) +
      "</p>" +
      '<p class="topic-tagline">' +
      escHtml(tagline) +
      "</p>" +
      '<div class="levels">' +
      nivelHtml +
      "</div></div>";

    return card;
  }

  function pintar() {
    if (typeof nivelMaestroParaGrupo !== "function") {
      return;
    }
    var seccion = document.getElementById("topics-maestro-niveles");
    var grid = document.getElementById("topics-maestro-grid");
    if (!grid) {
      return;
    }

    quitarTarjetasMaestro(grid);

    var email =
      typeof alumnoSesionEmail === "function" ? alumnoSesionEmail() : "";
    var vinculo =
      typeof alumnoObtenerGrupoVinculado === "function"
        ? alumnoObtenerGrupoVinculado(email)
        : null;

    if (!vinculo || !vinculo.grupoId) {
      if (seccion) {
        seccion.hidden = true;
      }
      return;
    }

    var niveles = nivelMaestroParaGrupo(vinculo.grupoId);
    if (!niveles.length) {
      if (seccion) {
        seccion.hidden = true;
      }
      return;
    }

    if (seccion) {
      seccion.hidden = false;
    }

    var frag = document.createDocumentFragment();
    for (var i = 0; i < niveles.length; i++) {
      frag.appendChild(crearTarjetaTema(niveles[i], vinculo));
    }
    grid.appendChild(frag);
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
