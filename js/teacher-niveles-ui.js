/**
 * Interfaz «Mis niveles» — pantalla dedicada del maestro.
 */
(function () {
  "use strict";

  var pagina = document.getElementById("teacher-niveles-page");
  if (!pagina) {
    return;
  }

  if (typeof teacherExigirSesion === "function" && !teacherExigirSesion()) {
    return;
  }

  var editandoId = null;
  var preguntasEditando = [];

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

  function gruposEditables() {
    return (typeof teacherLeerGrupos === "function" ? teacherLeerGrupos() : [])
      .filter(function (g) {
        return !g.sistema;
      });
  }

  function mostrarVistaBienvenida() {
    if (elFormWrap) {
      elFormWrap.hidden = true;
    }
    if (elWelcome) {
      elWelcome.hidden = false;
    }
  }

  function mostrarVistaEditor() {
    if (elFormWrap) {
      elFormWrap.hidden = false;
    }
    if (elWelcome) {
      elWelcome.hidden = true;
    }
  }

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

  function agregarPregunta() {
    preguntasEditando.push(nivelMaestroPreguntaVacia());
    pintarEditorPreguntas();
  }

  function quitarPregunta(idx) {
    if (preguntasEditando.length <= 1) {
      window.alert("Debe haber al menos una pregunta.");
      return;
    }
    preguntasEditando.splice(idx, 1);
    pintarEditorPreguntas();
  }

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
    var btnWelcome = document.getElementById("btn-tn-welcome");
    if (btnWelcome) {
      btnWelcome.textContent = niveles.length
        ? "Crear otro nivel"
        : "Crear mi primer nivel";
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
      li.innerHTML =
        '<button type="button" class="tn-list-btn" data-edit="' +
        escHtml(n.id) +
        '">' +
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
        "</span></span></button>";
      elLista.appendChild(li);
    }
  }

  function syncGrupoCardEstilo(card) {
    if (!card) {
      return;
    }
    var chk = card.querySelector("input[data-grupo-id]");
    card.classList.toggle("is-on", chk && chk.checked);
  }

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

  function mostrarFormulario(nivel) {
    editandoId = nivel ? nivel.id : null;
    mostrarVistaEditor();
    if (inpTitulo) {
      inpTitulo.value = nivel ? nivel.titulo : "";
    }
    if (btnEliminar) {
      btnEliminar.hidden = !nivel;
    }
    cargarPreguntasEnEditor(nivel);
    pintarFilasGrupos(nivel ? nivel.grupos : null);
    pintarListaNiveles();
  }

  function nuevoNivel() {
    mostrarFormulario(null);
    if (inpTitulo) {
      inpTitulo.focus();
    }
  }

  function guardarNivel(ev) {
    if (ev) {
      ev.preventDefault();
    }
    var titulo = inpTitulo ? inpTitulo.value.trim() : "";
    if (!titulo) {
      window.alert("Escribe un nombre para el nivel.");
      return;
    }
    var grupos = gruposEditables();
    if (!grupos.length) {
      window.alert("Primero crea un grupo en el panel (botón Grupos).");
      return;
    }
    var datosGrupos = leerGruposDelFormulario();
    var algunoVisible = false;
    var keys = Object.keys(datosGrupos);
    for (var i = 0; i < keys.length; i++) {
      if (datosGrupos[keys[i]].visible) {
        algunoVisible = true;
        break;
      }
    }
    if (!algunoVisible) {
      window.alert("Activa al menos un grupo para mostrar este nivel.");
      return;
    }

    preguntasEditando = leerPreguntasDelFormulario();
    var normalizadas = nivelMaestroNormalizarListaPreguntas(
      preguntasEditando,
      editandoId || "tn-nuevo"
    );
    if (!normalizadas.length) {
      window.alert(
        "Añade al menos una pregunta completa: enunciado y las 4 opciones con texto."
      );
      return;
    }

    var guardado = nivelMaestroGuardar({
      id: editandoId || undefined,
      titulo: titulo,
      preguntas: preguntasEditando,
      grupos: datosGrupos
    });
    editandoId = guardado.id;
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
    window.alert(
      "Nivel guardado con " +
        guardado.preguntas.length +
        " pregunta(s). Tus alumnos lo verán en Temas."
    );
  }

  function eliminarNivelActual() {
    if (!editandoId) {
      return;
    }
    if (!window.confirm("¿Eliminar este nivel? Los alumnos ya no podrán jugarlo.")) {
      return;
    }
    nivelMaestroEliminar(editandoId);
    editandoId = null;
    preguntasEditando = [];
    mostrarVistaBienvenida();
    pintarListaNiveles();
    if (window.history && window.history.replaceState) {
      var urlLimpia = new URL(window.location.href);
      urlLimpia.searchParams.delete("edit");
      urlLimpia.searchParams.delete("nuevo");
      window.history.replaceState({}, "", urlLimpia.pathname + urlLimpia.search);
    }
  }

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

  function onChangeEditor(ev) {
    var target = ev.target;
    if (target.matches('input[type="radio"][name^="correcta-"]')) {
      syncEstiloPreguntaCard(target.closest(".tn-pregunta-card"));
      return;
    }
    if (target.matches("input[data-grupo-id]")) {
      syncGrupoCardEstilo(target.closest(".tn-grupo-card"));
    }
  }

  function registrar() {
    var btnNuevo = document.getElementById("btn-tn-nuevo");
    var btnNuevoHeader = document.getElementById("btn-tn-nuevo-header");
    var btnWelcome = document.getElementById("btn-tn-welcome");

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
    if (btnWelcome) {
      btnWelcome.addEventListener("click", onNuevo);
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registrar);
  } else {
    registrar();
  }
})();
