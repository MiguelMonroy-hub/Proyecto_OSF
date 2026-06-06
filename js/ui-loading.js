// Overlay genérico de "Cargando…" con spinner. Varios ids pueden coexistir.
(function () {
  "use strict";

  var _overlays = {};

  // Crea el div del overlay si no existe en el DOM.
  function crearOverlay(id, mensaje) {
    var el = document.getElementById(id);
    if (el) {
      return el;
    }
    el = document.createElement("div");
    el.id = id;
    el.className = "ui-loading-overlay";
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-busy", "true");
    var card = document.createElement("div");
    card.className = "ui-loading-card";
    card.innerHTML =
      '<div class="ui-loading-spinner" aria-hidden="true"></div>' +
      '<p class="ui-loading-text"></p>';
    el.appendChild(card);
    document.body.appendChild(el);
    return el;
  }

  // Muestra el overlay con mensaje opcional (por defecto usa str o "Cargando…").
  function uiMostrarCarga(id, mensaje) {
    id = id || "ui-loading-default";
    var el = crearOverlay(id, mensaje);
    var texto = el.querySelector(".ui-loading-text");
    if (texto) {
      texto.textContent =
        mensaje ||
        (typeof str === "function" ? str("maestro.cargandoPanel", "Cargando…") : "Cargando…");
    }
    el.classList.remove("is-hidden");
    el.hidden = false;
    el.setAttribute("aria-busy", "true");
    _overlays[id] = true;
  }

  // Oculta el overlay por id.
  function uiOcultarCarga(id) {
    id = id || "ui-loading-default";
    var el = document.getElementById(id);
    if (!el) {
      return;
    }
    el.classList.add("is-hidden");
    el.hidden = true;
    el.setAttribute("aria-busy", "false");
    _overlays[id] = false;
  }

  window.uiMostrarCarga = uiMostrarCarga;
  window.uiOcultarCarga = uiOcultarCarga;
})();
