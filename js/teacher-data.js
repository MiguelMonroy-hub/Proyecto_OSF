/**
 * Datos del panel del maestro (Supabase).
 */
var _teacherAlumnosCache = [];

function teacherLeerGrupos() {
  return typeof gruposLeer === "function" ? gruposLeer() : [];
}

var TEACHER_TEMAS = [
  { id: "t1", nombre: "Coordenadas", corto: "Tema 1" },
  { id: "t2", nombre: "Vectores", corto: "Tema 2" },
  { id: "t3", nombre: "Suma y resta", corto: "Tema 3" },
  { id: "t4", nombre: "Escalar", corto: "Tema 4" }
];

var TEACHER_TEMA_DB_A_UI = {
  1: "t1",
  2: "t2",
  3: "t3",
  4: "t4"
};

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

function teacherTemasVacios() {
  return { t1: 0, t2: 0, t3: 0, t4: 0 };
}

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

function teacherTotalPreguntasPartida(partida, act) {
  var total = Number(partida.preguntas_total) || 0;
  if (total > 0) {
    return total;
  }
  if (!Array.isArray(act) || !act.length) {
    return 0;
  }
  if (
    partida.estado === "GAME_OVER" ||
    partida.estado === "COMPLETADA" ||
    act.some(function (a) {
      return a && a.omitida;
    })
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

/** Peso 0–1 por pregunta (misma escala que monedas: 10 / 5 / 2). */
function teacherPesoPreguntaActividad(entry) {
  if (!entry || entry.omitida) {
    return 0;
  }
  if (!entry.ok) {
    return 0;
  }
  var e = Number(entry.errores) || 0;
  if (e <= 0) {
    return 1;
  }
  if (e === 1) {
    return 0.5;
  }
  return 0.2;
}

function teacherNivelCompletoDesdePartida(partida) {
  if (!partida) {
    return { ok: 0, total: 0, pct: 0 };
  }
  var act = partida.actividad;
  var ok = 0;
  if (Array.isArray(act)) {
    for (var i = 0; i < act.length; i++) {
      if (act[i] && act[i].ok) {
        ok += 1;
      }
    }
  }
  var total = teacherTotalPreguntasPartida(partida, act);
  var pct = total > 0 ? Math.round((ok / total) * 100) : 0;
  return { ok: ok, total: total, pct: pct };
}

function teacherPorcentajeAciertosDesdePartida(partida) {
  if (!partida) {
    return { pct: 0, ok: 0, total: 0, peso: 0 };
  }
  var act = partida.actividad;
  var ok = 0;
  var sumPeso = 0;

  if (Array.isArray(act)) {
    for (var i = 0; i < act.length; i++) {
      if (act[i] && act[i].ok) {
        ok += 1;
      }
      sumPeso += teacherPesoPreguntaActividad(act[i]);
    }
  }

  var total = teacherTotalPreguntasPartida(partida, act);
  var pct = total > 0 ? Math.round((sumPeso / total) * 100) : 0;
  return { pct: pct, ok: ok, total: total, peso: sumPeso };
}

function teacherPuntajeDesdePartida(partida) {
  var nc = teacherNivelCompletoDesdePartida(partida);
  if (nc.total > 0) {
    return Math.round((nc.ok / nc.total) * 10);
  }
  if (partida.indice_pregunta != null && partida.indice_pregunta > 0) {
    return Math.min(10, partida.indice_pregunta);
  }
  return 0;
}

function teacherTiempoPromedioPartida(partida) {
  var act = partida.actividad;
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

function teacherTemaUiDesdePartida(partida) {
  if (partida.nivel && partida.nivel.tema_id) {
    return TEACHER_TEMA_DB_A_UI[partida.nivel.tema_id] || null;
  }
  return null;
}

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
    if ((map[key].temas[tid] || 0) < pts) {
      map[key].temas[tid] = pts;
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

function teacherPartidaModoDb(partida) {
  if (partida && partida.nivel && partida.nivel.codigo) {
    return String(partida.nivel.codigo).toUpperCase() === "DIFICIL"
      ? "DIFICIL"
      : "FACIL";
  }
  return String(partida && partida.modo ? partida.modo : "FACIL").toUpperCase() ===
    "DIFICIL"
    ? "DIFICIL"
    : "FACIL";
}

function teacherPartidaEsDificil(partida) {
  return teacherPartidaModoDb(partida) === "DIFICIL";
}

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
    tareas: teacherTareasDesdeActividad(partida.actividad)
  };
}

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

function teacherPrimerModoConIntentos(detalle, temaId) {
  var intentos = detalle && detalle.intentos ? detalle.intentos : [];
  for (var i = 0; i < intentos.length; i++) {
    if (intentos[i].temaActivo === temaId) {
      return String(intentos[i].modo || "FACIL").toUpperCase();
    }
  }
  return "FACIL";
}

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

function teacherTareasDesdeActividad(act) {
  var tareas = [];
  if (!Array.isArray(act)) {
    return tareas;
  }
  for (var i = 0; i < act.length; i++) {
    var a = act[i] || {};
    var idx = a.indice != null ? a.indice : i;
    tareas.push({
      indice: idx,
      ok: !!a.ok,
      errores: Number(a.errores) || 0,
      omitida: !!a.omitida,
      contestada: a.contestada !== false,
      tiempo: Number(a.tiempo) || 0,
      texto: a.texto || "Pregunta " + (idx + 1)
    });
  }
  tareas.sort(function (x, y) {
    return x.indice - y.indice;
  });
  return tareas;
}

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
  det.tareas = teacherTareasDesdeActividad(partida.actividad);
  det.intentos = [teacherIntentoDesdePartida(partida)];
  return det;
}

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

function teacherListarAlumnos() {
  return _teacherAlumnosCache.slice();
}

function teacherAlumnosEnGrupo(grupoId) {
  var todos = teacherListarAlumnos();
  if (!grupoId || grupoId === "grupo-todos") {
    return todos;
  }
  return todos.filter(function (a) {
    return (a.grupos || []).indexOf(grupoId) >= 0;
  });
}

function teacherAvatarDesdeAlumno(alumno) {
  if (!alumno || !alumno.avatar) {
    return null;
  }
  return Array.isArray(alumno.avatar) ? alumno.avatar[0] : alumno.avatar;
}

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

async function teacherCargarAlumnos(opciones) {
  _teacherAlumnosCache = [];
  opciones = opciones || {};
  var periodo = opciones.periodo || "today";

  if (typeof initSupabase !== "function") {
    return [];
  }

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

  var linksRes = await sb.from("alumno_grupo").select(
    "grupo_id, alumno:alumno_id ( id, usuario:usuario_id ( nombre, apellido, email ), avatar ( item_base_id, item_face_id, item_head_id, item_neck_id, item_shoes_id, actualizado_en ) ), grupo:grupo_id ( id, es_sistema )"
  );
  if (linksRes.error) {
    linksRes = await sb.from("alumno_grupo").select(
      "grupo_id, alumno:alumno_id ( id, usuario:usuario_id ( nombre, apellido, email ) ), grupo:grupo_id ( id, es_sistema )"
    );
    if (linksRes.error) {
      throw new Error(linksRes.error.message);
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
}

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

  var alumnos = teacherListarAlumnos();
  for (var j = 0; j < alumnos.length; j++) {
    var a = alumnos[j];
    var dbAlumnoId = a.dbId || parseInt(a.id, 10);
    if (!dbAlumnoId || isNaN(dbAlumnoId)) {
      continue;
    }
    var quiere = !!marcados[String(a.id)];
    var tiene = (a.grupos || []).indexOf(grupoId) >= 0;

    if (quiere && !tiene) {
      var ins = await sb.from("alumno_grupo").insert({
        alumno_id: dbAlumnoId,
        grupo_id: grupo.dbId,
        codigo_usado: grupo.codigo || null
      });
      if (ins.error) {
        throw new Error(ins.error.message);
      }
    }

    if (!quiere && tiene) {
      var del = await sb
        .from("alumno_grupo")
        .delete()
        .eq("alumno_id", dbAlumnoId)
        .eq("grupo_id", grupo.dbId);
      if (del.error) {
        throw new Error(del.error.message);
      }
    }
  }

  await teacherCargarAlumnos();
}

function teacherColorBarra(puntos, max) {
  max = max || 10;
  var r = puntos / max;
  if (r >= 0.7) return "bar-green";
  if (r >= 0.4) return "bar-orange";
  return "bar-red";
}

function teacherNombreTema(id) {
  for (var i = 0; i < TEACHER_TEMAS.length; i++) {
    if (TEACHER_TEMAS[i].id === id) {
      return TEACHER_TEMAS[i];
    }
  }
  return { nombre: id, corto: id };
}
