function obtenerMonedas() {
  return typeof duckObtenerSaldoMonedas === "function" ? duckObtenerSaldoMonedas() : 0;
}

function guardarMonedas(cantidad) {
  if (typeof duckEconomiaAplicarSaldoLocal === "function") {
    duckEconomiaAplicarSaldoLocal(cantidad);
  } else {
    localStorage.setItem(TEC_DUCK_STORAGE_COINS, String(cantidad));
  }
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

async function iniciarTienda() {
  if (typeof initSupabase === "function") {
    await initSupabase();
  }
  duckInvMigrar();

  if (typeof duckEconomiaSyncDesdeDb === "function") {
    try {
      await duckEconomiaSyncDesdeDb();
    } catch (e) {
      console.warn("[shop] sync:", e);
    }
  }

  var monedas = obtenerMonedas();
  pintarMonedas(monedas);

  var grid = document.getElementById("shop-grid");
  if (!grid) {
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
            alert(res.error || "No se pudo completar la compra.");
            actualizarBotonesComprar();
            return;
          }
          pintarMonedas(res.saldo);
          marcarTarjetaComprada(card);
          actualizarBotonesComprar();
          return;
        }

        var m = obtenerMonedas();
        if (m < precio) {
          alert("No tienes suficientes monedas.");
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
      btn.textContent = monedas < precio ? "No alcanza" : "Comprar";
    })(DUCK_CATALOG[i]);
  }

  setTimeout(function () {
    if (typeof duckAvatarResolverOutfit === "function") {
      duckAvatarResolverOutfit();
    }
  }, 100);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarTienda);
} else {
  iniciarTienda();
}
