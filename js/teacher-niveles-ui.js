/**
 * Interfaz de la pantalla «Mis niveles» del maestro.
 * Monta el editor, la lista lateral, el manejo de logos y el borrador en sesión.
 */
(function () {
  "use strict";

  var pagina = document.getElementById("teacher-niveles-page");
  if (!pagina) {
    return;
  }

  /** Inicia la página: exige sesión, carga datos y enlaza los eventos. */
  async function arrancar() {
    if (typeof teacherExigirSesionAsync === "function") {
      var ok = await teacherExigirSesionAsync();
      if (!ok) {
        return;
      }
    }
    try {
      if (typeof gruposCargarDesdeSupabase === "function") {
        await gruposCargarDesdeSupabase();
      }
      if (typeof nivelMaestroCargarDesdeDb === "function") {
        await nivelMaestroCargarDesdeDb(true);
      }
    } catch (e) {
      if (typeof uiToastError === "function") {
        uiToastError(
          "No se pudieron cargar tus niveles: " + (e && e.message ? e.message : e)
        );
      }
    }
    registrar();
  }

  var editandoId = null;
  var preguntasEditando = [];
  var logoActual = "";
  var _tnSucio = false;
  var _tnIgnorarBeforeUnload = false;
  var elValidacion = document.getElementById("tn-validation-errors");

  var inpLogoFile = document.getElementById("tn-logo-file");
  var imgLogoPreview = document.getElementById("tn-logo-preview");
  var elLogoPlaceholder = document.getElementById("tn-logo-placeholder");
  var btnQuitarLogo = document.getElementById("btn-tn-quitar-logo");

  var elLista = document.getElementById("lista-niveles-maestro");
  var elBadge = document.getElementById("tn-count-badge");
  var elFormWrap = document.getElementById("tn-form-wrap");
  var elWelcome = document.getElementById("tn-empty-hint");
  var form = document.getElementById("form-nivel-maestro");
  var inpTitulo = document.getElementById("tn-titulo");
  var contPreguntas = document.getElementById("tn-preguntas-list");
  var contGrupos = document.getElementById("tn-grupos-list");
  var btnEliminar = document.getElementById("btn-tn-eliminar");
  var LETRAS = ["A", "B", "C", "D"];

  /** Escapa texto para insertarlo de forma segura en HTML. */
  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Escapa texto para usarlo dentro de atributos HTML. */
  function escAttr(s) {
    return escHtml(s).replace(/'/g, "&#39;");
  }

  /** Devuelve la URL del logo en edición o la imagen por defecto del quiz. */
  function urlLogoPreview() {
    if (
      typeof nivelMaestroEsLogoValido === "function" &&
      nivelMaestroEsLogoValido(logoActual)
    ) {
      return logoActual;
    }
    return "../MAIN DUCK/BACKGROUND/Quiz_default.png";
  }

  /** Actualiza la vista previa del logo y la visibilidad del botón de quitar. */
  function pintarVistaLogo() {
    var tiene =
      typeof nivelMaestroEsLogoValido === "function" &&
      nivelMaestroEsLogoValido(logoActual);
    if (imgLogoPreview) {
      imgLogoPreview.src = urlLogoPreview();
      imgLogoPreview.hidden = false;
    }
    if (elLogoPlaceholder) {
      elLogoPlaceholder.hidden = true;
    }
    if (btnQuitarLogo) {
      btnQuitarLogo.hidden = !tiene;
    }
    if (elLogoPlaceholder && !imgLogoPreview) {
      elLogoPlaceholder.hidden = tiene;
    }
  }

  /** Borra el logo seleccionado y restablece el input de archivo. */
  function quitarLogoNivel() {
    logoActual = "";
    if (inpLogoFile) {
      inpLogoFile.value = "";
    }
    pintarVistaLogo();
  }

  /** Procesa la imagen elegida por el maestro y la guarda como logo del nivel. */
  function onArchivoLogoSeleccionado(ev) {
    var archivo = ev.target.files && ev.target.files[0];
    if (!archivo) {
      return;
    }
    if (typeof nivelMaestroProcesarArchivoLogo !== "function") {
      return;
    }
    nivelMaestroProcesarArchivoLogo(archivo, function (res) {
      if (inpLogoFile) {
        inpLogoFile.value = "";
      }
      if (!res.ok) {
        if (typeof uiToastError === "function") {
          uiToastError(res.error || "No se pudo usar esa imagen.");
        }
        return;
      }
      logoActual = res.logo;
      pintarVistaLogo();
    });
  }

  /** Devuelve los grupos del maestro que no son del sistema y se pueden asignar. */
  function gruposEditables() {
    return (typeof gruposLeer === "function" ? gruposLeer() : []).filter(
      function (g) {
        return !g.sistema;
      }
    );
  }

  /** Muestra el mensaje inicial y oculta el formulario de edición. */
  function mostrarVistaBienvenida() {
    if (elFormWrap) {
      elFormWrap.hidden = true;
    }
    if (elWelcome) {
      elWelcome.hidden = false;
    }
  }

  /** Muestra el formulario de edición y oculta el mensaje de bienvenida. */
  function mostrarVistaEditor() {
    if (elFormWrap) {
      elFormWrap.hidden = false;
    }
    if (elWelcome) {
      elWelcome.hidden = true;
    }
  }

  /** Resalta la opción correcta y desactiva la pista de esa opción en una tarjeta. */
  function syncEstiloPreguntaCard(card) {
    if (!card) {
      return;
    }
    var checked = card.querySelector(
      'input[type="radio"][name^="correcta-"]:checked'
    );
    var correcta = checked ? parseInt(checked.value, 10) : 0;
    var blocks = card.querySelectorAll(".tn-opcion-block");
    for (var i = 0; i < blocks.length; i++) {
      blocks[i].classList.toggle("is-correcta", i === correcta);
    }
    var fbInputs = card.querySelectorAll(".tn-opt-fb");
    for (var f = 0; f < fbInputs.length; f++) {
      var fi = parseInt(fbInputs[f].getAttribute("data-fb"), 10);
      fbInputs[f].disabled = fi === correcta;
      if (fbInputs[f].disabled) {
        fbInputs[f].value = "";
      }
    }
  }

  /** Genera el HTML de las cuatro opciones y sus pistas para una pregunta. */
  function htmlOpcionesPregunta(preg, idxPreg) {
    var html = '<div class="tn-opciones-grid">';
    for (var i = 0; i < 4; i++) {
      var esCorrecta = preg.correcta === i;
      html +=
        '<div class="tn-opcion-block' +
        (esCorrecta ? " is-correcta" : "") +
        '">' +
        '<div class="tn-opcion-top">' +
        '<span class="tn-opcion-letra">' +
        LETRAS[i] +
        "</span>" +
        '<input type="text" class="tn-input tn-opt-text" data-preg="' +
        idxPreg +
        '" data-opt="' +
        i +
        '" value="' +
        escAttr((preg.opciones && preg.opciones[i]) || "") +
        '" placeholder="Opción ' +
        LETRAS[i] +
        '…" maxlength="220" />' +
        "</div>" +
        '<label class="tn-fb-label">Pista si eligen ' +
        LETRAS[i] +
        " (opcional)" +
        '<input type="text" class="tn-input tn-opt-fb" data-preg="' +
        idxPreg +
        '" data-fb="' +
        i +
        '" value="' +
        escAttr((preg.feedback && preg.feedback[i]) || "") +
        '" placeholder="Ej. Revisa el signo del vector" maxlength="280" ' +
        (esCorrecta ? "disabled" : "") +
        " /></label></div>";
    }
    html += "</div>";
    return html;
  }

  /** Genera el HTML de los botones para elegir la respuesta correcta. */
  function htmlPillsCorrecta(preg, idx) {
    var html =
      '<div class="tn-correcta-wrap">' +
      '<span class="tn-label">Respuesta correcta</span>' +
      '<div class="tn-correcta-pills" role="radiogroup" aria-label="Respuesta correcta pregunta ' +
      (idx + 1) +
      '">';
    for (var i = 0; i < 4; i++) {
      html +=
        '<label class="tn-pill">' +
        '<input type="radio" name="correcta-' +
        idx +
        '" value="' +
        i +
        '"' +
        (preg.correcta === i ? " checked" : "") +
        " />" +
        "<span>" +
        LETRAS[i] +
        "</span></label>";
    }
    html += "</div></div>";
    return html;
  }

  /** Genera el HTML completo de una tarjeta de pregunta en el editor. */
  function htmlTarjetaPregunta(preg, idx) {
    return (
      '<article class="tn-pregunta-card" data-preg-idx="' +
      idx +
      '">' +
      '<div class="tn-pregunta-head">' +
      '<span class="tn-pregunta-num">Pregunta ' +
      (idx + 1) +
      "</span>" +
      '<button type="button" class="tn-btn-quitar-pregunta" data-quitar-preg="' +
      idx +
      '" title="Eliminar pregunta">Quitar</button>' +
      "</div>" +
      '<label class="tn-field">' +
      '<span class="tn-label">Enunciado</span>' +
      '<textarea class="tn-textarea tn-preg-q" data-preg="' +
      idx +
      '" rows="2" maxlength="500" placeholder="Escribe la pregunta que verán tus alumnos…">' +
      escHtml(preg.q || "") +
      "</textarea></label>" +
      htmlPillsCorrecta(preg, idx) +
      htmlOpcionesPregunta(preg, idx) +
      "</article>"
    );
  }

  /** Vuelve a dibujar todas las tarjetas de preguntas del formulario. */
  function pintarEditorPreguntas() {
    if (!contPreguntas) {
      return;
    }
    contPreguntas.innerHTML = "";
    for (var i = 0; i < preguntasEditando.length; i++) {
      contPreguntas.insertAdjacentHTML(
        "beforeend",
        htmlTarjetaPregunta(preguntasEditando[i], i)
      );
    }
  }

  /** Lee del DOM las preguntas que el maestro está editando. */
  function leerPreguntasDelFormulario() {
    var salida = [];
    if (!contPreguntas) {
      return salida;
    }
    var cards = contPreguntas.querySelectorAll(".tn-pregunta-card");
    for (var c = 0; c < cards.length; c++) {
      var idx = parseInt(cards[c].getAttribute("data-preg-idx"), 10);
      var qEl = cards[c].querySelector(".tn-preg-q");
      var radioOk = cards[c].querySelector(
        'input[type="radio"][name="correcta-' + idx + '"]:checked'
      );
      var opciones = ["", "", "", ""];
      var feedback = ["", "", "", ""];
      var optInputs = cards[c].querySelectorAll(".tn-opt-text");
      for (var o = 0; o < optInputs.length; o++) {
        var oi = parseInt(optInputs[o].getAttribute("data-opt"), 10);
        opciones[oi] = optInputs[o].value.trim();
      }
      var fbInputs = cards[c].querySelectorAll(".tn-opt-fb");
      for (var f = 0; f < fbInputs.length; f++) {
        var fi = parseInt(fbInputs[f].getAttribute("data-fb"), 10);
        feedback[fi] = fbInputs[f].disabled ? "" : fbInputs[f].value.trim();
      }
      salida.push({
        id: preguntasEditando[idx] && preguntasEditando[idx].id,
        q: qEl ? qEl.value.trim() : "",
        opciones: opciones,
        correcta: radioOk ? parseInt(radioOk.value, 10) : 0,
        feedback: feedback
      });
    }
    return salida;
  }

  /** Añade una pregunta vacía al final del editor. */
  function agregarPregunta() {
    preguntasEditando.push(nivelMaestroPreguntaVacia());
    pintarEditorPreguntas();
  }

  /** Elimina una pregunta del editor si queda al menos otra. */
  function quitarPregunta(idx) {
    if (preguntasEditando.length <= 1) {
      if (typeof uiToastError === "function") {
        uiToastError("Debe haber al menos una pregunta.");
      }
      return;
    }
    preguntasEditando.splice(idx, 1);
    pintarEditorPreguntas();
  }

  /** Dibuja la lista lateral con los niveles del maestro y su resumen. */
  function pintarListaNiveles() {
    if (!elLista) {
      return;
    }
    var niveles = nivelMaestroLeerTodos().slice().sort(function (a, b) {
      return (b.actualizadoEn || 0) - (a.actualizadoEn || 0);
    });
    if (elBadge) {
      elBadge.textContent = String(niveles.length);
    }
    elLista.innerHTML = "";
    if (!niveles.length) {
      var liVacio = document.createElement("li");
      liVacio.className = "tn-list-empty";
      liVacio.textContent = "Aquí aparecerán tus niveles cuando los crees.";
      elLista.appendChild(liVacio);
      return;
    }
    for (var i = 0; i < niveles.length; i++) {
      var n = niveles[i];
      var li = document.createElement("li");
      var activos = 0;
      var gids = n.grupos ? Object.keys(n.grupos) : [];
      for (var j = 0; j < gids.length; j++) {
        if (n.grupos[gids[j]] && n.grupos[gids[j]].visible) {
          activos++;
        }
      }
      li.className = "tn-list-item" + (n.id === editandoId ? " is-active" : "");
      var thumbSrc =
        typeof nivelMaestroUrlLogo === "function"
          ? nivelMaestroUrlLogo(n)
          : typeof nivelMaestroEsLogoValido === "function" && nivelMaestroEsLogoValido(n.logo)
            ? n.logo
            : "../MAIN DUCK/BACKGROUND/Quiz_default.png";
      var thumbHtml =
        '<span class="tn-list-thumb"><img src="' +
        escAttr(thumbSrc) +
        '" alt="" /></span>';
      li.innerHTML =
        '<button type="button" class="tn-list-btn" data-edit="' +
        escHtml(n.id) +
        '">' +
        thumbHtml +
        '<span class="tn-list-text">' +
        '<span class="tn-list-title">' +
        escHtml(n.titulo) +
        "</span>" +
        '<span class="tn-list-meta">' +
        '<span class="tn-list-chip">' +
        escHtml(nivelMaestroEtiquetaResumen(n)) +
        "</span>" +
        '<span class="tn-list-chip">' +
        activos +
        " grupo" +
        (activos === 1 ? "" : "s") +
        "</span></span></span></button>";
      elLista.appendChild(li);
    }
  }

  /** Marca visualmente si un grupo está activado para el nivel en edición. */
  function syncGrupoCardEstilo(card) {
    if (!card) {
      return;
    }
    var chk = card.querySelector("input[data-grupo-id]");
    card.classList.toggle("is-on", chk && chk.checked);
  }

  /** Dibuja las filas de grupos con interruptor de visibilidad y fecha límite. */
  function pintarFilasGrupos(gruposData) {
    if (!contGrupos) {
      return;
    }
    var grupos = gruposEditables();
    contGrupos.innerHTML = "";
    if (!grupos.length) {
      contGrupos.innerHTML =
        '<p class="tn-sin-grupos">Primero crea un grupo en el <a href="teacher-dashboard.html">panel</a> (botón Grupos).</p>';
      return;
    }
    gruposData = gruposData || nivelMaestroGruposVacios();
    for (var i = 0; i < grupos.length; i++) {
      var g = grupos[i];
      var asig = gruposData[g.id] || { visible: false, fechaLimite: "" };
      var row = document.createElement("div");
      row.className = "tn-grupo-card" + (asig.visible ? " is-on" : "");
      row.innerHTML =
        '<label class="tn-grupo-vis">' +
        '<span class="tn-toggle">' +
        '<input type="checkbox" data-grupo-id="' +
        escHtml(g.id) +
        '"' +
        (asig.visible ? " checked" : "") +
        " />" +
        '<span class="tn-toggle-slider"></span></span>' +
        '<span class="tn-grupo-info"><strong>' +
        escHtml(g.nombre) +
        "</strong>" +
        (g.codigo
          ? '<span class="tn-grupo-codigo">' + escHtml(g.codigo) + "</span>"
          : "") +
        "</span></label>" +
        '<label class="tn-grupo-fecha">Fecha límite' +
        '<input type="date" data-grupo-fecha="' +
        escHtml(g.id) +
        '" value="' +
        escHtml(asig.fechaLimite || "") +
        '" /></label>';
      contGrupos.appendChild(row);
    }
  }

  /** Lee del DOM qué grupos están activos y con qué fecha límite. */
  function leerGruposDelFormulario() {
    var mapa = nivelMaestroGruposVacios();
    if (!contGrupos) {
      return mapa;
    }
    var checks = contGrupos.querySelectorAll("input[data-grupo-id]");
    for (var i = 0; i < checks.length; i++) {
      var gid = checks[i].getAttribute("data-grupo-id");
      var fechaInp = contGrupos.querySelector(
        'input[data-grupo-fecha="' + gid + '"]'
      );
      mapa[gid] = {
        visible: checks[i].checked,
        fechaLimite: fechaInp ? fechaInp.value : ""
      };
    }
    return mapa;
  }

  /** Carga las preguntas de un nivel guardado o deja una pregunta vacía si es nuevo. */
  function cargarPreguntasEnEditor(nivel) {
    preguntasEditando = [];
    if (nivel && nivel.preguntas && nivel.preguntas.length) {
      for (var i = 0; i < nivel.preguntas.length; i++) {
        preguntasEditando.push(nivelMaestroDesdePreguntaGuardada(nivel.preguntas[i]));
      }
    } else {
      preguntasEditando.push(nivelMaestroPreguntaVacia());
    }
    pintarEditorPreguntas();
  }

  /** Clave de sessionStorage para el borrador del nivel que se está editando. */
  function claveBorradorTn() {
    return "tec_duck_tn_borrador_" + (editandoId || "nuevo");
  }

  /** Marca que hay cambios sin guardar y persiste el borrador en sesión. */
  function marcarTnSucio() {
    _tnSucio = true;
    guardarBorradorSesion();
  }

  /** Indica que no hay cambios pendientes y borra el borrador de sesión. */
  function limpiarTnSucio() {
    _tnSucio = false;
    try {
      sessionStorage.removeItem(claveBorradorTn());
    } catch (e) {
      /* noop */
    }
  }

  /** Guarda en sessionStorage el estado actual del formulario mientras se edita. */
  function guardarBorradorSesion() {
    if (!elFormWrap || elFormWrap.hidden) {
      return;
    }
    try {
      var borrador = {
        titulo: inpTitulo ? inpTitulo.value : "",
        preguntas: leerPreguntasDelFormulario(),
        grupos: leerGruposDelFormulario()
      };
      sessionStorage.setItem(claveBorradorTn(), JSON.stringify(borrador));
    } catch (e) {
      /* noop */
    }
  }

  /** Recupera el borrador guardado en sesión al abrir un nivel nuevo. */
  function restaurarBorradorSesion() {
    try {
      var raw = sessionStorage.getItem(claveBorradorTn());
      if (!raw) {
        return false;
      }
      var borrador = JSON.parse(raw);
      if (inpTitulo && borrador.titulo) {
        inpTitulo.value = borrador.titulo;
      }
      if (borrador.preguntas && borrador.preguntas.length) {
        preguntasEditando = borrador.preguntas;
        pintarEditorPreguntas();
      }
      if (borrador.grupos) {
        pintarFilasGrupos(borrador.grupos);
      }
      _tnSucio = true;
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Muestra u oculta el bloque de errores de validación del formulario. */
  function pintarErroresValidacion(errores) {
    if (!elValidacion) {
      return;
    }
    if (!errores || !errores.length) {
      elValidacion.hidden = true;
      elValidacion.innerHTML = "";
      return;
    }
    elValidacion.hidden = false;
    elValidacion.innerHTML =
      "<strong>Revisa lo siguiente:</strong><ul>" +
      errores
        .map(function (e) {
          return "<li>" + escHtml(e) + "</li>";
        })
        .join("") +
      "</ul>";
  }

  /** Abre el editor con los datos de un nivel existente o vacío para uno nuevo. */
  function mostrarFormulario(nivel) {
    editandoId = nivel ? nivel.id : null;
    mostrarVistaEditor();
    if (inpTitulo) {
      inpTitulo.value = nivel ? nivel.titulo : "";
    }
    if (btnEliminar) {
      btnEliminar.hidden = !nivel;
    }
    logoActual =
      nivel && typeof nivelMaestroEsLogoValido === "function" && nivelMaestroEsLogoValido(nivel.logo)
        ? nivel.logo
        : "";
    if (inpLogoFile) {
      inpLogoFile.value = "";
    }
    pintarVistaLogo();
    cargarPreguntasEnEditor(nivel);
    pintarFilasGrupos(nivel ? nivel.grupos : null);
    pintarListaNiveles();
    if (nivel) {
      limpiarTnSucio();
    } else {
      restaurarBorradorSesion();
    }
  }

  /** Prepara el formulario para crear un nivel desde cero. */
  function nuevoNivel() {
    mostrarFormulario(null);
    if (inpTitulo) {
      inpTitulo.focus();
    }
  }

  /** Valida el formulario, guarda el nivel en Supabase y actualiza la interfaz. */
  async function guardarNivel(ev) {
    if (ev) {
      ev.preventDefault();
    }
    preguntasEditando = leerPreguntasDelFormulario();
    var datosGrupos = leerGruposDelFormulario();
    var validacion =
      typeof nivelMaestroValidarBorrador === "function"
        ? nivelMaestroValidarBorrador({
            titulo: inpTitulo ? inpTitulo.value : "",
            preguntas: preguntasEditando,
            grupos: datosGrupos,
            id: editandoId
          })
        : { ok: true, errores: [] };
    if (!validacion.ok) {
      pintarErroresValidacion(validacion.errores);
      if (typeof uiToastError === "function") {
        uiToastError(validacion.errores[0] || "Revisa el formulario.");
      }
      return;
    }
    pintarErroresValidacion([]);

    try {
      var guardado = await nivelMaestroGuardarAsync({
        id: editandoId || undefined,
        titulo: inpTitulo ? inpTitulo.value.trim() : "",
        preguntas: preguntasEditando,
        grupos: datosGrupos,
        logo: logoActual || ""
      });
      editandoId = guardado.id;
      logoActual =
        typeof nivelMaestroEsLogoValido === "function" &&
        nivelMaestroEsLogoValido(guardado.logo)
          ? guardado.logo
          : "";
      pintarVistaLogo();
      preguntasEditando = guardado.preguntas.map(nivelMaestroDesdePreguntaGuardada);
      pintarEditorPreguntas();
      if (btnEliminar) {
        btnEliminar.hidden = false;
      }
      pintarListaNiveles();
      if (window.history && window.history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set("edit", guardado.id);
        url.searchParams.delete("nuevo");
        window.history.replaceState({}, "", url.pathname + url.search);
      }
      limpiarTnSucio();
      if (typeof uiToastSuccess === "function") {
        uiToastSuccess(
          typeof str === "function"
            ? str("maestro.guardarNivelOk", "Nivel guardado.")
            : "Nivel guardado con " +
                guardado.preguntas.length +
                " pregunta(s)."
        );
      }
    } catch (err) {
      if (typeof uiToastError === "function") {
        uiToastError(
          "No se pudo guardar el nivel: " +
            (err && err.message ? err.message : "Error desconocido")
        );
      }
    }
  }

  /** Pide confirmación y borra el nivel que se está editando. */
  async function eliminarNivelActual() {
    if (!editandoId) {
      return;
    }
    if (!window.confirm("¿Eliminar este nivel? Los alumnos ya no podrán jugarlo.")) {
      return;
    }
    try {
      await nivelMaestroEliminarAsync(editandoId);
    } catch (err) {
      if (typeof uiToastError === "function") {
        uiToastError(
          "No se pudo eliminar: " + (err && err.message ? err.message : "Error desconocido")
        );
      }
      return;
    }
    _tnIgnorarBeforeUnload = true;
    limpiarTnSucio();
    editandoId = null;
    preguntasEditando = [];
    logoActual = "";
    pintarVistaLogo();
    mostrarVistaBienvenida();
    pintarListaNiveles();
    if (window.history && window.history.replaceState) {
      var urlLimpia = new URL(window.location.href);
      urlLimpia.searchParams.delete("edit");
      urlLimpia.searchParams.delete("nuevo");
      window.history.replaceState({}, "", urlLimpia.pathname + urlLimpia.search);
    }
  }

  /** Abre un nivel concreto o el modo nuevo según los parámetros de la URL. */
  function aplicarParametrosUrl() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("nuevo") === "1") {
      nuevoNivel();
      return;
    }
    var editId = params.get("edit");
    if (editId) {
      var n = nivelMaestroPorId(editId);
      if (n) {
        mostrarFormulario(n);
      }
    }
  }

  /** Reacciona a cambios en el editor: marca sucio y actualiza estilos visuales. */
  function onChangeEditor(ev) {
    marcarTnSucio();
    var target = ev.target;
    if (target.matches('input[type="radio"][name^="correcta-"]')) {
      syncEstiloPreguntaCard(target.closest(".tn-pregunta-card"));
      return;
    }
    if (target.matches("input[data-grupo-id]")) {
      syncGrupoCardEstilo(target.closest(".tn-grupo-card"));
    }
  }

  /** Enlaza el botón flotante que vuelve arriba al hacer scroll en la página. */
  function registrarScrollTopDashboard() {
    var btn = document.getElementById("teacher-scroll-top");
    if (!btn || btn.getAttribute("data-hook") === "1") {
      return;
    }
    btn.setAttribute("data-hook", "1");
    var umbral = 280;

    /** Muestra u oculta el botón según cuánto se ha desplazado la página. */
    function actualizar() {
      var scrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      if (scrollY > umbral) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    }

    window.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    btn.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
    actualizar();
  }

  /** Conecta botones, formulario, lista y avisos de salida con sus manejadores. */
  function registrar() {
    var btnNuevo = document.getElementById("btn-tn-nuevo");
    var btnNuevoHeader = document.getElementById("btn-tn-nuevo-header");
    /** Abre un nivel nuevo y actualiza la URL para reflejarlo. */
    function onNuevo() {
      nuevoNivel();
      if (window.history && window.history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set("nuevo", "1");
        url.searchParams.delete("edit");
        window.history.replaceState({}, "", url.pathname + url.search);
      }
    }

    if (btnNuevo) {
      btnNuevo.addEventListener("click", onNuevo);
    }
    if (btnNuevoHeader) {
      btnNuevoHeader.addEventListener("click", onNuevo);
    }
    var btnAddPreg = document.getElementById("btn-tn-add-pregunta");
    if (btnAddPreg) {
      btnAddPreg.addEventListener("click", agregarPregunta);
    }
    if (form) {
      form.addEventListener("submit", guardarNivel);
    }
    if (btnEliminar) {
      btnEliminar.addEventListener("click", eliminarNivelActual);
    }
    if (inpTitulo) {
      inpTitulo.addEventListener("input", marcarTnSucio);
    }
    window.addEventListener("beforeunload", function (ev) {
      if (_tnIgnorarBeforeUnload || !_tnSucio) {
        return;
      }
      var msg =
        typeof str === "function"
          ? str("maestro.borradorSinGuardar", "Tienes cambios sin guardar.")
          : "Tienes cambios sin guardar.";
      ev.preventDefault();
      ev.returnValue = msg;
      return msg;
    });
    if (inpLogoFile) {
      inpLogoFile.addEventListener("change", onArchivoLogoSeleccionado);
    }
    if (btnQuitarLogo) {
      btnQuitarLogo.addEventListener("click", quitarLogoNivel);
    }
    if (contPreguntas) {
      contPreguntas.addEventListener("click", function (ev) {
        var btn = ev.target.closest("[data-quitar-preg]");
        if (!btn) {
          return;
        }
        quitarPregunta(parseInt(btn.getAttribute("data-quitar-preg"), 10));
      });
      contPreguntas.addEventListener("change", onChangeEditor);
    }
    if (contGrupos) {
      contGrupos.addEventListener("change", onChangeEditor);
    }
    if (elLista) {
      elLista.addEventListener("click", function (ev) {
        var btn = ev.target.closest("[data-edit]");
        if (!btn) {
          return;
        }
        var n = nivelMaestroPorId(btn.getAttribute("data-edit"));
        if (n) {
          mostrarFormulario(n);
          if (window.history && window.history.replaceState) {
            var url = new URL(window.location.href);
            url.searchParams.set("edit", n.id);
            url.searchParams.delete("nuevo");
            window.history.replaceState({}, "", url.pathname + url.search);
          }
        }
      });
    }

    if (typeof gruposLeer === "function") {
      gruposLeer();
    }
    pintarListaNiveles();
    mostrarVistaBienvenida();
    aplicarParametrosUrl();
    registrarScrollTopDashboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar);
  } else {
    arrancar();
  }
})();
