(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var tnId = params.get("tn");
  var nivelMaestro = null;
  var quizOptsPartida = null;
  var temaId = params.get("tema") || "1";
  var modo = params.get("modo") === "dificil" ? "dificil" : "facil";

  if (tnId && typeof nivelMaestroPorId === "function") {
    nivelMaestro = nivelMaestroPorId(tnId);
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

  function partidaUsaMapaJXG() {
    if (temaId !== "2") {
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

  function validarAccesoNivelMaestro() {
    if (!tnId) {
      return true;
    }
    if (!nivelMaestro) {
      window.alert("Este nivel no existe o fue eliminado.");
      window.location.href = "topics.html";
      return false;
    }
    var email =
      typeof alumnoSesionEmail === "function" ? alumnoSesionEmail() : "";
    var vinculo =
      typeof alumnoObtenerGrupoVinculado === "function"
        ? alumnoObtenerGrupoVinculado(email)
        : null;
    if (
      !vinculo ||
      !vinculo.grupoId ||
      !nivelMaestroVisibleParaGrupo(nivelMaestro, vinculo.grupoId)
    ) {
      window.alert("Este nivel no está disponible para tu grupo o ya venció.");
      window.location.href = "topics.html";
      return false;
    }
    if (!nivelMaestroContarPreguntas(nivelMaestro)) {
      window.alert("Este nivel aún no tiene preguntas. Avísale a tu maestro.");
      window.location.href = "topics.html";
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
      "Perderás todo el progreso acumulado en esta partida (preguntas del intento y vidas).\n\n¿Volver a temas?"
    );
  }

  function confirmarReiniciarNivel() {
    return window.confirm(
      "Perderás todo el progreso acumulado en esta partida (preguntas del intento y vidas).\n\n¿Reiniciar el nivel?"
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

  function prepararMapaPregunta(pregunta) {
    if (typeof QuizJXGMapaFijo === "undefined") {
      return;
    }
    if (partidaUsaMapaJXG()) {
      QuizJXGMapaFijo.prepararPregunta(temaId, pregunta);
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
    var go = document.getElementById("quiz-gameover");
    if (go) {
      go.textContent =
        "Sin vidas. Vuelve a intentarlo desde Temas cuando quieras.";
      go.hidden = false;
    }
    mostrarSiguiente("Salir", function () {
      window.location.href = "topics.html";
    });
    deshabilitarOpciones();
    ocultarConfirmar();
    if (typeof QuizJXGMapaFijo !== "undefined") {
      QuizJXGMapaFijo.ocultar();
    }
    pintarSaldo();
  }

  function terminarQuiz() {
    if (modo === "facil" && typeof setFacilCompletado === "function") {
      setFacilCompletado(temaId);
    }
    mostrarSiguiente("Volver a temas", function () {
      window.location.href = "topics.html";
    });
    document.getElementById("quiz-question-text").textContent =
      "¡Completaste el quiz! Monedas guardadas.";
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
    vistaMapaOpcion(opt);
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
      btn.classList.add("correct");
      respondidaBien = true;
      deshabilitarOpciones();
      ocultarFeedback();
      if (!monedaPagada) {
        monedaPagada = true;
        duckAgregarMonedas(
          monedasQuizSiAhoraAcierta(erroresOpcionIncorrectaEstaPregunta)
        );
      }
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
    erroresOpcionIncorrectaEstaPregunta = 0;
    ocultarConfirmar();
    document.getElementById("quiz-question-text").textContent = p.q;
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
  }

  function registrarBotonReiniciarQuiz() {
    var b = document.getElementById("quiz-reiniciar");
    if (!b || b.getAttribute("data-hook") === "1") return;
    b.setAttribute("data-hook", "1");
    b.addEventListener("click", function () {
      if (hayProgresoEnPartida() && !confirmarReiniciarNivel()) {
        return;
      }
      reiniciarNivelQuiz();
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
        return;
      }
      ev.preventDefault();
      if (confirmarSalirTemas()) {
        window.location.href = link.getAttribute("href") || "topics.html";
      }
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
      ocultarConfirmar();
      var prog = document.getElementById("quiz-progress");
      if (prog) prog.textContent = "—";
      indice = 0;
      vidas = 3;
      partidaTerminada = false;
      respondidaBien = false;
      monedaPagada = false;
      pintarVidas();
      pintarSaldo();
      return;
    }

    indice = 0;
    vidas = 3;
    partidaTerminada = false;
    respondidaBien = false;
    monedaPagada = false;
    pintarVidas();
    mostrarPregunta();
    pintarSaldo();
  }

  function iniciar() {
    if (!validarAccesoNivelMaestro()) {
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

    var ctx = document.getElementById("quiz-context");
    if (ctx) {
      if (nivelMaestro) {
        ctx.textContent = nivelMaestro.titulo;
      } else {
        ctx.textContent =
          "Tema " +
          temaId +
          " · " +
          (modo === "dificil" ? "Avanzado" : "Básico");
      }
    }
    reiniciarNivelQuiz();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
