// Pantalla de carga con pato y barra al cambiar de página (sobre todo al volver a Temas).
// Usa #page-loading-overlay del HTML o crea uno; en quiz también mira #quiz-loading-overlay.
(function () {
  "use strict";

  var OVERLAY_HTML =
    '<div class="td-page-loading-card">' +
    '<img class="td-page-loading-duck" src="../MAIN DUCK/DUCK/MAIN DUCK.png" alt="Pato TecDuck" width="86" height="86" onerror="if (typeof pageLoadDuckFallback === \'function\') pageLoadDuckFallback();" />' +
    '<span id="page-loading-duck-fallback" class="td-page-loading-duck-fallback" hidden aria-hidden="true">🦆</span>' +
    '<span class="td-page-loading-brand">TecDuck</span>' +
    '<span class="td-page-loading-main">Cargando…</span>' +
    '<span class="td-page-loading-sub">Un momento…</span>' +
    '<span class="td-page-loading-bar" aria-hidden="true"><span class="td-page-loading-bar-fill"></span></span>' +
    "</div>";

  // Busca el overlay en la página (genérico o el del quiz).
  function overlayEl() {
    return (
      document.getElementById("page-loading-overlay") ||
      document.getElementById("quiz-loading-overlay")
    );
  }

  // Textos por defecto cuando navegas de vuelta a Temas.
  function textosTemas() {
    return {
      main:
        typeof str === "function"
          ? str("topics.cargando", "Volviendo a temas")
          : "Volviendo a temas",
      sub:
        typeof str === "function"
          ? str("topics.cargandoSub", "Cargando tus temas y progreso…")
          : "Cargando tus temas y progreso…"
    };
  }

  // Textos por defecto al abrir Mis niveles del maestro.
  function textosNivelesMaestro() {
    return {
      main: "Cargando tus niveles",
      sub: "Preparando prácticas y grupos…"
    };
  }

  // Pone el título y subtítulo del overlay.
  function aplicarTextoOverlay(el, opts) {
    if (!el || !opts) {
      return;
    }
    var main = el.querySelector(".td-page-loading-main, .quiz-loading-main");
    var sub = el.querySelector(".td-page-loading-sub, .quiz-loading-sub");
    if (main && opts.main) {
      main.textContent = opts.main;
    }
    if (sub && opts.sub) {
      sub.textContent = opts.sub;
    }
  }

  // Si no hay overlay en el HTML, lo monta al inicio del body.
  function pageLoadAsegurarOverlay() {
    var el = overlayEl();
    if (el) {
      return el;
    }
    el = document.createElement("div");
    el.id = "page-loading-overlay";
    el.className = "td-page-loading-overlay";
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-label", "Cargando");
    el.innerHTML = OVERLAY_HTML;
    document.body.insertBefore(el, document.body.firstChild);
    return el;
  }

  // Muestra el overlay y opcionalmente cambia los textos.
  function pageLoadMostrar(opts) {
    opts = opts || {};
    var el = pageLoadAsegurarOverlay();
    document.body.classList.add("is-page-loading");
    if (document.body.classList.contains("page-quiz")) {
      document.body.classList.add("is-quiz-loading");
    }
    el.classList.remove("is-hidden");
    aplicarTextoOverlay(el, opts);
  }

  // Quita el overlay y limpia la marca de navegación a temas en sessionStorage.
  function pageLoadOcultar() {
    document.body.classList.remove("is-page-loading", "is-quiz-loading");
    var el = overlayEl();
    if (el) {
      el.classList.add("is-hidden");
    }
    try {
      sessionStorage.removeItem("tec_duck_nav_topics");
      sessionStorage.removeItem("tec_duck_nav_teacher_niveles");
    } catch (e) {
      /* noop */
    }
  }

  // Si falla la imagen del pato, muestra el emoji de respaldo.
  function pageLoadDuckFallback() {
    var img = document.querySelector(
      ".td-page-loading-duck, .quiz-loading-duck"
    );
    var fb = document.getElementById("page-loading-duck-fallback");
    if (img) {
      img.hidden = true;
    }
    if (fb) {
      fb.hidden = false;
      fb.removeAttribute("aria-hidden");
    }
  }

  // URL de topics.html usando rutas.js si está cargado.
  function pageLoadUrlTemas() {
    return typeof pagina === "function" ? pagina("topics.html") : "topics.html";
  }

  // URL de teacher-niveles.html usando rutas.js si está cargado.
  function pageLoadUrlNivelesMaestro() {
    return typeof pagina === "function"
      ? pagina("teacher-niveles.html")
      : "teacher-niveles.html";
  }

  // Marca en sessionStorage que vamos a temas, muestra overlay y navega.
  function pageLoadIrATemas(opts) {
    opts = opts || textosTemas();
    try {
      sessionStorage.setItem("tec_duck_nav_topics", "1");
    } catch (e) {
      /* noop */
    }
    pageLoadMostrar(opts);
    window.location.assign(pageLoadUrlTemas());
  }

  // Marca en sessionStorage que vamos a Mis niveles, muestra overlay y navega.
  function pageLoadIrANivelesMaestro(opts) {
    opts = opts || textosNivelesMaestro();
    try {
      sessionStorage.setItem("tec_duck_nav_teacher_niveles", "1");
    } catch (e) {
      /* noop */
    }
    pageLoadMostrar(opts);
    window.location.assign(pageLoadUrlNivelesMaestro());
  }

  // ¿La URL de destino apunta a la página de temas?
  function pageLoadDestinoEsTemas(destino) {
    var d = String(destino || "");
    return /topics(\.html)?(\?|#|$)/i.test(d) || d.indexOf("/topics") >= 0;
  }

  // Detecta enlaces a Mis niveles del maestro.
  function pageLoadEsEnlaceNivelesMaestro(a) {
    if (!a || a.tagName !== "A") {
      return false;
    }
    if (a.classList.contains("teacher-action-btn--levels")) {
      return true;
    }
    var href = (a.getAttribute("href") || "").trim();
    if (!href || href === "#") {
      return false;
    }
    return (
      href === "teacher-niveles.html" ||
      href === "/pages/teacher-niveles.html" ||
      /\/pages\/teacher-niveles\.html/i.test(href) ||
      /(^|\/)teacher-niveles\.html/i.test(href)
    );
  }

  // Detecta enlaces de "volver a temas" por id, clase, data-attribute o href.
  function pageLoadEsEnlaceVolverTemas(a) {
    if (!a || a.tagName !== "A") {
      return false;
    }
    if (a.getAttribute("data-volver-temas") === "1") {
      return true;
    }
    if (a.id === "quiz-volver-temas") {
      return true;
    }
    if (
      a.classList.contains("shop-nav-btn-temas") ||
      a.classList.contains("customize-nav-btn--topics") ||
      a.classList.contains("quiz-nav-btn--topics")
    ) {
      return true;
    }
    var href = (a.getAttribute("href") || "").trim();
    if (!href || href === "#") {
      return false;
    }
    return (
      href === "topics.html" ||
      href === "/pages/topics.html" ||
      /\/pages\/topics\.html/i.test(href) ||
      /(^|\/)topics\.html/i.test(href)
    );
  }

  // Intercepta clics en enlaces con overlay antes de navegar.
  function pageLoadEnlazarNavegacion() {
    document.addEventListener(
      "click",
      function (ev) {
        if (ev.defaultPrevented) {
          return;
        }
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) {
          return;
        }
        var a = ev.target.closest("a");
        if (!a || a.getAttribute("data-auth-logout")) {
          return;
        }
        if (pageLoadEsEnlaceVolverTemas(a)) {
          if (a.getAttribute("data-volver-temas-skip") === "1") {
            return;
          }
          ev.preventDefault();
          pageLoadIrATemas();
          return;
        }
        if (pageLoadEsEnlaceNivelesMaestro(a)) {
          ev.preventDefault();
          pageLoadIrANivelesMaestro();
        }
      },
      true
    );
  }

  window.pageLoadMostrar = pageLoadMostrar;
  window.pageLoadOcultar = pageLoadOcultar;
  window.pageLoadDuckFallback = pageLoadDuckFallback;
  window.pageLoadIrATemas = pageLoadIrATemas;
  window.pageLoadIrANivelesMaestro = pageLoadIrANivelesMaestro;
  window.pageLoadUrlTemas = pageLoadUrlTemas;
  window.pageLoadUrlNivelesMaestro = pageLoadUrlNivelesMaestro;
  window.pageLoadDestinoEsTemas = pageLoadDestinoEsTemas;
  window.pageLoadEsEnlaceVolverTemas = pageLoadEsEnlaceVolverTemas;
  window.pageLoadEsEnlaceNivelesMaestro = pageLoadEsEnlaceNivelesMaestro;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pageLoadEnlazarNavegacion);
  } else {
    pageLoadEnlazarNavegacion();
  }
})();
