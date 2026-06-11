(function () {
  "use strict";

  // --- Estado en memoria ---

  var _maestrosCache = null; // Lista completa que devolvió Supabase.
  var _filtroActual = ""; // Texto del buscador (filtra por nombre).
  var _panelAbierto = false; // ¿Está abierto el desplegable de maestros?

  // --- Utilidades ---

  // Evita que nombres con < o " rompan el HTML al pintar la lista.
  function escHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  // Nombre que se muestra en cada opción: etiqueta de la BD o nombre + apellido.
  function etiquetaMaestro(row) {
    var txt = String(row.etiqueta || "").trim();
    if (txt) {
      return txt;
    }
    var nombre = String(row.nombre || "").trim();
    var apellido = String(row.apellido || "").trim();
    return (nombre + " " + apellido).trim() || "Maestro";
  }

  // --- Referencias a elementos del HTML (signup.html) ---

  function fieldsetMaestros() {
    return document.getElementById("signup-maestros-fieldset");
  }

  function contenedorLista() {
    return document.getElementById("signup-maestros-list");
  }

  function toolbarBuscar() {
    return document.getElementById("signup-maestros-toolbar");
  }

  function inputBuscar() {
    return document.getElementById("signup-maestros-buscar");
  }

  function toggleBtn() {
    return document.getElementById("signup-maestros-toggle");
  }

  function toggleValor() {
    return document.getElementById("signup-maestros-toggle-valor");
  }

  function panelMaestros() {
    return document.getElementById("signup-maestros-panel");
  }

  // --- Abrir / cerrar el desplegable ---

  function abrirPanel() {
    var panel = panelMaestros();
    var btn = toggleBtn();
    var fs = fieldsetMaestros();
    if (!panel || !btn) {
      return;
    }
    panel.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    if (fs) {
      fs.classList.add("is-open");
    }
    _panelAbierto = true;
  }

  function cerrarPanel() {
    var panel = panelMaestros();
    var btn = toggleBtn();
    var fs = fieldsetMaestros();
    if (!panel || !btn) {
      return;
    }
    panel.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    if (fs) {
      fs.classList.remove("is-open");
    }
    _panelAbierto = false;
  }

  function alternarPanel() {
    if (_panelAbierto) {
      cerrarPanel();
    } else {
      abrirPanel();
    }
  }

  // Actualiza el texto del botón cerrado: «Elige un maestro» o el nombre elegido.
  function actualizarToggleValor() {
    var val = toggleValor();
    var btn = toggleBtn();
    var fs = fieldsetMaestros();
    if (!val || !btn) {
      return;
    }
    var checked = document.querySelector('input[name="profesor-id"]:checked');
    if (checked) {
      var label = checked.closest(".signup-maestro-option");
      var nombreEl = label ? label.querySelector(".signup-maestro-nombre") : null;
      val.textContent = nombreEl ? nombreEl.textContent : "Maestro seleccionado";
      btn.classList.add("has-value");
      if (fs) {
        fs.classList.add("has-selection");
      }
      return;
    }
    val.textContent = "Elige un maestro";
    btn.classList.remove("has-value");
    if (fs) {
      fs.classList.remove("has-selection");
    }
  }

  // Pone HTML en la lista (cargando, error o vacío) y oculta el buscador.
  function pintarEstadoLista(html) {
    var el = contenedorLista();
    if (el) {
      el.innerHTML = html;
    }
    var tb = toolbarBuscar();
    if (tb) {
      tb.hidden = true;
    }
    actualizarToggleValor();
  }

  // Animación de «Cargando maestros…» mientras llega la respuesta de Supabase.
  function htmlSkeleton() {
    return (
      '<div class="signup-maestros-skeleton" role="status" aria-live="polite">' +
      '<span class="signup-maestros-skeleton-row"></span>' +
      '<span class="signup-maestros-skeleton-row"></span>' +
      '<span class="signup-maestros-skeleton-text">Cargando maestros…</span></div>'
    );
  }

  // Filtra la lista por lo que escribió el alumno en el buscador.
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

  // Marca visualmente la opción del radio que está seleccionada.
  function sincronizarEstadoOpciones() {
    var opciones = document.querySelectorAll(".signup-maestro-option");
    for (var i = 0; i < opciones.length; i++) {
      var op = opciones[i];
      var input = op.querySelector('input[type="radio"]');
      op.classList.toggle("is-selected", !!(input && input.checked));
    }
    actualizarToggleValor();
  }

  // Al elegir un maestro (radio), cierra el panel y actualiza el botón.
  function enlazarEventosLista() {
    var lista = contenedorLista();
    if (!lista) {
      return;
    }
    lista.addEventListener("change", function (ev) {
      if (ev.target && ev.target.name === "profesor-id") {
        sincronizarEstadoOpciones();
        cerrarPanel();
      }
    });
  }

  // Clic en el botón desplegable: abre/cierra la lista.
  // Clic fuera del fieldset: cierra la lista.
  function enlazarToggle() {
    var btn = toggleBtn();
    if (!btn || btn.getAttribute("data-toggle-listo") === "1") {
      return;
    }
    btn.setAttribute("data-toggle-listo", "1");
    btn.addEventListener("click", function () {
      if (!_maestrosCache || !_maestrosCache.length) {
        return;
      }
      alternarPanel();
    });
    document.addEventListener("click", function (ev) {
      if (!_panelAbierto) {
        return;
      }
      var fs = fieldsetMaestros();
      if (fs && !fs.contains(ev.target)) {
        cerrarPanel();
      }
    });
  }

  // Cada tecla en el buscador vuelve a pintar la lista filtrada.
  function enlazarBusqueda() {
    var input = inputBuscar();
    if (!input || input.getAttribute("data-buscar-listo") === "1") {
      return;
    }
    input.setAttribute("data-buscar-listo", "1");
    input.addEventListener("input", function () {
      _filtroActual = input.value;
      if (_maestrosCache) {
        pintarMaestros(_maestrosCache, { conservarFiltro: true });
      }
    });
  }

  // --- Pintar la lista de maestros en pantalla ---

  function pintarMaestros(lista, opts) {
    opts = opts || {};
    var el = contenedorLista();
    if (!el) {
      return;
    }
    _maestrosCache = lista;

    // Sin maestros en la base: mensaje y botón deshabilitado.
    if (!lista.length) {
      cerrarPanel();
      pintarEstadoLista(
        '<div class="signup-maestros-empty-box">' +
          "<p>No hay maestros registrados.</p>" +
          '<p class="signup-maestros-empty-sub">Pide a tu centro que dé de alta al maestro en la base de datos.</p></div>'
      );
      var btn = toggleBtn();
      if (btn) {
        btn.disabled = true;
      }
      return;
    }

    var btn = toggleBtn();
    if (btn) {
      btn.disabled = false;
    }

    // Buscador solo si hay 4 o más maestros (si no, no hace falta).
    var tb = toolbarBuscar();
    if (tb) {
      tb.hidden = lista.length < 4;
    }

    if (!opts.conservarFiltro) {
      _filtroActual = "";
      var buscar = inputBuscar();
      if (buscar) {
        buscar.value = "";
      }
    }

    var visibles = filtrarMaestros(lista, _filtroActual);
    if (!visibles.length) {
      el.innerHTML =
        '<p class="signup-maestros-sin-resultados">Ningún maestro coincide con «' +
        escHtml(_filtroActual) +
        "».</p>";
      actualizarToggleValor();
      return;
    }

    // Un radio por maestro; name="profesor-id" para que register.js lea el elegido.
    var previo = signupMaestroSeleccionadoId();
    var html = [];
    for (var i = 0; i < visibles.length; i++) {
      var m = visibles[i];
      var id = String(m.profesor_id);
      var nombre = etiquetaMaestro(m);
      var checked = previo && String(previo) === id;
      html.push(
        '<label class="signup-maestro-option' +
        (checked ? " is-selected" : "") +
        '">' +
        '<input type="radio" name="profesor-id" value="' +
        escHtml(id) +
        '" required' +
        (checked ? " checked" : "") +
        ">" +
        '<span class="signup-maestro-nombre">' +
        escHtml(nombre) +
        "</span></label>"
      );
    }
    el.innerHTML = html.join("");

    // Si solo hay un maestro, lo preselecciona para ahorrar un clic.
    if (visibles.length === 1 && !document.querySelector('input[name="profesor-id"]:checked')) {
      var unico = el.querySelector('input[name="profesor-id"]');
      if (unico) {
        unico.checked = true;
      }
    }

    sincronizarEstadoOpciones();
    enlazarBusqueda();
  }

  // --- Cargar maestros desde Supabase ---

  async function signupCargarMaestros() {
    cerrarPanel();
    var el = contenedorLista();
    if (el) {
      el.innerHTML = htmlSkeleton();
    }
    var tb = toolbarBuscar();
    if (tb) {
      tb.hidden = true;
    }

    if (typeof initSupabase !== "function") {
      pintarEstadoLista(
        '<p class="signup-maestros-empty">No se pudo conectar con el servidor.</p>'
      );
      return [];
    }
    try {
      var sb = await initSupabase();
      if (!sb) {
        throw new Error("Supabase no configurado");
      }
      // RPC definido en database/01_esquema_y_funciones.sql
      var res = await sb.rpc("listar_maestros_registro", {});
      // Si el esquema acaba de actualizarse, espera y reintenta una vez.
      if (res.error && String(res.error.code || "") === "PGRST202") {
        await new Promise(function (r) {
          setTimeout(r, 1500);
        });
        res = await sb.rpc("listar_maestros_registro", {});
      }
      if (res.error) {
        var detalle = res.error.message || "Error al cargar maestros";
        if (String(res.error.code || "") === "PGRST202") {
          detalle =
            "Falta ejecutar database/01_esquema_y_funciones.sql en Supabase. Luego recarga esta página.";
        }
        throw new Error(detalle);
      }
      pintarMaestros(res.data || []);
      return _maestrosCache || [];
    } catch (e) {
      console.warn("[signup-maestros]", e);
      pintarEstadoLista(
        '<div class="signup-maestros-empty-box signup-maestros-empty-box--error">' +
          '<p class="signup-maestros-empty">' +
          escHtml(e.message || "No pudimos cargar la lista de maestros.") +
          "</p></div>"
      );
      return [];
    }
  }

  // --- API pública (la usa register.js) ---

  // Devuelve el profesor_id del radio marcado, o null.
  function signupMaestroSeleccionadoId() {
    var checked = document.querySelector('input[name="profesor-id"]:checked');
    if (!checked) {
      return null;
    }
    var id = parseInt(checked.value, 10);
    return isNaN(id) ? null : id;
  }

  // register.js llama esto antes de crear la cuenta: ¿hay lista y hay elección?
  function signupValidarMaestroSeleccionado() {
    if (!_maestrosCache || !_maestrosCache.length) {
      return {
        ok: false,
        error:
          "No hay maestros disponibles. Pide a tu centro que registre al maestro en la base de datos."
      };
    }
    var id = signupMaestroSeleccionadoId();
    if (!id) {
      return { ok: false, error: "Selecciona tu maestro." };
    }
    return { ok: true, profesorId: id };
  }

  // --- Arranque al cargar signup.html ---

  document.addEventListener("DOMContentLoaded", function () {
    enlazarToggle();
    enlazarEventosLista();
    signupCargarMaestros();
  });

  window.signupCargarMaestros = signupCargarMaestros;
  window.signupMaestroSeleccionadoId = signupMaestroSeleccionadoId;
  window.signupValidarMaestroSeleccionado = signupValidarMaestroSeleccionado;
})();
