/**
 * Pantalla join-group.html: el alumno ingresa el código de 6 letras de su grupo.
 * Si ya está vinculado, salta directo a temas.
 */
(function () {
  "use strict";

  // Primero Supabase Auth; si no hay sesión, el email guardado en local.
  async function obtenerEmailAlumno() {
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

  // Monta el formulario, listeners y el flujo de unión por código.
  async function iniciar() {
    // No tocamos datos hasta que alumno-guard confirme la sesión.
    if (typeof alumnoGuardEsperar === "function") {
      var okGuard = await alumnoGuardEsperar();
      if (!okGuard) {
        return;
      }
    }

    try {
      var email = await obtenerEmailAlumno();

      // Ya tiene grupo → no hace falta pedir el código otra vez.
      if (typeof alumnoTieneGrupoVinculadoAsync === "function") {
        var yaUnido = await alumnoTieneGrupoVinculadoAsync(email);
        if (yaUnido) {
          if (typeof pageLoadIrATemas === "function") {
            pageLoadIrATemas();
          } else {
            window.location.href =
              typeof pagina === "function" ? pagina("topics.html") : "topics.html";
          }
          return;
        }
      }

      var input = document.getElementById("codigo-grupo");
      var err = document.getElementById("join-error");
      var errText = document.getElementById("join-error-text");
      var btn = document.getElementById("btn-unir-grupo");
      var modal = document.querySelector(".modal-join-group");

      // Quita estilos y mensajes de error del input y el modal.
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

      // Muestra el error y marca el input para accesibilidad.
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

      // Valida el código con el backend y redirige a temas si todo va bien.
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
          if (typeof pageLoadIrATemas === "function") {
            pageLoadIrATemas();
          } else {
            window.location.href =
              typeof pagina === "function" ? pagina("topics.html") : "topics.html";
          }
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
      if (typeof uiToastError === "function") {
        uiToastError("No se pudo cargar la página de unión al grupo.");
      }
    }
  }

  // Espera a alumno-guard antes de arrancar (o escucha el evento ready).
  function arrancarJoin() {
    if (typeof alumnoGuardEstaListo === "function" && alumnoGuardEstaListo()) {
      iniciar();
      return;
    }
    window.addEventListener("alumno-guard-ready", iniciar, { once: true });
  }

  // Arranque al cargar el DOM.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancarJoin);
  } else {
    arrancarJoin();
  }
})();
