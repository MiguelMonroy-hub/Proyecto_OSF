// Niveles creados por el maestro en «Elige tu tema»: mismas tarjetas visuales que los temas del catálogo.
(function () {
  "use strict";

  var RUTA_LOGO_DEFAULT = "../MAIN DUCK/BACKGROUND/Quiz_default.png";
  var RUTA_TIMEOUT = "../MAIN DUCK/BACKGROUND/Timeout.png";

  // Escapa texto para meterlo seguro dentro de HTML.
  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Igual que escHtml pero también escapa comillas simples para atributos.
  function escAttr(s) {
    return escHtml(s).replace(/'/g, "&#39;");
  }

  // Resuelve la URL del logo del nivel maestro o usa la imagen por defecto.
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

  // Quita del grid las tarjetas de niveles maestro que ya estaban pintadas.
  function quitarTarjetasMaestro(grid) {
    var previas = grid.querySelectorAll("[data-maestro-nivel]");
    for (var i = 0; i < previas.length; i++) {
      previas[i].remove();
    }
  }

  // Construye una tarjeta de tema para un nivel del maestro (jugable o vencido).
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
        htmlContenidoBotonNivel("🔒", "Jugar", "No disponible", false) +
        "</span>";
    } else {
      nivelHtml =
        '<a href="/pages/quiz.html?tn=' +
        encodeURIComponent(nivel.id) +
        '" class="level-btn level-facil" data-maestro-progress="' +
        escAttr(String(nivel.id)) +
        '">' +
        htmlContenidoBotonNivel("A", "Jugar", "Jugar →", true) +
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

    if (!vencido) {
      var play = card.querySelector("a.level-facil");
      if (play) {
        play.setAttribute(
          "href",
          "/pages/quiz.html?tn=" + encodeURIComponent(nivel.id)
        );
        play.addEventListener("click", function (ev) {
          ev.preventDefault();
          window.location.assign(
            "/pages/quiz.html?tn=" + encodeURIComponent(nivel.id)
          );
        });
      }
    }

    return card;
  }

  var pintarSeq = 0;

  // Carga los niveles del maestro del grupo del alumno y los muestra en el grid.
  async function pintar() {
    if (typeof nivelMaestroParaGrupo !== "function") {
      return;
    }
    var seq = ++pintarSeq;
    var seccion = document.getElementById("topics-maestro-niveles");
    var grid = document.getElementById("topics-maestro-grid");
    if (!grid) {
      return;
    }

    quitarTarjetasMaestro(grid);

    var vinculo =
      typeof alumnoObtenerGrupoVinculadoAsync === "function"
        ? await alumnoObtenerGrupoVinculadoAsync()
        : null;

    if (seq !== pintarSeq) {
      return;
    }

    if (!vinculo || !vinculo.grupoId) {
      if (seccion) {
        seccion.hidden = true;
      }
      return;
    }

    if (typeof initSupabase === "function") {
      await initSupabase();
    }

    if (seq !== pintarSeq) {
      return;
    }

    var niveles =
      typeof nivelMaestroParaGrupoAsync === "function"
        ? await nivelMaestroParaGrupoAsync(vinculo.grupoId)
        : nivelMaestroParaGrupo(vinculo.grupoId);

    if (seq !== pintarSeq) {
      return;
    }

    quitarTarjetasMaestro(grid);

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
    if (typeof pintarBarrasProgresoNivelesMaestro === "function") {
      pintarBarrasProgresoNivelesMaestro();
    }
  }

  // Punto de arranque: pinta la sección de niveles del maestro al cargar la página.
  async function iniciar() {
    await pintar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
  window.addEventListener("pageshow", pintar);
})();
