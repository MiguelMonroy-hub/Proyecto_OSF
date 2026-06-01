/**
 * Autenticación con Supabase Auth + perfil en tabla usuario.
 */
var authPerfilCache = null;

function authDebugActivo() {
  try {
    if (typeof window !== "undefined" && window.location) {
      if (window.location.search.indexOf("debug=1") >= 0) {
        return true;
      }
      if (window.localStorage && window.localStorage.getItem("tec_duck_auth_debug") === "1") {
        return true;
      }
    }
  } catch (e) {
    /* noop */
  }
  return false;
}

function authLog(contexto, detalle) {
  if (authDebugActivo()) {
    console.log("[auth:" + contexto + "]", detalle);
  }
}

function authLogError(contexto, error) {
  console.error("[auth:" + contexto + "]", error);
  if (authDebugActivo() && error && typeof error === "object") {
    console.error("[auth:" + contexto + " detalle]", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
  }
}

function normalizarCorreoAuth(correo) {
  return String(correo || "")
    .trim()
    .toLowerCase();
}

function authLimpiarCache() {
  authPerfilCache = null;
}

/**
 * Convierte errores técnicos de Supabase/red en mensajes claros para el usuario.
 */
function authExtraerMensaje(error) {
  if (!error) {
    return "Error desconocido";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error.msg) {
    return error.msg;
  }
  if (error.message) {
    return error.message;
  }
  if (error.error_description) {
    return error.error_description;
  }
  return "Error desconocido";
}

function authTraducirError(error, contexto) {
  var msg = authExtraerMensaje(error);
  var code = error && error.code ? String(error.code).toLowerCase() : "";
  var lower = msg.toLowerCase();
  var esLogin = contexto === "login";
  var esRegistro = contexto === "registro";

  if (
    lower.indexOf("failed to fetch") >= 0 ||
    lower.indexOf("networkerror") >= 0 ||
    lower.indexOf("network request failed") >= 0 ||
    lower.indexOf("load failed") >= 0 ||
    lower.indexOf("no se puede resolver") >= 0 ||
    lower.indexOf("timeout") >= 0 ||
    lower.indexOf("timed out") >= 0
  ) {
    if (typeof window !== "undefined" && window.location && window.location.protocol === "file:") {
      return "Abre la app con un servidor local (por ejemplo: npx serve en la carpeta del proyecto), no como archivo suelto.";
    }
    return "No pudimos conectar con el servicio de cuentas. Revisa tu internet o inténtalo en unos minutos.";
  }

  if (
    code === "user_already_exists" ||
    lower.indexOf("user already registered") >= 0 ||
    lower.indexOf("already been registered") >= 0 ||
    lower.indexOf("already registered") >= 0
  ) {
    return "Ya hay una cuenta con ese correo. Prueba a iniciar sesión.";
  }

  if (
    lower.indexOf("invalid login credentials") >= 0 ||
    lower.indexOf("invalid_credentials") >= 0 ||
    lower.indexOf("invalid email or password") >= 0
  ) {
    return "No encontramos una cuenta con ese correo y contraseña. Revísalos o crea una cuenta en «Crear cuenta».";
  }

  if (lower.indexOf("user not found") >= 0 || lower.indexOf("usuario no encontrado") >= 0) {
    return "No existe una cuenta con ese correo. Puedes registrarte en «Crear cuenta».";
  }

  if (lower.indexOf("email not confirmed") >= 0) {
    return "Debes confirmar tu correo antes de entrar. Revisa tu bandeja de entrada.";
  }

  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    lower.indexOf("rate limit") >= 0 ||
    lower.indexOf("security purposes") >= 0 ||
    lower.indexOf("too many requests") >= 0
  ) {
    return "Demasiados intentos seguidos. Espera un minuto e inténtalo de nuevo.";
  }

  if (
    lower.indexOf("password should be at least") >= 0 ||
    lower.indexOf("weak password") >= 0 ||
    lower.indexOf("password is too short") >= 0
  ) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (lower.indexOf("unable to validate email") >= 0 || lower.indexOf("invalid email") >= 0) {
    return "El correo no tiene un formato válido.";
  }

  if (
    lower.indexOf("database error saving new user") >= 0 ||
    lower.indexOf("database error querying schema") >= 0 ||
    lower.indexOf("database error") >= 0 ||
    lower.indexOf("relation") >= 0 && lower.indexOf("does not exist") >= 0
  ) {
    if (lower.indexOf("database error querying schema") >= 0) {
      return "La cuenta existe en la base de datos pero Auth no puede iniciar sesión. Vuelve a crear el maestro con: node scripts/crear-maestro-admin.mjs";
    }
    return "El servidor aún no está listo para registrar cuentas. Avísale a tu maestro o inténtalo más tarde.";
  }

  if (lower.indexOf("error sending confirmation email") >= 0) {
    return "No pudimos enviar el correo de confirmación. Revisa que el correo sea válido o inténtalo más tarde.";
  }

  if (lower.indexOf("no se encontró el perfil") >= 0) {
    return "Tu cuenta existe pero aún no está lista. Inténtalo más tarde o contacta a soporte.";
  }

  if (
    code === "42p17" ||
    lower.indexOf("infinite recursion") >= 0 ||
    lower.indexOf("recursion detected") >= 0
  ) {
    return "Error de permisos en la base de datos (solo afecta cuentas de maestro). Ejecuta database/02_seguridad_rls.sql en el SQL Editor de Supabase (ver database/LEEME_INSTALACION.md).";
  }

  if (lower.indexOf("supabase no está configurado") >= 0) {
    return "El servicio de cuentas no está disponible en este momento.";
  }

  if (/[áéíóúñ¿¡]/i.test(msg)) {
    return msg;
  }

  if (esLogin) {
    return "No se pudo iniciar sesión. Revisa tu correo y contraseña.";
  }
  if (esRegistro) {
    return "No se pudo crear la cuenta. Revisa tus datos e inténtalo de nuevo.";
  }
  return "Ocurrió un error. Inténtalo de nuevo.";
}

function authLanzarError(error, contexto) {
  throw new Error(authTraducirError(error, contexto));
}

async function authObtenerSesion() {
  var sb = await initSupabase();
  if (!sb) {
    return null;
  }
  var res = await sb.auth.getSession();
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data.session;
}

/**
 * Valida la sesión con el servidor y renueva el token si hace falta.
 * Evita usar getSession() solo, que puede devolver un JWT ya expirado.
 */
async function authRenovarSesionSiHaceFalta() {
  var sb = await initSupabase();
  if (!sb) {
    return null;
  }

  var userRes = await sb.auth.getUser();
  if (!userRes.error && userRes.data && userRes.data.user) {
    var sessOk = await sb.auth.getSession();
    if (sessOk.data && sessOk.data.session) {
      return sessOk.data.session;
    }
  }

  authLimpiarCache();
  var refresh = await sb.auth.refreshSession();
  if (refresh.error || !refresh.data || !refresh.data.session) {
    authLogError(
      "renovarSesion",
      refresh.error || new Error("No hay sesión activa")
    );
    return null;
  }

  authLimpiarCache();
  return refresh.data.session;
}

function authEsRol(perfil, rol) {
  if (!perfil || !perfil.rol) {
    return false;
  }
  return String(perfil.rol).toUpperCase() === String(rol).toUpperCase();
}

async function authCargarPerfil(force, sesionExplicita) {
  if (authPerfilCache && !force) {
    return authPerfilCache;
  }
  var sb = await initSupabase();
  if (!sb) {
    return null;
  }
  var sesion = sesionExplicita;
  if (!sesion) {
    sesion = await authRenovarSesionSiHaceFalta();
  }
  if (!sesion) {
    sesion = await authObtenerSesion();
  }
  if (!sesion || !sesion.user) {
    authPerfilCache = null;
    return null;
  }
  var res = await sb
    .from("usuario")
    .select("id, email, rol, nombre, apellido, auth_id")
    .eq("auth_id", sesion.user.id)
    .maybeSingle();
  if (res.error) {
    authLogError("cargarPerfil", res.error);
    throw new Error(res.error.message);
  }
  authPerfilCache = res.data;
  return authPerfilCache;
}

async function authIniciarSesion(correo, contrasena) {
  var sb = await initSupabase();
  if (!sb) {
    authLanzarError("Supabase no está configurado.", "login");
  }
  try {
    var res = await sb.auth.signInWithPassword({
      email: normalizarCorreoAuth(correo),
      password: String(contrasena || "")
    });
    if (res.error) {
      authLogError("login", res.error);
      authLanzarError(res.error, "login");
    }
    authLimpiarCache();
    var perfil = await authCargarPerfil(true, res.data.session);
    if (!perfil) {
      authLanzarError(
        "Iniciaste sesión, pero tu perfil no está vinculado en la base de datos. Revisa que usuario.auth_id coincida con el UUID de Authentication y que exista la fila en profesor.",
        "login"
      );
    }
    return {
      session: res.data.session,
      perfil: perfil
    };
  } catch (e) {
    authLogError("login", e);
    if (e && e.message && /[áéíóúñ¿¡]/i.test(e.message)) {
      throw e;
    }
    authLanzarError(e, "login");
  }
}

async function authRegistrarAlumno(datos) {
  return authRegistrarUsuario(
    Object.assign({}, datos, { rol: datos.rol || "ALUMNO" })
  );
}

async function authRegistrarUsuario(datos) {
  var sb = await initSupabase();
  if (!sb) {
    authLanzarError("Supabase no está configurado.", "registro");
  }
  var rol = datos.rol === "MAESTRO" ? "MAESTRO" : "ALUMNO";
  try {
    var res = await sb.auth.signUp({
      email: normalizarCorreoAuth(datos.email),
      password: String(datos.password || ""),
      options: {
        data: {
          nombre: String(datos.nombre || "").trim(),
          apellido: String(datos.apellido || "").trim(),
          rol: rol
        }
      }
    });
    if (res.error) {
      authLogError("registro", res.error);
      authLanzarError(res.error, "registro");
    }
    authLimpiarCache();
    return res.data;
  } catch (e) {
    authLogError("registro", e);
    if (e && e.message && /[áéíóúñ¿¡]/i.test(e.message)) {
      throw e;
    }
    authLanzarError(e, "registro");
  }
}

async function authRegistrarMaestro(datos) {
  var sb = await initSupabase();
  if (!sb) {
    throw new Error("Supabase no está configurado.");
  }
  var email = normalizarCorreoAuth(datos.email);
  var res = await sb.auth.signUp({
    email: email,
    password: String(datos.password || ""),
    options: {
      data: {
        nombre: String(datos.nombre || "").trim(),
        apellido: String(datos.apellido || "").trim(),
        rol: "MAESTRO"
      }
    }
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  authLimpiarCache();
  return res.data;
}

function authClavesLocalStorageSesion() {
  return [
    "tec_duck_personaje",
    "tec_duck_monedas",
    "tec_duck_inventario",
    "tec_duck_inv_format",
    "tec_duck_economia_migrada_v1",
    "tec_duck_quiz_cola_preguntas",
    "tec_duck_alumno_sesion",
    "tec_duck_progreso_temas",
    "tec_duck_teacher_grupos",
    "tec_duck_teacher_sesion",
    "tec_duck_teacher_asignaciones",
    "tec_duck_alumno_grupo_vinculo",
    "tec_duck_teacher_niveles"
  ];
}

function authLimpiarDatosLocalesSesion() {
  if (typeof progresoTemasLimpiar === "function") {
    progresoTemasLimpiar();
  }
  if (typeof duckAvatarLimpiarCache === "function") {
    duckAvatarLimpiarCache();
  }
  if (typeof duckEconomiaLimpiarCache === "function") {
    duckEconomiaLimpiarCache();
  }
  if (typeof alumnoSesionLimpiarLocal === "function") {
    alumnoSesionLimpiarLocal();
  }
  try {
    var claves = authClavesLocalStorageSesion();
    for (var i = 0; i < claves.length; i++) {
      localStorage.removeItem(claves[i]);
    }
    var borrar = [];
    for (var j = 0; j < localStorage.length; j++) {
      var k = localStorage.key(j);
      if (k && k.indexOf("tec_duck_") === 0) {
        borrar.push(k);
      }
    }
    for (var b = 0; b < borrar.length; b++) {
      localStorage.removeItem(borrar[b]);
    }
  } catch (e) {
    /* noop */
  }
}

async function authCerrarSesion() {
  var sb = getSupabaseSync();
  authLimpiarCache();
  authLimpiarDatosLocalesSesion();
  if (sb) {
    await sb.auth.signOut();
  }
}

async function authSesionMaestroActiva() {
  try {
    var sesion = await authRenovarSesionSiHaceFalta();
    if (!sesion || !sesion.user) {
      return false;
    }
    var perfil = await authCargarPerfil(true, sesion);
    return authEsRol(perfil, "MAESTRO");
  } catch (e) {
    authLogError("sesionMaestro", e);
    return false;
  }
}

async function authSesionAlumnoActiva() {
  try {
    var sesion = await authRenovarSesionSiHaceFalta();
    if (!sesion || !sesion.user) {
      return false;
    }
    var perfil = await authCargarPerfil(true, sesion);
    return authEsRol(perfil, "ALUMNO");
  } catch (e) {
    authLogError("sesionAlumno", e);
    return false;
  }
}

async function authEmailActual() {
  var sesion = await authRenovarSesionSiHaceFalta();
  if (!sesion) {
    sesion = await authObtenerSesion();
  }
  if (sesion && sesion.user && sesion.user.email) {
    return normalizarCorreoAuth(sesion.user.email);
  }
  return "";
}

async function authExigirMaestro() {
  if (typeof initSupabase === "function") {
    await initSupabase();
  }
  var ok = await authSesionMaestroActiva();
  if (!ok) {
    window.location.href = typeof pagina === "function" ? pagina("login.html") : "login.html";
    return false;
  }
  return true;
}

async function authExigirAlumno() {
  if (typeof initSupabase === "function") {
    await initSupabase();
  }
  var sb = getSupabaseSync();
  if (!sb) {
    window.location.href = typeof pagina === "function" ? pagina("login.html") : "login.html";
    return false;
  }
  var ok = await authSesionAlumnoActiva();
  if (!ok) {
    window.location.href = typeof pagina === "function" ? pagina("login.html") : "login.html";
    return false;
  }
  return true;
}

async function authSalir(destino) {
  if (typeof initSupabase === "function") {
    await initSupabase();
  }
  if (typeof duckAvatarFlushSync === "function") {
    try {
      await duckAvatarFlushSync();
    } catch (e) {
      console.warn("[auth] flush avatar:", e);
    }
  }
  await authCerrarSesion();
  var dest = destino || "index.html";
  window.location.href = typeof pagina === "function" ? pagina(dest) : dest;
}

function authEnlazarBotonesSalir(root) {
  var scope = root || document;
  var botones = scope.querySelectorAll("[data-auth-logout]");
  for (var i = 0; i < botones.length; i++) {
    (function (el) {
      if (el.getAttribute("data-auth-logout-hook") === "1") {
        return;
      }
      el.setAttribute("data-auth-logout-hook", "1");
      el.addEventListener("click", function (ev) {
        ev.preventDefault();
        if (el.getAttribute("data-auth-logout-busy") === "1") {
          return;
        }
        el.setAttribute("data-auth-logout-busy", "1");
        var destino = el.getAttribute("data-auth-logout") || "index.html";
        authSalir(destino).catch(function (e) {
          authLogError("salir", e);
          el.removeAttribute("data-auth-logout-busy");
        });
      });
    })(botones[i]);
  }
}

function authInitSalirListeners() {
  authEnlazarBotonesSalir();
}

function authInitRenovacionSesion() {
  if (typeof document === "undefined") {
    return;
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState !== "visible") {
      return;
    }
    if (typeof authRenovarSesionSiHaceFalta !== "function") {
      return;
    }
    authRenovarSesionSiHaceFalta().catch(function (e) {
      authLogError("renovarAlVolver", e);
    });
  });
}

function authInitListenersAuth() {
  authInitSalirListeners();
  authInitRenovacionSesion();
  initSupabase()
    .then(function (sb) {
      if (!sb || !sb.auth || typeof sb.auth.onAuthStateChange !== "function") {
        return;
      }
      sb.auth.onAuthStateChange(function (event) {
        if (
          event === "SIGNED_OUT" ||
          event === "TOKEN_REFRESHED" ||
          event === "SIGNED_IN"
        ) {
          authLimpiarCache();
          if (typeof duckAvatarLimpiarCache === "function") {
            duckAvatarLimpiarCache();
          }
        }
      });
    })
    .catch(function (e) {
      authLogError("initAuthListener", e);
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", authInitListenersAuth);
} else {
  authInitListenersAuth();
}
