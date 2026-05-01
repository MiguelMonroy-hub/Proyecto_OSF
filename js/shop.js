/* Tienda: catálogo completo en duck-catalog.js */
function obtenerMonedas() {
  var guardado = localStorage.getItem(TEC_DUCK_STORAGE_COINS);
  if (guardado === null) {
    return 725;
  }
  var n = parseInt(guardado, 10);
  return isNaN(n) ? 725 : n;
}

function guardarMonedas(cantidad) {
  localStorage.setItem(TEC_DUCK_STORAGE_COINS, String(cantidad));
}

function pintarMonedas(cantidad) {
  var elCoins = document.getElementById("coins-value");
  var elSaldo = document.getElementById("saldo-value");
  if (elCoins) {
    elCoins.textContent = String(cantidad);
  }
  if (elSaldo) {
    elSaldo.textContent = String(cantidad);
  }
}

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

function crearTarjetaTienda(entry) {
  var art = document.createElement("article");
  art.className = "item-card";
  art.setAttribute("data-id", entry.id);
  art.setAttribute("data-price", String(entry.price));

  var img = document.createElement("img");
  img.src = duckSrcDesdeEntrada(entry);
  img.alt = entry.label;

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

function iniciarTienda() {
  duckInvMigrar();

  if (localStorage.getItem(TEC_DUCK_STORAGE_COINS) === null) {
    guardarMonedas(725);
  }

  var monedas = obtenerMonedas();
  pintarMonedas(monedas);

  var grid = document.getElementById("shop-grid");
  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  for (var i = 0; i < DUCK_CATALOG.length; i++) {
    var entry = DUCK_CATALOG[i];
    var card = crearTarjetaTienda(entry);
    grid.appendChild(card);

    if (duckTengoId(entry.id)) {
      marcarTarjetaComprada(card);
      continue;
    }

    var precio = entry.price;
    var btn = card.querySelector(".btn-buy");

    btn.addEventListener("click", function (ev) {
      var c = ev.target.closest(".item-card");
      var pid = c.getAttribute("data-id");
      var pprecio = parseInt(c.getAttribute("data-price"), 10);
      var lista = duckInvObtener();

      if (duckTengoId(pid)) {
        return;
      }

      var m = obtenerMonedas();
      if (m < pprecio) {
        alert("No tienes suficientes monedas.");
        return;
      }

      m = m - pprecio;
      lista.push(pid);
      guardarMonedas(m);
      duckInvGuardar(lista);

      pintarMonedas(m);
      marcarTarjetaComprada(c);
      actualizarBotonesComprar();
    });

    btn.disabled = monedas < precio;
    btn.textContent = monedas < precio ? "No alcanza" : "Comprar";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarTienda);
} else {
  iniciarTienda();
}
