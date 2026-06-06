/**
 * Monedas e inventario del alumno: Supabase es la fuente de verdad.
 * localStorage actúa como caché tras duckEconomiaSyncDesdeDb().
 */
var _duckEcoAlumnoId = null;
var _duckEcoSyncProm = null;
var _duckEcoListo = false;

// ¿Ya trajimos monedas e inventario de la nube?
function duckEconomiaEstaListo() {
  return _duckEcoListo === true;
}

// Resetea el estado al cerrar sesión o cambiar de usuario.
function duckEconomiaLimpiarCache() {
  _duckEcoAlumnoId = null;
  _duckEcoListo = false;
}

// Busca el ID de alumno en Supabase para el usuario logueado.
async function duckEconomiaObtenerAlumnoId(force) {
  if (_duckEcoAlumnoId && !force) {
    return _duckEcoAlumnoId;
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
    _duckEcoAlumnoId = res.data.id;
    return _duckEcoAlumnoId;
  } catch (e) {
    console.warn("[economia] alumno:", e);
    return null;
  }
}

// Escribe el saldo de monedas en localStorage.
function duckEconomiaAplicarSaldoLocal(saldo) {
  localStorage.setItem(TEC_DUCK_STORAGE_COINS, String(Math.max(0, saldo || 0)));
}

// Actualiza la copia local del inventario sin duplicados.
function duckEconomiaAplicarInventarioLocal(ids) {
  var lista = [];
  if (Array.isArray(ids)) {
    for (var i = 0; i < ids.length; i++) {
      if (ids[i] && lista.indexOf(ids[i]) < 0) {
        lista.push(ids[i]);
      }
    }
  }
  duckInvGuardar(lista);
}

// Trae saldo e inventario de Supabase y los deja en caché local.
async function duckEconomiaSyncDesdeDb() {
  if (typeof initSupabase !== "function") {
    _duckEcoListo = false;
    return { ok: false };
  }
  if (_duckEcoSyncProm) {
    return _duckEcoSyncProm;
  }

  _duckEcoSyncProm = (async function () {
    var sb = await initSupabase();
    if (!sb) {
      _duckEcoListo = false;
      return { ok: false };
    }
    var alumnoId = await duckEconomiaObtenerAlumnoId(true);
    if (!alumnoId) {
      _duckEcoListo = false;
      return { ok: false, sinSesion: true };
    }

    duckInvMigrar();

    var alumnoRes = await sb
      .from("alumno")
      .select("saldo_monedas")
      .eq("id", alumnoId)
      .maybeSingle();
    if (alumnoRes.error || !alumnoRes.data) {
      _duckEcoListo = false;
      return { ok: false, error: alumnoRes.error && alumnoRes.error.message };
    }

    var invRes = await sb
      .from("inventario")
      .select("item_id")
      .eq("alumno_id", alumnoId);
    if (invRes.error) {
      _duckEcoListo = false;
      return { ok: false, error: invRes.error.message };
    }

    var ids = [];
    for (var i = 0; i < (invRes.data || []).length; i++) {
      ids.push(invRes.data[i].item_id);
    }

    duckEconomiaAplicarSaldoLocal(alumnoRes.data.saldo_monedas);
    duckEconomiaAplicarInventarioLocal(ids);
    _duckEcoListo = true;

    return {
      ok: true,
      saldo: Number(alumnoRes.data.saldo_monedas) || 0,
      inventario: ids
    };
  })();

  try {
    return await _duckEcoSyncProm;
  } finally {
    _duckEcoSyncProm = null;
  }
}

// Ya no se usa; las monedas entran por registrar_resultado_quiz.
async function duckEconomiaAgregarMonedasDb() {
  console.warn(
    "[economia] agregar_monedas_alumno ya no está disponible; use registrar_resultado_quiz."
  );
  return { ok: false, obsoleto: true };
}

// Compra un ítem en la tienda vía RPC y actualiza saldo e inventario.
async function duckEconomiaComprarItem(itemId) {
  if (!itemId) {
    return { ok: false, error: "Artículo no válido" };
  }
  if (typeof initSupabase !== "function") {
    return { ok: false, error: "Sin conexión" };
  }
  try {
    var sb = await initSupabase();
    if (!sb) {
      return { ok: false, error: "Supabase no configurado" };
    }
    if (!(await duckEconomiaObtenerAlumnoId())) {
      return { ok: false, error: "Inicia sesión como alumno" };
    }
    var res = await sb.rpc("comprar_item_tienda", { p_item_id: itemId });
    if (res.error) {
      var msg = res.error.message || "No se pudo comprar";
      if (msg.indexOf("Saldo insuficiente") >= 0) {
        msg = "No tienes suficientes monedas.";
      }
      return { ok: false, error: msg };
    }
    var row = res.data && res.data[0] ? res.data[0] : null;
    if (!row) {
      return { ok: false, error: "Respuesta vacía del servidor" };
    }
    duckEconomiaAplicarSaldoLocal(row.saldo_restante);
    _duckEcoListo = true;
    if (!row.ya_tenia) {
      var lista = duckInvObtener().slice();
      if (lista.indexOf(itemId) < 0) {
        lista.push(itemId);
        duckEconomiaAplicarInventarioLocal(lista);
      }
    }
    return {
      ok: true,
      saldo: Number(row.saldo_restante) || 0,
      yaTenia: !!row.ya_tenia
    };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  }
}
