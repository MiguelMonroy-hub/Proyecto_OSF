// Datos del panel del maestro: alumnos, partidas, métricas y grupos (Supabase).
var _teacherAlumnosCache = [];
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

// "today", "week" o "month" → fecha ISO para filtrar partidas.
function teacherDesdePeriodo(periodo) {
  var ahora = new Date();
  var desde = new Date(ahora);
  if (periodo === "today") {
    desde.setHours(0, 0, 0, 0);
  } else if (periodo === "week") {
    desde.setDate(desde.getDate() - 7);
  } else if (periodo === "month") {
    desde.setDate(desde.getDate() - 30);
  } else {
    return null;
  }
  return desde.toISOString();
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

// tema_id de la BD → t1, t2, t3 o t4 para la interfaz.
function teacherTemaUiDesdePartida(partida) {
  if (partida.nivel && partida.nivel.tema_id) {
    return TEACHER_TEMA_DB_A_UI[partida.nivel.tema_id] || null;
  }
  return null;
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

// Máximos en cero por tema y modo, para armar el export.
function teacherMaximosHistorialVacios() {
  var out = {};
  for (var i = 0; i < TEACHER_TEMAS.length; i++) {
    out[TEACHER_TEMAS[i].id] = { FACIL: 0, DIFICIL: 0 };
  }
  return out;
}

// Rellena el mejor puntaje histórico (básico/avanzado) por alumno y tema.
function teacherAplicarMaximosHistorialDesdePartidas(map, partidas) {
  if (!partidas || !partidas.length) {
    return;
  }
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
    var modo = teacherPartidaModoDb(p);
    var pts = teacherPuntajeDesdePartida(p);
    if (pts > (map[key].maximos[tid][modo] || 0)) {
      map[key].maximos[tid][modo] = pts;
    }
    var tPart = teacherTiempoPromedioPartida(p);
    if (tPart > 0) {
      if (!map[key]._tiempos) {
        map[key]._tiempos = [];
      }
      map[key]._tiempos.push(tPart);
    }
  }

  Object.keys(map).forEach(function (k) {
    var arr = map[k]._tiempos || [];
    if (arr.length) {
      var sum = 0;
      for (var j = 0; j < arr.length; j++) {
        sum += arr[j];
      }
      map[k].tiempoPromedio = Math.round(sum / arr.length);
    }
    delete map[k]._tiempos;
  });
}

// Pide a Supabase los datos que necesita el Excel de historial.
async function teacherCargarExportacionHistorial(alumnoIds) {
  var vacio = { porAlumno: {} };
  if (!alumnoIds || !alumnoIds.length) {
    return vacio;
  }
  if (typeof initSupabase !== "function") {
    return vacio;
  }

  var sb = await initSupabase();
  if (!sb) {
    return vacio;
  }

  var ids = alumnoIds
    .map(function (id) {
      return parseInt(id, 10);
    })
    .filter(function (n) {
      return !isNaN(n);
    });
  if (!ids.length) {
    return vacio;
  }

  var map = {};
  for (var i = 0; i < ids.length; i++) {
    map[String(ids[i])] = {
      maximos: teacherMaximosHistorialVacios(),
      tiempoPromedio: 0
    };
  }

  var partRes = await sb
    .from("partida")
    .select(
      "alumno_id, modo, estado, indice_pregunta, preguntas_total, actividad, nivel:nivel_id ( tema_id, codigo )"
    )
    .in("alumno_id", ids);

  if (partRes.error) {
    console.warn("[teacher] export historial:", partRes.error.message);
    return { porAlumno: map };
  }

  teacherAplicarMaximosHistorialDesdePartidas(map, partRes.data || []);
  return { porAlumno: map };
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
  if (partida.nivel) {
    return (
      (esDificil ? "Avanzado" : "Básico") +
      " · " +
      (partida.nivel.nombre || "Nivel")
    );
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
    temaActivo: teacherTemaUiDesdePartida(partida) || "t1",
    tareas: teacherTareasDesdeActividad(partida.actividad, partida)
  };
}

// Filtra intentos por tema y, si quieres, por modo.
function teacherIntentosPorTema(intentos, temaId, modoId) {
  if (!Array.isArray(intentos)) {
    return [];
  }
  var modoFiltro = modoId ? String(modoId).toUpperCase() : "";
  return intentos.filter(function (it) {
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
    if (teacherIntentosPorTema(intentos, tid).length) {
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

// Cuando no hay filtro de periodo, usa la tabla progreso acumulado.
function teacherAplicarProgresoAcumulado(map, filas) {
  if (!filas || !filas.length) {
    return;
  }
  for (var p = 0; p < filas.length; p++) {
    var pr = filas[p];
    var key = String(pr.alumno_id);
    if (!map[key]) {
      continue;
    }
    var tid = TEACHER_TEMA_DB_A_UI[pr.tema_id];
    if (tid) {
      map[key].temas[tid] =
        pr.puntaje != null
          ? pr.puntaje
          : pr.preguntas_total
            ? Math.round((pr.preguntas_ok / pr.preguntas_total) * 10)
            : 0;
    }
  }

  Object.keys(map).forEach(function (k) {
    var tiempos = [];
    for (var t = 0; t < filas.length; t++) {
      if (
        String(filas[t].alumno_id) === k &&
        filas[t].tiempo_promedio_seg
      ) {
        tiempos.push(filas[t].tiempo_promedio_seg);
      }
    }
    if (tiempos.length) {
      var sum = 0;
      for (var x = 0; x < tiempos.length; x++) {
        sum += tiempos[x];
      }
      map[k].tiempoPromedio = Math.round(sum / tiempos.length);
    }
  });
}

// Copia del cache en memoria (no pega a Supabase otra vez).
function teacherListarAlumnos() {
  return _teacherAlumnosCache.slice();
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

// Carga principal: links, avatares y partidas o progreso según el periodo.
async function teacherCargarAlumnos(opciones) {
  _teacherAlumnosCache = [];
  _teacherUltimoErrorCarga = null;
  opciones = opciones || {};
  var periodo = opciones.periodo || "today";

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

    var desde = teacherDesdePeriodo(periodo);
    if (desde) {
      var partRes = await sb
        .from("partida")
        .select(
          "id, alumno_id, modo, estado, indice_pregunta, preguntas_total, vidas_restantes, actividad, iniciado_en, nivel_maestro_id, nivel:nivel_id ( tema_id, codigo, nombre ), nivel_maestro:nivel_maestro_id ( titulo )"
        )
        .in("alumno_id", ids)
        .gte("iniciado_en", desde)
        .order("iniciado_en", { ascending: false });
      if (partRes.error) {
        console.warn("[teacher] partidas:", partRes.error.message);
      } else {
        teacherAplicarMetricasDesdePartidas(map, partRes.data || []);
      }
    } else {
      var progRes = await sb
        .from("progreso")
        .select(
          "alumno_id, tema_id, puntaje, tiempo_promedio_seg, preguntas_ok, preguntas_total"
        )
        .in("alumno_id", ids)
        .not("tema_id", "is", null);
      if (!progRes.error && progRes.data) {
        teacherAplicarProgresoAcumulado(map, progRes.data);
      }
    }
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
async function teacherCargarDetalleAlumno(alumnoDbId, periodo) {
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
    .order("iniciado_en", { ascending: false })
    .limit(20);

  var desde = teacherDesdePeriodo(periodo || "today");
  if (desde) {
    q = q.gte("iniciado_en", desde);
  }

  var res = await q;
  if (res.error || !res.data || !res.data.length) {
    return teacherDetalleVacio();
  }
  return teacherDetalleDesdePartidas(res.data);
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
