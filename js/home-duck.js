var CLAVE_OUTFIT = "tec_duck_personaje";

function outfitPorDefecto() {
  return {
    base: "MAIN DUCK.png",
    face: "",
    head: "",
    neck: "",
    shoes: ""
  };
}

function cargarOutfit() {
  var raw = localStorage.getItem(CLAVE_OUTFIT);
  if (!raw) {
    return outfitPorDefecto();
  }
  try {
    var o = JSON.parse(raw);
    var d = outfitPorDefecto();
    d.base = o.base || d.base;
    d.face = o.face || "";
    d.head = o.head || "";
    d.neck = o.neck || "";
    d.shoes = o.shoes || "";
    return d;
  } catch (e) {
    return outfitPorDefecto();
  }
}

function rutaBase(archivo) {
  return "../MAIN DUCK/DUCK/" + archivo;
}

function rutaEnCarpeta(carpeta, archivo) {
  return "../MAIN DUCK/" + carpeta + "/" + archivo;
}

/**
 * IDs de elementos <img> en capas. Por defecto, portada principal.
 */
function pintarPatoPorIds(ids) {
  ids = ids || {};
  var elBase =
    document.getElementById(ids.base || "home-img-base");
  var elFace =
    document.getElementById(ids.face || "home-img-face");
  var elHead =
    document.getElementById(ids.head || "home-img-head");
  var elNeck =
    document.getElementById(ids.neck || "home-img-neck");
  var elShoes =
    document.getElementById(ids.shoes || "home-img-shoes");

  if (!elBase) {
    return;
  }

  var outfit = cargarOutfit();

  elBase.src = rutaBase(outfit.base);

  if (elFace) {
    if (outfit.face) {
      elFace.src = rutaEnCarpeta("FACE", outfit.face);
      elFace.hidden = false;
    } else {
      elFace.removeAttribute("src");
      elFace.hidden = true;
    }
  }

  if (elHead) {
    if (outfit.head) {
      elHead.src = rutaEnCarpeta("HEAD", outfit.head);
      elHead.hidden = false;
    } else {
      elHead.removeAttribute("src");
      elHead.hidden = true;
    }
  }

  if (elNeck) {
    if (outfit.neck) {
      elNeck.src = rutaEnCarpeta("NECK", outfit.neck);
      elNeck.hidden = false;
    } else {
      elNeck.removeAttribute("src");
      elNeck.hidden = true;
    }
  }

  if (elShoes) {
    if (outfit.shoes) {
      elShoes.src = rutaEnCarpeta("SHOES", outfit.shoes);
      elShoes.hidden = false;
    } else {
      elShoes.removeAttribute("src");
      elShoes.hidden = true;
    }
  }
}

function pintarPatoInicio() {
  pintarPatoPorIds({
    base: "home-img-base",
    face: "home-img-face",
    head: "home-img-head",
    neck: "home-img-neck",
    shoes: "home-img-shoes"
  });
}

function iniciar() {
  if (document.getElementById("home-img-base")) {
    pintarPatoInicio();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}

/* Al volver desde otra pantalla del mismo sitio, refrescar el pato */
window.addEventListener("pageshow", function () {
  if (document.getElementById("home-img-base")) {
    pintarPatoInicio();
  }
});
