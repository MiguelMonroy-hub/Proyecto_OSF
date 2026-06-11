// Pone el botón «Registrarse» en modo cargando o lo restaura.
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

// Texto traducible desde strings.js, o el fallback en español.
function registerMsg(path, fallback) {
  return typeof str === "function" ? str(path, fallback) : fallback;
}

// --- Vinculación con el maestro y redirección ---

// Si Supabase no devolvió sesión al registrarse, hace login manual y vincula al maestro.
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

// Llama al RPC vincular_alumno_a_maestro (grupo «Todos los alumnos» del profesor).
async function registerVincularMaestroTrasAlta(profesorId) {
  if (!profesorId || typeof alumnoVincularAMaestro !== "function") {
    return { ok: true };
  }
  return alumnoVincularAMaestro(profesorId);
}

// Después del alta: join-group si falta código de clase; si ya lo tiene, temas.
async function registerRedirigirAlumno(email) {
  if (typeof redirigirAlumnoTrasLogin === "function") {
    await redirigirAlumnoTrasLogin(email);
    return;
  }
  window.location.href =
    typeof pagina === "function" ? pagina("join-group.html") : "join-group.html";
}

// --- Arranque: preparar Supabase al cargar signup.html ---

document.addEventListener("DOMContentLoaded", function () {
  if (typeof initSupabase === "function") {
    initSupabase();
  }
});

// --- Función principal (onclick="crearCuenta()" en signup.html) ---

async function crearCuenta() {
  var nombreEl = document.getElementById("nombre");
  var apellidoEl = document.getElementById("apellido");
  var correoEl = document.getElementById("email");
  var passEl = document.getElementById("pass");
  var btn = document.querySelector(".btn-submit");
  var errBox = document.getElementById("signup-error");

  // Muestra el error en #signup-error o, si no existe, en un alert.
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

  // Paso 1: el maestro es obligatorio (signup-maestros.js).
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

  // Paso 2: nombre, apellido, correo y contraseña fuerte (auth-validacion.js).
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

      // Paso 3: signUp en Supabase Auth; el trigger SQL crea usuario + alumno + avatar.
      var data = await authRegistrarUsuario({
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
        rol: "ALUMNO"
      });

      // Correo ya registrado: identities vacío (no es un usuario nuevo).
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

      // Paso 4a: Supabase devolvió sesión → vincular maestro y redirigir.
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

      // Paso 4b: sin sesión automática → login manual y luego vincular.
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
