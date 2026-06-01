/**
 * Outfit del pato: localStorage, rutas de imágenes y pintado en capas.
 * La sincronización con Supabase vive en duck-avatar-sync.js.
 */
var DUCK_OUTFIT_STORAGE_KEY = "tec_duck_personaje";

function duckOutfitDefecto() {
  if (typeof duckOutfitPorDefecto === "function") {
    return duckOutfitPorDefecto();
  }
  return {
    base: "MAIN DUCK.png",
    face: "",
    head: "",
    neck: "",
    shoes: ""
  };
}

function duckOutfitNormalizar(obj) {
  var d = duckOutfitDefecto();
  if (!obj || typeof obj !== "object") {
    return d;
  }
  d.base = obj.base || d.base;
  d.face = obj.face || "";
  d.head = obj.head || "";
  d.neck = obj.neck || "";
  d.shoes = obj.shoes || "";
  return d;
}

function duckOutfitLeerLocalConMeta() {
  var raw = localStorage.getItem(DUCK_OUTFIT_STORAGE_KEY);
  if (!raw) {
    return { outfit: duckOutfitDefecto(), guardadoEn: 0 };
  }
  try {
    var o = JSON.parse(raw);
    return {
      outfit: duckOutfitNormalizar(o),
      guardadoEn: o.guardadoEn ? Number(o.guardadoEn) : 0
    };
  } catch (e) {
    return { outfit: duckOutfitDefecto(), guardadoEn: 0 };
  }
}

function duckOutfitLeerLocal() {
  return duckOutfitLeerLocalConMeta().outfit;
}

function duckOutfitGuardarLocal(outfit, guardadoEn) {
  var o = duckOutfitNormalizar(outfit);
  localStorage.setItem(
    DUCK_OUTFIT_STORAGE_KEY,
    JSON.stringify({
      base: o.base,
      face: o.face,
      head: o.head,
      neck: o.neck,
      shoes: o.shoes,
      guardadoEn: guardadoEn || Date.now()
    })
  );
}

function duckOutfitAString(outfit) {
  return JSON.stringify(duckOutfitNormalizar(outfit));
}

function duckOutfitSrcCampo(campo, archivo) {
  if (typeof duckSrcDesdeOutfitCampo === "function") {
    return duckSrcDesdeOutfitCampo(campo, archivo);
  }
  if (campo === "base") {
    return "../MAIN DUCK/DUCK/" + (archivo || "MAIN DUCK.png");
  }
  if (!archivo) {
    return "";
  }
  var carpetas = { face: "FACE", head: "HEAD", neck: "NECK", shoes: "SHOES" };
  return "../MAIN DUCK/" + (carpetas[campo] || "") + "/" + archivo;
}

function duckOutfitPintarCapa(el, campo, archivo) {
  if (!el) {
    return;
  }
  if (!archivo) {
    el.removeAttribute("src");
    el.hidden = true;
    return;
  }
  el.src = duckOutfitSrcCampo(campo, archivo);
  el.hidden = false;
}

/**
 * @param {Object} ids - mapa campo → id de elemento img
 * @param {Object} [outfit] - si se omite, se lee de localStorage
 */
function duckOutfitPintarEnIds(ids, outfit) {
  ids = ids || {};
  var o = outfit ? duckOutfitNormalizar(outfit) : duckOutfitLeerLocal();
  var elBase = document.getElementById(ids.base || "home-img-base");
  if (!elBase) {
    return;
  }
  duckOutfitPintarCapa(elBase, "base", o.base);
  duckOutfitPintarCapa(document.getElementById(ids.face || "home-img-face"), "face", o.face);
  duckOutfitPintarCapa(document.getElementById(ids.head || "home-img-head"), "head", o.head);
  duckOutfitPintarCapa(document.getElementById(ids.neck || "home-img-neck"), "neck", o.neck);
  duckOutfitPintarCapa(document.getElementById(ids.shoes || "home-img-shoes"), "shoes", o.shoes);
}

function duckOutfitAjustarAlInventario(outfit) {
  var o = duckOutfitNormalizar(outfit);
  if (typeof duckInvMigrar !== "function" || typeof duckTengoId !== "function") {
    return o;
  }
  duckInvMigrar();
  if (!duckTengoId(duckIdDesdePieza("base", o.base))) {
    o.base = "MAIN DUCK.png";
  }
  if (o.face && !duckTengoId(duckIdDesdePieza("face", o.face))) {
    o.face = "";
  }
  if (o.head && !duckTengoId(duckIdDesdePieza("head", o.head))) {
    o.head = "";
  }
  if (o.neck && !duckTengoId(duckIdDesdePieza("neck", o.neck))) {
    o.neck = "";
  }
  if (o.shoes && !duckTengoId(duckIdDesdePieza("shoes", o.shoes))) {
    o.shoes = "";
  }
  return o;
}

var DUCK_OUTFIT_IDS_PORTADA = {
  base: "home-img-base",
  face: "home-img-face",
  head: "home-img-head",
  neck: "home-img-neck",
  shoes: "home-img-shoes"
};

var DUCK_OUTFIT_IDS_CUSTOMIZE = {
  base: "img-base",
  face: "img-face",
  head: "img-head",
  neck: "img-neck",
  shoes: "img-shoes"
};

function duckOutfitRefrescarPortada() {
  if (document.getElementById(DUCK_OUTFIT_IDS_PORTADA.base)) {
    duckOutfitPintarEnIds(DUCK_OUTFIT_IDS_PORTADA);
  }
}

function duckOutfitIniciarPortada() {
  duckOutfitRefrescarPortada();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", duckOutfitRefrescarPortada);
  }
  window.addEventListener("pageshow", duckOutfitRefrescarPortada);
}

if (document.getElementById(DUCK_OUTFIT_IDS_PORTADA.base)) {
  duckOutfitIniciarPortada();
}
