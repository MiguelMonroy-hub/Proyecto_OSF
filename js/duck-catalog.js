/**
 * Catálogo único: tienda (todos los ítems) + personalización (solo comprados).
 * IDs: "CATEGORIA:archivo.png"  ej. FACE:F_glasses.png
 */
var TEC_DUCK_STORAGE_COINS = "tec_duck_monedas";
var TEC_DUCK_STORAGE_INV = "tec_duck_inventario";
var TEC_DUCK_INV_FORMAT = "tec_duck_inv_format";

/* Siempre usable sin comprar (solo esta base) */
function duckIdsSiempreGratis() {
  return ["BASE:MAIN DUCK.png"];
}

/* Mapa desde IDs viejos de la tienda */
var DUCK_INV_MAPA_VIEJO = {
  H_bow: "HEAD:H_bow.png",
  F_glasses: "FACE:F_glasses.png",
  N_bag: "NECK:N_bag.png",
  F_star: "FACE:F_star.png",
  H_pin: "HEAD:H_pin.png",
  S_silver: "SHOES:S_silver.png",
  N_flower: "NECK:N_flower.png",
  S_pink: "SHOES:S_pink.png",
  F_purple: "FACE:F_purple.png",
  N_camera: "NECK:N_camera.png"
};

/**
 * sub: carpeta dentro de MAIN DUCK, vacío = raíz
 * cat: base | face | head | neck | shoes
 */
var DUCK_CATALOG = [
  { id: "BASE:MAIN DUCK.png", cat: "base", sub: "", file: "MAIN DUCK.png", label: "Normal", price: 0 },
  { id: "BASE:D_happy.png", cat: "base", sub: "", file: "D_happy.png", label: "Feliz", price: 110 },
  { id: "BASE:D_sad.png", cat: "base", sub: "", file: "D_sad.png", label: "Triste", price: 110 },
  { id: "BASE:D_angry.png", cat: "base", sub: "", file: "D_angry.png", label: "Enojado", price: 110 },
  { id: "FACE:F_black.png", cat: "face", sub: "FACE", file: "F_black.png", label: "Cara negra", price: 95 },
  { id: "FACE:F_glasses.png", cat: "face", sub: "FACE", file: "F_glasses.png", label: "Gafas", price: 100 },
  { id: "FACE:F_purple.png", cat: "face", sub: "FACE", file: "F_purple.png", label: "Antifaz morado", price: 140 },
  { id: "FACE:F_star.png", cat: "face", sub: "FACE", file: "F_star.png", label: "Estrella", price: 180 },
  { id: "HEAD:H_bow.png", cat: "head", sub: "HEAD", file: "H_bow.png", label: "Lazo", price: 150 },
  { id: "HEAD:H_ear.png", cat: "head", sub: "HEAD", file: "H_ear.png", label: "Orejas", price: 135 },
  { id: "HEAD:H_pin.png", cat: "head", sub: "HEAD", file: "H_pin.png", label: "Pin", price: 130 },
  { id: "NECK:N_bag.png", cat: "neck", sub: "NECK", file: "N_bag.png", label: "Mochila", price: 200 },
  { id: "NECK:N_camera.png", cat: "neck", sub: "NECK", file: "N_camera.png", label: "Cámara", price: 160 },
  { id: "NECK:N_flower.png", cat: "neck", sub: "NECK", file: "N_flower.png", label: "Flor", price: 90 },
  { id: "NECK:N_punk.png", cat: "neck", sub: "NECK", file: "N_punk.png", label: "Punk", price: 125 },
  { id: "SHOES:S_black.png", cat: "shoes", sub: "SHOES", file: "S_black.png", label: "Zapatos negros", price: 105 },
  { id: "SHOES:S_mc.png", cat: "shoes", sub: "SHOES", file: "S_mc.png", label: "Zapatos MC", price: 115 },
  { id: "SHOES:S_pink.png", cat: "shoes", sub: "SHOES", file: "S_pink.png", label: "Zapatos rosa", price: 110 },
  { id: "SHOES:S_silver.png", cat: "shoes", sub: "SHOES", file: "S_silver.png", label: "Zapatos plateados", price: 120 }
];

/** Saldo de monedas (misma clave que la tienda). */
function duckObtenerSaldoMonedas() {
  var g = localStorage.getItem(TEC_DUCK_STORAGE_COINS);
  if (g === null) {
    return 725;
  }
  var n = parseInt(g, 10);
  return isNaN(n) ? 725 : n;
}

function duckAgregarMonedas(cantidad) {
  var total = duckObtenerSaldoMonedas() + cantidad;
  localStorage.setItem(TEC_DUCK_STORAGE_COINS, String(total));
  return total;
}

/**
 * Precio medio solo de ítems de pago (sin gratis).
 * Recompensa por acierto repartida según preguntas por nivel (2 fácil / 2 difícil).
 */
var DUCK_QUIZ_PREGUNTAS_FACIL = 2;
var DUCK_QUIZ_PREGUNTAS_DIFICIL = 2;

function duckPrecioPromedioCatalogoPagado() {
  var sum = 0;
  var n = 0;
  for (var i = 0; i < DUCK_CATALOG.length; i++) {
    var pr = DUCK_CATALOG[i].price;
    if (pr > 0) {
      sum += pr;
      n++;
    }
  }
  return n ? sum / n : 120;
}

function duckMonedasPorPregunta(modo) {
  var media = duckPrecioPromedioCatalogoPagado();
  if (String(modo).toLowerCase() === "dificil") {
    return Math.max(5, Math.round((media * 0.38) / DUCK_QUIZ_PREGUNTAS_DIFICIL));
  }
  return Math.max(4, Math.round((media * 0.32) / DUCK_QUIZ_PREGUNTAS_FACIL));
}

function duckSrcDesdeEntrada(entry) {
  if (entry.sub) {
    return "../MAIN DUCK/" + entry.sub + "/" + entry.file;
  }
  return "../MAIN DUCK/" + entry.file;
}

function duckInvMigrar() {
  if (localStorage.getItem(TEC_DUCK_INV_FORMAT) === "v2") {
    try {
      var j = localStorage.getItem(TEC_DUCK_STORAGE_INV);
      return j ? JSON.parse(j) : [];
    } catch (e) {
      return [];
    }
  }
  var raw = localStorage.getItem(TEC_DUCK_STORAGE_INV);
  var arr = [];
  if (raw) {
    try {
      arr = JSON.parse(raw);
    } catch (e) {
      arr = [];
    }
  }
  if (!Array.isArray(arr)) {
    arr = [];
  }
  var nuevos = [];
  for (var i = 0; i < arr.length; i++) {
    var id = arr[i];
    if (DUCK_INV_MAPA_VIEJO[id]) {
      id = DUCK_INV_MAPA_VIEJO[id];
    }
    if (nuevos.indexOf(id) < 0) {
      nuevos.push(id);
    }
  }
  localStorage.setItem(TEC_DUCK_STORAGE_INV, JSON.stringify(nuevos));
  localStorage.setItem(TEC_DUCK_INV_FORMAT, "v2");
  return nuevos;
}

function duckInvObtener() {
  var lista = duckInvMigrar();
  return Array.isArray(lista) ? lista : [];
}

function duckInvGuardar(ids) {
  localStorage.setItem(TEC_DUCK_STORAGE_INV, JSON.stringify(ids));
  localStorage.setItem(TEC_DUCK_INV_FORMAT, "v2");
}

function duckTengoId(id) {
  if (duckIdsSiempreGratis().indexOf(id) >= 0) {
    return true;
  }
  return duckInvObtener().indexOf(id) >= 0;
}

function duckCatalogPorCategoria(cat) {
  var r = [];
  for (var i = 0; i < DUCK_CATALOG.length; i++) {
    if (DUCK_CATALOG[i].cat === cat) {
      r.push(DUCK_CATALOG[i]);
    }
  }
  return r;
}

function duckEntradaPorId(id) {
  for (var i = 0; i < DUCK_CATALOG.length; i++) {
    if (DUCK_CATALOG[i].id === id) {
      return DUCK_CATALOG[i];
    }
  }
  return null;
}

function duckIdDesdePieza(grupo, archivo) {
  if (!archivo) {
    return "";
  }
  var pref = { base: "BASE", face: "FACE", head: "HEAD", neck: "NECK", shoes: "SHOES" };
  var p = pref[grupo];
  if (!p) {
    return "";
  }
  return p + ":" + archivo;
}
