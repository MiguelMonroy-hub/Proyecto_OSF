// Barrera para páginas de alumno: comprueba sesión ALUMNO y sincroniza
// economía y avatar antes de mostrar la pantalla.
(function () {
  "use strict";

  var _promesa = null;
  var _listo = false;

  // Redirige al login si no hay sesión válida.
  function irLogin() {
    window.location.href =
      typeof pagina === "function" ? pagina("login.html") : "login.html";
  }

  // Corre la verificación una sola vez: auth, economía y outfit del pato.
  async function alumnoGuardIniciar() {
    if (_listo) {
      return true;
    }
    if (typeof authExigirAlumno !== "function") {
      irLogin();
      return false;
    }
    var ok = await authExigirAlumno();
    if (!ok) {
      return false;
    }

    if (typeof duckEconomiaSyncDesdeDb === "function") {
      try {
        await duckEconomiaSyncDesdeDb();
      } catch (e) {
        console.warn("[alumno-guard] economia:", e);
      }
    }

    if (typeof duckAvatarResolverOutfit === "function") {
      try {
        await duckAvatarResolverOutfit();
      } catch (e) {
        console.warn("[alumno-guard] avatar:", e);
      }
    }

    _listo = true;
    document.documentElement.classList.remove("alumno-guard-pending");
    document.documentElement.classList.add("alumno-guard-ready");
    window.dispatchEvent(new CustomEvent("alumno-guard-ready"));
    return true;
  }

  // Espera a que termine el guard (o devuelve al toque si ya pasó).
  function alumnoGuardEsperar() {
    if (_listo) {
      return Promise.resolve(true);
    }
    if (!_promesa) {
      _promesa = alumnoGuardIniciar().then(function (ok) {
        if (!ok) {
          _promesa = null;
        }
        return ok;
      });
    }
    return _promesa;
  }

  // ¿Ya terminó la verificación?
  function alumnoGuardEstaListo() {
    return _listo;
  }

  // Resetea el estado (útil tras logout o cambio de cuenta).
  function alumnoGuardReiniciar() {
    _listo = false;
    _promesa = null;
    document.documentElement.classList.add("alumno-guard-pending");
    document.documentElement.classList.remove("alumno-guard-ready");
  }

  document.documentElement.classList.add("alumno-guard-pending");

  window.alumnoGuardIniciar = alumnoGuardIniciar;
  window.alumnoGuardEsperar = alumnoGuardEsperar;
  window.alumnoGuardEstaListo = alumnoGuardEstaListo;
  window.alumnoGuardReiniciar = alumnoGuardReiniciar;

  alumnoGuardEsperar();
})();
