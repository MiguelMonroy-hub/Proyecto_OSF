var TEC_DUCK_STORAGE_COINS = "tec_duck_monedas";
var TEC_DUCK_STORAGE_INV = "tec_duck_inventario";
var TEC_DUCK_INV_FORMAT = "tec_duck_inv_format";

// Piezas que todos tienen desde el inicio, sin comprarlas.
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
 * sub: carpeta dentro de MAIN DUCK (p. ej. DUCK, FACE, HEAD)
 * cat: base | face | head | neck | shoes
 */
var DUCK_CATALOG = [
  { id: "BASE:MAIN DUCK.png", cat: "base", sub: "DUCK", file: "MAIN DUCK.png", label: "Normal", price: 0 },
  { id: "FACE:F_black.png", cat: "face", sub: "FACE", file: "F_black.png", label: "Lentes de sol", price: 95 },
  { id: "FACE:F_glasses.png", cat: "face", sub: "FACE", file: "F_glasses.png", label: "Gafas", price: 100 },
  { id: "FACE:F_purple.png", cat: "face", sub: "FACE", file: "F_purple.png", label: "Gafas Estrella", price: 140 },
  { id: "FACE:F_star.png", cat: "face", sub: "FACE", file: "F_star.png", label: "Estrellas", price: 180 },
  { id: "HEAD:H_bow.png", cat: "head", sub: "HEAD", file: "H_bow.png", label: "Moño", price: 150 },
  { id: "HEAD:H_ear.png", cat: "head", sub: "HEAD", file: "H_ear.png", label: "Orejeras", price: 135 },
  { id: "HEAD:H_pin.png", cat: "head", sub: "HEAD", file: "H_pin.png", label: "Lazo", price: 130 },
  { id: "NECK:N_bag.png", cat: "neck", sub: "NECK", file: "N_bag.png", label: "Mochila", price: 200 },
  { id: "NECK:N_camera.png", cat: "neck", sub: "NECK", file: "N_camera.png", label: "Cámara", price: 160 },
  { id: "NECK:N_flower.png", cat: "neck", sub: "NECK", file: "N_flower.png", label: "Collar de flores", price: 90 },
  { id: "NECK:N_punk.png", cat: "neck", sub: "NECK", file: "N_punk.png", label: "Punk", price: 125 },
  { id: "SHOES:S_black.png", cat: "shoes", sub: "SHOES", file: "S_black.png", label: "Tenis Negros", price: 105 },
  { id: "SHOES:S_mc.png", cat: "shoes", sub: "SHOES", file: "S_mc.png", label: "Zapatos MC", price: 115 },
  { id: "SHOES:S_pink.png", cat: "shoes", sub: "SHOES", file: "S_pink.png", label: "Sandalias", price: 110 },
  { id: "SHOES:S_silver.png", cat: "shoes", sub: "SHOES", file: "S_silver.png", label: "Botas vaqueras", price: 120 }
];

// Cuántas monedas hay guardadas en el navegador.
function duckObtenerSaldoMonedas() {
  if (
    typeof duckEconomiaEstaListo === "function" &&
    !duckEconomiaEstaListo()
  ) {
    return 0;
  }
  var g = localStorage.getItem(TEC_DUCK_STORAGE_COINS);
  if (g === null) {
    return 0;
  }
  var n = parseInt(g, 10);
  return isNaN(n) ? 0 : n;
}

// Suma monedas al saldo local (por ejemplo tras un quiz).
function duckAgregarMonedas(cantidad) {
  var n = parseInt(cantidad, 10);
  if (isNaN(n) || n <= 0) {
    return duckObtenerSaldoMonedas();
  }
  var total = duckObtenerSaldoMonedas() + n;
  localStorage.setItem(TEC_DUCK_STORAGE_COINS, String(total));
  return total;
}

// Arma la ruta relativa de la imagen de un ítem del catálogo.
function duckSrcDesdeEntrada(entry) {
  if (entry.sub) {
    return "../MAIN DUCK/" + entry.sub + "/" + entry.file;
  }
  if (entry.cat === "base") {
    return "../MAIN DUCK/DUCK/" + entry.file;
  }
  return "../MAIN DUCK/" + entry.file;
}

// Pasa el inventario viejo al formato v2 y traduce IDs antiguos.
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

// Lista de IDs que el alumno ya compró.
function duckInvObtener() {
  if (
    typeof duckEconomiaEstaListo === "function" &&
    !duckEconomiaEstaListo()
  ) {
    return [];
  }
  var lista = duckInvMigrar();
  return Array.isArray(lista) ? lista : [];
}

// Guarda el inventario en localStorage.
function duckInvGuardar(ids) {
  localStorage.setItem(TEC_DUCK_STORAGE_INV, JSON.stringify(ids));
  localStorage.setItem(TEC_DUCK_INV_FORMAT, "v2");
}

// ¿El alumno ya tiene este ítem? (o es gratis de fábrica)
function duckTengoId(id) {
  if (duckIdsSiempreGratis().indexOf(id) >= 0) {
    return true;
  }
  return duckInvObtener().indexOf(id) >= 0;
}

// Filtra el catálogo: base, face, head, neck o shoes.
function duckCatalogPorCategoria(cat) {
  var r = [];
  for (var i = 0; i < DUCK_CATALOG.length; i++) {
    if (DUCK_CATALOG[i].cat === cat) {
      r.push(DUCK_CATALOG[i]);
    }
  }
  return r;
}

// Busca un ítem del catálogo por su ID completo.
function duckEntradaPorId(id) {
  for (var i = 0; i < DUCK_CATALOG.length; i++) {
    if (DUCK_CATALOG[i].id === id) {
      return DUCK_CATALOG[i];
    }
  }
  return null;
}

// Convierte "head" + "H_bow.png" → "HEAD:H_bow.png".
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

// Pato básico, sin accesorios puestos.
function duckOutfitPorDefecto() {
  return {
    base: "MAIN DUCK.png",
    face: "",
    head: "",
    neck: "",
    shoes: ""
  };
}

// Traduce una fila de la tabla avatar a nombres de archivo locales.
function duckOutfitDesdeDbRow(row) {
  if (!row) {
    return duckOutfitPorDefecto();
  }
  // De un ID de catálogo saca solo el nombre del png.
  function archivoDesdeId(id) {
    if (!id) {
      return "";
    }
    var entry = duckEntradaPorId(id);
    return entry ? entry.file : "";
  }
  return {
    base: archivoDesdeId(row.item_base_id) || "MAIN DUCK.png",
    face: archivoDesdeId(row.item_face_id),
    head: archivoDesdeId(row.item_head_id),
    neck: archivoDesdeId(row.item_neck_id),
    shoes: archivoDesdeId(row.item_shoes_id)
  };
}

// Outfit local → columnas item_*_id para guardar en Supabase.
function duckOutfitADbIds(outfit) {
  var o = outfit || duckOutfitPorDefecto();
  return {
    item_base_id:
      duckIdDesdePieza("base", o.base || "MAIN DUCK.png") || "BASE:MAIN DUCK.png",
    item_face_id: o.face ? duckIdDesdePieza("face", o.face) : null,
    item_head_id: o.head ? duckIdDesdePieza("head", o.head) : null,
    item_neck_id: o.neck ? duckIdDesdePieza("neck", o.neck) : null,
    item_shoes_id: o.shoes ? duckIdDesdePieza("shoes", o.shoes) : null
  };
}

// Ruta de imagen para una capa concreta del pato (base, cara, etc.).
function duckSrcDesdeOutfitCampo(campo, archivo) {
  if (campo === "base") {
    var idBase = duckIdDesdePieza("base", archivo || "MAIN DUCK.png");
    var entryBase = duckEntradaPorId(idBase);
    if (entryBase) {
      return duckSrcDesdeEntrada(entryBase);
    }
    return "../MAIN DUCK/DUCK/" + (archivo || "MAIN DUCK.png");
  }
  if (!archivo) {
    return "";
  }
  var id = duckIdDesdePieza(campo, archivo);
  var entry = duckEntradaPorId(id);
  if (entry) {
    return duckSrcDesdeEntrada(entry);
  }
  var carpetas = { face: "FACE", head: "HEAD", neck: "NECK", shoes: "SHOES" };
  return "../MAIN DUCK/" + carpetas[campo] + "/" + archivo;
}

// HTML apilado de capas para el avatar mini del panel de maestro.
function duckHtmlAvatarMini(outfit, version) {
  var o = outfit || duckOutfitPorDefecto();
  var bust = version
    ? "?v=" + encodeURIComponent(String(version).replace(/[^\w.-]/g, ""))
    : "";
  var capas = [
    { key: "base", cls: "teacher-avatar-base", siempre: true },
    { key: "shoes", cls: "teacher-avatar-shoes" },
    { key: "neck", cls: "teacher-avatar-neck" },
    { key: "face", cls: "teacher-avatar-face" },
    { key: "head", cls: "teacher-avatar-head" }
  ];
  var html = '<div class="teacher-avatar teacher-avatar--duck" aria-hidden="true">';
  for (var i = 0; i < capas.length; i++) {
    var capa = capas[i];
    var valor = o[capa.key];
    if (!valor && !capa.siempre) {
      continue;
    }
    var src = duckSrcDesdeOutfitCampo(capa.key, valor);
    if (!src) {
      continue;
    }
    html +=
      '<img class="teacher-avatar-layer ' +
      capa.cls +
      '" src="' +
      src +
      bust +
      '" alt="">';
  }
  html += "</div>";
  return html;
}
