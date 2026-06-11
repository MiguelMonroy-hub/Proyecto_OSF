/**
 * Botón de ojo para mostrar u ocultar la contraseña.
 *
 * Se carga en login.html y signup.html. Busca todos los input[type="password"],
 * les pone un botón al lado y alterna entre texto visible y puntos.
 *
 * El HTML solo necesita el input dentro de .auth-password-wrap (o sin wrap:
 * este script crea el contenedor si falta).
 */
(function () {
  "use strict";

  // Iconos SVG del ojo abierto y del ojo tachado (ocultar).
  var SVG_OJO =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  var SVG_OJO_TACHADO =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

  // Crea el botón con accesibilidad (aria-label, aria-pressed, aria-controls).
  function crearBotonToggle(input) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "auth-password-toggle";
    btn.setAttribute("aria-label", "Mostrar contraseña");
    btn.setAttribute("aria-pressed", "false");
    if (input.id) {
      btn.setAttribute("aria-controls", input.id);
    }
    btn.innerHTML =
      '<span class="auth-password-toggle-icon auth-password-toggle-icon--show">' +
      SVG_OJO +
      "</span>" +
      '<span class="auth-password-toggle-icon auth-password-toggle-icon--hide">' +
      SVG_OJO_TACHADO +
      "</span>";
    return btn;
  }

  // Cambia el input entre type="password" y type="text"; actualiza icono y aria.
  function alternarVisibilidad(wrap, input, btn) {
    var visible = input.type === "password";
    input.type = visible ? "text" : "password";
    wrap.classList.toggle("is-password-visible", visible);
    btn.setAttribute("aria-pressed", visible ? "true" : "false");
    btn.setAttribute("aria-label", visible ? "Ocultar contraseña" : "Mostrar contraseña");
  }

  // Añade el botón de ojo a un campo de contraseña (solo una vez por input).
  function enlazarCampo(input) {
    if (!input || input.getAttribute("data-password-toggle-ready") === "1") {
      return;
    }
    var wrap = input.closest(".auth-password-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "auth-password-wrap";
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
    }
    var btn = wrap.querySelector(".auth-password-toggle");
    if (!btn) {
      btn = crearBotonToggle(input);
      wrap.appendChild(btn);
    }
    btn.addEventListener("click", function () {
      alternarVisibilidad(wrap, input, btn);
    });
    input.setAttribute("data-password-toggle-ready", "1");
  }

  // Busca todos los campos password en root (o en todo el documento) y los enlaza.
  function authPasswordToggleInit(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var campos = scope.querySelectorAll('input[type="password"]');
    for (var i = 0; i < campos.length; i++) {
      enlazarCampo(campos[i]);
    }
  }

  // Arranque automático al cargar login o signup.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      authPasswordToggleInit(document);
    });
  } else {
    authPasswordToggleInit(document);
  }

  window.authPasswordToggleInit = authPasswordToggleInit;
})();
