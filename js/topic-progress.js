/**
 * Progreso por tema: solo memoria tras cargar desde Supabase (sin localStorage).
 */
var _progresoTemasMem = {};
var _progresoTemasListo = false;

function progresoTemasLimpiar() {
  _progresoTemasMem = {};
  _progresoTemasListo = false;
}

function progresoTemasEstaListo() {
  return _progresoTemasListo === true;
}

function getProgresoTemas() {
  return _progresoTemasMem;
}

function aplicarProgresoTemaDesdeDb(temaId, facilOk, dificilOk) {
  var id = String(temaId);
  if (!id) {
    return;
  }
  if (!_progresoTemasMem[id]) {
    _progresoTemasMem[id] = {};
  }
  if (facilOk) {
    _progresoTemasMem[id].facil = true;
  }
  if (dificilOk) {
    _progresoTemasMem[id].dificil = true;
    _progresoTemasMem[id].facil = true;
  }
}

function setFacilCompletado(temaId) {
  var id = String(temaId);
  if (!_progresoTemasMem[id]) {
    _progresoTemasMem[id] = {};
  }
  _progresoTemasMem[id].facil = true;
}

function setDificilCompletado(temaId) {
  var id = String(temaId);
  if (!_progresoTemasMem[id]) {
    _progresoTemasMem[id] = {};
  }
  _progresoTemasMem[id].dificil = true;
  _progresoTemasMem[id].facil = true;
}

function isFacilCompletado(temaId) {
  if (!_progresoTemasListo) {
    return false;
  }
  var id = String(temaId);
  var p = _progresoTemasMem[id];
  return !!(p && p.facil === true);
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
  a.href =
    typeof paginaQuiz === "function"
      ? paginaQuiz(tema, "dificil")
      : "/pages/quiz?tema=" +
        encodeURIComponent(tema) +
        "&modo=dificil";
  a.className = "level-btn level-btn-2 level-dificil";
  a.innerHTML =
    '<span class="lvl-badge">B</span><span class="lvl-label">Nivel avanzado</span><span class="lvl-go">Jugar →</span>';
  return a;
}

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

function crearDificilBloqueado(tema) {
  var span = document.createElement("span");
  span.className = diffLinkClassLocked();
  span.setAttribute("role", "presentation");
  span.innerHTML =
    '<span class="lvl-badge">🔒</span><span class="lvl-label">Nivel avanzado</span><span class="lvl-go">Completa el nivel básico para desbloquear</span>';
  return span;
}

function diffLinkClassLocked() {
  return "level-btn level-btn-2 level-dificil level-dificil-locked";
}

function irQuizTemaModo(tema, modo) {
  var url =
    typeof paginaQuiz === "function"
      ? paginaQuiz(tema, modo)
      : "/pages/quiz?tema=" +
        encodeURIComponent(tema) +
        "&modo=" +
        encodeURIComponent(modo);
  window.location.assign(url);
}

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
            : "/pages/quiz?tema=" +
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
            : "/pages/quiz?tema=" +
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

/** Muestra “Cargando progreso…” en avanzado hasta leer Supabase. */
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

function quizProgressActualizarMemoriaTrasGuardar(datos, estadoPartida) {
  if (estadoPartida !== "COMPLETADA" || datos.nivelMaestroId || !datos.temaId) {
    return;
  }
  var temaStr = String(datos.temaId);
  if (quizProgressModoDb(datos.modo) === "DIFICIL") {
    setDificilCompletado(temaStr);
  } else {
    setFacilCompletado(temaStr);
  }
}

/* --- Supabase: partidas y progreso --- */

function quizProgressModoDb(modo) {
  return String(modo || "facil").toLowerCase() === "dificil" ? "DIFICIL" : "FACIL";
}

function quizProgressEstadoDb(estado) {
  var e = String(estado || "COMPLETADA").toUpperCase();
  if (e === "GAME_OVER" || e === "ABANDONADA" || e === "EN_CURSO") {
    return e;
  }
  return "COMPLETADA";
}

async function quizProgressGuardar(datos) {
  if (typeof initSupabase !== "function") {
    return { ok: false, error: "Supabase no disponible" };
  }
  try {
    var sb = await initSupabase();
    if (!sb) {
      return { ok: false, error: "Supabase no configurado" };
    }
    if (typeof authRenovarSesionSiHaceFalta === "function") {
      var sesion = await authRenovarSesionSiHaceFalta();
      if (!sesion) {
        return { ok: false, error: "Sesión expirada" };
      }
    }

    var params = {
      p_tema_id: datos.temaId ? Number(datos.temaId) : null,
      p_nivel_maestro_id: datos.nivelMaestroId
        ? Number(datos.nivelMaestroId)
        : null,
      p_modo: quizProgressModoDb(datos.modo),
      p_estado: quizProgressEstadoDb(datos.estado),
      p_preguntas_ok: datos.preguntasOk || 0,
      p_preguntas_total: datos.preguntasTotal || 0,
      p_tiempo_promedio_seg: datos.tiempoPromedioSeg || null,
      p_monedas_ganadas: datos.monedasGanadas || 0,
      p_vidas_restantes: datos.vidasRestantes != null ? datos.vidasRestantes : 0,
      p_indice_pregunta:
        datos.indicePregunta != null ? Number(datos.indicePregunta) : 0,
      p_actividad: Array.isArray(datos.actividad) ? datos.actividad : []
    };

    var res = await sb.rpc("registrar_resultado_quiz", params);
    if (res.error) {
      console.warn("[quiz-progress]", res.error.message);
      return { ok: false, error: res.error.message };
    }
    if (params.p_estado === "COMPLETADA") {
      quizProgressActualizarMemoriaTrasGuardar(datos, "COMPLETADA");
    }
    return { ok: true, partidaId: res.data };
  } catch (e) {
    console.warn("[quiz-progress]", e);
    return { ok: false, error: e.message || String(e) };
  }
}

async function quizProgressCargarDesbloqueosTemas() {
  _progresoTemasListo = false;
  _progresoTemasMem = {};

  if (typeof initSupabase !== "function") {
    _progresoTemasListo = true;
    return { ok: false };
  }
  try {
    var sb = await initSupabase();
    if (!sb || typeof authCargarPerfil !== "function") {
      _progresoTemasListo = true;
      return { ok: false };
    }
    var perfil = await authCargarPerfil();
    if (!perfil || !authEsRol(perfil, "ALUMNO")) {
      _progresoTemasListo = true;
      return { ok: false };
    }
    var alumnoRes = await sb
      .from("alumno")
      .select("id")
      .eq("usuario_id", perfil.id)
      .maybeSingle();
    if (alumnoRes.error || !alumnoRes.data) {
      _progresoTemasListo = true;
      return { ok: false };
    }
    var prog = await sb
      .from("progreso")
      .select("tema_id, facil_completado, dificil_completado")
      .eq("alumno_id", alumnoRes.data.id)
      .not("tema_id", "is", null);
    if (prog.error) {
      console.warn("[quiz-progress] desbloqueos:", prog.error.message);
      _progresoTemasListo = true;
      return { ok: false, error: prog.error.message };
    }
    if (prog.data) {
      for (var i = 0; i < prog.data.length; i++) {
        var row = prog.data[i];
        if (!row.tema_id) {
          continue;
        }
        aplicarProgresoTemaDesdeDb(
          row.tema_id,
          !!row.facil_completado,
          !!row.dificil_completado
        );
      }
    }
    _progresoTemasListo = true;
    return { ok: true };
  } catch (e) {
    console.warn("[quiz-progress] desbloqueos:", e);
    _progresoTemasListo = true;
    return { ok: false, error: e.message || String(e) };
  }
}
