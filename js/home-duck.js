/* Muestra en el inicio el mismo outfit que guarda Mi pato (tec_duck_personaje) */
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
  return "../MAIN DUCK/" + archivo;
}

function rutaEnCarpeta(carpeta, archivo) {
  return "../MAIN DUCK/" + carpeta + "/" + archivo;
}

function pintarPatoInicio() {
  var outfit = cargarOutfit();
  var elBase = document.getElementById("home-img-base");
  var elFace = document.getElementById("home-img-face");
  var elHead = document.getElementById("home-img-head");
  var elNeck = document.getElementById("home-img-neck");
  var elShoes = document.getElementById("home-img-shoes");

  if (!elBase) {
    return;
  }

  elBase.src = rutaBase(outfit.base);

  if (outfit.face) {
    elFace.src = rutaEnCarpeta("FACE", outfit.face);
    elFace.hidden = false;
  } else {
    elFace.removeAttribute("src");
    elFace.hidden = true;
  }

  if (outfit.head) {
    elHead.src = rutaEnCarpeta("HEAD", outfit.head);
    elHead.hidden = false;
  } else {
    elHead.removeAttribute("src");
    elHead.hidden = true;
  }

  if (outfit.neck) {
    elNeck.src = rutaEnCarpeta("NECK", outfit.neck);
    elNeck.hidden = false;
  } else {
    elNeck.removeAttribute("src");
    elNeck.hidden = true;
  }

  if (outfit.shoes) {
    elShoes.src = rutaEnCarpeta("SHOES", outfit.shoes);
    elShoes.hidden = false;
  } else {
    elShoes.removeAttribute("src");
    elShoes.hidden = true;
  }
}

function iniciar() {
  pintarPatoInicio();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}

/* Al volver desde otra pantalla del mismo sitio, refrescar el pato */
window.addEventListener("pageshow", function () {
  pintarPatoInicio();
});
