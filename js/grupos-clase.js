/**
 * Grupos de clase y vínculos de alumnos (Supabase).
 */
var CLAVE_ALUMNO_SESION = "tec_duck_alumno_sesion";

var GRUPO_CODIGO_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
var _gruposCache = null;

function normalizarEmailAlumno(correo) {
  return String(correo || "")
    .trim()
    .toLowerCase();
}

function normalizarCodigoGrupo(codigo) {
  return String(codigo || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function mapGrupoDesdeDb(row) {
  return {
    id: row.es_sistema ? "grupo-todos" : String(row.id),
    dbId: row.id,
    nombre: row.nombre,
    sistema: !!row.es_sistema,
    codigo: row.es_sistema ? undefined : row.codigo
  };
}

function gruposGenerarCodigo() {
  var s = "";
  for (var i = 0; i < 6; i++) {
    s += GRUPO_CODIGO_CHARS.charAt(
      Math.floor(Math.random() * GRUPO_CODIGO_CHARS.length)
    );
  }
  return s;
}

function gruposCodigosEnUso(lista) {
  var usados = {};
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].codigo) {
      usados[normalizarCodigoGrupo(lista[i].codigo)] = true;
    }
  }
  return usados;
}

function gruposGenerarCodigoUnico(lista) {
  lista = lista || gruposLeer();
  var usados = gruposCodigosEnUso(lista);
  var intentos = 0;
  var codigo;
  do {
    codigo = gruposGenerarCodigo();
    intentos += 1;
  } while (usados[codigo] && intentos < 80);
  return codigo;
}

function gruposLeer() {
  return _gruposCache ? _gruposCache.slice() : [];
}

async function gruposPerfilMaestro() {
  var sb = await initSupabase();
  if (!sb || typeof authCargarPerfil !== "function") {
    return null;
  }
  var perfil = null;
  try {
    perfil = await authCargarPerfil();
  } catch (e) {
    return null;
  }
  if (!perfil || perfil.rol !== "MAESTRO") {
    return null;
  }
  var profesorRes = await sb.from("profesor").select("id").maybeSingle();
  if (profesorRes.error || !profesorRes.data) {
    throw new Error(
      profesorRes.error
        ? profesorRes.error.message
        : "Perfil de maestro no encontrado. Vuelve a iniciar sesión."
    );
  }
  return {
    sb: sb,
    perfil: perfil,
    profesorId: profesorRes.data.id
  };
}

async function gruposCargarDesdeSupabase() {
  var sb = await initSupabase();
  if (!sb) {
    _gruposCache = [];
    return _gruposCache;
  }
  var perfil = await authCargarPerfil();
  if (!perfil || perfil.rol !== "MAESTRO") {
    _gruposCache = null;
    return null;
  }
  var res = await sb
    .from("grupo")
    .select("id, nombre, codigo, es_sistema")
    .order("es_sistema", { ascending: false })
    .order("nombre", { ascending: true });
  if (res.error) {
    throw new Error(res.error.message);
  }
  _gruposCache = (res.data || []).map(mapGrupoDesdeDb);
  return _gruposCache;
}

function gruposInicializar() {
  return initSupabase().then(function (sb) {
    if (!sb) {
      _gruposCache = [];
      return _gruposCache;
    }
    return authCargarPerfil().then(function (perfil) {
      if (perfil && perfil.rol === "MAESTRO") {
        return gruposCargarDesdeSupabase();
      }
      _gruposCache = null;
      return null;
    });
  });
}

function alumnoSesionGuardar(correo) {
  localStorage.setItem(
    CLAVE_ALUMNO_SESION,
    JSON.stringify({
      email: normalizarEmailAlumno(correo),
      desde: Date.now()
    })
  );
}

function alumnoSesionLimpiarLocal() {
  localStorage.removeItem(CLAVE_ALUMNO_SESION);
}

function alumnoSesionEmail() {
  return alumnoSesionEmailSync();
}

function alumnoSesionEmailSync() {
  try {
    var raw = localStorage.getItem(CLAVE_ALUMNO_SESION);
    if (!raw) {
      return "";
    }
    var s = JSON.parse(raw);
    return s && s.email ? s.email : "";
  } catch (e) {
    return "";
  }
}

async function alumnoObtenerVinculoSupabase() {
  var sb = await initSupabase();
  if (!sb) {
    return null;
  }
  var alumnoRes = await sb.from("alumno").select("id").maybeSingle();
  if (alumnoRes.error || !alumnoRes.data) {
    return null;
  }
  var linkRes = await sb
    .from("alumno_grupo")
    .select(
      "grupo_id, codigo_usado, vinculado_en, grupo:grupo_id (id, nombre, codigo, es_sistema)"
    )
    .eq("alumno_id", alumnoRes.data.id)
    .order("vinculado_en", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (linkRes.error || !linkRes.data || !linkRes.data.grupo) {
    return null;
  }
  var g = linkRes.data.grupo;
  return {
    grupoId: g.es_sistema ? "grupo-todos" : String(g.id),
    dbId: g.id,
    codigo: linkRes.data.codigo_usado || g.codigo,
    nombreGrupo: g.nombre,
    vinculadoEn: linkRes.data.vinculado_en
  };
}

async function alumnoTieneGrupoVinculadoAsync(correo) {
  var sb = await initSupabase();
  if (!sb) {
    return false;
  }
  if (typeof authObtenerSesion === "function") {
    var sesion = await authObtenerSesion();
    if (!sesion || !sesion.user) {
      return false;
    }
  }
  try {
    var v = await alumnoObtenerVinculoSupabase();
    return !!v;
  } catch (e) {
    return false;
  }
}

async function alumnoObtenerGrupoVinculadoAsync(correo) {
  var sb = await initSupabase();
  if (!sb) {
    return null;
  }
  if (typeof authObtenerSesion === "function") {
    var sesion = await authObtenerSesion();
    if (!sesion || !sesion.user) {
      return null;
    }
  }
  try {
    return await alumnoObtenerVinculoSupabase();
  } catch (e) {
    return null;
  }
}

async function alumnoVincularPorCodigo(correo, codigo) {
  var c = normalizarCodigoGrupo(codigo);
  if (c.length !== 6) {
    return { ok: false, error: "El código debe tener 6 caracteres." };
  }

  var sb = await initSupabase();
  if (!sb) {
    return { ok: false, error: "Supabase no está configurado." };
  }

  var perfil = await authCargarPerfil();
  if (!perfil || perfil.rol !== "ALUMNO") {
    return { ok: false, error: "Debes iniciar sesión como alumno." };
  }

  var rpc = await sb.rpc("unirse_a_grupo", { p_codigo: c });
  if (rpc.error) {
    var msg = rpc.error.message || "Código no válido. Revisa con tu maestro.";
    if (msg.indexOf("Código no válido") >= 0) {
      return { ok: false, error: "Código no válido. Revisa con tu maestro." };
    }
    return { ok: false, error: msg };
  }
  var row = rpc.data && rpc.data[0] ? rpc.data[0] : null;
  if (!row) {
    return { ok: false, error: "Código no válido. Revisa con tu maestro." };
  }
  var grupo = {
    id: String(row.grupo_id),
    dbId: row.grupo_id,
    nombre: row.nombre,
    codigo: row.codigo,
    sistema: false
  };
  return {
    ok: true,
    grupo: grupo,
    vinculo: {
      grupoId: grupo.id,
      codigo: grupo.codigo,
      nombreGrupo: grupo.nombre,
      vinculadoEn: Date.now()
    }
  };
}

async function redirigirAlumnoTrasLogin(correo) {
  alumnoSesionGuardar(correo);
  var tieneGrupo = await alumnoTieneGrupoVinculadoAsync(correo);
  window.location.href = tieneGrupo
    ? typeof pagina === "function"
      ? pagina("topics.html")
      : "topics.html"
    : typeof pagina === "function"
      ? pagina("join-group.html")
      : "join-group.html";
}

function gruposCrear(nombre) {
  return gruposCrearAsync(nombre);
}

async function gruposCrearAsync(nombre) {
  nombre = String(nombre || "").trim();
  if (!nombre) {
    return null;
  }

  var ctx = await gruposPerfilMaestro();
  if (!ctx) {
    throw new Error("Debes iniciar sesión como maestro para crear grupos.");
  }

  if (!_gruposCache) {
    await gruposCargarDesdeSupabase();
  }

  var codigo = gruposGenerarCodigoUnico(_gruposCache || []);
  var insertRes = await ctx.sb
    .from("grupo")
    .insert({
      profesor_id: ctx.profesorId,
      nombre: nombre,
      codigo: codigo,
      es_sistema: false
    })
    .select("id, nombre, codigo, es_sistema")
    .single();
  if (insertRes.error) {
    throw new Error(insertRes.error.message);
  }
  var nuevo = mapGrupoDesdeDb(insertRes.data);
  _gruposCache = (_gruposCache || []).concat([nuevo]);
  return nuevo;
}

async function gruposEliminar(id) {
  if (!id || id === "grupo-todos") {
    return false;
  }

  var ctx = await gruposPerfilMaestro();
  if (!ctx) {
    throw new Error("Debes iniciar sesión como maestro para eliminar grupos.");
  }

  if (!_gruposCache) {
    await gruposCargarDesdeSupabase();
  }

  var grupo = (_gruposCache || []).find(function (g) {
    return g.id === id;
  });
  var dbId = grupo && grupo.dbId ? grupo.dbId : parseInt(id, 10);
  if (!dbId || isNaN(dbId)) {
    throw new Error("Grupo no encontrado.");
  }
  var delRes = await ctx.sb
    .from("grupo")
    .delete()
    .eq("id", dbId)
    .eq("es_sistema", false);
  if (delRes.error) {
    throw new Error(delRes.error.message);
  }
  await gruposCargarDesdeSupabase();
  return true;
}
