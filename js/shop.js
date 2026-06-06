// Tienda: muestra piezas del catálogo, descuenta monedas y las guarda en inventario local.

// Lee el saldo actual de monedas del alumno.
function obtenerMonedas() {
  return typeof duckObtenerSaldoMonedas === "function" ? duckObtenerSaldoMonedas() : 0;
}

// Escribe el saldo en localStorage (o vía economía si hay sync).
function guardarMonedas(cantidad) {
  if (typeof duckEconomiaAplicarSaldoLocal === "function") {
    duckEconomiaAplicarSaldoLocal(cantidad);
  } else {
    localStorage.setItem(TEC_DUCK_STORAGE_COINS, String(cantidad));
  }
}

// Actualiza el número de monedas que se ve en pantalla.
function pintarMonedas(cantidad) {
  var elCoins = document.getElementById("coins-value");
  if (elCoins) {
    elCoins.textContent = String(cantidad);
  }
}

// Marca la tarjeta como "ya lo tienes" y esconde el botón de compra.
function marcarTarjetaComprada(card) {
  card.classList.add("owned");
  var btn = card.querySelector(".btn-buy");
  if (btn) {
    btn.style.display = "none";
  }
  if (card.querySelector(".owned-label")) {
    return;
  }
  var msg = document.createElement("p");
  msg.className = "owned-label";
  msg.textContent = "¡En tu inventario!";
  card.appendChild(msg);
}

// Habilita o deshabilita comprar según el saldo de cada ítem.
function actualizarBotonesComprar() {
  var monedas = obtenerMonedas();
  var tarjetas = document.querySelectorAll(".item-card");

  for (var i = 0; i < tarjetas.length; i++) {
    var card = tarjetas[i];
    var id = card.getAttribute("data-id");
    var precio = parseInt(card.getAttribute("data-price"), 10);
    var btn = card.querySelector(".btn-buy");

    if (duckTengoId(id)) {
      continue;
    }
    if (!btn || btn.style.display === "none") {
      continue;
    }

    btn.disabled = monedas < precio;
    btn.textContent = monedas < precio ? "No alcanza" : "Comprar";
  }
}

// Arma el HTML de una tarjeta de producto en el grid.
function crearTarjetaTienda(entry) {
  var art = document.createElement("article");
  art.className = "item-card";
  art.setAttribute("data-id", entry.id);
  art.setAttribute("data-price", String(entry.price));

  var img = document.createElement("img");
  img.src = duckSrcDesdeEntrada(entry);
  img.alt = entry.label;
  img.decoding = "async";
  img.loading = entry.cat === "shoes" ? "eager" : "lazy";

  var h3 = document.createElement("h3");
  h3.textContent = entry.label;

  var p = document.createElement("p");
  p.className = "price";
  p.textContent = entry.price === 0 ? "🪙 Gratis" : "🪙 " + entry.price;

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn-buy";
  btn.textContent = "Comprar";

  art.appendChild(img);
  art.appendChild(h3);
  art.appendChild(p);
  art.appendChild(btn);

  return art;
}

// Monta el catálogo, pinta monedas y enlaza la lógica de compra.
async function iniciarTienda() {
  if (typeof alumnoGuardEsperar === "function") {
    var okGuard = await alumnoGuardEsperar();
    if (!okGuard) {
      return;
    }
  }

  if (typeof pageLoadMostrar === "function") {
    pageLoadMostrar({
      main:
        typeof str === "function"
          ? str("shop.cargando", "Cargando la tienda")
          : "Cargando la tienda",
      sub:
        typeof str === "function"
          ? str("shop.cargandoSub", "Preparando artículos y tu saldo…")
          : "Preparando artículos y tu saldo…"
    });
  }

  duckInvMigrar();

  var monedas = obtenerMonedas();
  pintarMonedas(monedas);

  var grid = document.getElementById("shop-grid");
  if (!grid) {
    if (typeof pageLoadOcultar === "function") {
      pageLoadOcultar();
    }
    return;
  }

  grid.innerHTML = "";

  for (var i = 0; i < DUCK_CATALOG.length; i++) {
    (function (entry) {
      var card = crearTarjetaTienda(entry);
      grid.appendChild(card);

      if (duckTengoId(entry.id)) {
        marcarTarjetaComprada(card);
        return;
      }

      var precio = entry.price;
      var btn = card.querySelector(".btn-buy");

      btn.addEventListener("click", async function () {
        if (duckTengoId(entry.id)) {
          return;
        }

        btn.disabled = true;
        btn.textContent = "…";

        if (typeof duckEconomiaComprarItem === "function") {
          var res = await duckEconomiaComprarItem(entry.id);
          if (!res.ok) {
            var errCompra =
              res.error ||
              (typeof str === "function"
                ? str("economia.compraError", "No se pudo completar la compra.")
                : "No se pudo completar la compra.");
            if (typeof uiToastError === "function") {
              uiToastError(errCompra);
            } else {
              alert(errCompra);
            }
            actualizarBotonesComprar();
            return;
          }
          if (typeof uiToastSuccess === "function") {
            uiToastSuccess(
              typeof str === "function"
                ? str("economia.compraOk", "¡Comprado!")
                : "¡Comprado!"
            );
          }
          pintarMonedas(res.saldo);
          marcarTarjetaComprada(card);
          actualizarBotonesComprar();
          return;
        }

        var m = obtenerMonedas();
        if (m < precio) {
          if (typeof uiToastError === "function") {
            uiToastError("No tienes suficientes monedas.");
          }
          actualizarBotonesComprar();
          return;
        }
        m = m - precio;
        var lista = duckInvObtener();
        lista.push(entry.id);
        guardarMonedas(m);
        duckInvGuardar(lista);
        pintarMonedas(m);
        marcarTarjetaComprada(card);
        actualizarBotonesComprar();
      });

      btn.disabled = monedas < precio;
      var sinSaldo =
      typeof str === "function" ? str("economia.sinSaldo", "No alcanza") : "No alcanza";
    btn.textContent = monedas < precio ? sinSaldo : "Comprar";
    })(DUCK_CATALOG[i]);
  }

  if (typeof pageLoadOcultar === "function") {
    pageLoadOcultar();
  }
}

// Espera a que el guard de alumno esté listo y arranca la tienda.
function arrancarShop() {
  if (typeof alumnoGuardEstaListo === "function" && alumnoGuardEstaListo()) {
    iniciarTienda();
    return;
  }
  window.addEventListener("alumno-guard-ready", iniciarTienda, { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", arrancarShop);
} else {
  arrancarShop();
}
