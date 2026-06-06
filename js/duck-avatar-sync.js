/**
 * Sincroniza el outfit del alumno con public.avatar en Supabase.
 * Lectura/escritura local: duck-outfit.js
 */
var _duckAvatarAlumnoDbId = null;
var _duckAvatarSyncTimer = null;
var _duckAvatarSyncPromesa = null;
var _duckAvatarPendiente = null;
var _duckAvatarListo = false;

// ¿Ya resolvimos qué outfit mostrar al alumno?
function duckAvatarEstaListo() {
  return _duckAvatarListo === true;
}

// Limpia caché y cancela sincronizaciones pendientes.
function duckAvatarLimpiarCache() {
  _duckAvatarAlumnoDbId = null;
  _duckAvatarListo = false;
  if (_duckAvatarSyncTimer) {
    clearTimeout(_duckAvatarSyncTimer);
    _duckAvatarSyncTimer = null;
  }
}

// Lee outfit local con metadata; delega en duck-outfit.js.
function duckAvatarLeerOutfitLocalConMeta() {
  return typeof duckOutfitLeerLocalConMeta === "function"
    ? duckOutfitLeerLocalConMeta()
    : { outfit: duckOutfitDefecto(), guardadoEn: 0 };
}

// Atajo para leer solo el outfit del localStorage.
function duckAvatarLeerOutfitLocal() {
  return typeof duckOutfitLeerLocal === "function"
    ? duckOutfitLeerLocal()
    : duckOutfitDefecto();
}

// Guarda en local a través de duck-outfit si está disponible.
function duckAvatarGuardarLocal(outfit, guardadoEn) {
  if (typeof duckOutfitGuardarLocal === "function") {
    duckOutfitGuardarLocal(outfit, guardadoEn);
  }
}

// ID del alumno en la BD, cacheado para no repetir consultas.
async function duckAvatarObtenerAlumnoDbId(force) {
  if (_duckAvatarAlumnoDbId && !force) {
    return _duckAvatarAlumnoDbId;
  }
  if (typeof initSupabase !== "function" || typeof authCargarPerfil !== "function") {
    return null;
  }
  try {
    var sb = await initSupabase();
    if (!sb) {
      return null;
    }
    var perfil = await authCargarPerfil();
    if (!perfil || !authEsRol(perfil, "ALUMNO")) {
      return null;
    }
    var res = await sb
      .from("alumno")
      .select("id")
      .eq("usuario_id", perfil.id)
      .maybeSingle();
    if (res.error || !res.data) {
      return null;
    }
    _duckAvatarAlumnoDbId = res.data.id;
    return _duckAvatarAlumnoDbId;
  } catch (e) {
    console.warn("[avatar] alumno id:", e);
    return null;
  }
}

// Descarga el avatar guardado en la tabla avatar de Supabase.
async function duckAvatarCargarRemoto() {
  var sb = await initSupabase();
  if (!sb) {
    return null;
  }
  var alumnoId = await duckAvatarObtenerAlumnoDbId();
  if (!alumnoId) {
    return null;
  }
  var res = await sb
    .from("avatar")
    .select(
      "item_base_id, item_face_id, item_head_id, item_neck_id, item_shoes_id, actualizado_en"
    )
    .eq("alumno_id", alumnoId)
    .maybeSingle();
  if (res.error || !res.data) {
    return null;
  }
  return {
    outfit:
      typeof duckOutfitDesdeDbRow === "function"
        ? duckOutfitDesdeDbRow(res.data)
        : duckOutfitDefecto(),
    actualizadoEn: res.data.actualizado_en || null
  };
}

// Formato uniforme { ok, error } para las respuestas de sync.
function duckAvatarResultado(ok, error) {
  return { ok: !!ok, error: error || "" };
}

// Convierte errores técnicos en mensajes que el alumno entienda.
function duckAvatarErrorAmigable(msg) {
  var lower = String(msg || "").toLowerCase();
  if (
    lower.indexOf("solo alumnos autenticados") >= 0 ||
    lower.indexOf("jwt expired") >= 0 ||
    lower.indexOf("invalid claim") >= 0 ||
    lower.indexOf("not authenticated") >= 0
  ) {
    return "Tu sesión de alumno expiró o no es válida. Cierra sesión e inicia de nuevo.";
  }
  if (
    lower.indexOf("foreign key") >= 0 ||
    lower.indexOf("violates foreign key") >= 0
  ) {
    return "Alguna pieza del pato no es válida en la nube. Quita accesorios y vuelve a guardar.";
  }
  if (
    lower.indexOf("failed to fetch") >= 0 ||
    lower.indexOf("networkerror") >= 0 ||
    lower.indexOf("network request failed") >= 0 ||
    lower.indexOf("load failed") >= 0
  ) {
    return "No se pudo conectar con la nube. Revisa tu internet e inténtalo de nuevo.";
  }
  return "";
}

// Sube el outfit a la nube (RPC primero, upsert directo si falla).
async function duckAvatarSincronizar(outfit) {
  var ultimoError = "";
  try {
    if (typeof duckOutfitADbIds !== "function") {
      return duckAvatarResultado(false, "No se pudo preparar el pato para guardar.");
    }
    var sb = await initSupabase();
    if (!sb) {
      return duckAvatarResultado(
        false,
        "Supabase no está configurado en esta página."
      );
    }
    if (typeof authRenovarSesionSiHaceFalta !== "function") {
      return duckAvatarResultado(
        false,
        "Tu sesión de alumno expiró. Vuelve a iniciar sesión."
      );
    }
    var sesion = await authRenovarSesionSiHaceFalta();
    if (!sesion || !sesion.user) {
      return duckAvatarResultado(
        false,
        "Tu sesión de alumno expiró. Vuelve a iniciar sesión."
      );
    }
    var perfil = await authCargarPerfil(true, sesion);
    if (!perfil) {
      return duckAvatarResultado(
        false,
        "Tu sesión de alumno expiró. Vuelve a iniciar sesión."
      );
    }
    if (!authEsRol(perfil, "ALUMNO")) {
      return duckAvatarResultado(
        false,
        "Solo los alumnos pueden guardar el pato en la nube."
      );
    }
    var ids = duckOutfitADbIds(outfit);
    var params = {
      p_item_base_id: ids.item_base_id,
      p_item_face_id: ids.item_face_id,
      p_item_head_id: ids.item_head_id,
      p_item_neck_id: ids.item_neck_id,
      p_item_shoes_id: ids.item_shoes_id
    };

    var rpc = await sb.rpc("guardar_avatar_alumno", params);
    if (!rpc.error) {
      duckAvatarGuardarLocal(outfit, Date.now());
      return duckAvatarResultado(true);
    }

    ultimoError = rpc.error.message || "";
    console.warn("[avatar] RPC guardar_avatar_alumno:", ultimoError);

    var alumnoId = await duckAvatarObtenerAlumnoDbId(true);
    if (!alumnoId) {
      return duckAvatarResultado(
        false,
        duckAvatarErrorAmigable(ultimoError) ||
          "No encontramos tu perfil de alumno. Cierra sesión e inicia de nuevo."
      );
    }
    var payload = {
      alumno_id: alumnoId,
      item_base_id: ids.item_base_id,
      item_face_id: ids.item_face_id,
      item_head_id: ids.item_head_id,
      item_neck_id: ids.item_neck_id,
      item_shoes_id: ids.item_shoes_id
    };
    var ups = await sb.from("avatar").upsert(payload, { onConflict: "alumno_id" });
    if (ups.error) {
      ultimoError = ups.error.message || ultimoError;
      console.warn("[avatar] upsert directo:", ultimoError);
      return duckAvatarResultado(
        false,
        duckAvatarErrorAmigable(ultimoError) ||
          "No se pudo guardar en la nube. Revisa tu conexión e inténtalo de nuevo."
      );
    }
    duckAvatarGuardarLocal(outfit, Date.now());
    return duckAvatarResultado(true);
  } catch (e) {
    ultimoError = e && e.message ? e.message : String(e);
    console.warn("[avatar] sync:", e);
    return duckAvatarResultado(
      false,
      duckAvatarErrorAmigable(ultimoError) ||
        "No se pudo guardar en la nube. Revisa tu conexión e inténtalo de nuevo."
    );
  }
}

// Guarda local al instante y sube a la nube con un pequeño retraso.
function duckAvatarProgramarSincronizacion(outfit) {
  duckOutfitGuardarLocal(outfit, Date.now());
  _duckAvatarPendiente = outfit;
  if (_duckAvatarSyncTimer) {
    clearTimeout(_duckAvatarSyncTimer);
  }
  _duckAvatarSyncTimer = setTimeout(function () {
    _duckAvatarSyncTimer = null;
    var pendiente = _duckAvatarPendiente;
    _duckAvatarPendiente = null;
    if (!pendiente) {
      return;
    }
    _duckAvatarSyncPromesa = duckAvatarSincronizar(pendiente);
  }, 350);
}

// Fuerza la subida de lo que quedó pendiente sin esperar el timer.
async function duckAvatarFlushSync() {
  if (_duckAvatarSyncTimer) {
    clearTimeout(_duckAvatarSyncTimer);
    _duckAvatarSyncTimer = null;
  }
  var pendiente = _duckAvatarPendiente;
  _duckAvatarPendiente = null;
  if (pendiente) {
    var res = await duckAvatarSincronizar(pendiente);
    return res.ok;
  }
  if (_duckAvatarSyncPromesa) {
    try {
      await _duckAvatarSyncPromesa;
    } catch (e) {
      /* noop */
    }
  }
  return true;
}

// Al abrir la app: fusiona outfit local y remoto y elige el más reciente.
async function duckAvatarResolverOutfit() {
  try {
    if (typeof authCargarPerfil !== "function") {
      _duckAvatarListo = true;
      return duckAvatarLeerOutfitLocal();
    }
    var perfil = null;
    try {
      perfil = await authCargarPerfil();
    } catch (e) {
      _duckAvatarListo = true;
      return duckAvatarLeerOutfitLocal();
    }
    if (!perfil || perfil.rol !== "ALUMNO") {
      _duckAvatarListo = true;
      return duckAvatarLeerOutfitLocal();
    }

    await duckAvatarFlushSync();

    var local = duckAvatarLeerOutfitLocalConMeta();
    var remoto = await duckAvatarCargarRemoto();

    if (_duckAvatarPendiente) {
      _duckAvatarListo = true;
      return local.outfit;
    }

    if (!remoto) {
      if (local.outfit) {
        await duckAvatarSincronizar(local.outfit);
      }
      _duckAvatarListo = true;
      return local.outfit;
    }

    var remotoTs = remoto.actualizadoEn
      ? new Date(remoto.actualizadoEn).getTime()
      : 0;
    duckAvatarGuardarLocal(remoto.outfit, remotoTs || Date.now());
    _duckAvatarListo = true;
    return remoto.outfit;
  } catch (e) {
    console.warn("[avatar] resolver:", e);
    _duckAvatarListo = true;
    return duckAvatarLeerOutfitLocal();
  }
}

window.addEventListener("pagehide", function () {
  if (_duckAvatarPendiente) {
    var pendiente = _duckAvatarPendiente;
    _duckAvatarPendiente = null;
    if (_duckAvatarSyncTimer) {
      clearTimeout(_duckAvatarSyncTimer);
      _duckAvatarSyncTimer = null;
    }
    duckAvatarSincronizar(pendiente);
  }
});
