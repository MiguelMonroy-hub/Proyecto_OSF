/**
 * Capa de persistencia de niveles del maestro en Supabase.
 * Lee y escribe en las tablas nivel_maestro, pregunta_maestro, respuesta_maestro
 * y nivel_maestro_grupo, y mantiene una caché en memoria para evitar consultas repetidas.
 */
var _nivelMaestroDbCache = null;
var _nivelMaestroDbCargando = null;

var NIVEL_MAESTRO_DB_SELECT =
  "id, titulo, logo, creado_en, actualizado_en, activo, " +
  "nivel_maestro_grupo ( grupo_id, visible, fecha_limite ), " +
  "pregunta_maestro ( id, enunciado, orden, activa, respuesta_maestro ( letra, texto, es_correcta, retroalimentacion, orden ) )";

/** Quita el prefijo «A)», «B)», etc. del texto de una opción antes de guardarla. */
function nivelMaestroDbTextoOpcionSinPrefijo(letra, texto) {
  texto = String(texto || "").trim();
  if (!texto) {
    return "";
  }
  var pref = letra + ") ";
  if (texto.toUpperCase().indexOf(letra + ")") === 0) {
    var sin = texto.slice(pref.length).trim();
    return sin || texto;
  }
  return texto;
}

/** Convierte la clave de grupo del front a número de base de datos, o null si no aplica. */
function nivelMaestroDbGrupoIdNumerico(grupoKey) {
  if (!grupoKey || grupoKey === "grupo-todos") {
    return null;
  }
  var n = parseInt(grupoKey, 10);
  return isNaN(n) ? null : n;
}

/** Transforma una fila de Supabase al objeto de nivel que usa el resto de la app. */
function nivelMaestroDbMapRow(row) {
  if (!row) {
    return null;
  }
  var grupos = {};
  var asignaciones = row.nivel_maestro_grupo || [];
  for (var g = 0; g < asignaciones.length; g++) {
    var nmg = asignaciones[g];
    grupos[String(nmg.grupo_id)] = {
      visible: !!nmg.visible,
      fechaLimite: nmg.fecha_limite
        ? String(nmg.fecha_limite).slice(0, 10)
        : ""
    };
  }
  if (typeof nivelMaestroFusionarGrupos === "function") {
    grupos = nivelMaestroFusionarGrupos(grupos);
  }

  var rawPreguntas = row.pregunta_maestro || [];
  rawPreguntas.sort(function (a, b) {
    return (a.orden || 0) - (b.orden || 0);
  });

  var preguntas = [];
  for (var i = 0; i < rawPreguntas.length; i++) {
    var pr = rawPreguntas[i];
    if (pr.activa === false) {
      continue;
    }
    var respuestas = (pr.respuesta_maestro || []).slice();
    respuestas.sort(function (a, b) {
      var la = NIVEL_MAESTRO_LETRAS_OPCION.indexOf(String(a.letra));
      var lb = NIVEL_MAESTRO_LETRAS_OPCION.indexOf(String(b.letra));
      if (la < 0) {
        la = a.orden || 0;
      }
      if (lb < 0) {
        lb = b.orden || 0;
      }
      return la - lb;
    });
    var opts = [];
    for (var j = 0; j < respuestas.length; j++) {
      var r = respuestas[j];
      var letra = String(r.letra || NIVEL_MAESTRO_LETRAS_OPCION[j] || "A");
      var op = {
        t:
          typeof nivelMaestroPrefijoOpcion === "function"
            ? nivelMaestroPrefijoOpcion(letra, r.texto)
            : letra + ") " + r.texto,
        ok: !!r.es_correcta
      };
      if (r.retroalimentacion) {
        op.fb = r.retroalimentacion;
      }
      opts.push(op);
    }
    if (!opts.length) {
      continue;
    }
    preguntas.push({
      id: String(pr.id),
      dbPreguntaId: pr.id,
      q: pr.enunciado,
      opts: opts
    });
  }

  var dbId = row.id;
  return {
    id: String(dbId),
    dbId: dbId,
    titulo: row.titulo,
    logo: row.logo || undefined,
    preguntas: preguntas,
    grupos: grupos,
    creadoEn: row.creado_en ? new Date(row.creado_en).getTime() : Date.now(),
    actualizadoEn: row.actualizado_en
      ? new Date(row.actualizado_en).getTime()
      : Date.now()
  };
}

/** Inserta o reemplaza un nivel en la caché local tras leerlo o guardarlo. */
function nivelMaestroDbActualizarCacheItem(item) {
  if (!item || !_nivelMaestroDbCache) {
    return;
  }
  var idx = -1;
  for (var i = 0; i < _nivelMaestroDbCache.length; i++) {
    if (String(_nivelMaestroDbCache[i].id) === String(item.id)) {
      idx = i;
      break;
    }
  }
  if (idx >= 0) {
    _nivelMaestroDbCache[idx] = item;
  } else {
    _nivelMaestroDbCache.push(item);
  }
}

/** Elimina un nivel de la caché local cuando se borra de la base de datos. */
function nivelMaestroDbQuitarDeCache(id) {
  if (!_nivelMaestroDbCache) {
    return;
  }
  _nivelMaestroDbCache = _nivelMaestroDbCache.filter(function (n) {
    return String(n.id) !== String(id);
  });
}

/** Trae todos los niveles activos del maestro desde Supabase y los guarda en caché. */
async function nivelMaestroDbCargarTodos(force) {
  if (_nivelMaestroDbCache && !force) {
    return _nivelMaestroDbCache.slice();
  }
  if (_nivelMaestroDbCargando) {
    return _nivelMaestroDbCargando;
  }

  _nivelMaestroDbCargando = (async function () {
    var sb = await initSupabase();
    if (!sb) {
      _nivelMaestroDbCache = [];
      return [];
    }
    var res = await sb
      .from("nivel_maestro")
      .select(NIVEL_MAESTRO_DB_SELECT)
      .eq("activo", true)
      .order("actualizado_en", { ascending: false });
    if (res.error) {
      console.warn("[nivel-maestro-db] cargar:", res.error.message);
      throw new Error(res.error.message);
    }
    var lista = [];
    for (var i = 0; i < (res.data || []).length; i++) {
      var mapped = nivelMaestroDbMapRow(res.data[i]);
      if (mapped) {
        lista.push(mapped);
      }
    }
    _nivelMaestroDbCache = lista;
    return lista.slice();
  })();

  try {
    return await _nivelMaestroDbCargando;
  } finally {
    _nivelMaestroDbCargando = null;
  }
}

/** Carga un solo nivel por id, primero en caché y luego con una consulta a Supabase. */
async function nivelMaestroDbCargarUno(id) {
  if (!id) {
    return null;
  }
  var numId = parseInt(id, 10);
  if (isNaN(numId)) {
    return null;
  }

  if (_nivelMaestroDbCache) {
    for (var c = 0; c < _nivelMaestroDbCache.length; c++) {
      if (String(_nivelMaestroDbCache[c].id) === String(numId)) {
        return _nivelMaestroDbCache[c];
      }
    }
  }

  var sb = await initSupabase();
  if (!sb) {
    return null;
  }
  var res = await sb
    .from("nivel_maestro")
    .select(NIVEL_MAESTRO_DB_SELECT)
    .eq("id", numId)
    .eq("activo", true)
    .maybeSingle();
  if (res.error || !res.data) {
    if (res.error) {
      console.warn("[nivel-maestro-db] uno:", res.error.message);
    }
    return null;
  }
  var item = nivelMaestroDbMapRow(res.data);
  if (item) {
    nivelMaestroDbActualizarCacheItem(item);
  }
  return item;
}

/** Reemplaza por completo las preguntas y respuestas de un nivel en la base de datos. */
async function nivelMaestroDbGuardarPreguntas(sb, nivelId, preguntas) {
  var delRes = await sb
    .from("pregunta_maestro")
    .delete()
    .eq("nivel_maestro_id", nivelId);
  if (delRes.error) {
    throw new Error(delRes.error.message);
  }

  for (var i = 0; i < preguntas.length; i++) {
    var p = preguntas[i];
    var insP = await sb
      .from("pregunta_maestro")
      .insert({
        nivel_maestro_id: nivelId,
        enunciado: p.q,
        orden: i,
        activa: true
      })
      .select("id")
      .single();
    if (insP.error || !insP.data) {
      throw new Error(
        insP.error ? insP.error.message : "No se pudo guardar una pregunta."
      );
    }

    var respRows = [];
    for (var j = 0; j < p.opts.length && j < 4; j++) {
      var letra = NIVEL_MAESTRO_LETRAS_OPCION[j];
      var op = p.opts[j];
      respRows.push({
        pregunta_maestro_id: insP.data.id,
        letra: letra,
        texto: nivelMaestroDbTextoOpcionSinPrefijo(letra, op.t),
        es_correcta: !!op.ok,
        retroalimentacion: op.ok ? null : op.fb || null,
        orden: j
      });
    }
    if (respRows.length) {
      var insR = await sb.from("respuesta_maestro").insert(respRows);
      if (insR.error) {
        throw new Error(insR.error.message);
      }
    }
  }
}

/** Reemplaza las asignaciones de visibilidad y fecha límite por grupo de un nivel. */
async function nivelMaestroDbGuardarGrupos(sb, nivelId, gruposMap) {
  var delRes = await sb
    .from("nivel_maestro_grupo")
    .delete()
    .eq("nivel_maestro_id", nivelId);
  if (delRes.error) {
    throw new Error(delRes.error.message);
  }

  var rows = [];
  var keys = gruposMap ? Object.keys(gruposMap) : [];
  for (var i = 0; i < keys.length; i++) {
    var gid = nivelMaestroDbGrupoIdNumerico(keys[i]);
    if (!gid) {
      continue;
    }
    var asig = gruposMap[keys[i]] || {};
    rows.push({
      nivel_maestro_id: nivelId,
      grupo_id: gid,
      visible: !!asig.visible,
      fecha_limite: asig.fechaLimite ? asig.fechaLimite : null
    });
  }
  if (!rows.length) {
    return;
  }
  var insRes = await sb.from("nivel_maestro_grupo").insert(rows);
  if (insRes.error) {
    throw new Error(insRes.error.message);
  }
}

/** Crea o actualiza un nivel completo: cabecera, grupos, preguntas y logo. */
async function nivelMaestroDbGuardar(datos) {
  if (typeof gruposPerfilMaestro !== "function") {
    throw new Error("No se pudo verificar la sesión del maestro.");
  }
  var ctx = await gruposPerfilMaestro();
  if (!ctx || !ctx.sb) {
    throw new Error("Inicia sesión como maestro para guardar niveles.");
  }

  var sb = ctx.sb;
  var preguntas = nivelMaestroNormalizarListaPreguntas(
    datos.preguntas,
    datos.id || "nuevo"
  );
  if (!preguntas.length) {
    throw new Error("Añade al menos una pregunta completa.");
  }

  var titulo =
    String(datos.titulo || "Nivel sin nombre").trim() || "Nivel sin nombre";
  var gruposMap =
    typeof nivelMaestroFusionarGrupos === "function"
      ? nivelMaestroFusionarGrupos(datos.grupos)
      : datos.grupos || {};

  var logo = null;
  if (datos.logo === "" || datos.logo === null) {
    logo = null;
  } else if (
    typeof nivelMaestroEsLogoValido === "function" &&
    nivelMaestroEsLogoValido(datos.logo)
  ) {
    logo = datos.logo;
  } else if (datos.id) {
    var previo = nivelMaestroPorId(datos.id);
    if (
      previo &&
      typeof nivelMaestroEsLogoValido === "function" &&
      nivelMaestroEsLogoValido(previo.logo)
    ) {
      logo = previo.logo;
    }
  }

  var dbId = parseInt(datos.id, 10);
  var esNuevo = isNaN(dbId);

  if (esNuevo) {
    var insN = await sb
      .from("nivel_maestro")
      .insert({
        profesor_id: ctx.profesorId,
        titulo: titulo,
        logo: logo,
        activo: true
      })
      .select("id")
      .single();
    if (insN.error || !insN.data) {
      throw new Error(
        insN.error ? insN.error.message : "No se pudo crear el nivel."
      );
    }
    dbId = insN.data.id;
  } else {
    var updN = await sb
      .from("nivel_maestro")
      .update({ titulo: titulo, logo: logo, activo: true })
      .eq("id", dbId);
    if (updN.error) {
      throw new Error(updN.error.message);
    }
  }

  await nivelMaestroDbGuardarGrupos(sb, dbId, gruposMap);
  await nivelMaestroDbGuardarPreguntas(sb, dbId, preguntas);

  var guardado = await nivelMaestroDbCargarUno(dbId);
  if (!guardado) {
    throw new Error("El nivel se guardó pero no se pudo volver a cargar.");
  }
  return guardado;
}

/** Borra un nivel de Supabase y lo quita de la caché local. */
async function nivelMaestroDbEliminar(id) {
  var numId = parseInt(id, 10);
  if (isNaN(numId)) {
    return;
  }
  var sb = await initSupabase();
  if (!sb) {
    throw new Error("Sin conexión con la base de datos.");
  }
  var res = await sb.from("nivel_maestro").delete().eq("id", numId);
  if (res.error) {
    throw new Error(res.error.message);
  }
  nivelMaestroDbQuitarDeCache(String(numId));
}
