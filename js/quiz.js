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
      var n = duckMonedasPorPregunta(modo);
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

  function mostrarGameOver() {
    partidaTerminada = true;
    var go = document.getElementById("quiz-gameover");
    if (go) {
      go.textContent =
        "Sin vidas. Vuelve a intentarlo desde Temas cuando quieras.";
      go.hidden = false;
    }
    var sig = document.getElementById("quiz-siguiente");
    if (sig) sig.hidden = true;
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
    partidaTerminada = true;
    pintarSaldo();
  }

  function onOpcionClick(ev) {
    if (partidaTerminada) return;
    if (respondidaBien) return;

    var btn = ev.currentTarget;
    if (btn.disabled) return;

    var ok = btn.getAttribute("data-ok") === "1";

    if (ok) {
      btn.classList.add("correct");
      respondidaBien = true;
      deshabilitarOpciones();
      if (!monedaPagada) {
        monedaPagada = true;
        var n = duckMonedasPorPregunta(modo);
        duckAgregarMonedas(n);
      }
      var sig = document.getElementById("quiz-siguiente");
      if (sig) {
        if (indice + 1 >= lista.length) {
          sig.textContent = "Finalizar";
        } else {
          sig.textContent = "Siguiente pregunta";
        }
        sig.hidden = false;
        sig.onclick = onSiguiente;
      }
      pintarSaldo();
    } else {
      btn.classList.add("wrong");
      vidas -= 1;
      pintarVidas();
      if (vidas <= 0) {
        deshabilitarOpciones();
        mostrarGameOver();
      } else {
        setTimeout(function () {
          if (partidaTerminada || respondidaBien) return;
          limpiarClasesOpciones();
          habilitarOpciones();
        }, 600);
      }
    }
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
    document.getElementById("quiz-question-text").textContent = p.q;
    pintarProgreso();
    pintarSaldo();

    var cont = document.getElementById("quiz-options");
    cont.innerHTML = "";
    var ops = barajar(p.a);
    for (var i = 0; i < ops.length; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "option";
      b.textContent = ops[i].t;
      b.setAttribute("data-ok", ops[i].ok ? "1" : "0");
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

  function iniciar() {
    var ctx = document.getElementById("quiz-context");
    if (ctx) {
      ctx.textContent =
        "Tema " + temaId + " · " + (modo === "dificil" ? "Difícil" : "Fácil");
    }
    lista = quizObtenerPreguntas(temaId, modo);
    if (!lista.length) {
      document.getElementById("quiz-question-text").textContent =
        "No hay preguntas para este tema.";
      return;
    }
    indice = 0;
    vidas = 3;
    partidaTerminada = false;
    respondidaBien = false;
    monedaPagada = false;
    pintarVidas();
    mostrarPregunta();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
