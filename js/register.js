/**
 * Lógica de signup.html: crea la cuenta en Supabase y redirige.
 * Maestros van al dashboard; alumnos, a unirse a un grupo.
 */

// Muestra "Creando cuenta…" y deshabilita el botón mientras espera.
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

// Textos traducibles de esta pantalla.
function registerMsg(path, fallback) {
  return typeof str === "function" ? str(path, fallback) : fallback;
}

// Si signUp no devolvió sesión, intentamos login inmediato con las mismas credenciales.
async function registerEntrarTrasCrear(email, password, esMaestro) {
  if (typeof authIniciarSesion !== "function") {
    return false;
  }
  var resultado = await authIniciarSesion(email, password);
  if (esMaestro) {
    if (typeof gruposInicializar === "function") {
      await gruposInicializar();
    }
    window.location.href =
      typeof pagina === "function"
        ? pagina("teacher-dashboard.html")
        : "teacher-dashboard.html";
    return true;
  }
  if (typeof redirigirAlumnoTrasLogin === "function") {
    await redirigirAlumnoTrasLogin(email);
    return true;
  }
  window.location.href =
    typeof pagina === "function" ? pagina("join-group.html") : "join-group.html";
  return true;
}

// Precalienta Supabase al cargar la página.
document.addEventListener("DOMContentLoaded", function () {
  if (typeof initSupabase === "function") {
    initSupabase();
  }
});

// Handler del formulario de alta.
async function crearCuenta() {
  var nombreEl = document.getElementById("nombre");
  var apellidoEl = document.getElementById("apellido");
  var correoEl = document.getElementById("email");
  var passEl = document.getElementById("pass");
  var maestroEl = document.getElementById("es-maestro");
  var btn = document.querySelector(".btn-submit");
  var errBox = document.getElementById("signup-error");

  // Pinta el error en la caja o, si no hay, usa alert.
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

  if (typeof authValidarFormularioRegistro !== "function") {
    if (!nombre || !email || password.length < 8) {
      mostrarError(
        "Completa nombre, correo y contraseña (mínimo 8 caracteres con mayúscula, minúscula, número y carácter especial)."
      );
      return;
    }
  } else {
    var validacion = authValidarFormularioRegistro({
      nombre: nombre,
      apellido: apellido,
      email: email,
      password: password
    });
    if (!validacion.ok) {
      mostrarError(validacion.error);
      return;
    }
    email = validacion.email;
    nombre = validacion.nombre;
    apellido = validacion.apellido;
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
        mostrarError(
          registerMsg(
            "auth.correoYaRegistrado",
            "Ya hay una cuenta con ese correo. Prueba a iniciar sesión."
          )
        );
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

      try {
        await registerEntrarTrasCrear(email, password, esMaestro);
        return;
      } catch (loginErr) {
        console.warn("[registro] sin sesión tras signUp:", loginErr);
      }

      mostrarError(
        registerMsg(
          "auth.registroSinSesion",
          "Cuenta creada. Ve a «Iniciar sesión» con tu correo y contraseña."
        )
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
    window.location.href =
      typeof pagina === "function" ? pagina("topics.html") : "topics.html";
  }
}
