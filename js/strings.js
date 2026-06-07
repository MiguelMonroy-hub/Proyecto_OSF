// Textos de la app en un solo sitio. Usa str("auth.loginFallido") para leerlos.
var STRINGS = {
  marca: "TecDuck",
  auth: {
    sesionExpirada: "Tu sesión expiró. Vuelve a iniciar sesión.",
    soloAlumno: "Debes iniciar sesión como alumno.",
    soloMaestro: "Debes iniciar sesión como maestro.",
    errorConexion: "No se pudo conectar con la nube. Revisa tu internet e inténtalo de nuevo.",
    nombreRequerido: "El nombre es obligatorio.",
    apellidoRequerido: "El apellido es obligatorio.",
    correoRequerido: "El correo es obligatorio.",
    correoInvalido: "El correo no tiene un formato válido.",
    correoYaRegistrado: "Ya hay una cuenta con ese correo. Prueba a iniciar sesión.",
    passCorta: "La contraseña debe tener al menos 8 caracteres.",
    passMayuscula: "La contraseña debe incluir al menos una letra mayúscula.",
    passMinuscula: "La contraseña debe incluir al menos una letra minúscula.",
    passNumero: "La contraseña debe incluir al menos un número.",
    passEspecial:
      "La contraseña debe incluir al menos un carácter especial (por ejemplo ! @ # $).",
    passRequisitos:
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
    passHint:
      "Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter especial.",
    passLoginRequerida: "Ingresa tu contraseña.",
    loginDatosIncompletos: "Ingresa tu correo y contraseña.",
    loginFallido: "No se pudo iniciar sesión.",
    servicioNoDisponible: "El servicio de cuentas no está disponible.",
    registroOk: "Cuenta creada correctamente.",
    registroSinSesion:
      "Cuenta creada. Ve a «Iniciar sesión» con tu correo y contraseña.",
    cuentaNoActiva:
      "No pudimos iniciar sesión con esta cuenta. Vuelve a intentarlo o habla con tu maestro.",
    registroFallido: "No se pudo crear la cuenta. Revisa tus datos e inténtalo de nuevo."
  },
  topics: {
    cargando: "Volviendo a temas",
    cargandoSub: "Cargando tus temas y progreso…"
  },
  shop: {
    cargando: "Cargando la tienda",
    cargandoSub: "Preparando artículos y tu saldo…"
  },
  economia: {
    cargandoSaldo: "Cargando tu saldo…",
    compraOk: "¡Comprado! Ya está en tu inventario.",
    compraError: "No se pudo completar la compra.",
    sinSaldo: "No alcanza"
  },
  avatar: {
    cargando: "Cargando tu pato",
    cargandoSub: "Preparando piezas y vista previa…",
    guardadoOk: "¡Pato guardado!",
    guardadoError: "No se pudo guardar en la nube."
  },
  quiz: {
    previewBanner: "Modo vista previa — no se guarda progreso ni monedas.",
    cargandoNivel: "Cargando la tecduck-aventura"
  },
  maestro: {
    cargandoPanel: "Cargando alumnos…",
    guardarNivelOk: "Nivel guardado. Tus alumnos lo verán en Temas.",
    previewNivel: "Vista previa",
    borradorSinGuardar: "Tienes cambios sin guardar en este nivel.",
    errorGuardarNivel:
      "No se pudo guardar la práctica. Revisa tu conexión e inténtalo de nuevo.",
    errorGuardarGrupos:
      "No se pudo guardar la asignación a grupos. Recarga la página e inténtalo otra vez.",
    errorGuardarPreguntas:
      "No se pudo guardar las preguntas. Vuelve a pulsar Guardar; si sigue fallando, recarga la página.",
    errorGuardarPermisos:
      "No tienes permiso para guardar este cambio. Cierra sesión, vuelve a entrar como maestro e inténtalo.",
    errorEliminarNivel:
      "No se pudo eliminar la práctica. Revisa tu conexión e inténtalo de nuevo.",
    errorCargarNiveles:
      "No se pudieron cargar tus prácticas. Revisa tu conexión y recarga la página.",
    errorCargarPanel:
      "No se pudo cargar el panel. Revisa tu conexión y recarga la página.",
    errorGrupo:
      "No se pudo completar la acción con el grupo. Inténtalo de nuevo.",
    errorSesion: "Tu sesión expiró. Vuelve a iniciar sesión e inténtalo.",
    errorConexion:
      "No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo."
  },
  grupo: {
    codigoInvalido: "Código no válido. Revisa con tu maestro."
  }
};

// Busca un texto por ruta con puntos, ej. "shop.cargando". Si no existe, usa fallback o la ruta.
function str(path, fallback) {
  var parts = String(path || "").split(".");
  var cur = STRINGS;
  for (var i = 0; i < parts.length; i++) {
    if (!cur || typeof cur !== "object") {
      return fallback != null ? fallback : path;
    }
    cur = cur[parts[i]];
  }
  return cur != null ? cur : fallback != null ? fallback : path;
}

// Convierte errores técnicos de Supabase/Postgres en mensajes claros para el maestro.
function maestroErrorAmigable(err, contexto) {
  var raw = "";
  if (typeof err === "string") {
    raw = err;
  } else if (err && err.message) {
    raw = err.message;
  } else if (err) {
    raw = String(err);
  }
  raw = raw.trim();
  var lower = raw.toLowerCase();

  function msg(path, fallback) {
    return typeof str === "function" ? str(path, fallback) : fallback;
  }

  function porContexto(defPath, defFallback) {
    if (contexto === "eliminar") {
      return msg("maestro.errorEliminarNivel", defFallback);
    }
    if (contexto === "cargar") {
      return msg("maestro.errorCargarNiveles", defFallback);
    }
    if (contexto === "panel") {
      return msg("maestro.errorCargarPanel", defFallback);
    }
    if (contexto === "grupo") {
      return msg("maestro.errorGrupo", defFallback);
    }
    return msg(defPath, defFallback);
  }

  if (!raw) {
    return porContexto(
      "maestro.errorGuardarNivel",
      "No se pudo completar la acción. Inténtalo de nuevo."
    );
  }

  if (
    lower.indexOf("failed to fetch") >= 0 ||
    lower.indexOf("networkerror") >= 0 ||
    lower.indexOf("load failed") >= 0
  ) {
    return msg(
      "maestro.errorConexion",
      "No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo."
    );
  }

  if (
    lower.indexOf("jwt") >= 0 ||
    lower.indexOf("not authenticated") >= 0 ||
    lower.indexOf("sesión") >= 0 ||
    lower.indexOf("inicia sesión") >= 0
  ) {
    return msg(
      "maestro.errorSesion",
      "Tu sesión expiró. Vuelve a iniciar sesión e inténtalo."
    );
  }

  if (
    lower.indexOf("row-level security") >= 0 ||
    lower.indexOf("permission denied") >= 0 ||
    lower.indexOf("42501") >= 0
  ) {
    if (lower.indexOf("respuesta_maestro") >= 0 || lower.indexOf("pregunta_maestro") >= 0) {
      return msg(
        "maestro.errorGuardarPreguntas",
        "No se pudo guardar las preguntas. Vuelve a pulsar Guardar; si sigue fallando, recarga la página."
      );
    }
    return msg(
      "maestro.errorGuardarPermisos",
      "No tienes permiso para guardar este cambio. Cierra sesión, vuelve a entrar como maestro e inténtalo."
    );
  }

  if (
    lower.indexOf("duplicate key") >= 0 ||
    lower.indexOf("unique constraint") >= 0
  ) {
    if (lower.indexOf("nivel_maestro_grupo") >= 0) {
      return msg(
        "maestro.errorGuardarGrupos",
        "No se pudo guardar la asignación a grupos. Recarga la página e inténtalo otra vez."
      );
    }
    return porContexto(
      "maestro.errorGuardarNivel",
      "No se pudo guardar la práctica. Recarga la página e inténtalo otra vez."
    );
  }

  if (lower.indexOf("foreign key") >= 0) {
    if (lower.indexOf("respuesta") >= 0 || lower.indexOf("pregunta") >= 0) {
      return msg(
        "maestro.errorGuardarPreguntas",
        "No se pudo guardar las preguntas. Vuelve a pulsar Guardar; si sigue fallando, recarga la página."
      );
    }
    return porContexto(
      "maestro.errorGuardarNivel",
      "No se pudo guardar la práctica. Recarga la página e inténtalo otra vez."
    );
  }

  var esTecnico =
    lower.indexOf("constraint") >= 0 ||
    lower.indexOf("violates") >= 0 ||
    lower.indexOf("pgrst") >= 0 ||
    lower.indexOf("postgres") >= 0 ||
    lower.indexOf("sql") >= 0 ||
    lower.indexOf("_fkey") >= 0 ||
    lower.indexOf("_key") >= 0;

  if (esTecnico) {
    return porContexto(
      "maestro.errorGuardarNivel",
      "No se pudo guardar la práctica. Revisa tu conexión e inténtalo de nuevo."
    );
  }

  if (raw.indexOf("No se pudo") === 0 || raw.indexOf("No tienes") === 0) {
    return raw;
  }

  if (
    lower.indexOf("sin grupo") >= 0 ||
    raw.indexOf("No puedes dejar") === 0
  ) {
    return raw;
  }

  return porContexto(
    "maestro.errorGuardarNivel",
    "No se pudo guardar la práctica. Revisa tu conexión e inténtalo de nuevo."
  );
}
