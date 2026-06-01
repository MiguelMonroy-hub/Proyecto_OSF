(function () {
  "use strict";

  async function obtenerEmailAlumno() {
    if (typeof initSupabase === "function") {
      await initSupabase();
    }
    if (typeof authEmailActual === "function") {
      var desdeAuth = await authEmailActual();
      if (desdeAuth) {
        return desdeAuth;
      }
    }
    if (typeof alumnoSesionEmailSync === "function") {
      return alumnoSesionEmailSync();
    }
    return "";
  }

  async function iniciar() {
    try {
      var email = await obtenerEmailAlumno();
      if (!email) {
        window.location.href =
          typeof pagina === "function" ? pagina("login.html") : "login.html";
        return;
      }

      if (typeof alumnoTieneGrupoVinculadoAsync === "function") {
        var yaUnido = await alumnoTieneGrupoVinculadoAsync(email);
        if (yaUnido) {
          window.location.href =
            typeof pagina === "function" ? pagina("topics.html") : "topics.html";
          return;
        }
      }

      var input = document.getElementById("codigo-grupo");
      var err = document.getElementById("join-error");
      var errText = document.getElementById("join-error-text");
      var btn = document.getElementById("btn-unir-grupo");
      var modal = document.querySelector(".modal-join-group");

      function limpiarError() {
        if (err) {
          err.hidden = true;
        }
        if (errText) {
          errText.textContent = "";
        }
        if (input) {
          input.classList.remove("join-codigo-input--error");
          input.removeAttribute("aria-invalid");
        }
        if (modal) {
          modal.classList.remove("modal-join-group--error");
        }
      }

      function mostrarError(msg) {
        if (!msg) {
          limpiarError();
          return;
        }
        if (errText) {
          errText.textContent = msg;
        } else if (err) {
          err.textContent = msg;
        }
        if (err) {
          err.hidden = false;
        }
        if (input) {
          input.classList.add("join-codigo-input--error");
          input.setAttribute("aria-invalid", "true");
          input.focus();
        }
        if (modal) {
          modal.classList.add("modal-join-group--error");
        }
      }

      async function intentarUnir() {
        limpiarError();
        if (btn) {
          btn.disabled = true;
        }
        try {
          var codigo = input ? input.value : "";
          var res = await alumnoVincularPorCodigo(email, codigo);
          if (!res.ok) {
            mostrarError(
              res.error || "Código incorrecto. Revisa con tu maestro e inténtalo de nuevo."
            );
            return;
          }
          window.location.href =
            typeof pagina === "function" ? pagina("topics.html") : "topics.html";
        } catch (e) {
          mostrarError(e.message || "No se pudo unir al grupo.");
        } finally {
          if (btn) {
            btn.disabled = false;
          }
        }
      }

      if (input) {
        input.addEventListener("input", function () {
          input.value = normalizarCodigoGrupo(input.value).slice(0, 6);
          limpiarError();
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
    } catch (e) {
      if (typeof authLogError === "function") {
        authLogError("join-group", e);
      } else {
        console.error("join-group:", e);
      }
      window.location.href =
        typeof pagina === "function" ? pagina("login.html") : "login.html";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
