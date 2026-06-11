/**
 * Outfit del pato: localStorage, rutas de imágenes y pintado en capas.
 * La sincronización con Supabase vive en duck-avatar-sync.js.
 */
var DUCK_OUTFIT_STORAGE_KEY = "tec_duck_personaje";
var DUCK_OUTFIT_PORTADA_KEY = "tec_duck_personaje_portada";

// Outfit vacío; usa duck-catalog si ya cargó.
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

// Rellena huecos y limpia valores raros del objeto outfit.
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

// Lee el pato guardado y cuándo se guardó por última vez.
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

// Solo el outfit, sin la fecha de guardado.
function duckOutfitLeerLocal() {
  return duckOutfitLeerLocalConMeta().outfit;
}

// Persiste el outfit en localStorage del navegador.
function duckOutfitGuardarLocal(outfit, guardadoEn) {
  var o = duckOutfitNormalizar(outfit);
  var payload = JSON.stringify({
    base: o.base,
    face: o.face,
    head: o.head,
    neck: o.neck,
    shoes: o.shoes,
    guardadoEn: guardadoEn || Date.now()
  });
  localStorage.setItem(DUCK_OUTFIT_STORAGE_KEY, payload);
  localStorage.setItem(DUCK_OUTFIT_PORTADA_KEY, payload);
}

// Outfit mostrado en la portada (persiste tras cerrar sesión o el navegador).
function duckOutfitLeerPortada() {
  var raw =
    localStorage.getItem(DUCK_OUTFIT_PORTADA_KEY) ||
    localStorage.getItem(DUCK_OUTFIT_STORAGE_KEY);
  if (!raw) {
    return duckOutfitDefecto();
  }
  try {
    var o = JSON.parse(raw);
    return duckOutfitNormalizar(o);
  } catch (e) {
    return duckOutfitDefecto();
  }
}

// Serializa el outfit para comparar si hubo cambios.
function duckOutfitAString(outfit) {
  return JSON.stringify(duckOutfitNormalizar(outfit));
}

// Ruta de la imagen de una capa (cara, cabeza, etc.).
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

// Pone o quita una capa en un <img> del DOM.
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

// Pinta todas las capas del pato según los IDs de los <img> en la página.
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

// Quita piezas que el alumno no tiene compradas.
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

var DUCK_OUTFIT_IDS_QUIZ = {
  base: "quiz-img-base",
  face: "quiz-img-face",
  head: "quiz-img-head",
  neck: "quiz-img-neck",
  shoes: "quiz-img-shoes"
};

// Repinta el pato en la barra del quiz.
function duckOutfitRefrescarQuiz() {
  if (!document.getElementById(DUCK_OUTFIT_IDS_QUIZ.base)) {
    return;
  }
  var outfit = duckOutfitLeerLocal();
  if (typeof duckOutfitAjustarAlInventario === "function") {
    outfit = duckOutfitAjustarAlInventario(outfit);
  }
  duckOutfitPintarEnIds(DUCK_OUTFIT_IDS_QUIZ, outfit);
}

// Arranca el refresco del pato en el quiz.
function duckOutfitIniciarQuiz() {
  duckOutfitRefrescarQuiz();
  window.addEventListener("pageshow", duckOutfitRefrescarQuiz);
  window.addEventListener("alumno-guard-ready", duckOutfitRefrescarQuiz);
}

// Repinta el pato en la pantalla de inicio si está el contenedor.
function duckOutfitRefrescarPortada() {
  if (document.getElementById(DUCK_OUTFIT_IDS_PORTADA.base)) {
    duckOutfitPintarEnIds(DUCK_OUTFIT_IDS_PORTADA, duckOutfitLeerPortada());
  }
}

// Arranca el refresco del pato al cargar y al volver con el botón atrás.
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

if (document.getElementById(DUCK_OUTFIT_IDS_QUIZ.base)) {
  duckOutfitIniciarQuiz();
}
