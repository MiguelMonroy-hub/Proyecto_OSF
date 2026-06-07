// Progreso por tema: se guarda solo en memoria después de leer Supabase.
// Aquí vive la lógica de datos; la UI de temas usa otras funciones para pintar bloqueos.
var _progresoTemasMem = {};
var _progresoMaestroMem = {};
var _progresoTemasListo = false;

// Vacía el progreso en memoria y marca que aún no terminó de cargarse.
function progresoTemasLimpiar() {
  _progresoTemasMem = {};
  _progresoMaestroMem = {};
  _progresoTemasListo = false;
}

function progresoTemasModoSlotVacio() {
  return { pts: 0, enCurso: false, completado: false };
}

function progresoTemasAsegurarTema(temaId) {
  var id = String(temaId);
  if (!id) {
    return {
      facil: progresoTemasModoSlotVacio(),
      dificil: progresoTemasModoSlotVacio()
    };
  }
  var actual = _progresoTemasMem[id];
  if (!actual || typeof actual.facil === "boolean") {
    var facilOk = actual && actual.facil === true;
    var dificilOk = actual && actual.dificil === true;
    _progresoTemasMem[id] = {
      facil: {
        pts: facilOk ? 10 : 0,
        enCurso: false,
        completado: !!facilOk
      },
      dificil: {
        pts: dificilOk ? 10 : 0,
        enCurso: false,
        completado: !!dificilOk
      }
    };
  }
  return _progresoTemasMem[id];
}

function progresoMaestroSlotVacio() {
  return { pts: 0, enCurso: false, completado: false };
}

function progresoMaestroAsegurar(nivelId) {
  var id = String(nivelId);
  if (!id) {
    return progresoMaestroSlotVacio();
  }
  if (!_progresoMaestroMem[id]) {
    _progresoMaestroMem[id] = progresoMaestroSlotVacio();
  }
  return _progresoMaestroMem[id];
}

function progresoMaestroCelda(nivelId) {
  if (!_progresoTemasListo) {
    return progresoMaestroSlotVacio();
  }
  return progresoMaestroAsegurar(nivelId);
}

function aplicarProgresoMaestroDesdeDb(nivelId, completado, puntaje) {
  var id = String(nivelId);
  if (!id) {
    return;
  }
  var slot = progresoMaestroAsegurar(id);
  if (completado) {
    slot.completado = true;
    slot.enCurso = false;
    slot.pts = Math.max(slot.pts, 10);
  }
  if (puntaje != null && !isNaN(puntaje)) {
    slot.pts = Math.max(slot.pts, Math.min(10, Math.max(0, Number(puntaje))));
  }
}

function aplicarPartidasProgresoMaestro(partidas) {
  if (!partidas || !partidas.length) {
    return;
  }
  for (var i = 0; i < partidas.length; i++) {
    var p = partidas[i];
    if (!p.nivel_maestro_id) {
      continue;
    }
    var estado = String(p.estado || "").toUpperCase();
    if (
      estado !== "EN_CURSO" &&
      estado !== "COMPLETADA" &&
      estado !== "GAME_OVER"
    ) {
      continue;
    }
    var slot = progresoMaestroAsegurar(p.nivel_maestro_id);
    var enCurso = estado === "EN_CURSO";
    var pts = progresoPtsDesdePartida(p, enCurso);
    if (enCurso) {
      slot.enCurso = true;
      slot.pts = pts;
    } else if (!slot.enCurso && pts > slot.pts) {
      slot.pts = pts;
    }
    if (estado === "COMPLETADA") {
      slot.completado = true;
      slot.enCurso = false;
      slot.pts = Math.max(slot.pts, 10);
    }
  }
}

function progresoTemasModoCelda(temaId, modoKey) {
  if (!_progresoTemasListo) {
    return progresoTemasModoSlotVacio();
  }
  var tema = progresoTemasAsegurarTema(temaId);
  if (modoKey === "dificil") {
    return tema.dificil || progresoTemasModoSlotVacio();
  }
  return tema.facil || progresoTemasModoSlotVacio();
}

function progresoPtsDesdePartida(partida, enCurso) {
  var act =
    typeof partidaActividadItems === "function"
      ? partidaActividadItems(partida.actividad)
      : [];
  var total = partida.preguntas_total || act.length || 10;
  if (typeof partidaMetricasDesdeActividad === "function") {
    return partidaMetricasDesdeActividad(act, total).puntaje;
  }
  return 0;
}

function aplicarPartidasProgresoTemas(partidas) {
  if (!partidas || !partidas.length) {
    return;
  }
  for (var i = 0; i < partidas.length; i++) {
    var p = partidas[i];
    if (p.nivel_maestro_id || !p.nivel || !p.nivel.tema_id) {
      continue;
    }
    var estado = String(p.estado || "").toUpperCase();
    if (
      estado !== "EN_CURSO" &&
      estado !== "COMPLETADA" &&
      estado !== "GAME_OVER"
    ) {
      continue;
    }
    var codigo = String(p.nivel.tema_id);
    var modoKey =
      String(p.modo || "").toUpperCase() === "DIFICIL" ? "dificil" : "facil";
    var tema = progresoTemasAsegurarTema(codigo);
    var slot = tema[modoKey];
    var enCurso = estado === "EN_CURSO";
    var pts = progresoPtsDesdePartida(p, enCurso);
    if (enCurso) {
      slot.enCurso = true;
      slot.pts = pts;
    } else if (!slot.enCurso && pts > slot.pts) {
      slot.pts = pts;
    }
    if (estado === "COMPLETADA") {
      slot.completado = true;
      slot.enCurso = false;
      slot.pts = Math.max(slot.pts, 10);
    }
  }
}

// Indica si ya terminamos de cargar el progreso desde el servidor.
function progresoTemasEstaListo() {
  return _progresoTemasListo === true;
}

// Devuelve el mapa completo de progreso por tema (solo lectura desde fuera).
function getProgresoTemas() {
  return _progresoTemasMem;
}

// Aplica en memoria lo que vino de la tabla progreso para un tema concreto.
function aplicarProgresoTemaDesdeDb(temaId, facilOk, dificilOk) {
  var id = String(temaId);
  if (!id) {
    return;
  }
  var tema = progresoTemasAsegurarTema(id);
  if (facilOk) {
    tema.facil.completado = true;
    tema.facil.enCurso = false;
    tema.facil.pts = Math.max(tema.facil.pts, 10);
  }
  if (dificilOk) {
    tema.dificil.completado = true;
    tema.dificil.enCurso = false;
    tema.dificil.pts = Math.max(tema.dificil.pts, 10);
    tema.facil.completado = true;
    tema.facil.enCurso = false;
    tema.facil.pts = Math.max(tema.facil.pts, 10);
  }
}

// Marca el nivel fácil de un tema como completado en memoria.
function setFacilCompletado(temaId) {
  var tema = progresoTemasAsegurarTema(temaId);
  tema.facil.completado = true;
  tema.facil.enCurso = false;
  tema.facil.pts = 10;
}

// Marca el difícil como hecho; también deja el fácil en true porque ya lo superaste.
function setDificilCompletado(temaId) {
  var tema = progresoTemasAsegurarTema(temaId);
  tema.dificil.completado = true;
  tema.dificil.enCurso = false;
  tema.dificil.pts = 10;
  tema.facil.completado = true;
  tema.facil.enCurso = false;
  tema.facil.pts = 10;
}

// Comprueba si el alumno ya completó el nivel fácil de ese tema.
function isFacilCompletado(temaId) {
  if (!_progresoTemasListo) {
    return false;
  }
  return !!progresoTemasModoCelda(temaId, "facil").completado;
}

// El avanzado se desbloquea cuando el básico está completado.
function isDificilDesbloqueado(temaId) {
  return isFacilCompletado(temaId);
}

// Lee tema y modo (fácil/difícil) de los parámetros de la URL del quiz.
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

// Tras guardar una partida completada, actualiza la memoria local sin volver a pedir la BD.
function quizProgressActualizarMemoriaTrasGuardar(datos, estadoPartida) {
  if (estadoPartida !== "COMPLETADA") {
    return;
  }
  if (datos.nivelMaestroId) {
    var slot = progresoMaestroAsegurar(datos.nivelMaestroId);
    slot.completado = true;
    slot.enCurso = false;
    slot.pts = 10;
    return;
  }
  if (!datos.temaId) {
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

// Pasa "facil" o "dificil" al formato que espera la base de datos (FACIL / DIFICIL).
function quizProgressModoDb(modo) {
  return String(modo || "facil").toLowerCase() === "dificil" ? "DIFICIL" : "FACIL";
}

// Normaliza el estado de la partida a uno de los valores válidos en BD.
function quizProgressEstadoDb(estado) {
  var e = String(estado || "COMPLETADA").toUpperCase();
  if (e === "GAME_OVER" || e === "ABANDONADA" || e === "EN_CURSO") {
    return e;
  }
  return "COMPLETADA";
}

// Interpreta la respuesta del RPC registrar_resultado_quiz (objeto, id suelto, etc.).
function quizProgressParsearRespuestaRpc(data) {
  if (data && typeof data === "object" && data.partida_id != null) {
    return {
      partidaId: data.partida_id,
      saldoMonedas: Number(data.saldo_monedas) || 0,
      monedasPartida: Number(data.monedas_partida) || 0
    };
  }
  if (typeof data === "number" || typeof data === "string") {
    return { partidaId: data, saldoMonedas: null, monedasPartida: null };
  }
  return { partidaId: null, saldoMonedas: null, monedasPartida: null };
}

// Si el servidor devolvió saldo nuevo, lo refleja en la economía local del pato.
function quizProgressAplicarSaldoRespuesta(parsed) {
  if (
    parsed &&
    parsed.saldoMonedas != null &&
    typeof duckEconomiaAplicarSaldoLocal === "function"
  ) {
    duckEconomiaAplicarSaldoLocal(parsed.saldoMonedas);
  }
}

// Busca si el alumno tiene una partida EN_CURSO para retomar (tema normal o nivel maestro).
async function quizProgressCargarPartidaActiva(opts) {
  opts = opts || {};
  if (typeof initSupabase !== "function") {
    return { ok: false };
  }
  try {
    var sb = await initSupabase();
    if (!sb) {
      return { ok: false };
    }
    if (typeof authRenovarSesionSiHaceFalta === "function") {
      var sesion = await authRenovarSesionSiHaceFalta();
      if (!sesion) {
        return { ok: false, error: "Sesión expirada" };
      }
    }

    var modoDb = quizProgressModoDb(opts.modo);
    var q = sb
      .from("partida")
      .select(
        "id, indice_pregunta, vidas_restantes, monedas_ganadas, preguntas_total, actividad, estado"
      )
      .eq("estado", "EN_CURSO")
      .eq("modo", modoDb);

    if (opts.nivelMaestroId) {
      q = q
        .eq("nivel_maestro_id", Number(opts.nivelMaestroId))
        .is("nivel_id", null);
    } else if (opts.temaId) {
      var nivelRes = await sb
        .from("nivel")
        .select("id")
        .eq("tema_id", Number(opts.temaId))
        .eq("codigo", modoDb)
        .maybeSingle();
      if (nivelRes.error || !nivelRes.data) {
        return { ok: false };
      }
      q = q.eq("nivel_id", nivelRes.data.id).is("nivel_maestro_id", null);
    } else {
      return { ok: false };
    }

    var res = await q.order("iniciado_en", { ascending: false }).limit(1).maybeSingle();
    if (res.error || !res.data) {
      return { ok: false };
    }
    return { ok: true, partida: res.data };
  } catch (e) {
    console.warn("[quiz-progress] partida activa:", e);
    return { ok: false, error: e.message || String(e) };
  }
}

// Guarda el resultado de una partida en Supabase y actualiza memoria y monedas si toca.
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

    var monedasPayload =
      typeof partidaMonedasDesdeActividad === "function"
        ? partidaMonedasDesdeActividad(
            typeof partidaActividadItems === "function"
              ? partidaActividadItems(datos.actividad)
              : []
          )
        : datos.monedasGanadas || 0;

    var params = quizProgressConstruirParamsGuardar(datos);
    params.p_monedas_ganadas = monedasPayload;

    var res = await sb.rpc("registrar_resultado_quiz", params);
    if (res.error) {
      console.warn("[quiz-progress]", res.error.message);
      return { ok: false, error: res.error.message };
    }
    if (params.p_estado === "COMPLETADA") {
      quizProgressActualizarMemoriaTrasGuardar(datos, "COMPLETADA");
    }
    var parsed = quizProgressParsearRespuestaRpc(res.data);
    quizProgressAplicarSaldoRespuesta(parsed);
    return {
      ok: true,
      partidaId: parsed.partidaId,
      saldoMonedas: parsed.saldoMonedas,
      monedasPartida: parsed.monedasPartida
    };
  } catch (e) {
    console.warn("[quiz-progress]", e);
    return { ok: false, error: e.message || String(e) };
  }
}

// Arma el objeto de parámetros que espera el RPC registrar_resultado_quiz.
function quizProgressConstruirParamsGuardar(datos) {
  var monedasPayload =
    typeof partidaMonedasDesdeActividad === "function"
      ? partidaMonedasDesdeActividad(
          typeof partidaActividadItems === "function"
            ? partidaActividadItems(datos.actividad)
            : []
        )
      : datos.monedasGanadas || 0;

  return {
    p_tema_id: datos.temaId ? Number(datos.temaId) : null,
    p_nivel_maestro_id: datos.nivelMaestroId
      ? Number(datos.nivelMaestroId)
      : null,
    p_modo: quizProgressModoDb(datos.modo),
    p_estado: quizProgressEstadoDb(datos.estado),
    p_preguntas_ok: datos.preguntasOk || 0,
    p_preguntas_total: datos.preguntasTotal || 0,
    p_tiempo_promedio_seg: datos.tiempoPromedioSeg || null,
    p_monedas_ganadas: monedasPayload,
    p_vidas_restantes:
      datos.vidasRestantes != null ? datos.vidasRestantes : 0,
    p_indice_pregunta:
      datos.indicePregunta != null ? Number(datos.indicePregunta) : 0,
    p_actividad:
      datos.actividad != null && datos.actividad !== undefined
        ? datos.actividad
        : []
  };
}

// Saca el token de sesión que Supabase guarda en localStorage (para peticiones sin await).
function quizProgressTokenAuthLocal() {
  if (!window.SUPABASE_URL) {
    return null;
  }
  var ref = String(window.SUPABASE_URL)
    .replace(/^https?:\/\//, "")
    .split(".")[0];
  var key = "sb-" + ref + "-auth-token";
  try {
    var raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    var parsed = JSON.parse(raw);
    if (parsed && parsed.access_token) {
      return parsed.access_token;
    }
    if (parsed && parsed.currentSession && parsed.currentSession.access_token) {
      return parsed.currentSession.access_token;
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Envía el guardado con fetch keepalive (útil al cerrar la pestaña sin cortar la petición).
function quizProgressEnvioKeepalive(params) {
  if (!params || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    return false;
  }
  var token = quizProgressTokenAuthLocal();
  if (!token) {
    return false;
  }
  try {
    fetch(window.SUPABASE_URL + "/rest/v1/rpc/registrar_resultado_quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: window.SUPABASE_ANON_KEY,
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(params),
      keepalive: true
    });
    return true;
  } catch (e) {
    return false;
  }
}

// Carga desde Supabase qué temas tiene desbloqueados el alumno y llena la memoria local.
async function quizProgressCargarDesbloqueosTemas() {
  _progresoTemasListo = false;
  _progresoTemasMem = {};
  _progresoMaestroMem = {};

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

    var partRes = await sb
      .from("partida")
      .select(
        "estado, modo, actividad, preguntas_total, nivel:nivel_id ( tema_id )"
      )
      .eq("alumno_id", alumnoRes.data.id)
      .in("estado", ["EN_CURSO", "COMPLETADA", "GAME_OVER"])
      .is("nivel_maestro_id", null);
    if (!partRes.error && partRes.data) {
      aplicarPartidasProgresoTemas(partRes.data);
    } else if (partRes.error) {
      console.warn("[quiz-progress] partidas temas:", partRes.error.message);
    }

    var progNm = await sb
      .from("progreso")
      .select("nivel_maestro_id, facil_completado, puntaje")
      .eq("alumno_id", alumnoRes.data.id)
      .not("nivel_maestro_id", "is", null)
      .is("tema_id", null);
    if (!progNm.error && progNm.data) {
      for (var j = 0; j < progNm.data.length; j++) {
        var rowNm = progNm.data[j];
        if (!rowNm.nivel_maestro_id) {
          continue;
        }
        aplicarProgresoMaestroDesdeDb(
          rowNm.nivel_maestro_id,
          !!rowNm.facil_completado,
          rowNm.puntaje
        );
      }
    } else if (progNm.error) {
      console.warn("[quiz-progress] progreso maestro:", progNm.error.message);
    }

    var partNmRes = await sb
      .from("partida")
      .select("estado, actividad, preguntas_total, nivel_maestro_id")
      .eq("alumno_id", alumnoRes.data.id)
      .in("estado", ["EN_CURSO", "COMPLETADA", "GAME_OVER"])
      .not("nivel_maestro_id", "is", null);
    if (!partNmRes.error && partNmRes.data) {
      aplicarPartidasProgresoMaestro(partNmRes.data);
    } else if (partNmRes.error) {
      console.warn("[quiz-progress] partidas maestro:", partNmRes.error.message);
    }

    _progresoTemasListo = true;
    return { ok: true };
  } catch (e) {
    console.warn("[quiz-progress] desbloqueos:", e);
    _progresoTemasListo = true;
    return { ok: false, error: e.message || String(e) };
  }
}
