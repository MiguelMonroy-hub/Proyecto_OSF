/* Personalización: solo ítems que existen en el inventario (tienda) */
var CLAVE = "tec_duck_personaje";

function valoresPorDefecto() {
  return {
    base: "MAIN DUCK.png",
    face: "",
    head: "",
    neck: "",
    shoes: ""
  };
}

function cargarOutfit() {
  var raw = localStorage.getItem(CLAVE);
  if (!raw) {
    return valoresPorDefecto();
  }
  try {
    var o = JSON.parse(raw);
    var d = valoresPorDefecto();
    d.base = o.base || d.base;
    d.face = o.face || "";
    d.head = o.head || "";
    d.neck = o.neck || "";
    d.shoes = o.shoes || "";
    return d;
  } catch (e) {
    return valoresPorDefecto();
  }
}

function guardarOutfit(outfit) {
  localStorage.setItem(CLAVE, JSON.stringify(outfit));
}

function rutaBase(archivo) {
  return "../MAIN DUCK/" + archivo;
}

function rutaEnCarpeta(carpeta, archivo) {
  return "../MAIN DUCK/" + carpeta + "/" + archivo;
}

function aplicarVistaPrevia(outfit) {
  var elBase = document.getElementById("img-base");
  var elFace = document.getElementById("img-face");
  var elHead = document.getElementById("img-head");
  var elNeck = document.getElementById("img-neck");
  var elShoes = document.getElementById("img-shoes");

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

function ajustarOutfitAlInventario(outfit) {
  duckInvMigrar();
  var o = {
    base: outfit.base || "MAIN DUCK.png",
    face: outfit.face || "",
    head: outfit.head || "",
    neck: outfit.neck || "",
    shoes: outfit.shoes || ""
  };

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

  guardarOutfit(o);
  return o;
}

function vaciarOpts(panel) {
  var opts = panel.querySelector(".opts");
  if (opts) {
    opts.innerHTML = "";
  }
  return opts;
}

function crearBotonNinguno(activo) {
  var b = document.createElement("button");
  b.type = "button";
  b.className = "opt-none" + (activo ? " selected" : "");
  b.setAttribute("data-valor", "__ninguno__");
  b.textContent = "Ninguno";
  return b;
}

function crearBotonItem(entry, activo) {
  var b = document.createElement("button");
  b.type = "button";
  b.className = "opt" + (activo ? " selected" : "");
  b.setAttribute("data-valor", entry.file);
  b.title = entry.label;
  var img = document.createElement("img");
  img.src = duckSrcDesdeEntrada(entry);
  img.alt = "";
  b.appendChild(img);
  return b;
}

function construirPanelBase(outfit) {
  var panel = document.querySelector('.panel[data-grupo="base"]');
  if (!panel) {
    return;
  }
  var opts = vaciarOpts(panel);
  var lista = duckCatalogPorCategoria("base");
  var cuenta = 0;
  for (var i = 0; i < lista.length; i++) {
    var e = lista[i];
    if (!duckTengoId(e.id)) {
      continue;
    }
    opts.appendChild(crearBotonItem(e, outfit.base === e.file));
    cuenta++;
  }
  var hint = panel.querySelector(".panel-hint");
  if (hint) {
    hint.hidden = cuenta > 0;
  }
}

function construirPanelAccesorio(grupo, categoria, outfit, clave) {
  var panel = document.querySelector('.panel[data-grupo="' + grupo + '"]');
  if (!panel) {
    return;
  }
  var opts = vaciarOpts(panel);
  var val = outfit[clave] || "";
  opts.appendChild(crearBotonNinguno(!val));

  var lista = duckCatalogPorCategoria(categoria);
  var cuentaComprados = 0;
  for (var i = 0; i < lista.length; i++) {
    var e = lista[i];
    if (!duckTengoId(e.id)) {
      continue;
    }
    cuentaComprados++;
    opts.appendChild(crearBotonItem(e, val === e.file));
  }

  var hint = panel.querySelector(".panel-hint");
  if (hint) {
    hint.hidden = cuentaComprados > 0;
  }
}

function enlazarPaneles() {
  var paneles = document.querySelectorAll(".panel");
  for (var p = 0; p < paneles.length; p++) {
    var panel = paneles[p];
    if (panel.getAttribute("data-listo") === "1") {
      continue;
    }
    panel.setAttribute("data-listo", "1");
    panel.addEventListener("click", function (ev) {
      var btn = ev.target.closest(".opt, .opt-none");
      if (!btn || !this.contains(btn)) {
        return;
      }

      var grupo = this.getAttribute("data-grupo");
      var valor = btn.getAttribute("data-valor");
      if (valor === "__ninguno__") {
        valor = "";
      }

      if (grupo === "base" && valor) {
        if (!duckTengoId(duckIdDesdePieza("base", valor))) {
          return;
        }
      }
      if (grupo === "face" && valor && !duckTengoId(duckIdDesdePieza("face", valor))) {
        return;
      }
      if (grupo === "head" && valor && !duckTengoId(duckIdDesdePieza("head", valor))) {
        return;
      }
      if (grupo === "neck" && valor && !duckTengoId(duckIdDesdePieza("neck", valor))) {
        return;
      }
      if (grupo === "shoes" && valor && !duckTengoId(duckIdDesdePieza("shoes", valor))) {
        return;
      }

      var outfit = cargarOutfit();
      if (grupo === "base") {
        outfit.base = valor || "MAIN DUCK.png";
      }
      if (grupo === "face") {
        outfit.face = valor;
      }
      if (grupo === "head") {
        outfit.head = valor;
      }
      if (grupo === "neck") {
        outfit.neck = valor;
      }
      if (grupo === "shoes") {
        outfit.shoes = valor;
      }

      outfit = ajustarOutfitAlInventario(outfit);
      guardarOutfit(outfit);
      aplicarVistaPrevia(outfit);

      var todos = this.querySelectorAll(".opt, .opt-none");
      for (var i = 0; i < todos.length; i++) {
        todos[i].classList.remove("selected");
      }
      btn.classList.add("selected");
    });
  }
}

function iniciar() {
  duckInvMigrar();
  var outfit = ajustarOutfitAlInventario(cargarOutfit());
  aplicarVistaPrevia(outfit);

  construirPanelBase(outfit);
  construirPanelAccesorio("face", "face", outfit, "face");
  construirPanelAccesorio("head", "head", outfit, "head");
  construirPanelAccesorio("neck", "neck", outfit, "neck");
  construirPanelAccesorio("shoes", "shoes", outfit, "shoes");

  enlazarPaneles();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}
