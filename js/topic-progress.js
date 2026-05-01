/**
 * Progreso por tema: el nivel difícil se desbloquea al completar el fácil (localStorage).
 */
var PROGRESO_TEMATICA = "tec_duck_progreso_temas";

function getProgresoTemas() {
  try {
    var raw = localStorage.getItem(PROGRESO_TEMATICA);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function guardarProgresoTemas(obj) {
  localStorage.setItem(PROGRESO_TEMATICA, JSON.stringify(obj));
}

function setFacilCompletado(temaId) {
  var id = String(temaId);
  var p = getProgresoTemas();
  if (!p[id]) {
    p[id] = {};
  }
  p[id].facil = true;
  guardarProgresoTemas(p);
}

function isFacilCompletado(temaId) {
  var id = String(temaId);
  var p = getProgresoTemas();
  return !!(p[id] && p[id].facil === true);
}

function isDificilDesbloqueado(temaId) {
  return isFacilCompletado(temaId);
}

function leerParamsQuiz() {
  var q = new URLSearchParams(window.location.search || "");
  var modo = (q.get("modo") || "facil").toLowerCase();
  if (modo !== "dificil" && modo !== "facil") {
    modo = "facil";
  }
  return {
    tema: q.get("tema") || "1",
    modo: modo
  };
}

function crearEnlaceDificil(tema) {
  var a = document.createElement("a");
  a.href = "quiz.html?tema=" + encodeURIComponent(tema) + "&modo=dificil";
  a.className = "level-btn level-btn-2 level-dificil";
  a.innerHTML =
    '<span class="lvl-badge">D</span><span class="lvl-label">Nivel difícil</span><span class="lvl-go">Jugar →</span>';
  return a;
}

/**
 * En temas: bloquea o desbloquea el nivel difícil según progreso (sirve también con bfcache).
 */
function aplicarBloqueosTarjetas() {
  var cards = document.querySelectorAll(".topic-card[data-tema]");
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var tema = card.getAttribute("data-tema");
    var diffLink = card.querySelector("a.level-dificil");
    var lockedSpan = card.querySelector("span.level-dificil-locked");

    if (isDificilDesbloqueado(tema)) {
      if (lockedSpan) {
        lockedSpan.parentNode.replaceChild(crearEnlaceDificil(tema), lockedSpan);
      }
      continue;
    }

    if (diffLink) {
      var span = document.createElement("span");
      span.className = diffLink.className + " level-dificil-locked";
      span.setAttribute("role", "presentation");
      span.innerHTML = diffLink.innerHTML;
      var go = span.querySelector(".lvl-go");
      if (go) {
        go.textContent = "Completa el nivel fácil para desbloquear";
      }
      var badge = span.querySelector(".lvl-badge");
      if (badge) {
        badge.textContent = "🔒";
      }
      diffLink.parentNode.replaceChild(span, diffLink);
    }
  }
}
