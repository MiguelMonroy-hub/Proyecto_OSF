/**
 * Monedas e inventario del alumno: Supabase es la fuente de verdad.
 * localStorage actúa como caché para la UI offline/inmediata.
 */
var DUCK_ECONOMIA_MIGRADA = "tec_duck_economia_migrada_v1";

var _duckEcoAlumnoId = null;
var _duckEcoSyncProm = null;

function duckEconomiaLimpiarCache() {
  _duckEcoAlumnoId = null;
}

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

function duckEconomiaAplicarSaldoLocal(saldo) {
  localStorage.setItem(TEC_DUCK_STORAGE_COINS, String(Math.max(0, saldo || 0)));
}

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

async function duckEconomiaMigrarLocalADb(sb) {
  if (localStorage.getItem(DUCK_ECONOMIA_MIGRADA) === "1") {
    return;
  }

  var saldoLocal = duckObtenerSaldoMonedas();
  var invLocal = duckInvObtener().slice();

  var alumnoRes = await sb
    .from("alumno")
    .select("saldo_monedas")
    .maybeSingle();
  if (alumnoRes.error || !alumnoRes.data) {
    return;
  }

  var saldoDb = Number(alumnoRes.data.saldo_monedas) || 0;
  if (saldoLocal > saldoDb) {
    var delta = saldoLocal - saldoDb;
    await sb.rpc("agregar_monedas_alumno", { p_cantidad: delta });
  }

  var invDbRes = await sb.from("inventario").select("item_id");
  var enDb = {};
  if (!invDbRes.error && invDbRes.data) {
    for (var i = 0; i < invDbRes.data.length; i++) {
      enDb[invDbRes.data[i].item_id] = true;
    }
  }

  for (var j = 0; j < invLocal.length; j++) {
    var id = invLocal[j];
    if (!id || enDb[id]) {
      continue;
    }
    if (typeof duckEntradaPorId === "function" && !duckEntradaPorId(id)) {
      continue;
    }
    await sb.rpc("otorgar_item_inventario", {
      p_item_id: id,
      p_origen: "GRATIS"
    });
  }

  localStorage.setItem(DUCK_ECONOMIA_MIGRADA, "1");
}

async function duckEconomiaSyncDesdeDb() {
  if (typeof initSupabase !== "function") {
    return { ok: false };
  }
  if (_duckEcoSyncProm) {
    return _duckEcoSyncProm;
  }

  _duckEcoSyncProm = (async function () {
    var sb = await initSupabase();
    if (!sb) {
      return { ok: false };
    }
    var alumnoId = await duckEconomiaObtenerAlumnoId(true);
    if (!alumnoId) {
      return { ok: false, sinSesion: true };
    }

    duckInvMigrar();
    await duckEconomiaMigrarLocalADb(sb);

    var alumnoRes = await sb
      .from("alumno")
      .select("saldo_monedas")
      .eq("id", alumnoId)
      .maybeSingle();
    if (alumnoRes.error || !alumnoRes.data) {
      return { ok: false, error: alumnoRes.error && alumnoRes.error.message };
    }

    var invRes = await sb
      .from("inventario")
      .select("item_id")
      .eq("alumno_id", alumnoId);
    if (invRes.error) {
      return { ok: false, error: invRes.error.message };
    }

    var ids = [];
    for (var i = 0; i < (invRes.data || []).length; i++) {
      ids.push(invRes.data[i].item_id);
    }

    duckEconomiaAplicarSaldoLocal(alumnoRes.data.saldo_monedas);
    duckEconomiaAplicarInventarioLocal(ids);

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

async function duckEconomiaAgregarMonedasDb(cantidad) {
  var n = parseInt(cantidad, 10);
  if (isNaN(n) || n <= 0) {
    return { ok: true, saldo: duckObtenerSaldoMonedas() };
  }
  if (typeof initSupabase !== "function") {
    return { ok: false };
  }
  try {
    var sb = await initSupabase();
    if (!sb) {
      return { ok: false };
    }
    if (!(await duckEconomiaObtenerAlumnoId())) {
      return { ok: false, sinSesion: true };
    }
    var res = await sb.rpc("agregar_monedas_alumno", { p_cantidad: n });
    if (res.error) {
      console.warn("[economia] monedas:", res.error.message);
      return { ok: false, error: res.error.message };
    }
    var saldo = Number(res.data) || 0;
    duckEconomiaAplicarSaldoLocal(saldo);
    return { ok: true, saldo: saldo };
  } catch (e) {
    console.warn("[economia] monedas:", e);
    return { ok: false, error: e.message || String(e) };
  }
}

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
