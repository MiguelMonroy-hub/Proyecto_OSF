(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var temaId = params.get("tema") || "1";
  var modo = params.get("modo") === "dificil" ? "dificil" : "facil";

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
      opts[i].classList.remove("correct", "wrong");
    }
  }

  function ocultarFeedback() {
    var fb = document.getElementById("quiz-feedback");
    if (fb) {
      fb.hidden = true;
      fb.textContent = "";
    }
  }

  function pintarFiguraQuiz(urlImg, textoAlt) {
    cerrarLightboxQuiz();
    var fig = document.getElementById("quiz-figure");
    var im = document.getElementById("quiz-image");
    if (!fig || !im) return;
    if (urlImg) {
      im.alt = textoAlt ? String(textoAlt).slice(0, 220) : "Ilustración de la pregunta";
      im.src = urlImg;
      im.title = "Pulsa para ver en grande";
      fig.hidden = false;
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute(
        "aria-label",
        "Ampliar ilustración de la pregunta"
      );
    } else {
      im.removeAttribute("src");
      im.alt = "";
      im.removeAttribute("title");
      fig.hidden = true;
      fig.removeAttribute("tabindex");
      fig.removeAttribute("role");
      fig.removeAttribute("aria-label");
    }
  }

  function quizLightboxOnEscape(ev) {
    if (ev.key === "Escape") {
      cerrarLightboxQuiz();
    }
  }

  function cerrarLightboxQuiz() {
    var lb = document.getElementById("quiz-img-lightbox");
    var big = document.getElementById("quiz-img-lightbox-img");
    if (!lb) return;
    lb.hidden = true;
    if (big) {
      big.removeAttribute("src");
      big.alt = "";
    }
    document.body.style.overflow = "";
    document.removeEventListener("keydown", quizLightboxOnEscape);
  }

  function abrirLightboxQuiz(url, textoAlt) {
    var lb = document.getElementById("quiz-img-lightbox");
    var big = document.getElementById("quiz-img-lightbox-img");
    if (!lb || !big || !url) return;
    big.alt = textoAlt ? String(textoAlt).slice(0, 220) : "";
    big.src = url;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", quizLightboxOnEscape);
  }

  function registrarLightboxImagenQuiz() {
    var fig = document.getElementById("quiz-figure");
    if (!fig || fig.getAttribute("data-lightbox-hook") === "1") return;
    fig.setAttribute("data-lightbox-hook", "1");
    fig.addEventListener("click", function () {
      if (fig.hidden) return;
      var sm = document.getElementById("quiz-image");
      if (!sm || !sm.getAttribute("src")) return;
      abrirLightboxQuiz(sm.src, sm.alt || "");
    });
    fig.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      if (fig.hidden) return;
      var sm = document.getElementById("quiz-image");
      if (!sm || !sm.getAttribute("src")) return;
      ev.preventDefault();
      abrirLightboxQuiz(sm.src, sm.alt || "");
    });

    var c = document.getElementById("quiz-img-lightbox-close");
    var bd = document.getElementById("quiz-img-lightbox-backdrop");
    if (c) c.addEventListener("click", cerrarLightboxQuiz);
    if (bd) bd.addEventListener("click", cerrarLightboxQuiz);
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
    var sig = document.getElementById("quiz-siguiente");
    if (sig) {
      sig.textContent = "Salir";
      sig.hidden = false;
      sig.onclick = function () {
        window.location.href = "topics.html";
      };
    }
    deshabilitarOpciones();
    pintarSaldo();
  }

  function terminarQuiz() {
    if (modo === "facil" && typeof setFacilCompletado === "function") {
      setFacilCompletado(temaId);
    }
    var sig = document.getElementById("quiz-siguiente");
    if (sig) {
      sig.hidden = false;
      sig.textContent = "Volver a temas";
      sig.onclick = function () {
        window.location.href = "topics.html";
      };
    }
    document.getElementById("quiz-question-text").textContent =
      "¡Completaste el quiz! Monedas guardadas.";
    document.getElementById("quiz-options").innerHTML = "";
    pintarFiguraQuiz("");
    ocultarFeedback();
    partidaTerminada = true;
    pintarSaldo();
  }

  function onOpcionClick(ev) {
    if (partidaTerminada) return;
    if (respondidaBien) return;

    var btn = ev.currentTarget;
    if (btn.disabled) return;

    var idx = parseInt(btn.getAttribute("data-idx"), 10);
    var opt = opcionesActuales[idx];
    if (!opt) return;

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
      var sig = document.getElementById("quiz-siguiente");
      if (sig) {
        sig.textContent =
          indice + 1 >= lista.length ? "Finalizar" : "Siguiente pregunta";
        sig.hidden = false;
        sig.onclick = onSiguiente;
      }
      pintarSaldo();
      return;
    }

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
  }

  function onSiguiente() {
    indice += 1;
    if (indice >= lista.length) {
      terminarQuiz();
      return;
    }
    respondidaBien = false;
    monedaPagada = false;
    var sig = document.getElementById("quiz-siguiente");
    if (sig) {
      sig.hidden = true;
      sig.onclick = null;
    }
    mostrarPregunta();
  }

  function mostrarPregunta() {
    var p = lista[indice];
    erroresOpcionIncorrectaEstaPregunta = 0;
    document.getElementById("quiz-question-text").textContent = p.q;
    pintarProgreso();
    pintarSaldo();
    ocultarFeedback();

    var urlImg =
      typeof quizImagenParaPregunta === "function"
        ? quizImagenParaPregunta(p)
        : "";
    pintarFiguraQuiz(urlImg, p.q);

    opcionesActuales = barajar(p.opts);

    var cont = document.getElementById("quiz-options");
    cont.innerHTML = "";
    for (var i = 0; i < opcionesActuales.length; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "option";
      b.textContent = opcionesActuales[i].t;
      b.setAttribute("data-idx", String(i));
      b.addEventListener("click", onOpcionClick);
      cont.appendChild(b);
    }

    var go = document.getElementById("quiz-gameover");
    if (go) go.hidden = true;
    var sig = document.getElementById("quiz-siguiente");
    if (sig) {
      sig.hidden = true;
      sig.onclick = null;
    }
  }

  function registrarBotonReiniciarQuiz() {
    var b = document.getElementById("quiz-reiniciar");
    if (!b || b.getAttribute("data-hook") === "1") return;
    b.setAttribute("data-hook", "1");
    b.addEventListener("click", reiniciarNivelQuiz);
  }

  function reiniciarNivelQuiz() {
    cerrarLightboxQuiz();
    ocultarFeedback();
    var go = document.getElementById("quiz-gameover");
    if (go) go.hidden = true;
    var sig = document.getElementById("quiz-siguiente");
    if (sig) {
      sig.hidden = true;
      sig.onclick = null;
    }

    lista = quizObtenerPreguntas(temaId, modo);
    if (!lista.length) {
      document.getElementById("quiz-question-text").textContent =
        "No hay preguntas para este tema.";
      document.getElementById("quiz-options").innerHTML = "";
      pintarFiguraQuiz("");
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
    registrarLightboxImagenQuiz();
    registrarBotonReiniciarQuiz();

    var ctx = document.getElementById("quiz-context");
    if (ctx) {
      ctx.textContent =
        "Tema " + temaId + " · " + (modo === "dificil" ? "Avanzado" : "Básico");
    }
    reiniciarNivelQuiz();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
