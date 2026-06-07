/**
 * Reglas de validación para login y registro.
 * Expone todo en window para que auth-service.js valide antes de llamar a Supabase.
 */
(function () {
  "use strict";

  var RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Texto i18n vía strings.js, o el fallback en español.
  function msg(path, fallback) {
    return typeof str === "function" ? str(path, fallback) : fallback;
  }

  // El nombre no puede ir vacío.
  function authValidarNombre(nombre) {
    if (!String(nombre || "").trim()) {
      return {
        ok: false,
        error: msg("auth.nombreRequerido", "El nombre es obligatorio.")
      };
    }
    return { ok: true };
  }

  // El apellido no puede ir vacío.
  function authValidarApellido(apellido) {
    if (!String(apellido || "").trim()) {
      return {
        ok: false,
        error: msg("auth.apellidoRequerido", "El apellido es obligatorio.")
      };
    }
    return { ok: true };
  }

  // Formato básico de correo y normalización a minúsculas.
  function authValidarCorreo(correo) {
    var normalizado =
      typeof normalizarCorreoAuth === "function"
        ? normalizarCorreoAuth(correo)
        : String(correo || "")
            .trim()
            .toLowerCase();
    if (!normalizado) {
      return {
        ok: false,
        error: msg("auth.correoRequerido", "El correo es obligatorio.")
      };
    }
    if (!RE_CORREO.test(normalizado)) {
      return {
        ok: false,
        error: msg(
          "auth.correoInvalido",
          "El correo no tiene un formato válido."
        )
      };
    }
    return { ok: true, email: normalizado };
  }

  // Política fuerte: 8+ caracteres, mayúscula, minúscula, número y símbolo.
  function authValidarContrasenaRegistro(password) {
    var pass = String(password || "");
    if (pass.length < 8) {
      return {
        ok: false,
        error: msg(
          "auth.passCorta",
          "La contraseña debe tener al menos 8 caracteres."
        )
      };
    }
    if (!/[A-Z]/.test(pass)) {
      return {
        ok: false,
        error: msg(
          "auth.passMayuscula",
          "La contraseña debe incluir al menos una letra mayúscula."
        )
      };
    }
    if (!/[a-z]/.test(pass)) {
      return {
        ok: false,
        error: msg(
          "auth.passMinuscula",
          "La contraseña debe incluir al menos una letra minúscula."
        )
      };
    }
    if (!/[0-9]/.test(pass)) {
      return {
        ok: false,
        error: msg(
          "auth.passNumero",
          "La contraseña debe incluir al menos un número."
        )
      };
    }
    if (!/[^A-Za-z0-9]/.test(pass)) {
      return {
        ok: false,
        error: msg(
          "auth.passEspecial",
          "La contraseña debe incluir al menos un carácter especial (por ejemplo ! @ # $)."
        )
      };
    }
    return { ok: true };
  }

  // En login solo pedimos que no venga vacía.
  function authValidarContrasenaLogin(password) {
    if (!String(password || "")) {
      return {
        ok: false,
        error: msg("auth.passLoginRequerida", "Ingresa tu contraseña.")
      };
    }
    return { ok: true };
  }

  // Valida nombre, apellido, correo y contraseña del signup de una pasada.
  function authValidarFormularioRegistro(datos) {
    datos = datos || {};
    var vNombre = authValidarNombre(datos.nombre);
    if (!vNombre.ok) {
      return vNombre;
    }
    var vApellido = authValidarApellido(datos.apellido);
    if (!vApellido.ok) {
      return vApellido;
    }
    var vCorreo = authValidarCorreo(datos.email);
    if (!vCorreo.ok) {
      return vCorreo;
    }
    var vPass = authValidarContrasenaRegistro(datos.password);
    if (!vPass.ok) {
      return vPass;
    }
    return {
      ok: true,
      email: vCorreo.email,
      nombre: String(datos.nombre || "").trim(),
      apellido: String(datos.apellido || "").trim()
    };
  }

  // Correo + contraseña antes de intentar el signIn.
  function authValidarFormularioLogin(correo, password) {
    var vCorreo = authValidarCorreo(correo);
    if (!vCorreo.ok) {
      return vCorreo;
    }
    var vPass = authValidarContrasenaLogin(password);
    if (!vPass.ok) {
      return vPass;
    }
    return { ok: true, email: vCorreo.email };
  }

  // Publicamos en window (el proyecto no usa módulos ES aquí).
  window.authValidarNombre = authValidarNombre;
  window.authValidarApellido = authValidarApellido;
  window.authValidarCorreo = authValidarCorreo;
  window.authValidarContrasenaRegistro = authValidarContrasenaRegistro;
  window.authValidarContrasenaLogin = authValidarContrasenaLogin;
  window.authValidarFormularioRegistro = authValidarFormularioRegistro;
  window.authValidarFormularioLogin = authValidarFormularioLogin;
})();
