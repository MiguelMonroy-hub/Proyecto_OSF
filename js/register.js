/**
 * Lógica de signup.html: crea la cuenta en Supabase y redirige.
 * Solo alumnos: elige maestro, se vincula a él y luego va a ingresar el código de clase.
 */

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

function registerMsg(path, fallback) {
  return typeof str === "function" ? str(path, fallback) : fallback;
}

async function registerEntrarTrasCrear(email, password, profesorId) {
  if (typeof authIniciarSesion !== "function") {
    return false;
  }
  await authIniciarSesion(email, password);
  if (
    profesorId &&
    typeof alumnoVincularAMaestro === "function"
  ) {
    var vin = await alumnoVincularAMaestro(profesorId);
    if (!vin.ok) {
      throw new Error(vin.error || "No se pudo vincular con tu maestro.");
    }
  }
  if (typeof redirigirAlumnoTrasLogin === "function") {
    await redirigirAlumnoTrasLogin(email);
    return true;
  }
  window.location.href =
    typeof pagina === "function" ? pagina("join-group.html") : "join-group.html";
  return true;
}

async function registerVincularMaestroTrasAlta(profesorId) {
  if (!profesorId || typeof alumnoVincularAMaestro !== "function") {
    return { ok: true };
  }
  return alumnoVincularAMaestro(profesorId);
}

// Tras el alta: join-group si aún no tiene código de clase; si no, temas.
async function registerRedirigirAlumno(email) {
  if (typeof redirigirAlumnoTrasLogin === "function") {
    await redirigirAlumnoTrasLogin(email);
    return;
  }
  window.location.href =
    typeof pagina === "function" ? pagina("join-group.html") : "join-group.html";
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

  mostrarError("");

  if (typeof signupValidarMaestroSeleccionado === "function") {
    var valMaestro = signupValidarMaestroSeleccionado();
    if (!valMaestro.ok) {
      mostrarError(valMaestro.error);
      return;
    }
  } else {
    mostrarError("No se pudo cargar la lista de maestros.");
    return;
  }
  var profesorId = valMaestro.profesorId;

  if (typeof authValidarFormularioRegistro !== "function") {
    if (!nombre || !apellido || !email || password.length < 8) {
      mostrarError(
        "Completa nombre, apellido, correo y contraseña (mínimo 8 caracteres con mayúscula, minúscula, número y carácter especial)."
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
        rol: "ALUMNO"
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

      if (typeof alumnoSesionGuardar === "function") {
        alumnoSesionGuardar(email);
      }

      if (data && data.session) {
        var vinSesion = await registerVincularMaestroTrasAlta(profesorId);
        if (!vinSesion.ok) {
          mostrarError(vinSesion.error);
          registerEstadoBoton(btn, false);
          return;
        }
        await registerRedirigirAlumno(email);
        return;
      }

      try {
        await registerEntrarTrasCrear(email, password, profesorId);
        return;
      } catch (loginErr) {
        console.warn("[registro] sin sesión tras signUp:", loginErr);
        mostrarError(
          loginErr.message ||
            registerMsg(
              "auth.registroSinSesion",
              "Cuenta creada. Ve a «Iniciar sesión» con tu correo y contraseña."
            )
        );
        registerEstadoBoton(btn, false);
        return;
      }
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
  await registerRedirigirAlumno(email);
}
