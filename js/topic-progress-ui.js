// UI del progreso en la pantalla de temas: botones de nivel avanzado, bloqueos y navegación al quiz.

// Crea el enlace clicable al nivel avanzado cuando ya está desbloqueado.
function crearEnlaceDificil(tema) {
  var a = document.createElement("a");
  a.href =
    typeof paginaQuiz === "function"
      ? paginaQuiz(tema, "dificil")
      : "/pages/quiz.html?tema=" +
        encodeURIComponent(tema) +
        "&modo=dificil";
  a.className = "level-btn level-btn-2 level-dificil";
  a.innerHTML =
    '<span class="lvl-badge">B</span><span class="lvl-label">Nivel avanzado</span><span class="lvl-go">Jugar →</span>';
  return a;
}

// Placeholder mientras aún no sabemos si el avanzado está desbloqueado o no.
function crearDificilCargando(tema) {
  var span = document.createElement("span");
  span.className =
    "level-btn level-btn-2 level-dificil level-dificil-cargando";
  span.setAttribute("role", "status");
  span.setAttribute("data-tema-cargando", String(tema));
  span.innerHTML =
    '<span class="lvl-badge">…</span><span class="lvl-label">Nivel avanzado</span><span class="lvl-go">Cargando progreso…</span>';
  return span;
}

// Botón del avanzado bloqueado: el alumno aún no completó el básico.
function crearDificilBloqueado(tema) {
  var span = document.createElement("span");
  span.className = diffLinkClassLocked();
  span.setAttribute("role", "presentation");
  span.innerHTML =
    '<span class="lvl-badge">🔒</span><span class="lvl-label">Nivel avanzado</span><span class="lvl-go">Completa el nivel básico para desbloquear</span>';
  return span;
}

// Clases CSS que usa el botón avanzado cuando sigue bloqueado.
function diffLinkClassLocked() {
  return "level-btn level-btn-2 level-dificil level-dificil-locked";
}

// Navega al quiz de un tema en el modo indicado (fácil o difícil).
function irQuizTemaModo(tema, modo) {
  var url =
    typeof paginaQuiz === "function"
      ? paginaQuiz(tema, modo)
      : "/pages/quiz.html?tema=" +
        encodeURIComponent(tema) +
        "&modo=" +
        encodeURIComponent(modo);
  window.location.assign(url);
}

// Enlaza los clics de fácil y difícil en cada tarjeta, respetando bloqueos del avanzado.
function enlazarBotonesQuizTemas() {
  var cards = document.querySelectorAll(".topic-card[data-tema]");
  for (var i = 0; i < cards.length; i++) {
    (function (card) {
      var tema = card.getAttribute("data-tema");
      if (!tema) {
        return;
      }
      var facil = card.querySelector("a.level-facil");
      if (facil && facil.getAttribute("data-quiz-nav") !== "1") {
        facil.setAttribute("data-quiz-nav", "1");
        facil.setAttribute(
          "href",
          typeof paginaQuiz === "function"
            ? paginaQuiz(tema, "facil")
            : "/pages/quiz.html?tema=" +
              encodeURIComponent(tema) +
              "&modo=facil"
        );
        facil.addEventListener("click", function (ev) {
          ev.preventDefault();
          irQuizTemaModo(tema, "facil");
        });
      }
      var dificil = card.querySelector("a.level-dificil");
      if (dificil && dificil.getAttribute("data-quiz-nav") !== "1") {
        dificil.setAttribute("data-quiz-nav", "1");
        dificil.setAttribute(
          "href",
          typeof paginaQuiz === "function"
            ? paginaQuiz(tema, "dificil")
            : "/pages/quiz.html?tema=" +
              encodeURIComponent(tema) +
              "&modo=dificil"
        );
        dificil.addEventListener("click", function (ev) {
          ev.preventDefault();
          if (!progresoTemasEstaListo()) {
            return;
          }
          if (!isDificilDesbloqueado(tema)) {
            return;
          }
          irQuizTemaModo(tema, "dificil");
        });
      }
    })(cards[i]);
  }
}

// Sustituye el slot del avanzado por “Cargando progreso…” hasta que llegue la respuesta de Supabase.
function progresoTemasBloquearDificilCargando() {
  var cards = document.querySelectorAll(".topic-card[data-tema]");
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var tema = card.getAttribute("data-tema");
    var slot = card.querySelector(
      "a.level-dificil, span.level-dificil-locked, span.level-dificil-cargando"
    );
    if (!slot || !tema) {
      continue;
    }
    slot.parentNode.replaceChild(crearDificilCargando(tema), slot);
  }
  enlazarBotonesQuizTemas();
}

// Una vez cargado el progreso, pinta enlace o candado en el avanzado según corresponda.
function aplicarBloqueosTarjetas() {
  if (!progresoTemasEstaListo()) {
    return;
  }
  var cards = document.querySelectorAll(".topic-card[data-tema]");
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var tema = card.getAttribute("data-tema");
    var slot = card.querySelector(
      "a.level-dificil, span.level-dificil-locked, span.level-dificil-cargando"
    );

    if (!slot || !tema) {
      continue;
    }

    if (isDificilDesbloqueado(tema)) {
      if (!slot.matches("a.level-dificil")) {
        slot.parentNode.replaceChild(crearEnlaceDificil(tema), slot);
      }
      continue;
    }

    if (!slot.matches("span.level-dificil-locked")) {
      slot.parentNode.replaceChild(crearDificilBloqueado(tema), slot);
    }
  }
  enlazarBotonesQuizTemas();
}
