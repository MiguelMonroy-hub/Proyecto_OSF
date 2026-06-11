/**
 * Modal en Temas para corregir el maestro (máximo 1 cambio por alumno).
 */
(function () {
  "use strict";

  var _maestrosCache = null;
  var _estado = null;
  var _filtro = "";

  function escHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function etiquetaMaestro(row) {
    var txt = String(row.etiqueta || "").trim();
    if (txt) {
      return txt;
    }
    var nombre = String(row.nombre || "").trim();
    var apellido = String(row.apellido || "").trim();
    return (nombre + " " + apellido).trim() || "Maestro";
  }

  function modal() {
    return document.getElementById("topics-modal-maestro");
  }

  function listaEl() {
    return document.getElementById("topics-modal-lista");
  }

  function errorEl() {
    return document.getElementById("topics-modal-error");
  }

  function actualEl() {
    return document.getElementById("topics-maestro-actual-texto");
  }

  function buscarEl() {
    return document.getElementById("topics-modal-buscar");
  }

  function buscarWrap() {
    return document.getElementById("topics-modal-buscar-wrap");
  }

  function mostrarError(msg) {
    var el = errorEl();
    if (!el) {
      return;
    }
    if (msg) {
      el.textContent = msg;
      el.hidden = false;
    } else {
      el.hidden = true;
      el.textContent = "";
    }
  }

  function fijarTextoMaestroActual(texto) {
    var el = actualEl();
    if (el) {
      el.textContent = texto;
    }
  }

  function nombreMaestroDesdeEstado(estado) {
    if (!estado) {
      return "";
    }
    var n = String(estado.nombre_maestro || "").trim();
    if (n) {
      return n;
    }
    var pid = estado.profesor_id;
    if (pid != null && _maestrosCache && _maestrosCache.length) {
      for (var i = 0; i < _maestrosCache.length; i++) {
        if (String(_maestrosCache[i].profesor_id) === String(pid)) {
          return etiquetaMaestro(_maestrosCache[i]);
        }
      }
    }
    return pid != null ? "Maestro asignado" : "";
  }

  function nombreMaestroActualTexto() {
    if (!_estado) {
      return "Sin asignar";
    }
    var n = nombreMaestroDesdeEstado(_estado);
    return n || "Sin asignar";
  }

  function pintarMaestroActual() {
    fijarTextoMaestroActual(nombreMaestroActualTexto());
  }

  function maestroSeleccionadoId() {
    var checked = document.querySelector('input[name="cambio-profesor-id"]:checked');
    if (!checked) {
      return null;
    }
    var id = parseInt(checked.value, 10);
    return isNaN(id) ? null : id;
  }

  function filtrarMaestros(lista, termino) {
    var q = String(termino || "")
      .trim()
      .toLowerCase();
    if (!q) {
      return lista.slice();
    }
    return lista.filter(function (m) {
      return etiquetaMaestro(m).toLowerCase().indexOf(q) >= 0;
    });
  }

  function pintarListaMaestros(lista) {
    var el = listaEl();
    if (!el) {
      return;
    }

    var actualId =
      _estado && _estado.profesor_id != null ? String(_estado.profesor_id) : "";
    var visibles = filtrarMaestros(lista, _filtro).filter(function (m) {
      return String(m.profesor_id) !== actualId;
    });

    var wrap = buscarWrap();
    if (wrap) {
      wrap.hidden = lista.length < 4;
    }

    if (!visibles.length) {
      el.innerHTML =
        '<p class="topics-modal-empty">No hay otro maestro disponible para seleccionar.</p>';
      return;
    }

    var html = [];
    for (var i = 0; i < visibles.length; i++) {
      var m = visibles[i];
      var id = String(m.profesor_id);
      var nombre = etiquetaMaestro(m);
      html.push(
        '<label class="topics-modal-opcion">' +
          '<input type="radio" name="cambio-profesor-id" value="' +
          escHtml(id) +
          '">' +
          '<span class="topics-modal-nombre">' +
          escHtml(nombre) +
          "</span></label>"
      );
    }
    el.innerHTML = html.join("");

    el.querySelectorAll('input[name="cambio-profesor-id"]').forEach(function (input) {
      input.addEventListener("change", function () {
        el.querySelectorAll(".topics-modal-opcion").forEach(function (op) {
          op.classList.toggle(
            "is-selected",
            op.querySelector("input") === input && input.checked
          );
        });
        mostrarError("");
      });
    });
  }

  function cerrarModal() {
    var m = modal();
    if (!m) {
      return;
    }
    m.hidden = true;
    m.setAttribute("hidden", "");
    document.body.classList.remove("topics-modal-open");
    mostrarError("");
  }

  async function manejarClicIncorrecto(ev) {
    if (ev && ev.preventDefault) {
      ev.preventDefault();
    }

    if (!_estado && typeof alumnoResolverEstadoMaestro === "function") {
      var resEstado = await alumnoResolverEstadoMaestro();
      if (resEstado.ok) {
        _estado = resEstado.estado || null;
        _maestrosCache = resEstado.maestros || [];
      }
    }

    if (!_estado) {
      window.alert("No se pudo verificar tu maestro. Intenta de nuevo.");
      return;
    }

    if (!_estado.puede_cambiar) {
      window.alert("Si necesitas otra corrección, pide ayuda a tu profesor.");
      return;
    }

    await abrirModal();
  }

  async function alumnoPintarBannerGrupoAsync(nombreGrupo) {
    var banner = document.getElementById("topics-grupo-banner");
    var lineaMaestro = document.getElementById("topics-maestro-line");
    if (!banner) {
      return;
    }

    var grupo = String(nombreGrupo || "").trim();
    var nombreMaestro = "";

    if (typeof alumnoResolverEstadoMaestro === "function") {
      var res = await alumnoResolverEstadoMaestro();
      if (res.ok) {
        _estado = res.estado || null;
        _maestrosCache = res.maestros || [];
        nombreMaestro = nombreMaestroDesdeEstado(_estado);
      }
    }

    if (grupo) {
      banner.textContent = "Tu grupo: " + grupo;
      banner.hidden = false;
    } else {
      banner.hidden = true;
      banner.textContent = "";
    }

    if (!lineaMaestro) {
      return;
    }

    if (nombreMaestro) {
      lineaMaestro.innerHTML =
        '<span>Maestro: <strong>' +
        escHtml(nombreMaestro) +
        '</strong></span>' +
        '<span class="topics-maestro-line-sep" aria-hidden="true">·</span>' +
        '<button type="button" class="topics-maestro-line-link" id="topics-cambio-maestro-link">¿Incorrecto?</button>';
      lineaMaestro.hidden = false;

      var link = document.getElementById("topics-cambio-maestro-link");
      if (link) {
        link.addEventListener("click", manejarClicIncorrecto);
      }
    } else {
      lineaMaestro.hidden = true;
      lineaMaestro.innerHTML = "";
    }
  }

  async function abrirModal() {
    var m = modal();
    if (!m) {
      return;
    }

    _filtro = "";
    if (buscarEl) {
      buscarEl.value = "";
    }

    fijarTextoMaestroActual("Consultando…");
    if (listaEl()) {
      listaEl().innerHTML =
        '<p class="topics-modal-loading">Cargando maestros…</p>';
    }

    m.hidden = false;
    m.removeAttribute("hidden");
    document.body.classList.add("topics-modal-open");
    mostrarError("");

    if (typeof alumnoResolverEstadoMaestro !== "function") {
      cerrarModal();
      window.alert("No se pudo cargar el módulo de maestros. Recarga la página.");
      return;
    }

    var res;
    if (_estado && _maestrosCache && _maestrosCache.length) {
      res = { ok: true, estado: _estado, maestros: _maestrosCache };
    } else {
      res = await alumnoResolverEstadoMaestro();
    }
    if (!res.ok) {
      cerrarModal();
      window.alert(
        res.error || "No se pudo verificar tu maestro. Intenta de nuevo."
      );
      return;
    }

    _estado = res.estado || null;
    _maestrosCache = res.maestros || [];

    if (!_estado || !_estado.puede_cambiar) {
      cerrarModal();
      window.alert("Si necesitas otra corrección, pide ayuda a tu profesor.");
      return;
    }

    pintarMaestroActual();
    pintarListaMaestros(_maestrosCache);
  }

  async function confirmarCambio() {
    var id = maestroSeleccionadoId();
    if (!id) {
      mostrarError("Selecciona el maestro correcto.");
      return;
    }

    var nombre =
      _maestrosCache &&
      _maestrosCache.find(function (m) {
        return String(m.profesor_id) === String(id);
      });
    var etiqueta = nombre ? etiquetaMaestro(nombre) : "este maestro";

    var ok = window.confirm(
      "¿Cambiar tu maestro a " +
        etiqueta +
        "?\n\nSolo puedes hacerlo una vez. Después ya no podrás modificarlo."
    );
    if (!ok) {
      return;
    }

    var btn = document.getElementById("btn-confirmar-cambio-maestro");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Guardando…";
    }
    mostrarError("");

    try {
      var res = await alumnoCambiarMaestro(id);
      if (!res.ok) {
        throw new Error(res.error || "No se pudo cambiar de maestro.");
      }
      cerrarModal();
      if (typeof uiToastSuccess === "function") {
        uiToastSuccess(
          "Maestro actualizado. Ingresa el código de clase de tu nuevo profesor."
        );
      }
      window.setTimeout(function () {
        window.location.href =
          typeof pagina === "function"
            ? pagina("join-group.html")
            : "join-group.html";
      }, 600);
    } catch (e) {
      mostrarError(e.message || "No se pudo cambiar de maestro.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Confirmar cambio";
      }
    }
  }

  function enlazarEventos() {
    var m = modal();
    if (m) {
      m.querySelectorAll("[data-close-topics-modal]").forEach(function (el) {
        el.addEventListener("click", cerrarModal);
      });
    }

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && m && !m.hidden) {
        cerrarModal();
      }
    });

    var confirmar = document.getElementById("btn-confirmar-cambio-maestro");
    if (confirmar) {
      confirmar.addEventListener("click", confirmarCambio);
    }

    if (buscarEl) {
      buscarEl.addEventListener("input", function () {
        _filtro = buscarEl.value;
        if (_maestrosCache) {
          pintarListaMaestros(_maestrosCache);
        }
      });
    }
  }

  async function iniciar() {
    if (typeof alumnoGuardEsperar === "function") {
      var ok = await alumnoGuardEsperar();
      if (!ok) {
        return;
      }
    }
    enlazarEventos();
  }

  function arrancar() {
    if (typeof alumnoGuardEstaListo === "function" && alumnoGuardEstaListo()) {
      iniciar();
      return;
    }
    window.addEventListener("alumno-guard-ready", iniciar, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar);
  } else {
    arrancar();
  }

  window.alumnoPintarBannerGrupoAsync = alumnoPintarBannerGrupoAsync;
})();
