(function () {
  "use strict";

  var tnId = null;
  var nivelMaestro = null;
  var quizOptsPartida = null;
  var temaId = "1";
  var modo = "facil";
  var quizModoPreview = false;

  function quizSearchParams() {
    var search = window.location.search || "";
    if (!search && window.location.href.indexOf("?") >= 0) {
      search = "?" + window.location.href.split("?")[1].split("#")[0];
    }
    return new URLSearchParams(search);
  }

  function quizLeerParamsPartida() {
    var params = quizSearchParams();
    var modoRaw = String(params.get("modo") || "facil")
      .trim()
      .toLowerCase();
    return {
      tnId: params.get("tn"),
      temaId: String(params.get("tema") || "1").trim() || "1",
      modo: modoRaw === "dificil" ? "dificil" : "facil",
      preview: params.get("preview") === "1"
    };
  }

  function aplicarParamsPartida(conf) {
    conf = conf || quizLeerParamsPartida();
    tnId = conf.tnId;
    temaId = conf.temaId;
    modo = conf.modo;
    quizModoPreview = !!conf.preview;
    nivelMaestro = null;
    quizOptsPartida = null;
    if (window.quizConfigPartida) {
      delete window.quizConfigPartida;
    }
  }

  aplicarParamsPartida();

  function partidaUsaMapaJXG() {
    var t = String(temaId);
    if (t !== "1" && t !== "2") {
      return false;
    }
    if (
      window.quizConfigPartida &&
      window.quizConfigPartida.mostrarJxg === false
    ) {
      return false;
    }
    return true;
  }

  /** Básico: vista al elegir opción; avanzado: solo al confirmar acierto. */
  function jxgVistaAlSeleccionarOpcion() {
    return modo === "facil";
  }

  function actualizarHintMapaJXG(pregunta) {
    var hint = document.querySelector(".quiz-jxg-panel-hint");
    if (!hint || !pregunta) {
      return;
    }
    if (
      !partidaUsaMapaJXG() ||
      typeof quizPreguntaUsaMapaJXG !== "function" ||
      !quizPreguntaUsaMapaJXG(temaId, pregunta)
    ) {
      return;
    }
    hint.textContent =
      modo === "dificil"
        ? "Plano de coordenadas — se dibujará al confirmar la respuesta correcta"
        : "Plano de coordenadas — elige una opción para verla dibujada";
  }

  function reiniciarMapaPreguntaActual() {
    if (!lista[indice]) {
      return;
    }
    prepararMapaPregunta(lista[indice]);
  }

  async function validarAccesoTemaModo() {
    if (tnId || modo !== "dificil") {
      return true;
    }
    if (typeof quizProgressCargarDesbloqueosTemas === "function") {
      await quizProgressCargarDesbloqueosTemas();
    }
    if (
      typeof isDificilDesbloqueado === "function" &&
      !isDificilDesbloqueado(temaId)
    ) {
      quizAvisar(
        "Completa el nivel básico de este tema antes de jugar el avanzado."
      );
      irATemasQuiz();
      return false;
    }
    return true;
  }

  function quizAvisar(msg) {
    if (typeof uiToastError === "function") {
      uiToastError(msg);
    } else {
      window.alert(msg);
    }
  }

  function pintarBannerPreview() {
    var banner = document.getElementById("quiz-preview-banner");
    if (!banner) {
      return;
    }
    if (!quizModoPreview) {
      banner.hidden = true;
      return;
    }
    banner.textContent =
      typeof str === "function"
        ? str("quiz.previewBanner", "Modo vista previa — no se guarda progreso ni monedas.")
        : "Modo vista previa — no se guarda progreso ni monedas.";
    banner.hidden = false;
    document.body.classList.add("quiz--preview");
  }

  async function validarAccesoNivelMaestro() {
    if (!tnId) {
      return true;
    }
    if (!nivelMaestro) {
      quizAvisar("Este nivel no existe o fue eliminado.");
      irATemasQuiz();
      return false;
    }
    if (quizModoPreview) {
      if (!nivelMaestroContarPreguntas(nivelMaestro)) {
        quizAvisar("Este nivel aún no tiene preguntas.");
        return false;
      }
      return true;
    }
    var vinculo =
      typeof alumnoObtenerGrupoVinculadoAsync === "function"
        ? await alumnoObtenerGrupoVinculadoAsync()
        : null;
    if (!vinculo || !vinculo.grupoId) {
      quizAvisar("Este nivel no está disponible para tu grupo.");
      irATemasQuiz();
      return false;
    }
    if (!nivelMaestroVisibleParaGrupo(nivelMaestro, vinculo.grupoId)) {
      quizAvisar("Este nivel no está disponible para tu grupo.");
      irATemasQuiz();
      return false;
    }
    if (
      typeof nivelMaestroFechaVencida === "function" &&
      nivelMaestroFechaVencida(nivelMaestro, vinculo.grupoId)
    ) {
      quizAvisar("La fecha límite de este nivel ya pasó. Ya no puedes jugarlo.");
      irATemasQuiz();
      return false;
    }
    if (!nivelMaestroContarPreguntas(nivelMaestro)) {
      quizAvisar("Este nivel aún no tiene preguntas. Avísale a tu maestro.");
      irATemasQuiz();
      return false;
    }
    return true;
  }

  var lista = [];
  var indice = 0;
  var vidas = 3;
  var partidaTerminada = false;
  var respondidaBien = false;
  var monedaPagada = false;
  /* Guardamos los datos de las opciones de la pregunta actual para no depender
     de leer atributos del DOM al renderizar la retroalimentación. */
  var opcionesActuales = [];
  /** Incorrectas dadas ya en esta pregunta antes del primer acierto (se reinicia cada pregunta). */
  var erroresOpcionIncorrectaEstaPregunta = 0;
  /** Índice de opción elegida pendiente de confirmar (null = ninguna). */
  var seleccionPendienteIdx = null;
  var _quizSync = {
    porIndice: {},
    preguntasOk: 0,
    monedasGanadas: 0,
    preguntaInicioMs: Date.now(),
    finalizado: false,
    pausado: false
  };

  function reiniciarQuizSync() {
    _quizSync = {
      porIndice: {},
      preguntasOk: 0,
      monedasGanadas: 0,
      preguntaInicioMs: Date.now(),
      finalizado: false,
      pausado: false
    };
  }

  function tiempoSegundosPreguntaActual() {
    return Math.max(
      1,
      Math.round((Date.now() - (_quizSync.preguntaInicioMs || Date.now())) / 1000)
    );
  }

  function textoPreguntaActual() {
    var p = lista[indice];
    return p ? String(p.q || "").slice(0, 220) : "";
  }

  function registrarErrorPreguntaActual() {
    var prev = _quizSync.porIndice[indice];
    _quizSync.porIndice[indice] = {
      indice: indice,
      ok: false,
      errores: erroresOpcionIncorrectaEstaPregunta,
      tiempo: prev ? prev.tiempo : tiempoSegundosPreguntaActual(),
      texto: textoPreguntaActual(),
      contestada: false,
      omitida: false
    };
  }

  function registrarActividadPregunta(ok, texto) {
    _quizSync.porIndice[indice] = {
      indice: indice,
      ok: !!ok,
      errores: erroresOpcionIncorrectaEstaPregunta,
      tiempo: tiempoSegundosPreguntaActual(),
      texto: String(texto || "").slice(0, 220),
      contestada: true,
      omitida: false
    };
    if (ok) {
      _quizSync.preguntasOk += 1;
    }
  }

  function construirActividadParaGuardar(estadoPartida) {
    var act = [];
    var i;
    for (i = 0; i < lista.length; i++) {
      var entry = _quizSync.porIndice[i];
      if (entry) {
        act.push({
          indice: entry.indice,
          ok: !!entry.ok,
          errores: entry.errores || 0,
          tiempo: entry.tiempo || 0,
          texto: entry.texto || "",
          contestada: entry.contestada !== false,
          omitida: !!entry.omitida
        });
        continue;
      }
      if (estadoPartida === "GAME_OVER") {
        act.push({
          indice: i,
          ok: false,
          errores: 0,
          tiempo: 0,
          texto: lista[i] ? String(lista[i].q || "").slice(0, 220) : "",
          contestada: false,
          omitida: true
        });
      } else if (
        (estadoPartida === "ABANDONADA" || estadoPartida === "EN_CURSO") &&
        i === indice
      ) {
        act.push({
          indice: i,
          ok: !!respondidaBien,
          errores: erroresOpcionIncorrectaEstaPregunta,
          tiempo: tiempoSegundosPreguntaActual(),
          texto: textoPreguntaActual(),
          contestada: !!respondidaBien,
          omitida: false
        });
      }
    }
    return act;
  }

  function contarPreguntasOkActividad(act) {
    var n = 0;
    for (var i = 0; i < act.length; i++) {
      if (act[i] && act[i].ok) {
        n += 1;
      }
    }
    return n;
  }

  function tiempoPromedioActividad(act) {
    if (!act.length) {
      return 0;
    }
    var sum = 0;
    var n = 0;
    for (var i = 0; i < act.length; i++) {
      if (act[i] && act[i].tiempo != null && act[i].contestada !== false) {
        sum += act[i].tiempo || 0;
        n += 1;
      }
    }
    return n ? Math.round(sum / n) : 0;
  }

  async function enviarResultadoQuiz(estadoPartida) {
    if (quizModoPreview) {
      return true;
    }
    if (typeof quizProgressGuardar !== "function") {
      return false;
    }
    if (tnId && !nivelMaestro) {
      return false;
    }
    var esFinal =
      estadoPartida === "COMPLETADA" || estadoPartida === "GAME_OVER";
    var esPausa =
      estadoPartida === "ABANDONADA" || estadoPartida === "EN_CURSO";
    if (_quizSync.finalizado && esFinal) {
      return false;
    }
    if (_quizSync.pausado && esPausa) {
      return false;
    }
    if (!lista.length) {
      return false;
    }

    var actividad = construirActividadParaGuardar(estadoPartida);
    if (!actividad.length && !esPausa) {
      return false;
    }

    try {
      var res = await quizProgressGuardar({
        temaId: tnId ? null : parseInt(temaId, 10),
        nivelMaestroId:
          tnId && nivelMaestro
            ? nivelMaestro.dbId || parseInt(nivelMaestro.id, 10) || null
            : null,
        modo: modo,
        estado: estadoPartida,
        preguntasOk: contarPreguntasOkActividad(actividad),
        preguntasTotal: lista.length,
        tiempoPromedioSeg: tiempoPromedioActividad(actividad),
        monedasGanadas: _quizSync.monedasGanadas,
        vidasRestantes: vidas,
        indicePregunta: indice,
        actividad: actividad
      });
      if (!res || !res.ok) {
        console.warn("[quiz] sync:", res && res.error ? res.error : "Error desconocido");
        return false;
      }
      if (esFinal) {
        _quizSync.finalizado = true;
      }
      if (esPausa) {
        _quizSync.pausado = true;
      }
      return true;
    } catch (e) {
      console.warn("[quiz] sync:", e);
      return false;
    }
  }

  function estadoSalidaConVidas() {
    return vidas > 0 ? "EN_CURSO" : "ABANDONADA";
  }

  async function guardarProgresoYSalir(destino) {
    if (!hayProgresoEnPartida()) {
      if (destino) {
        window.location.href = destino;
      }
      return true;
    }
    var ok = await enviarResultadoQuiz(estadoSalidaConVidas());
    if (!ok) {
      quizAvisar(
        "No se pudo guardar tu avance en la nube. Revisa tu conexión e inténtalo de nuevo."
      );
      return false;
    }
    if (destino) {
      if (
        typeof pageLoadDestinoEsTemas === "function" &&
        pageLoadDestinoEsTemas(destino) &&
        typeof pageLoadIrATemas === "function"
      ) {
        pageLoadIrATemas();
        return true;
      }
      window.location.href = destino;
    }
    return true;
  }

  function irATemasQuiz() {
    if (typeof pageLoadIrATemas === "function") {
      pageLoadIrATemas();
      return;
    }
    window.location.href =
      typeof pagina === "function" ? pagina("topics.html") : "topics.html";
  }

  function hayProgresoEnPartida() {
    if (partidaTerminada || !lista.length) {
      return false;
    }
    if (indice > 0) {
      return true;
    }
    if (vidas < 3) {
      return true;
    }
    if (erroresOpcionIncorrectaEstaPregunta > 0) {
      return true;
    }
    if (monedaPagada || respondidaBien) {
      return true;
    }
    return false;
  }

  function confirmarSalirTemas() {
    return window.confirm(
      "Se guardará tu avance en la nube (pregunta actual, vidas y errores).\n\n¿Volver a temas?"
    );
  }

  function confirmarReiniciarNivel() {
    return window.confirm(
      "Se guardará este intento como abandonado y empezarás el nivel desde cero.\n\n¿Reiniciar el nivel?"
    );
  }

  /** 10 monedas al acertar a la primera; 5 tras 1 fallo; 2 a partir del 2º fallo antes de acertar. */
  function monedasQuizSiAhoraAcierta(numFallosYa) {
    if (numFallosYa <= 0) return 10;
    if (numFallosYa === 1) return 5;
    return 2;
  }

  function barajar(arr) {
    var copia = arr.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copia[i];
      copia[i] = copia[j];
      copia[j] = tmp;
    }
    return copia;
  }

  function pintarVidas() {
    var el = document.getElementById("quiz-hearts");
    if (el) {
      el.textContent = "❤️".repeat(vidas) + "🤍".repeat(3 - vidas);
    }
  }

  function pintarProgreso() {
    var el = document.getElementById("quiz-progress");
    if (el) {
      el.textContent = indice + 1 + " / " + lista.length;
    }
  }

  function pintarSaldo() {
    var el = document.getElementById("quiz-saldo");
    if (!el) return;
    var base = duckObtenerSaldoMonedas();
    var extra = "";
    if (!respondidaBien && !partidaTerminada && lista.length) {
      var n = monedasQuizSiAhoraAcierta(erroresOpcionIncorrectaEstaPregunta);
      extra = " (+" + n + " si aciertas)";
    }
    el.textContent = "Monedas: " + base + extra;
  }

  function deshabilitarOpciones() {
    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].disabled = true;
    }
  }

  function habilitarOpciones() {
    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].disabled = false;
    }
  }

  function limpiarClasesOpciones() {
    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.remove("correct", "wrong", "option-elegida");
    }
  }

  function ocultarConfirmar() {
    seleccionPendienteIdx = null;
    var btn = document.getElementById("quiz-confirmar");
    if (btn) {
      btn.hidden = true;
    }
  }

  function mostrarConfirmar() {
    var btn = document.getElementById("quiz-confirmar");
    if (btn && seleccionPendienteIdx !== null && !respondidaBien && !partidaTerminada) {
      btn.hidden = false;
    }
  }

  function preguntaUsaMapaJXG(pregunta) {
    return (
      partidaUsaMapaJXG() &&
      typeof quizPreguntaUsaMapaJXG === "function" &&
      !!quizPreguntaUsaMapaJXG(temaId, pregunta)
    );
  }

  function aplicarLayoutMapaQuiz(pregunta) {
    var conMapa = !!pregunta && preguntaUsaMapaJXG(pregunta);
    document.body.classList.toggle("quiz--con-mapa", conMapa);
    document.body.classList.toggle("quiz--sin-mapa", !conMapa);
  }

  function prepararMapaPregunta(pregunta) {
    aplicarLayoutMapaQuiz(pregunta);
    if (typeof QuizJXGMapaFijo === "undefined") {
      return;
    }
    if (partidaUsaMapaJXG()) {
      QuizJXGMapaFijo.prepararPregunta(temaId, pregunta);
      actualizarHintMapaJXG(pregunta);
    } else {
      QuizJXGMapaFijo.ocultar();
    }
  }

  function vistaMapaOpcion(opcion) {
    if (
      !partidaUsaMapaJXG() ||
      typeof QuizJXGMapaFijo === "undefined" ||
      !lista[indice]
    ) {
      return;
    }
    QuizJXGMapaFijo.vistaOpcion(temaId, lista[indice], opcion);
  }

  function ocultarFeedback() {
    var fb = document.getElementById("quiz-feedback");
    if (fb) {
      fb.hidden = true;
      fb.textContent = "";
    }
  }

  function ocultarSiguiente() {
    var sig = document.getElementById("quiz-siguiente");
    if (sig) {
      sig.hidden = true;
      sig.onclick = null;
    }
  }

  /** Solo tras acertar la pregunta actual (o fin de partida / game over). */
  function mostrarSiguiente(texto, onClick) {
    var sig = document.getElementById("quiz-siguiente");
    if (!sig) return;
    sig.textContent = texto;
    sig.hidden = false;
    sig.onclick = onClick;
  }

  function mostrarFeedback(texto) {
    var fb = document.getElementById("quiz-feedback");
    if (!fb) return;
    fb.innerHTML = "";
    var titulo = document.createElement("span");
    titulo.className = "quiz-feedback-title";
    titulo.textContent = "Retroalimentación";
    var cuerpo = document.createElement("span");
    cuerpo.textContent = texto;
    fb.appendChild(titulo);
    fb.appendChild(cuerpo);
    fb.hidden = false;
  }

  function mostrarGameOver() {
    partidaTerminada = true;
    enviarResultadoQuiz("GAME_OVER");
    var go = document.getElementById("quiz-gameover");
    if (go) {
      go.textContent =
        "Sin vidas. Vuelve a intentarlo desde Temas cuando quieras.";
      go.hidden = false;
    }
    mostrarSiguiente("Salir", irATemasQuiz);
    deshabilitarOpciones();
    ocultarConfirmar();
    if (typeof QuizJXGMapaFijo !== "undefined") {
      QuizJXGMapaFijo.ocultar();
    }
    pintarSaldo();
  }

  async function terminarQuiz() {
    var guardado = await enviarResultadoQuiz("COMPLETADA");
    if (!guardado) {
      document.getElementById("quiz-question-text").textContent =
        "Completaste el quiz, pero no se pudo guardar el progreso en la nube. Revisa tu conexión e inténtalo de nuevo.";
      mostrarSiguiente("Reintentar guardar", function () {
        terminarQuiz();
      });
      partidaTerminada = true;
      pintarSaldo();
      return;
    }
    mostrarSiguiente("Volver a temas", irATemasQuiz);
    document.getElementById("quiz-question-text").textContent =
      "¡Completaste el quiz! Monedas y progreso guardados.";
    document.getElementById("quiz-options").innerHTML = "";
    if (typeof QuizJXGMapaFijo !== "undefined") {
      QuizJXGMapaFijo.ocultar();
    }
    ocultarConfirmar();
    ocultarFeedback();
    partidaTerminada = true;
    pintarSaldo();
  }

  function seleccionarOpcion(ev) {
    if (partidaTerminada) return;
    if (respondidaBien) return;

    ocultarSiguiente();

    var btn = ev.currentTarget;
    if (btn.disabled) return;

    var idx = parseInt(btn.getAttribute("data-idx"), 10);
    var opt = opcionesActuales[idx];
    if (!opt) return;

    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.remove("option-elegida");
    }
    btn.classList.add("option-elegida");
    seleccionPendienteIdx = idx;
    if (jxgVistaAlSeleccionarOpcion()) {
      vistaMapaOpcion(opt);
    } else {
      reiniciarMapaPreguntaActual();
    }
    mostrarConfirmar();
  }

  function confirmarRespuesta() {
    if (partidaTerminada) return;
    if (respondidaBien) return;
    if (seleccionPendienteIdx === null) return;

    var idx = seleccionPendienteIdx;
    var opt = opcionesActuales[idx];
    if (!opt) return;

    var btn = document.querySelector(
      '#quiz-options .option[data-idx="' + idx + '"]'
    );
    if (!btn || btn.disabled) return;

    ocultarConfirmar();

    if (opt.ok) {
      if (!jxgVistaAlSeleccionarOpcion()) {
        vistaMapaOpcion(opt);
      }
      btn.classList.add("correct");
      respondidaBien = true;
      deshabilitarOpciones();
      ocultarFeedback();
      if (!monedaPagada && !quizModoPreview) {
        monedaPagada = true;
        var monedasGanadas = monedasQuizSiAhoraAcierta(
          erroresOpcionIncorrectaEstaPregunta
        );
        duckAgregarMonedas(monedasGanadas);
        _quizSync.monedasGanadas += monedasGanadas;
      } else if (!monedaPagada && quizModoPreview) {
        monedaPagada = true;
      }
      registrarActividadPregunta(true, lista[indice] && lista[indice].q);
      mostrarSiguiente(
        indice + 1 >= lista.length ? "Finalizar" : "Siguiente pregunta",
        onSiguiente
      );
      pintarSaldo();
      return;
    }

    ocultarSiguiente();
    btn.classList.add("wrong");
    erroresOpcionIncorrectaEstaPregunta += 1;
    registrarErrorPreguntaActual();
    vidas -= 1;
    pintarVidas();

    if (opt.fb) {
      mostrarFeedback(opt.fb);
    } else {
      ocultarFeedback();
    }

    if (vidas <= 0) {
      deshabilitarOpciones();
      mostrarGameOver();
      return;
    }

    pintarSaldo();

    /* Deshabilitamos solo esta opción para que el usuario pueda releer la
       retroalimentación y elegir otra sin volver a sumar el mismo error. */
    btn.disabled = true;
    btn.classList.remove("option-elegida");
  }

  function onSiguiente() {
    indice += 1;
    if (indice >= lista.length) {
      terminarQuiz();
      return;
    }
    respondidaBien = false;
    monedaPagada = false;
    ocultarConfirmar();
    ocultarSiguiente();
    mostrarPregunta();
  }

  function mostrarPregunta() {
    var p = lista[indice];
    _quizSync.preguntaInicioMs = Date.now();
    erroresOpcionIncorrectaEstaPregunta = 0;
    ocultarConfirmar();
    var qEl = document.getElementById("quiz-question-text");
    if (qEl) {
      qEl.textContent = p.q;
    }
    pintarProgreso();
    pintarSaldo();
    ocultarFeedback();

    prepararMapaPregunta(p);

    opcionesActuales = barajar(p.opts);

    var cont = document.getElementById("quiz-options");
    cont.innerHTML = "";
    for (var i = 0; i < opcionesActuales.length; i++) {
      (function (idx, opcionDat) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "option";
        b.textContent = opcionDat.t;
        b.setAttribute("data-idx", String(idx));
        cont.appendChild(b);

        b.addEventListener("click", seleccionarOpcion);
      })(i, opcionesActuales[i]);
    }

    var go = document.getElementById("quiz-gameover");
    if (go) go.hidden = true;
    ocultarSiguiente();
    ocultarCargandoTecduckAventura();
  }

  function pintarContextoQuiz() {
    var ctx = document.getElementById("quiz-context");
    if (!ctx) {
      return;
    }
    if (nivelMaestro) {
      ctx.textContent = nivelMaestro.titulo;
      return;
    }
    ctx.textContent =
      "Tema " +
      temaId +
      " · " +
      (modo === "dificil" ? "Avanzado" : "Básico");
  }

  function mostrarCargandoTecduckAventura() {
    document.body.classList.add("is-quiz-loading");
    var overlay = document.getElementById("quiz-loading-overlay");
    if (overlay) {
      overlay.classList.remove("is-hidden");
    }
  }

  function ocultarCargandoTecduckAventura() {
    document.body.classList.remove("is-quiz-loading");
    var overlay = document.getElementById("quiz-loading-overlay");
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  }

  function reiniciarPartidaSegunUrl() {
    mostrarCargandoTecduckAventura();
    aplicarParamsPartida();
    _quizSync.pausado = false;
    _quizSync.finalizado = false;
    pintarContextoQuiz();
    reiniciarNivelQuiz();
  }

  function registrarBotonReiniciarQuiz() {
    var b = document.getElementById("quiz-reiniciar");
    if (!b || b.getAttribute("data-hook") === "1") return;
    b.setAttribute("data-hook", "1");
    b.addEventListener("click", function () {
      if (!hayProgresoEnPartida()) {
        reiniciarNivelQuiz();
        return;
      }
      if (!confirmarReiniciarNivel()) {
        return;
      }
      enviarResultadoQuiz("ABANDONADA").then(function (ok) {
        if (!ok) {
          quizAvisar(
            "No se pudo guardar el intento abandonado. Revisa tu conexión e inténtalo de nuevo."
          );
          return;
        }
        reiniciarNivelQuiz();
      });
    });
  }

  function registrarVolverTemasQuiz() {
    var link = document.getElementById("quiz-volver-temas");
    if (!link || link.getAttribute("data-hook") === "1") {
      return;
    }
    link.setAttribute("data-hook", "1");
    link.addEventListener("click", function (ev) {
      if (!hayProgresoEnPartida()) {
        ev.preventDefault();
        irATemasQuiz();
        return;
      }
      ev.preventDefault();
      if (!confirmarSalirTemas()) {
        return;
      }
      var destino =
        link.getAttribute("href") ||
        (typeof pagina === "function" ? pagina("topics.html") : "topics.html");
      guardarProgresoYSalir(destino);
    });
  }

  function registrarBotonConfirmarQuiz() {
    var b = document.getElementById("quiz-confirmar");
    if (!b || b.getAttribute("data-hook") === "1") return;
    b.setAttribute("data-hook", "1");
    b.addEventListener("click", confirmarRespuesta);
  }

  function reiniciarNivelQuiz() {
    ocultarFeedback();
    var go = document.getElementById("quiz-gameover");
    if (go) go.hidden = true;
    ocultarSiguiente();

    if (
      nivelMaestro &&
      typeof nivelMaestroObtenerPreguntasPartida === "function"
    ) {
      lista = nivelMaestroObtenerPreguntasPartida(nivelMaestro);
    } else {
      lista = quizObtenerPreguntas(temaId, modo, quizOptsPartida);
    }
    if (!lista.length) {
      document.getElementById("quiz-question-text").textContent =
        nivelMaestro
          ? "Este nivel no tiene preguntas todavía."
          : "No hay preguntas para este tema.";
      document.getElementById("quiz-options").innerHTML = "";
      if (typeof QuizJXGMapaFijo !== "undefined") {
        QuizJXGMapaFijo.ocultar();
      }
      aplicarLayoutMapaQuiz(null);
      ocultarConfirmar();
      var prog = document.getElementById("quiz-progress");
      if (prog) prog.textContent = "—";
      indice = 0;
      vidas = 3;
      partidaTerminada = false;
      respondidaBien = false;
      monedaPagada = false;
      reiniciarQuizSync();
      pintarContextoQuiz();
      pintarVidas();
      pintarSaldo();
      ocultarCargandoTecduckAventura();
      return;
    }

    reiniciarQuizSync();
    indice = 0;
    vidas = 3;
    partidaTerminada = false;
    respondidaBien = false;
    monedaPagada = false;
    pintarContextoQuiz();
    pintarVidas();
    mostrarPregunta();
    pintarSaldo();
  }

  function registrarAtajosTecladoQuiz() {
    if (document.body.getAttribute("data-quiz-keys") === "1") {
      return;
    }
    document.body.setAttribute("data-quiz-keys", "1");
    document.addEventListener("keydown", function (ev) {
      if (partidaTerminada || respondidaBien) {
        return;
      }
      var tag = ev.target && ev.target.tagName ? ev.target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || tag === "select") {
        return;
      }
      var key = ev.key;
      if (key === "Enter") {
        var btnConf = document.getElementById("quiz-confirmar");
        if (btnConf && !btnConf.hidden && seleccionPendienteIdx !== null) {
          ev.preventDefault();
          confirmarRespuesta();
        }
        return;
      }
      var mapa = { "1": 0, "2": 1, "3": 2, "4": 3 };
      var idx = mapa[key];
      if (idx == null && (key === "ArrowDown" || key === "ArrowUp")) {
        var opts = document.querySelectorAll("#quiz-options .option:not([disabled])");
        if (!opts.length) {
          return;
        }
        var actual = -1;
        for (var i = 0; i < opts.length; i++) {
          if (opts[i].classList.contains("option-elegida")) {
            actual = i;
            break;
          }
        }
        idx = key === "ArrowDown" ? (actual + 1) % opts.length : (actual <= 0 ? opts.length - 1 : actual - 1);
        opts[idx].click();
        ev.preventDefault();
        return;
      }
      if (idx == null) {
        return;
      }
      var boton = document.querySelector(
        '#quiz-options .option[data-idx="' + idx + '"]:not([disabled])'
      );
      if (boton) {
        ev.preventDefault();
        boton.click();
      }
    });
  }

  async function iniciar() {
    mostrarCargandoTecduckAventura();
    aplicarParamsPartida();
    pintarBannerPreview();

    if (quizModoPreview) {
      if (typeof teacherExigirSesionAsync === "function") {
        var okMaestro = await teacherExigirSesionAsync();
        if (!okMaestro) {
          return;
        }
      }
    } else if (typeof alumnoGuardEsperar === "function") {
      var okAlumno = await alumnoGuardEsperar();
      if (!okAlumno) {
        return;
      }
    }

    if (typeof initSupabase === "function") {
      await initSupabase();
    }
    if (
      !quizModoPreview &&
      typeof duckEconomiaSyncDesdeDb === "function" &&
      (typeof alumnoGuardEstaListo !== "function" || !alumnoGuardEstaListo())
    ) {
      try {
        await duckEconomiaSyncDesdeDb();
      } catch (e) {
        console.warn("[quiz] economia:", e);
      }
    }
    if (tnId && typeof nivelMaestroPorIdAsync === "function") {
      nivelMaestro = await nivelMaestroPorIdAsync(tnId);
      if (nivelMaestro) {
        temaId = "1";
        modo = "facil";
        quizOptsPartida = { nivelMaestroCustom: true };
        window.quizConfigPartida = {
          mostrarJxg: false,
          titulo: nivelMaestro.titulo
        };
      }
    }
    if (!(await validarAccesoNivelMaestro())) {
      return;
    }
    if (!(await validarAccesoTemaModo())) {
      return;
    }
    if (nivelMaestro && typeof window.quizPreguntaUsaMapaJXG === "function") {
      window.quizPreguntaUsaMapaJXG = function () {
        return false;
      };
    }
    registrarBotonReiniciarQuiz();
    registrarVolverTemasQuiz();
    registrarBotonConfirmarQuiz();
    registrarAtajosTecladoQuiz();
    reiniciarQuizSync();
    pintarContextoQuiz();
    reiniciarNivelQuiz();

    window.addEventListener("pagehide", function () {
      if (
        partidaTerminada ||
        _quizSync.finalizado ||
        _quizSync.pausado ||
        !hayProgresoEnPartida()
      ) {
        return;
      }
      enviarResultadoQuiz(estadoSalidaConVidas());
    });

    window.addEventListener("pageshow", function (ev) {
      if (!ev.persisted) {
        return;
      }
      reiniciarPartidaSegunUrl();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
