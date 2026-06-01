function registerEstadoBoton(btn, cargando) {
  if (!btn) {
    return;
  }
  if (cargando) {
    if (!btn.dataset.labelOriginal) {
      btn.dataset.labelOriginal = btn.textContent;
    }
    btn.disabled = true;
    btn.textContent = "Creando cuenta…";
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.labelOriginal || "Registrarse";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (typeof initSupabase === "function") {
    initSupabase();
  }
});

async function crearCuenta() {
  var nombreEl = document.getElementById("nombre");
  var apellidoEl = document.getElementById("apellido");
  var correoEl = document.getElementById("email");
  var passEl = document.getElementById("pass");
  var maestroEl = document.getElementById("es-maestro");
  var btn = document.querySelector(".btn-submit");
  var errBox = document.getElementById("signup-error");

  function mostrarError(msg) {
    if (!errBox) {
      if (msg) {
        window.alert(msg);
      }
      return;
    }
    if (msg) {
      errBox.textContent = msg;
      errBox.hidden = false;
    } else {
      errBox.hidden = true;
      errBox.textContent = "";
    }
  }

  var nombre = nombreEl ? nombreEl.value.trim() : "";
  var apellido = apellidoEl ? apellidoEl.value.trim() : "";
  var email = correoEl ? correoEl.value.trim() : "";
  var password = passEl ? passEl.value : "";
  var esMaestro = !!(maestroEl && maestroEl.checked);

  mostrarError("");

  if (!nombre || !email || password.length < 6) {
    mostrarError("Completa nombre, correo y contraseña (mínimo 6 caracteres).");
    return;
  }

  registerEstadoBoton(btn, true);

  try {
    if (typeof authRegistrarUsuario === "function") {
      await initSupabase();
      var data = await authRegistrarUsuario({
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
        rol: esMaestro ? "MAESTRO" : "ALUMNO"
      });

      if (
        data &&
        data.user &&
        (!data.user.identities || data.user.identities.length === 0)
      ) {
        mostrarError("Ya hay una cuenta con ese correo. Prueba a iniciar sesión.");
        registerEstadoBoton(btn, false);
        return;
      }

      if (!esMaestro && typeof alumnoSesionGuardar === "function") {
        alumnoSesionGuardar(email);
      }

      if (data && data.session) {
        if (esMaestro) {
          if (typeof gruposInicializar === "function") {
            await gruposInicializar();
          }
          window.location.href =
            typeof pagina === "function"
              ? pagina("teacher-dashboard.html")
              : "teacher-dashboard.html";
          return;
        }
        window.location.href =
          typeof pagina === "function" ? pagina("join-group.html") : "join-group.html";
        return;
      }

      mostrarError(
        "Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión."
      );
      registerEstadoBoton(btn, false);
      return;
    }
  } catch (e) {
    console.error("Registro fallido:", e);
    mostrarError(
      typeof authTraducirError === "function"
        ? authTraducirError(e, "registro")
        : e.message || "No se pudo crear la cuenta."
    );
    registerEstadoBoton(btn, false);
    return;
  }

  registerEstadoBoton(btn, false);
  if (typeof redirigirAlumnoTrasLogin === "function") {
    await redirigirAlumnoTrasLogin(email);
  } else {
    window.location.href = typeof pagina === "function" ? pagina("topics.html") : "topics.html";
  }
}
