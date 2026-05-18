(function () {
  "use strict";

  var email = typeof alumnoSesionEmail === "function" ? alumnoSesionEmail() : "";

  if (!email) {
    window.location.href = "login.html";
    return;
  }

  if (typeof alumnoTieneGrupoVinculado === "function" && alumnoTieneGrupoVinculado(email)) {
    window.location.href = "topics.html";
    return;
  }

  var input = document.getElementById("codigo-grupo");
  var err = document.getElementById("join-error");
  var btn = document.getElementById("btn-unir-grupo");

  function mostrarError(msg) {
    if (!err) return;
    if (msg) {
      err.textContent = msg;
      err.hidden = false;
    } else {
      err.hidden = true;
      err.textContent = "";
    }
  }

  function intentarUnir() {
    mostrarError("");
    var codigo = input ? input.value : "";
    var res = alumnoVincularPorCodigo(email, codigo);
    if (!res.ok) {
      mostrarError(res.error || "No se pudo unir al grupo.");
      return;
    }
    window.location.href = "topics.html";
  }

  if (input) {
    input.addEventListener("input", function () {
      input.value = normalizarCodigoGrupo(input.value).slice(0, 6);
      mostrarError("");
    });
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        ev.preventDefault();
        intentarUnir();
      }
    });
  }

  if (btn) {
    btn.addEventListener("click", intentarUnir);
  }
})();
