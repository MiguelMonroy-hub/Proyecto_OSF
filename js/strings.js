// Textos de la app en un solo sitio. Usa str("auth.loginFallido") para leerlos.
var STRINGS = {
  marca: "TecDuck",
  auth: {
    sesionExpirada: "Tu sesión expiró. Vuelve a iniciar sesión.",
    soloAlumno: "Debes iniciar sesión como alumno.",
    soloMaestro: "Debes iniciar sesión como maestro.",
    errorConexion: "No se pudo conectar con la nube. Revisa tu internet e inténtalo de nuevo.",
    nombreRequerido: "El nombre es obligatorio.",
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
    exportCsv: "Exportar CSV",
    guardarNivelOk: "Nivel guardado. Tus alumnos lo verán en Temas.",
    previewNivel: "Vista previa",
    borradorSinGuardar: "Tienes cambios sin guardar en este nivel."
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
