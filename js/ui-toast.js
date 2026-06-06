// Toasts flotantes (éxito, error, aviso). No bloquean la pantalla.
(function () {
  "use strict";

  var CONTAINER_ID = "ui-toast-container";
  var ANNOUNCER_ID = "ui-announcer";

  // Crea el div oculto que lee el lector de pantalla cuando sale un toast.
  function asegurarAnnouncer() {
    var el = document.getElementById(ANNOUNCER_ID);
    if (!el) {
      el = document.createElement("div");
      el.id = ANNOUNCER_ID;
      el.className = "ui-announcer";
      el.setAttribute("aria-live", "polite");
      el.setAttribute("aria-atomic", "true");
      document.body.appendChild(el);
    }
    return el;
  }

  // En la tienda los toasts van arriba; en el resto, abajo.
  function posicionToastPreferida() {
    if (
      document.body &&
      document.body.classList.contains("page-shop")
    ) {
      return "top";
    }
    return "bottom";
  }

  // Aplica la clase de posición (top/bottom) al contenedor.
  function aplicarPosicionContainer(el) {
    var pos = posicionToastPreferida();
    el.className = "ui-toast-container ui-toast-container--" + pos;
  }

  // Crea o reutiliza el contenedor donde se apilan los toasts.
  function asegurarContainer() {
    var el = document.getElementById(CONTAINER_ID);
    if (!el) {
      el = document.createElement("div");
      el.id = CONTAINER_ID;
      el.setAttribute("aria-live", "polite");
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    aplicarPosicionContainer(el);
    return el;
  }

  // Muestra un toast con tipo (error/success/warn/info) y lo quita solo tras unos segundos.
  function uiToast(mensaje, tipo, duracionMs) {
    var msg = String(mensaje || "").trim();
    if (!msg) {
      return;
    }
    var tipoCls =
      tipo === "error"
        ? "ui-toast--error"
        : tipo === "success"
          ? "ui-toast--success"
          : tipo === "warn"
            ? "ui-toast--warn"
            : "ui-toast--info";
    var container = asegurarContainer();
    var announcer = asegurarAnnouncer();
    var toast = document.createElement("div");
    toast.className = "ui-toast " + tipoCls;
    toast.setAttribute("role", tipo === "error" ? "alert" : "status");
    toast.textContent = msg;
    container.appendChild(toast);
    announcer.textContent = msg;
    var ms = duracionMs != null ? duracionMs : tipo === "error" ? 6000 : 4000;
    setTimeout(function () {
      toast.classList.add("ui-toast--out");
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 280);
    }, ms);
  }

  // Atajo para toast rojo de error.
  function uiToastError(mensaje) {
    uiToast(mensaje, "error");
  }

  // Atajo para toast verde de éxito.
  function uiToastSuccess(mensaje) {
    uiToast(mensaje, "success");
  }

  window.uiToast = uiToast;
  window.uiToastError = uiToastError;
  window.uiToastSuccess = uiToastSuccess;
})();
