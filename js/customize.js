/* Personalización: solo ítems que existen en el inventario (tienda) */
var _outfitBorrador = null;
var _outfitGuardadoJson = "";

// Compara el borrador con lo último que se guardó.
function hayCambiosSinGuardar() {
  return duckOutfitAString(_outfitBorrador) !== _outfitGuardadoJson;
}

// Muestra el mensaje verde de éxito o el rojo de error al guardar.
function mostrarMensajeGuardado(texto, esError) {
  var ok = document.getElementById("customize-save-msg");
  var err = document.getElementById("customize-save-error");
  if (ok) {
    ok.hidden = !!esError;
  }
  if (err) {
    err.hidden = !esError;
    err.textContent = esError ? texto : "";
  }
  if (!esError && ok) {
    ok.hidden = false;
    setTimeout(function () {
      if (!hayCambiosSinGuardar()) {
        ok.hidden = true;
      }
    }, 2500);
  }
}

// Activa el botón Guardar solo si hay cambios pendientes.
function actualizarBotonGuardar() {
  var btn = document.getElementById("btn-guardar-pato");
  if (btn) {
    btn.disabled = !hayCambiosSinGuardar();
  }
  if (hayCambiosSinGuardar()) {
    mostrarMensajeGuardado("", false);
    var ok = document.getElementById("customize-save-msg");
    if (ok) {
      ok.hidden = true;
    }
  }
}

// Sincroniza el estado "guardado" con el borrador actual.
function marcarOutfitComoGuardado() {
  _outfitGuardadoJson = duckOutfitAString(_outfitBorrador);
  actualizarBotonGuardar();
}

// Pinta el pato en la vista previa de personalización.
function aplicarVistaPrevia(outfit) {
  duckOutfitPintarEnIds(DUCK_OUTFIT_IDS_CUSTOMIZE, outfit);
}

// Guarda local y sube el outfit a Supabase si hay sesión de alumno.
async function guardarPatoPersonalizado() {
  var btn = document.getElementById("btn-guardar-pato");
  if (!hayCambiosSinGuardar()) {
    return true;
  }

  _outfitBorrador = duckOutfitAjustarAlInventario(
    _outfitBorrador || duckOutfitLeerLocal()
  );
  aplicarVistaPrevia(_outfitBorrador);
  duckOutfitGuardarLocal(_outfitBorrador, Date.now());

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Guardando…";
  }

  var ok = true;
  var errorNube = "";
  if (typeof duckAvatarSincronizar === "function") {
    var syncRes = await duckAvatarSincronizar(_outfitBorrador);
    if (syncRes && typeof syncRes.ok === "boolean") {
      ok = syncRes.ok;
      errorNube = syncRes.error || "";
    } else {
      ok = !!syncRes;
    }
  }

  if (btn) {
    btn.textContent = "Guardar pato";
  }

  if (ok) {
    marcarOutfitComoGuardado();
    mostrarMensajeGuardado("¡Pato guardado!", false);
  } else {
    actualizarBotonGuardar();
    mostrarMensajeGuardado(
      errorNube ||
        "No se pudo guardar en la nube. Revisa tu conexión e inténtalo de nuevo.",
      true
    );
  }

  return ok;
}

// Limpia la lista de opciones de un panel antes de rellenarla.
function vaciarOpts(panel) {
  var opts = panel.querySelector(".opts");
  if (opts) {
    opts.innerHTML = "";
  }
  return opts;
}

// Botón para quitar un accesorio de esa zona.
function crearBotonNinguno(activo) {
  var b = document.createElement("button");
  b.type = "button";
  b.className = "opt-none" + (activo ? " selected" : "");
  b.setAttribute("data-valor", "__ninguno__");
  b.textContent = "Ninguno";
  return b;
}

// Botón con miniatura de un ítem del inventario.
function crearBotonItem(entry, activo) {
  var b = document.createElement("button");
  b.type = "button";
  b.className = "opt" + (activo ? " selected" : "");
  b.setAttribute("data-valor", entry.file);
  b.title = entry.label;
  var img = document.createElement("img");
  img.src = duckSrcDesdeEntrada(entry);
  img.alt = "";
  b.appendChild(img);
  return b;
}

// Rellena el panel de cuerpo/base con lo que el alumno tiene.
function construirPanelBase(outfit) {
  var panel = document.querySelector('.panel[data-grupo="base"]');
  if (!panel) {
    return;
  }
  var opts = vaciarOpts(panel);
  var lista = duckCatalogPorCategoria("base");
  var cuenta = 0;
  for (var i = 0; i < lista.length; i++) {
    var e = lista[i];
    if (!duckTengoId(e.id)) {
      continue;
    }
    opts.appendChild(crearBotonItem(e, outfit.base === e.file));
    cuenta++;
  }
  var hint = panel.querySelector(".panel-hint");
  if (hint) {
    hint.hidden = cuenta > 0;
  }
}

// Panel de cara, cabeza, cuello o zapatos con opción "Ninguno".
function construirPanelAccesorio(grupo, categoria, outfit, clave) {
  var panel = document.querySelector('.panel[data-grupo="' + grupo + '"]');
  if (!panel) {
    return;
  }
  var opts = vaciarOpts(panel);
  var val = outfit[clave] || "";
  opts.appendChild(crearBotonNinguno(!val));

  var lista = duckCatalogPorCategoria(categoria);
  var cuentaComprados = 0;
  for (var i = 0; i < lista.length; i++) {
    var e = lista[i];
    if (!duckTengoId(e.id)) {
      continue;
    }
    cuentaComprados++;
    opts.appendChild(crearBotonItem(e, val === e.file));
  }

  var hint = panel.querySelector(".panel-hint");
  if (hint) {
    hint.hidden = cuentaComprados > 0;
  }
}

// Al elegir una pieza, actualiza el borrador y la vista previa.
function enlazarPaneles() {
  var paneles = document.querySelectorAll(".panel");
  for (var p = 0; p < paneles.length; p++) {
    var panel = paneles[p];
    if (panel.getAttribute("data-listo") === "1") {
      continue;
    }
    panel.setAttribute("data-listo", "1");
    panel.addEventListener("click", function (ev) {
      var btn = ev.target.closest(".opt, .opt-none");
      if (!btn || !this.contains(btn)) {
        return;
      }

      var grupo = this.getAttribute("data-grupo");
      var valor = btn.getAttribute("data-valor");
      if (valor === "__ninguno__") {
        valor = "";
      }

      if (grupo === "base" && valor) {
        if (!duckTengoId(duckIdDesdePieza("base", valor))) {
          return;
        }
      }
      if (grupo === "face" && valor && !duckTengoId(duckIdDesdePieza("face", valor))) {
        return;
      }
      if (grupo === "head" && valor && !duckTengoId(duckIdDesdePieza("head", valor))) {
        return;
      }
      if (grupo === "neck" && valor && !duckTengoId(duckIdDesdePieza("neck", valor))) {
        return;
      }
      if (grupo === "shoes" && valor && !duckTengoId(duckIdDesdePieza("shoes", valor))) {
        return;
      }

      var outfit = Object.assign({}, _outfitBorrador || duckOutfitLeerLocal());
      if (grupo === "base") {
        outfit.base = valor || "MAIN DUCK.png";
      }
      if (grupo === "face") {
        outfit.face = valor;
      }
      if (grupo === "head") {
        outfit.head = valor;
      }
      if (grupo === "neck") {
        outfit.neck = valor;
      }
      if (grupo === "shoes") {
        outfit.shoes = valor;
      }

      _outfitBorrador = duckOutfitAjustarAlInventario(outfit);
      aplicarVistaPrevia(_outfitBorrador);
      actualizarBotonGuardar();

      var todos = this.querySelectorAll(".opt, .opt-none");
      for (var i = 0; i < todos.length; i++) {
        todos[i].classList.remove("selected");
      }
      btn.classList.add("selected");
    });
  }
}

// Enlaza el clic del botón Guardar pato.
function enlazarGuardar() {
  var btn = document.getElementById("btn-guardar-pato");
  if (!btn) {
    return;
  }
  btn.addEventListener("click", function () {
    guardarPatoPersonalizado();
  });
}

// Volver a temas, avisando si hay cambios sin guardar.
function enlazarNavegacion() {
  var volver = document.querySelector(".customize-nav-btn--topics");
  if (!volver) {
    return;
  }
  volver.addEventListener("click", function (ev) {
    ev.preventDefault();
    var destino =
      typeof pagina === "function" ? pagina("topics.html") : "topics.html";

    // Navega a temas con overlay de carga si existe.
    function ir() {
      if (typeof pageLoadIrATemas === "function") {
        pageLoadIrATemas();
        return;
      }
      window.location.href = destino;
    }

    if (hayCambiosSinGuardar()) {
      var salir = window.confirm(
        "Tienes cambios sin guardar. ¿Salir sin guardar?"
      );
      if (!salir) {
        return;
      }
    }

    ir();
  });
}

// Monta paneles, vista previa y listeners de la pantalla.
function montarInterfaz(outfit) {
  _outfitBorrador = duckOutfitAjustarAlInventario(outfit);
  marcarOutfitComoGuardado();
  aplicarVistaPrevia(_outfitBorrador);
  construirPanelBase(_outfitBorrador);
  construirPanelAccesorio("face", "face", _outfitBorrador, "face");
  construirPanelAccesorio("head", "head", _outfitBorrador, "head");
  construirPanelAccesorio("neck", "neck", _outfitBorrador, "neck");
  construirPanelAccesorio("shoes", "shoes", _outfitBorrador, "shoes");
  enlazarPaneles();
  enlazarGuardar();
  enlazarNavegacion();
}

// Punto de entrada: carga outfit y arma la UI de personalización.
async function iniciar() {
  if (typeof alumnoGuardEsperar === "function") {
    var okGuard = await alumnoGuardEsperar();
    if (!okGuard) {
      return;
    }
  }

  if (typeof pageLoadMostrar === "function") {
    pageLoadMostrar({
      main:
        typeof str === "function"
          ? str("avatar.cargando", "Cargando tu pato")
          : "Cargando tu pato",
      sub:
        typeof str === "function"
          ? str("avatar.cargandoSub", "Preparando piezas y vista previa…")
          : "Preparando piezas y vista previa…"
    });
  }

  duckInvMigrar();
  var outfit = duckOutfitLeerLocal();
  if (typeof duckAvatarEstaListo === "function" && duckAvatarEstaListo()) {
    outfit = duckOutfitLeerLocal();
  }

  try {
    montarInterfaz(outfit);
  } catch (e) {
    console.warn("No se pudo cargar el avatar:", e);
    montarInterfaz(duckOutfitLeerLocal());
  }

  if (typeof pageLoadOcultar === "function") {
    pageLoadOcultar();
  }
}

// Espera al guard de alumno antes de iniciar customize.
function arrancarCustomize() {
  if (typeof alumnoGuardEstaListo === "function" && alumnoGuardEstaListo()) {
    iniciar();
    return;
  }
  window.addEventListener("alumno-guard-ready", iniciar, { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", arrancarCustomize);
} else {
  arrancarCustomize();
}
