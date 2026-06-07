// Datos del panel del maestro: alumnos, partidas, métricas y grupos (Supabase).
var _teacherAlumnosCache = [];
var _teacherAlumnosNivelesCache = [];
var _teacherColumnasNiveles = [];
var _teacherNivelesMaestroCargados = false;
var _teacherUltimoErrorCarga = null;

// Si la última carga falló, aquí queda el mensaje.
function teacherUltimoErrorCarga() {
  return _teacherUltimoErrorCarga;
}

// Grupos del cliente; usa gruposLeer si ya está cargado.
function teacherLeerGrupos() {
  return typeof gruposLeer === "function" ? gruposLeer() : [];
}

var TEACHER_TEMAS =
  typeof TEC_DUCK_TEMAS !== "undefined"
    ? TEC_DUCK_TEMAS
    : [
        { id: "t1", nombre: "Coordenadas", corto: "Tema 1" },
        { id: "t2", nombre: "Vectores", corto: "Tema 2" },
        { id: "t3", nombre: "Suma y resta", corto: "Tema 3" },
        { id: "t4", nombre: "Escalar", corto: "Tema 4" }
      ];

var TEACHER_TEMA_DB_A_UI =
  typeof TEC_DUCK_TEMA_DB_A_UI !== "undefined"
    ? TEC_DUCK_TEMA_DB_A_UI
    : {
        1: "t1",
        2: "t2",
        3: "t3",
        4: "t4"
      };

// Plantilla vacía del detalle cuando aún no hay datos del alumno.
function teacherDetalleVacio() {
  return {
    temaActivo: "t1",
    nivel: "Sin actividad",
    progresoNivel: 0,
    maxNivel: 100,
    porcentajeAciertos: 0,
    nivelCompletoOk: 0,
    nivelCompletoTotal: 0,
    nivelCompletoPct: 0,
    tareas: [],
    intentos: []
  };
}

// Los cuatro temas en cero (puntaje por tema).
function teacherTemasVacios() {
  return { t1: 0, t2: 0, t3: 0, t4: 0 };
}

// Ningún tema con partida abierta todavía.
function teacherTemasEnCursoVacios() {
  return { t1: false, t2: false, t3: false, t4: false };
}

function teacherTemaModoSlotVacio() {
  return { pts: 0, enCurso: false, tiempoPromedio: 0 };
}

// Avance por tema separado en básico (facil) y avanzado (dificil).
function teacherTemasModoVacios() {
  var o = {};
  for (var i = 0; i < TEACHER_TEMAS.length; i++) {
    o[TEACHER_TEMAS[i].id] = {
      facil: teacherTemaModoSlotVacio(),
      dificil: teacherTemaModoSlotVacio()
    };
  }
  return o;
}

function teacherModoKeyDesdePartida(partida) {
  return teacherPartidaEsDificil(partida) ? "dificil" : "facil";
}

function teacherPtsTemaDesdePartida(partida, enCurso) {
  if (enCurso) {
    var nc = teacherNivelCompletoDesdePartida(partida);
    if (nc.total > 0) {
      return Math.round((nc.ok / nc.total) * 10);
    }
  }
  return teacherPuntajeDesdePartida(partida);
}

function teacherAsegurarTemasModo(alumno) {
  if (!alumno.temasModo) {
    alumno.temasModo = teacherTemasModoVacios();
  }
  return alumno.temasModo;
}

function teacherTemaModoCelda(alumno, temaId, modoKey) {
  var tm = alumno && alumno.temasModo ? alumno.temasModo[temaId] : null;
  if (!tm || !tm[modoKey]) {
    return teacherTemaModoSlotVacio();
  }
  return {
    pts: tm[modoKey].pts || 0,
    enCurso: !!tm[modoKey].enCurso,
    tiempoPromedio: tm[modoKey].tiempoPromedio || 0
  };
}

// Sincroniza temas/temasEnCurso (detalle) con el máximo de ambos modos.
function teacherSincronizarTemasLegacy(map) {
  Object.keys(map).forEach(function (k) {
    var a = map[k];
    if (!a.temasModo) {
      return;
    }
    for (var i = 0; i < TEACHER_TEMAS.length; i++) {
      var tid = TEACHER_TEMAS[i].id;
      var tm = a.temasModo[tid];
      if (!tm) {
        continue;
      }
      a.temas[tid] = Math.max(tm.facil.pts || 0, tm.dificil.pts || 0);
      a.temasEnCurso[tid] = !!(tm.facil.enCurso || tm.dificil.enCurso);
    }
  });
}

// Normaliza el JSON de actividad (o delega al módulo compartido).
function teacherParsearActividadPartida(raw) {
  if (typeof partidaActividadParsear === "function") {
    return partidaActividadParsear(raw);
  }
  if (!raw) {
    return { items: [], preguntaIds: [], preguntas: [] };
  }
  if (Array.isArray(raw)) {
    return { items: raw, preguntaIds: [], preguntas: [] };
  }
  return { items: [], preguntaIds: [], preguntas: [] };
}

// Solo el array de respuestas dentro de la actividad.
function teacherActividadItems(raw) {
  if (typeof partidaActividadItems === "function") {
    return partidaActividadItems(raw);
  }
  return teacherParsearActividadPartida(raw).items;
}

// Cuántas preguntas cuenta la partida según estado y formato guardado.
function teacherTotalPreguntasPartida(partida, actRaw) {
  var parsed = teacherParsearActividadPartida(actRaw);
  var act = parsed.items;
  var total = Number(partida && partida.preguntas_total) || 0;
  if (total > 0) {
    return total;
  }
  if (parsed.preguntaIds.length) {
    return parsed.preguntaIds.length;
  }
  if (parsed.preguntas.length) {
    return parsed.preguntas.length;
  }
  if (!act.length) {
    return 0;
  }
  if (
    partida &&
    (partida.estado === "GAME_OVER" ||
      partida.estado === "COMPLETADA" ||
      act.some(function (a) {
        return a && a.omitida;
      }))
  ) {
    return act.length;
  }
  var maxIdx = -1;
  for (var j = 0; j < act.length; j++) {
    var idx = act[j] && act[j].indice != null ? act[j].indice : j;
    if (idx > maxIdx) {
      maxIdx = idx;
    }
  }
  return maxIdx >= 0 ? maxIdx + 1 : act.length;
}

// Peso 0–1 por pregunta (misma escala que monedas: 10 / 5 / 2).
function teacherPesoPreguntaActividad(entry) {
  if (typeof partidaPesoPregunta === "function") {
    return partidaPesoPregunta(entry);
  }
  return 0;
}

// Aciertos simples sobre el total, sin ponderar por errores.
function teacherNivelCompletoDesdePartida(partida) {
  if (!partida) {
    return { ok: 0, total: 0, pct: 0 };
  }
  var act = teacherActividadItems(partida.actividad);
  var ok = 0;
  if (Array.isArray(act)) {
    for (var i = 0; i < act.length; i++) {
      if (act[i] && act[i].ok) {
        ok += 1;
      }
    }
  }
  var total = teacherTotalPreguntasPartida(partida, partida.actividad);
  var pct = total > 0 ? Math.round((ok / total) * 100) : 0;
  return { ok: ok, total: total, pct: pct };
}

// Porcentaje de aciertos con pesos (como en el quiz).
function teacherPorcentajeAciertosDesdePartida(partida) {
  if (!partida) {
    return { pct: 0, ok: 0, total: 0, peso: 0 };
  }
  var act = teacherActividadItems(partida.actividad);
  var total = teacherTotalPreguntasPartida(partida, partida.actividad);
  if (typeof partidaMetricasDesdeActividad === "function") {
    var m = partidaMetricasDesdeActividad(act, total);
    return { pct: m.pct, ok: m.ok, total: m.total, peso: m.sumPeso };
  }
  return { pct: 0, ok: 0, total: total, peso: 0 };
}

// Nota de 0 a 10 con la misma fórmula del juego.
function teacherPuntajeDesdePartida(partida) {
  var act = teacherActividadItems(partida && partida.actividad);
  var total = teacherTotalPreguntasPartida(partida, partida && partida.actividad);
  if (typeof partidaMetricasDesdeActividad === "function") {
    return partidaMetricasDesdeActividad(act, total).puntaje;
  }
  return 0;
}

// Promedio de segundos por pregunta que trae tiempo registrado.
function teacherTiempoPromedioPartida(partida) {
  var act = teacherActividadItems(partida.actividad);
  if (!Array.isArray(act) || !act.length) {
    return 0;
  }
  var sum = 0;
  var n = 0;
  for (var i = 0; i < act.length; i++) {
    if (act[i] && act[i].tiempo != null) {
      sum += Number(act[i].tiempo) || 0;
      n += 1;
    }
  }
  return n ? Math.round(sum / n) : 0;
}

// Promedio histórico del alumno: media de los promedios por nivel con datos.
function teacherRecalcularTiempoPromedioAlumno(alumno, esPracticas) {
  if (!alumno) {
    return;
  }
  var vals = [];
  if (esPracticas) {
    if (alumno.nivelesMaestro) {
      Object.keys(alumno.nivelesMaestro).forEach(function (nid) {
        var t = alumno.nivelesMaestro[nid].tiempoPromedio;
        if (t > 0) {
          vals.push(t);
        }
      });
    }
  } else {
    var temasModo = teacherAsegurarTemasModo(alumno);
    for (var i = 0; i < TEACHER_TEMAS.length; i++) {
      var tid = TEACHER_TEMAS[i].id;
      var tm = temasModo[tid];
      if (tm.facil.tiempoPromedio > 0) {
        vals.push(tm.facil.tiempoPromedio);
      }
      if (tm.dificil.tiempoPromedio > 0) {
        vals.push(tm.dificil.tiempoPromedio);
      }
    }
  }
  var sum = 0;
  for (var j = 0; j < vals.length; j++) {
    sum += vals[j];
  }
  alumno.tiempoPromedio = vals.length ? Math.round(sum / vals.length) : 0;
}

// Acumula el promedio por intento (seg/pregunta) de cada partida, por nivel.
function teacherAplicarTiemposHistoricosDesdePartidas(map, partidas, esPracticas) {
  if (!partidas || !partidas.length || !map) {
    return;
  }
  var acc = {};

  for (var i = 0; i < partidas.length; i++) {
    var p = partidas[i];
    var estado = String(p.estado || "").toUpperCase();
    if (
      estado !== "COMPLETADA" &&
      estado !== "GAME_OVER" &&
      estado !== "EN_CURSO"
    ) {
      continue;
    }
    var alumnoKey = String(p.alumno_id);
    if (!map[alumnoKey]) {
      continue;
    }
    var tPart = teacherTiempoPromedioPartida(p);
    if (tPart <= 0) {
      continue;
    }
    var levelKey;
    if (esPracticas) {
      if (!p.nivel_maestro_id) {
        continue;
      }
      levelKey = String(p.nivel_maestro_id);
    } else {
      if (p.nivel_maestro_id) {
        continue;
      }
      var tid = teacherTemaUiDesdePartida(p);
      if (!tid) {
        continue;
      }
      levelKey = tid + ":" + teacherModoKeyDesdePartida(p);
    }
    var accKey = alumnoKey + "|" + levelKey;
    if (!acc[accKey]) {
      acc[accKey] = { alumnoKey: alumnoKey, levelKey: levelKey, sum: 0, n: 0 };
    }
    acc[accKey].sum += tPart;
    acc[accKey].n += 1;
  }

  Object.keys(acc).forEach(function (k) {
    var b = acc[k];
    var avg = Math.round(b.sum / b.n);
    var alumno = map[b.alumnoKey];
    if (esPracticas) {
      if (!alumno.nivelesMaestro) {
        alumno.nivelesMaestro = teacherNivelesMaestroVacios();
      }
      if (!alumno.nivelesMaestro[b.levelKey]) {
        alumno.nivelesMaestro[b.levelKey] = {
          ok: 0,
          total: teacherTotalPreguntasNivelMaestro(b.levelKey),
          tiempoPromedio: 0
        };
      }
      alumno.nivelesMaestro[b.levelKey].tiempoPromedio = avg;
    } else {
      var parts = b.levelKey.split(":");
      var temasModo = teacherAsegurarTemasModo(alumno);
      temasModo[parts[0]][parts[1]].tiempoPromedio = avg;
    }
  });

  Object.keys(map).forEach(function (k) {
    teacherRecalcularTiempoPromedioAlumno(map[k], esPracticas);
  });
}

// tema_id de la BD → t1, t2, t3 o t4 para la interfaz.
function teacherTemaUiDesdePartida(partida) {
  if (partida.nivel && partida.nivel.tema_id) {
    return TEACHER_TEMA_DB_A_UI[partida.nivel.tema_id] || null;
  }
  return null;
}

// Partidas de temas fijos: puntaje por tema y modo (básico / avanzado).
function teacherAplicarTemasModoDesdePartidas(map, partidas) {
  if (!partidas || !partidas.length) {
    return;
  }
  for (var i = 0; i < partidas.length; i++) {
    var p = partidas[i];
    if (p.nivel_maestro_id) {
      continue;
    }
    var key = String(p.alumno_id);
    if (!map[key]) {
      continue;
    }
    var tid = teacherTemaUiDesdePartida(p);
    if (!tid) {
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
    var modoKey = teacherModoKeyDesdePartida(p);
    var temasModo = teacherAsegurarTemasModo(map[key]);
    var slot = temasModo[tid][modoKey];
    var enCurso = estado === "EN_CURSO";
    var pts = teacherPtsTemaDesdePartida(p, enCurso);
    if (enCurso) {
      slot.pts = pts;
      slot.enCurso = true;
    } else if (!slot.enCurso && pts > slot.pts) {
      slot.pts = pts;
    }
  }
}

// Si el progreso acumulado marca un modo completado, asegura al menos 10/10.
function teacherAplicarProgresoModoCompletado(map, filas) {
  if (!filas || !filas.length) {
    return;
  }
  for (var p = 0; p < filas.length; p++) {
    var pr = filas[p];
    var key = String(pr.alumno_id);
    if (!map[key] || pr.nivel_maestro_id) {
      continue;
    }
    var tid = TEACHER_TEMA_DB_A_UI[pr.tema_id];
    if (!tid) {
      continue;
    }
    var temasModo = teacherAsegurarTemasModo(map[key]);
    var facil = temasModo[tid].facil;
    var dificil = temasModo[tid].dificil;
    if (pr.facil_completado && !facil.enCurso) {
      facil.pts = Math.max(facil.pts, 10);
    }
    if (pr.dificil_completado && !dificil.enCurso) {
      dificil.pts = Math.max(dificil.pts, 10);
    }
  }
}

// Mezcla partidas en el mapa de alumnos: puntajes por tema y tiempo medio.
function teacherAplicarMetricasDesdePartidas(map, partidas) {
  if (!partidas || !partidas.length) {
    return;
  }
  var tiemposPorAlumno = {};

  for (var i = 0; i < partidas.length; i++) {
    var p = partidas[i];
    var key = String(p.alumno_id);
    if (!map[key]) {
      continue;
    }
    var tid = teacherTemaUiDesdePartida(p);
    if (!tid) {
      continue;
    }
    var pts = teacherPuntajeDesdePartida(p);
    var enCurso = String(p.estado || "").toUpperCase() === "EN_CURSO";
    if (!map[key].temasEnCurso) {
      map[key].temasEnCurso = teacherTemasEnCursoVacios();
    }
    if (enCurso) {
      if (!map[key].temasEnCurso[tid]) {
        map[key].temasEnCurso[tid] = true;
        map[key].temas[tid] = pts;
      }
    } else if (!map[key].temasEnCurso[tid]) {
      if ((map[key].temas[tid] || 0) < pts) {
        map[key].temas[tid] = pts;
      }
    }
    var tPart = teacherTiempoPromedioPartida(p);
    if (tPart > 0) {
      if (!tiemposPorAlumno[key]) {
        tiemposPorAlumno[key] = [];
      }
      tiemposPorAlumno[key].push(tPart);
    }
  }

  Object.keys(tiemposPorAlumno).forEach(function (k) {
    var arr = tiemposPorAlumno[k];
    var sum = 0;
    for (var j = 0; j < arr.length; j++) {
      sum += arr[j];
    }
    map[k].tiempoPromedio = Math.round(sum / arr.length);
  });
}

// Texto corto del estado: Completado, Sin vidas, En curso…
function teacherEtiquetaEstadoPartida(estado) {
  var e = String(estado || "").toUpperCase();
  if (e === "COMPLETADA") {
    return "Completado";
  }
  if (e === "GAME_OVER") {
    return "Sin vidas";
  }
  if (e === "ABANDONADA") {
    return "Abandonado";
  }
  if (e === "EN_CURSO") {
    return "En curso";
  }
  return estado || "—";
}

// Lo que dice la barra de progreso del nivel según cómo quedó la partida.
function teacherEtiquetaBarraNivel(estado) {
  var e = String(estado || "").toUpperCase();
  if (e === "COMPLETADA") {
    return "Nivel completado";
  }
  if (e === "EN_CURSO") {
    return "Nivel en curso";
  }
  if (e === "GAME_OVER") {
    return "Sin vidas";
  }
  if (e === "ABANDONADA") {
    return "Nivel abandonado";
  }
  return "Progreso del nivel";
}

// FACIL o DIFICIL leído de la partida (o del módulo compartido).
function teacherPartidaModoDb(partida) {
  if (typeof partidaModoDesdePartida === "function") {
    return partidaModoDesdePartida(partida);
  }
  return "FACIL";
}

// Atajo: ¿va en modo avanzado?
function teacherPartidaEsDificil(partida) {
  return teacherPartidaModoDb(partida) === "DIFICIL";
}

// Nombre del nivel para mostrar (maestro, básico, avanzado…).
function teacherNivelDesdePartida(partida) {
  if (partida.nivel_maestro_id && partida.nivel_maestro) {
    return partida.nivel_maestro.titulo || "Nivel del maestro";
  }
  var esDificil = teacherPartidaEsDificil(partida);
  if (partida.nivel && partida.nivel.nombre) {
    return partida.nivel.nombre;
  }
  return esDificil ? "Nivel avanzado" : "Nivel básico";
}

// Un intento listo para la UI a partir de una fila de partida.
function teacherIntentoDesdePartida(partida) {
  var pa = teacherPorcentajeAciertosDesdePartida(partida);
  var nc = teacherNivelCompletoDesdePartida(partida);
  return {
    id: partida.id,
    fecha: partida.iniciado_en || partida.terminado_en,
    estado: partida.estado,
    estadoLabel: teacherEtiquetaEstadoPartida(partida.estado),
    porcentajeAciertos: pa.pct,
    aciertos: pa.ok,
    total: pa.total,
    nivelCompletoOk: nc.ok,
    nivelCompletoTotal: nc.total,
    nivelCompletoPct: nc.pct,
    vidasRestantes: partida.vidas_restantes,
    indicePregunta: partida.indice_pregunta,
    nivel: teacherNivelDesdePartida(partida),
    modo: teacherPartidaModoDb(partida),
    temaActivo: partida.nivel_maestro_id
      ? null
      : teacherTemaUiDesdePartida(partida) || "t1",
    nivelMaestroId: partida.nivel_maestro_id
      ? String(partida.nivel_maestro_id)
      : null,
    tareas: teacherTareasDesdeActividad(partida.actividad, partida)
  };
}

// Filtra intentos de prácticas creadas por el maestro.
function teacherIntentosPorNivelMaestro(intentos, nivelId) {
  if (!Array.isArray(intentos) || nivelId == null) {
    return [];
  }
  return intentos.filter(function (it) {
    return String(it.nivelMaestroId) === String(nivelId);
  });
}

// Primer nivel del maestro con al menos un intento en el detalle.
function teacherPrimerNivelConIntentos(detalle, columnas) {
  var intentos = detalle && detalle.intentos ? detalle.intentos : [];
  var cols = columnas || teacherColumnasNivelesMaestro();
  for (var i = 0; i < cols.length; i++) {
    if (teacherIntentosPorNivelMaestro(intentos, cols[i].id).length) {
      return cols[i].id;
    }
  }
  return cols.length ? cols[0].id : null;
}

// Intentos de un nivel del maestro; respeta el intento seleccionado.
function teacherIntentoSeleccionadoNivel(detalle, nivelId, intentoId) {
  var lista = teacherIntentosPorNivelMaestro(
    detalle && detalle.intentos ? detalle.intentos : [],
    nivelId
  );
  if (!lista.length) {
    return null;
  }
  if (intentoId != null) {
    for (var i = 0; i < lista.length; i++) {
      if (String(lista[i].id) === String(intentoId)) {
        return lista[i];
      }
    }
  }
  return lista[0];
}

// Filtra intentos por tema y, si quieres, por modo.
function teacherIntentosPorTema(intentos, temaId, modoId) {
  if (!Array.isArray(intentos)) {
    return [];
  }
  var modoFiltro = modoId ? String(modoId).toUpperCase() : "";
  return intentos.filter(function (it) {
    if (it.nivelMaestroId) {
      return false;
    }
    if (it.temaActivo !== temaId) {
      return false;
    }
    if (modoFiltro && String(it.modo || "FACIL").toUpperCase() !== modoFiltro) {
      return false;
    }
    return true;
  });
}

// El primer modo (fácil/difícil) que tenga intentos en ese tema.
function teacherPrimerModoConIntentos(detalle, temaId) {
  var intentos = detalle && detalle.intentos ? detalle.intentos : [];
  for (var i = 0; i < intentos.length; i++) {
    if (intentos[i].nivelMaestroId) {
      continue;
    }
    if (intentos[i].temaActivo === temaId) {
      return String(intentos[i].modo || "FACIL").toUpperCase();
    }
  }
  return "FACIL";
}

// Primer tema con al menos un intento en el detalle.
function teacherPrimerTemaConIntentos(detalle) {
  var intentos = detalle && detalle.intentos ? detalle.intentos : [];
  for (var i = 0; i < TEACHER_TEMAS.length; i++) {
    var tid = TEACHER_TEMAS[i].id;
    if (teacherIntentosPorTema(intentos, tid, null).length) {
      return tid;
    }
  }
  return "t1";
}

// El intento que está seleccionado en el panel (o el más reciente).
function teacherIntentoSeleccionado(detalle, temaId, intentoId, modoId) {
  var lista = teacherIntentosPorTema(
    detalle && detalle.intentos ? detalle.intentos : [],
    temaId,
    modoId
  );
  if (!lista.length) {
    return null;
  }
  if (intentoId != null) {
    for (var i = 0; i < lista.length; i++) {
      if (String(lista[i].id) === String(intentoId)) {
        return lista[i];
      }
    }
  }
  return lista[0];
}

// Una pregunta del desglose con campos ya normalizados.
function teacherTareaDesdeItemActividad(a, idx) {
  var entry = a || {};
  var indice = entry.indice != null ? entry.indice : idx;
  return {
    indice: indice,
    ok: !!entry.ok,
    errores: Number(entry.errores) || 0,
    omitida: !!entry.omitida,
    contestada: entry.contestada !== false,
    enCurso: !!entry.enCurso,
    tiempo: Number(entry.tiempo) || 0,
    texto: entry.texto || "Pregunta " + (indice + 1)
  };
}

// Lista de preguntas para el panel; en partida activa rellena los huecos.
function teacherTareasDesdeActividad(actRaw, partida) {
  var parsed = teacherParsearActividadPartida(actRaw);
  var items = parsed.items;
  var estado = partida ? String(partida.estado || "").toUpperCase() : "";
  var enPartida = estado === "EN_CURSO";

  var porIndice = {};
  for (var i = 0; i < items.length; i++) {
    var a = items[i] || {};
    var idx = a.indice != null ? a.indice : i;
    porIndice[idx] = a;
  }

  var total = teacherTotalPreguntasPartida(partida, actRaw);

  if (enPartida && total > 0) {
    var tareas = [];
    var textos = {};
    for (var p = 0; p < parsed.preguntas.length; p++) {
      var snap = parsed.preguntas[p];
      if (snap && snap.texto) {
        textos[p] = snap.texto;
      }
    }
    for (var j = 0; j < total; j++) {
      if (porIndice[j]) {
        tareas.push(teacherTareaDesdeItemActividad(porIndice[j], j));
      } else {
        tareas.push({
          indice: j,
          ok: false,
          errores: 0,
          omitida: false,
          contestada: false,
          enCurso: true,
          tiempo: 0,
          texto: textos[j] || "Pregunta " + (j + 1)
        });
      }
    }
    tareas.sort(function (x, y) {
      return x.indice - y.indice;
    });
    return tareas;
  }

  var tareasLegacy = [];
  for (var k = 0; k < items.length; k++) {
    tareasLegacy.push(teacherTareaDesdeItemActividad(items[k], k));
  }
  tareasLegacy.sort(function (x, y) {
    return x.indice - y.indice;
  });
  return tareasLegacy;
}

// Detalle de un alumno armado desde una sola partida.
function teacherDetalleDesdePartida(partida) {
  var det = teacherDetalleVacio();
  if (!partida) {
    return det;
  }

  var tid = teacherTemaUiDesdePartida(partida) || "t1";
  var pa = teacherPorcentajeAciertosDesdePartida(partida);
  var nc = teacherNivelCompletoDesdePartida(partida);
  det.temaActivo = tid;
  det.porcentajeAciertos = pa.pct;
  det.nivelCompletoOk = nc.ok;
  det.nivelCompletoTotal = nc.total;
  det.nivelCompletoPct = nc.pct;
  det.progresoNivel = nc.pct;
  det.maxNivel = 100;
  det.nivel = teacherNivelDesdePartida(partida);
  det.tareas = teacherTareasDesdeActividad(partida.actividad, partida);
  det.intentos = [teacherIntentoDesdePartida(partida)];
  return det;
}

// Igual que arriba pero con varios intentos (historial reciente).
function teacherDetalleDesdePartidas(partidas) {
  if (!partidas || !partidas.length) {
    return teacherDetalleVacio();
  }
  var det = teacherDetalleDesdePartida(partidas[0]);
  det.intentos = [];
  for (var i = 0; i < partidas.length; i++) {
    det.intentos.push(teacherIntentoDesdePartida(partidas[i]));
  }
  return det;
}

// Aplica puntajes desde la tabla progreso acumulado (temas fijos).
function teacherAplicarProgresoAcumulado(map, filas) {
  if (!filas || !filas.length) {
    return;
  }
  for (var p = 0; p < filas.length; p++) {
    var pr = filas[p];
    var key = String(pr.alumno_id);
    if (!map[key] || pr.nivel_maestro_id) {
      continue;
    }
  }
}

// Copia del cache en memoria (no pega a Supabase otra vez).
function teacherListarAlumnos() {
  return _teacherAlumnosCache.slice();
}

function teacherColumnasNivelesMaestro() {
  return _teacherColumnasNiveles.slice();
}

function teacherNivelesMaestroCargados() {
  return _teacherNivelesMaestroCargados;
}

function teacherListarAlumnosNivelesMaestro() {
  return _teacherAlumnosNivelesCache.slice();
}

function teacherTituloCortoNivel(titulo, max) {
  max = max || 14;
  titulo = String(titulo || "Nivel").trim();
  if (titulo.length <= max) {
    return titulo;
  }
  return titulo.slice(0, max - 1) + "…";
}

function teacherNivelesMaestroVacios() {
  var o = {};
  for (var i = 0; i < _teacherColumnasNiveles.length; i++) {
    var col = _teacherColumnasNiveles[i];
    o[col.id] = {
      ok: 0,
      total: col.totalPreguntas || 0,
      tiempoPromedio: 0
    };
  }
  return o;
}

function teacherTotalPreguntasNivelMaestro(nivelId) {
  for (var i = 0; i < _teacherColumnasNiveles.length; i++) {
    if (String(_teacherColumnasNiveles[i].id) === String(nivelId)) {
      return _teacherColumnasNiveles[i].totalPreguntas || 0;
    }
  }
  return 0;
}

// Aciertos y total de preguntas de una práctica para la tabla del panel.
function teacherNivelMaestroCelda(alumno, col) {
  var totalCol = col && col.totalPreguntas ? col.totalPreguntas : 0;
  var raw =
    alumno && alumno.nivelesMaestro && col
      ? alumno.nivelesMaestro[col.id]
      : null;
  if (raw && typeof raw === "object") {
    return {
      ok: raw.ok || 0,
      total: raw.total || totalCol,
      tiempoPromedio: raw.tiempoPromedio || 0
    };
  }
  return { ok: 0, total: totalCol, tiempoPromedio: 0 };
}

function teacherNombreNivelMaestro(id) {
  for (var i = 0; i < _teacherColumnasNiveles.length; i++) {
    if (String(_teacherColumnasNiveles[i].id) === String(id)) {
      return _teacherColumnasNiveles[i];
    }
  }
  return {
    id: id,
    titulo: "Nivel",
    corto: "Nivel",
    totalPreguntas: 0
  };
}

// Alumnos del grupo elegido, o todos si es "grupo-todos".
function teacherAlumnosEnGrupo(grupoId) {
  var todos = teacherListarAlumnos();
  if (!grupoId || grupoId === "grupo-todos") {
    return todos;
  }
  return todos.filter(function (a) {
    return (a.grupos || []).indexOf(grupoId) >= 0;
  });
}

function teacherAlumnosNivelesEnGrupo(grupoId) {
  var todos = teacherListarAlumnosNivelesMaestro();
  if (!grupoId || grupoId === "grupo-todos") {
    return todos;
  }
  return todos.filter(function (a) {
    return (a.grupos || []).indexOf(grupoId) >= 0;
  });
}

// Supabase a veces manda el avatar como objeto y a veces como array.
function teacherAvatarDesdeAlumno(alumno) {
  if (!alumno || !alumno.avatar) {
    return null;
  }
  return Array.isArray(alumno.avatar) ? alumno.avatar[0] : alumno.avatar;
}

// Actualiza el outfit del pato solo si el avatar es más nuevo.
function teacherAplicarOutfitAlumno(alumnoObj, avatarRow) {
  if (!alumnoObj || !avatarRow || typeof duckOutfitDesdeDbRow !== "function") {
    return;
  }
  var nuevoTs = avatarRow.actualizado_en
    ? new Date(avatarRow.actualizado_en).getTime()
    : 0;
  var viejoTs = alumnoObj.avatarVersion
    ? new Date(alumnoObj.avatarVersion).getTime()
    : 0;
  if (viejoTs && nuevoTs && nuevoTs <= viejoTs && alumnoObj.outfit) {
    return;
  }
  alumnoObj.outfit = duckOutfitDesdeDbRow(avatarRow);
  if (avatarRow.actualizado_en) {
    alumnoObj.avatarVersion = avatarRow.actualizado_en;
  }
}

// Crea o actualiza un alumno en el mapa desde un link alumno_grupo.
function teacherMapAlumnoDesdeLinks(map, row) {
  if (!row || !row.alumno || !row.alumno.usuario) {
    return;
  }
  var aid = String(row.alumno.id);
  var u = row.alumno.usuario;
  var nombre =
    [u.nombre, u.apellido].filter(Boolean).join(" ").trim() ||
    u.email ||
    "Alumno";

  if (!map[aid]) {
    map[aid] = {
      id: aid,
      dbId: row.alumno.id,
      nombre: nombre,
      email: u.email || "",
      outfit:
        typeof duckOutfitPorDefecto === "function"
          ? duckOutfitPorDefecto()
          : { base: "MAIN DUCK.png", face: "", head: "", neck: "", shoes: "" },
      grupos: [],
      temas: teacherTemasVacios(),
      temasModo: teacherTemasModoVacios(),
      temasEnCurso: teacherTemasEnCursoVacios(),
      tiempoPromedio: 0,
      detalle: teacherDetalleVacio()
    };
  }

  teacherAplicarOutfitAlumno(map[aid], teacherAvatarDesdeAlumno(row.alumno));

  if (row.grupo && !row.grupo.es_sistema) {
    var gid = String(row.grupo.id);
    if (map[aid].grupos.indexOf(gid) < 0) {
      map[aid].grupos.push(gid);
    }
  }
}

function teacherAplicarProgresoNivelesMaestro(map, filas) {
  if (!filas || !filas.length) {
    return;
  }
  for (var p = 0; p < filas.length; p++) {
    var pr = filas[p];
    var key = String(pr.alumno_id);
    if (!map[key] || !pr.nivel_maestro_id || pr.tema_id) {
      continue;
    }
    var nid = String(pr.nivel_maestro_id);
    var totalCol = teacherTotalPreguntasNivelMaestro(nid);
    map[key].nivelesMaestro[nid] = {
      ok: pr.preguntas_ok != null ? pr.preguntas_ok : 0,
      total: pr.preguntas_total || totalCol || 0,
      tiempoPromedio:
        map[key].nivelesMaestro[nid] &&
        map[key].nivelesMaestro[nid].tiempoPromedio
          ? map[key].nivelesMaestro[nid].tiempoPromedio
          : 0
    };
  }
}

// Carga principal: links, avatares y progreso acumulado por alumno.
async function teacherCargarAlumnos() {
  _teacherAlumnosCache = [];
  _teacherUltimoErrorCarga = null;

  if (typeof initSupabase !== "function") {
    _teacherUltimoErrorCarga = "Supabase no disponible.";
    return [];
  }

  try {

  var sb = await initSupabase();
  if (!sb || typeof authCargarPerfil !== "function") {
    return [];
  }

  var perfil = null;
  try {
    perfil = await authCargarPerfil();
  } catch (e) {
    return [];
  }

  if (!perfil || perfil.rol !== "MAESTRO") {
    _teacherUltimoErrorCarga = "Sesión no válida como maestro.";
    return [];
  }

  var linksRes = await sb.from("alumno_grupo").select(
    "grupo_id, alumno:alumno_id ( id, usuario:usuario_id ( nombre, apellido, email ), avatar ( item_base_id, item_face_id, item_head_id, item_neck_id, item_shoes_id, actualizado_en ) ), grupo:grupo_id ( id, es_sistema )"
  );
  if (linksRes.error) {
    linksRes = await sb.from("alumno_grupo").select(
      "grupo_id, alumno:alumno_id ( id, usuario:usuario_id ( nombre, apellido, email ) ), grupo:grupo_id ( id, es_sistema )"
    );
    if (linksRes.error) {
      _teacherUltimoErrorCarga = linksRes.error.message;
      return [];
    }
  }

  var map = {};
  var rows = linksRes.data || [];
  for (var i = 0; i < rows.length; i++) {
    teacherMapAlumnoDesdeLinks(map, rows[i]);
  }

  var ids = Object.keys(map)
    .map(function (k) {
      return parseInt(k, 10);
    })
    .filter(function (n) {
      return !isNaN(n);
    });

  if (ids.length) {
    var avRes = await sb
      .from("avatar")
      .select(
        "alumno_id, item_base_id, item_face_id, item_head_id, item_neck_id, item_shoes_id, actualizado_en"
      )
      .in("alumno_id", ids);
    if (!avRes.error && avRes.data) {
      for (var a = 0; a < avRes.data.length; a++) {
        var av = avRes.data[a];
        var avKey = String(av.alumno_id);
        if (map[avKey]) {
          teacherAplicarOutfitAlumno(map[avKey], av);
        }
      }
    } else if (avRes.error) {
      console.warn("[teacher] No se pudieron cargar avatares:", avRes.error.message);
    }

    var progRes = await sb
      .from("progreso")
      .select(
        "alumno_id, tema_id, nivel_maestro_id, facil_completado, dificil_completado, puntaje, tiempo_promedio_seg, preguntas_ok, preguntas_total"
      )
      .in("alumno_id", ids)
      .not("tema_id", "is", null)
      .is("nivel_maestro_id", null);
    if (!progRes.error && progRes.data) {
      teacherAplicarProgresoAcumulado(map, progRes.data);
    }

    var partRes = await sb
      .from("partida")
      .select(
        "alumno_id, estado, modo, actividad, preguntas_total, nivel_maestro_id, nivel:nivel_id ( tema_id, codigo, nombre )"
      )
      .in("alumno_id", ids)
      .in("estado", ["EN_CURSO", "COMPLETADA", "GAME_OVER"])
      .is("nivel_maestro_id", null)
      .order("iniciado_en", { ascending: false });
    if (!partRes.error && partRes.data && partRes.data.length) {
      teacherAplicarTemasModoDesdePartidas(map, partRes.data);
      teacherAplicarTiemposHistoricosDesdePartidas(map, partRes.data, false);
    } else if (partRes.error) {
      console.warn("[teacher] partidas temas fijos:", partRes.error.message);
    }

    if (!progRes.error && progRes.data) {
      teacherAplicarProgresoModoCompletado(map, progRes.data);
    }
    teacherSincronizarTemasLegacy(map);
  }

  _teacherAlumnosCache = Object.keys(map).map(function (k) {
    return map[k];
  });
  return _teacherAlumnosCache;
  } catch (e) {
    _teacherUltimoErrorCarga = e.message || String(e);
    console.warn("[teacher] cargar alumnos:", e);
    return [];
  }
}

// Partidas recientes de un alumno para la vista de detalle.
async function teacherCargarDetalleAlumno(alumnoDbId) {
  if (!alumnoDbId) {
    return teacherDetalleVacio();
  }
  var sb = await initSupabase();
  if (!sb) {
    return teacherDetalleVacio();
  }

  var q = sb
    .from("partida")
    .select(
      "id, alumno_id, modo, estado, indice_pregunta, preguntas_total, vidas_restantes, actividad, iniciado_en, terminado_en, nivel_maestro_id, nivel:nivel_id ( tema_id, codigo, nombre ), nivel_maestro:nivel_maestro_id ( titulo )"
    )
    .eq("alumno_id", alumnoDbId)
    .is("nivel_maestro_id", null)
    .order("iniciado_en", { ascending: false })
    .limit(20);

  var res = await q;
  if (res.error || !res.data || !res.data.length) {
    return teacherDetalleVacio();
  }
  return teacherDetalleDesdePartidas(res.data);
}

// Alumnos y progreso en prácticas creadas por el maestro.
async function teacherCargarAlumnosNivelesMaestro() {
  _teacherAlumnosNivelesCache = [];
  _teacherColumnasNiveles = [];
  _teacherNivelesMaestroCargados = false;

  if (typeof initSupabase !== "function") {
    return [];
  }

  try {
    var sb = await initSupabase();
    if (!sb || typeof authCargarPerfil !== "function") {
      return [];
    }

    var perfil = null;
    try {
      perfil = await authCargarPerfil();
    } catch (e) {
      return [];
    }

    if (!perfil || perfil.rol !== "MAESTRO") {
      return [];
    }

    var nmRes = await sb
      .from("nivel_maestro")
      .select("id, titulo, pregunta_maestro ( id, activa )")
      .eq("activo", true)
      .order("creado_en", { ascending: true });
    if (nmRes.error) {
      console.warn("[teacher] niveles maestro:", nmRes.error.message);
    }

    var nivelIds = [];
    var niveles = nmRes.data || [];
    for (var n = 0; n < niveles.length; n++) {
      var nv = niveles[n];
      var nid = String(nv.id);
      var pms = nv.pregunta_maestro || [];
      var totalPreg = 0;
      for (var q = 0; q < pms.length; q++) {
        if (pms[q].activa !== false) {
          totalPreg++;
        }
      }
      nivelIds.push(nv.id);
      _teacherColumnasNiveles.push({
        id: nid,
        titulo: nv.titulo || "Sin título",
        corto: teacherTituloCortoNivel(nv.titulo),
        totalPreguntas: totalPreg
      });
    }

    var linksRes = await sb.from("alumno_grupo").select(
      "grupo_id, alumno:alumno_id ( id, usuario:usuario_id ( nombre, apellido, email ), avatar ( item_base_id, item_face_id, item_head_id, item_neck_id, item_shoes_id, actualizado_en ) ), grupo:grupo_id ( id, es_sistema )"
    );
    if (linksRes.error) {
      linksRes = await sb.from("alumno_grupo").select(
        "grupo_id, alumno:alumno_id ( id, usuario:usuario_id ( nombre, apellido, email ) ), grupo:grupo_id ( id, es_sistema )"
      );
      if (linksRes.error) {
        return [];
      }
    }

    var map = {};
    var rows = linksRes.data || [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (!row || !row.alumno || !row.alumno.usuario) {
        continue;
      }
      teacherMapAlumnoDesdeLinks(map, row);
      var aid = String(row.alumno.id);
      if (map[aid]) {
        map[aid].nivelesMaestro = teacherNivelesMaestroVacios();
        map[aid].tiempoPromedio = 0;
      }
    }

    var ids = Object.keys(map)
      .map(function (k) {
        return parseInt(k, 10);
      })
      .filter(function (num) {
        return !isNaN(num);
      });

    if (ids.length && nivelIds.length) {
      var avRes = await sb
        .from("avatar")
        .select(
          "alumno_id, item_base_id, item_face_id, item_head_id, item_neck_id, item_shoes_id, actualizado_en"
        )
        .in("alumno_id", ids);
      if (!avRes.error && avRes.data) {
        for (var a = 0; a < avRes.data.length; a++) {
          var av = avRes.data[a];
          var avKey = String(av.alumno_id);
          if (map[avKey]) {
            teacherAplicarOutfitAlumno(map[avKey], av);
          }
        }
      }

      var progRes = await sb
        .from("progreso")
        .select(
          "alumno_id, tema_id, nivel_maestro_id, puntaje, tiempo_promedio_seg, preguntas_ok, preguntas_total"
        )
        .in("alumno_id", ids)
        .in("nivel_maestro_id", nivelIds)
        .is("tema_id", null)
        .not("nivel_maestro_id", "is", null);
      if (!progRes.error && progRes.data) {
        teacherAplicarProgresoNivelesMaestro(map, progRes.data);
      }

      var partPractRes = await sb
        .from("partida")
        .select("alumno_id, estado, actividad, nivel_maestro_id")
        .in("alumno_id", ids)
        .in("nivel_maestro_id", nivelIds)
        .in("estado", ["EN_CURSO", "COMPLETADA", "GAME_OVER"]);
      if (!partPractRes.error && partPractRes.data && partPractRes.data.length) {
        teacherAplicarTiemposHistoricosDesdePartidas(
          map,
          partPractRes.data,
          true
        );
      } else if (partPractRes.error) {
        console.warn(
          "[teacher] partidas prácticas:",
          partPractRes.error.message
        );
      }
    }

    _teacherAlumnosNivelesCache = Object.keys(map).map(function (k) {
      return map[k];
    });
    _teacherNivelesMaestroCargados = true;
    return _teacherAlumnosNivelesCache;
  } catch (e) {
    console.warn("[teacher] cargar niveles maestro:", e);
    return [];
  }
}

// Partidas recientes de un alumno en prácticas del maestro.
async function teacherCargarDetalleAlumnoNivelesMaestro(alumnoDbId) {
  if (!alumnoDbId) {
    return teacherDetalleVacio();
  }
  var sb = await initSupabase();
  if (!sb) {
    return teacherDetalleVacio();
  }

  var res = await sb
    .from("partida")
    .select(
      "id, alumno_id, modo, estado, indice_pregunta, preguntas_total, vidas_restantes, actividad, iniciado_en, terminado_en, nivel_maestro_id, nivel:nivel_id ( tema_id, codigo, nombre ), nivel_maestro:nivel_maestro_id ( titulo )"
    )
    .eq("alumno_id", alumnoDbId)
    .not("nivel_maestro_id", "is", null)
    .order("iniciado_en", { ascending: false })
    .limit(20);

  if (res.error || !res.data || !res.data.length) {
    return teacherDetalleVacio();
  }
  return teacherDetalleDesdePartidas(res.data);
}

// Valida que nadie quede sin grupo al desmarcarlo en este grupo.
function teacherValidarAsignacionGrupo(grupoId, alumnosMarcados) {
  var marcados = {};
  for (var m = 0; m < alumnosMarcados.length; m++) {
    marcados[String(alumnosMarcados[m])] = true;
  }
  var alumnos = teacherListarAlumnos();
  for (var j = 0; j < alumnos.length; j++) {
    var a = alumnos[j];
    var enEsteGrupo = (a.grupos || []).indexOf(grupoId) >= 0;
    if (!enEsteGrupo || marcados[String(a.id)]) {
      continue;
    }
    var otros = (a.grupos || []).filter(function (g) {
      return g !== grupoId && g !== "grupo-todos";
    });
    if (!otros.length) {
      throw new Error(
        "No puedes dejar a «" +
          (a.nombre || "el alumno") +
          "» sin grupo. Asígnalo primero a otro grupo."
      );
    }
  }
}

// Guarda qué alumnos van en el grupo vía RPC y recarga la lista.
async function teacherGuardarAsignacionGrupo(grupoId, alumnosMarcados) {
  if (!grupoId || grupoId === "grupo-todos") {
    return;
  }

  var sb = await initSupabase();
  if (!sb) {
    return;
  }

  var perfil = await authCargarPerfil();
  if (!perfil || perfil.rol !== "MAESTRO") {
    return;
  }

  var grupos = teacherLeerGrupos();
  var grupo = null;
  for (var i = 0; i < grupos.length; i++) {
    if (grupos[i].id === grupoId) {
      grupo = grupos[i];
      break;
    }
  }
  if (!grupo || grupo.sistema || !grupo.dbId) {
    return;
  }

  teacherValidarAsignacionGrupo(grupoId, alumnosMarcados);

  var marcados = {};
  for (var m = 0; m < alumnosMarcados.length; m++) {
    marcados[String(alumnosMarcados[m])] = true;
  }

  var idsRpc = [];
  var alumnos = teacherListarAlumnos();
  for (var j = 0; j < alumnos.length; j++) {
    var a = alumnos[j];
    if (!marcados[String(a.id)]) {
      continue;
    }
    var dbAlumnoId = a.dbId || parseInt(a.id, 10);
    if (dbAlumnoId && !isNaN(dbAlumnoId)) {
      idsRpc.push(dbAlumnoId);
    }
  }

  var syncRes = await sb.rpc("sincronizar_alumnos_grupo", {
    p_grupo_id: grupo.dbId,
    p_alumno_ids: idsRpc
  });
  if (syncRes.error) {
    throw new Error(syncRes.error.message);
  }

  await teacherCargarAlumnos();
  if (_teacherNivelesMaestroCargados) {
    await teacherCargarAlumnosNivelesMaestro();
  }
}

// Verde, naranja o rojo según qué tan cerca está del máximo (10).
function teacherColorBarra(puntos, max) {
  max = max || 10;
  var r = puntos / max;
  if (r >= 0.7) return "bar-green";
  if (r >= 0.4) return "bar-orange";
  return "bar-red";
}

// Nombre largo y etiqueta corta de un tema por su id.
function teacherNombreTema(id) {
  for (var i = 0; i < TEACHER_TEMAS.length; i++) {
    if (TEACHER_TEMAS[i].id === id) {
      return TEACHER_TEMAS[i];
    }
  }
  return { nombre: id, corto: id };
}
