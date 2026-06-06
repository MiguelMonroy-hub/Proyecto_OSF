// Punto de entrada de la pantalla «Elige tu tema»: sesión, tarjetas, progreso y grupo del alumno.
(function () {
  "use strict";

  // Obtiene el email del alumno desde auth o, si hace falta, desde la sesión local.
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

  // Arranca la página: overlay, guard, progreso, tarjetas y redirección si no hay grupo.
  async function iniciar() {
    if (typeof pageLoadMostrar === "function") {
      pageLoadMostrar({
        main:
          typeof str === "function"
            ? str("topics.cargando", "Volviendo a temas")
            : "Volviendo a temas",
        sub:
          typeof str === "function"
            ? str("topics.cargandoSub", "Cargando tus temas y progreso…")
            : "Cargando tus temas y progreso…"
      });
    }

    if (typeof alumnoGuardEsperar === "function") {
      var okGuard = await alumnoGuardEsperar();
      if (!okGuard) {
        if (typeof pageLoadOcultar === "function") {
          pageLoadOcultar();
        }
        return;
      }
    }

    var email = "";
    try {
      email = await obtenerEmailAlumno();
    } catch (e) {
      if (typeof authLogError === "function") {
        authLogError("topics-entry-email", e);
      }
    }

    if (email && typeof alumnoSesionGuardar === "function") {
      alumnoSesionGuardar(email);
    }

    if (typeof progresoTemasBloquearDificilCargando === "function") {
      progresoTemasBloquearDificilCargando();
    }

    if (typeof renderizarTarjetasTemas === "function") {
      renderizarTarjetasTemas();
    }

    if (typeof quizProgressCargarDesbloqueosTemas === "function") {
      try {
        var progRes = await quizProgressCargarDesbloqueosTemas();
        if (progRes && progRes.ok === false && progRes.error) {
          console.warn("[topics] progreso:", progRes.error);
        }
      } catch (e) {
        console.warn("[topics] progreso:", e);
      }
    }

    if (typeof aplicarBloqueosTarjetas === "function") {
      aplicarBloqueosTarjetas();
    }

    var tieneGrupo = false;
    try {
      tieneGrupo =
        typeof alumnoTieneGrupoVinculadoAsync === "function"
          ? await alumnoTieneGrupoVinculadoAsync(email)
          : false;
    } catch (e) {
      console.warn("[topics] grupo:", e);
    }

    if (!tieneGrupo) {
      if (typeof pageLoadOcultar === "function") {
        pageLoadOcultar();
      }
      window.location.href =
        typeof pagina === "function" ? pagina("join-group.html") : "join-group.html";
      return;
    }

    try {
      var banner = document.getElementById("topics-grupo-banner");
      if (banner) {
        var v =
          typeof alumnoObtenerGrupoVinculadoAsync === "function"
            ? await alumnoObtenerGrupoVinculadoAsync(email)
            : null;
        if (v && v.nombreGrupo) {
          banner.textContent = "Tu grupo: " + v.nombreGrupo;
          banner.hidden = false;
        }
      }
    } catch (e) {
      console.warn("[topics] banner:", e);
    }

    if (typeof pageLoadOcultar === "function") {
      pageLoadOcultar();
    }
  }

  // Genera en el DOM las tarjetas de temas a partir de TEC_DUCK_TEMAS.
  function renderizarTarjetasTemas() {
    var grid = document.getElementById("topics-grid-temas");
    if (!grid || !Array.isArray(TEC_DUCK_TEMAS)) {
      return;
    }
    var html = [];
    for (var i = 0; i < TEC_DUCK_TEMAS.length; i++) {
      var tema = TEC_DUCK_TEMAS[i];
      var codigo = tema.codigo || String(i + 1);
      var urlFacil =
        typeof paginaQuiz === "function"
          ? paginaQuiz(codigo, "facil")
          : "/pages/quiz.html?tema=" +
            encodeURIComponent(codigo) +
            "&modo=facil";
      html.push(
        '<article class="topic-card ' +
          (tema.cssClass || "") +
          '" data-tema="' +
          codigo +
          '">' +
          '<div class="topic-visual topic-visual--logo" aria-hidden="true">' +
          '<img class="topic-logo" src="' +
          (tema.backgroundImg || tema.img || "") +
          '" alt="" width="142" height="142" />' +
          "</div>" +
          '<div class="topic-body">' +
          "<h2>" +
          (tema.corto || "Tema") +
          "</h2>" +
          '<p class="topic-title">' +
          (tema.titulo || tema.nombre || "") +
          "</p>" +
          '<p class="topic-tagline">' +
          (tema.tagline || tema.descripcion || "") +
          "</p>" +
          '<div class="levels">' +
          '<a href="' +
          urlFacil +
          '" class="level-btn level-facil"><span class="lvl-badge">A</span><span class="lvl-label">Nivel básico</span><span class="lvl-go">Jugar →</span></a>' +
          '<span class="level-btn level-btn-2 level-dificil level-dificil-cargando" role="status" data-tema-cargando="' +
          codigo +
          '"><span class="lvl-badge">…</span><span class="lvl-label">Nivel avanzado</span><span class="lvl-go">Cargando progreso…</span></span>' +
          "</div></div></article>"
      );
    }
    grid.innerHTML = html.join("");
  }

  // Espera a que el guard de alumno esté listo o escucha el evento antes de llamar a iniciar.
  function arrancarTopics() {
    if (typeof alumnoGuardEstaListo === "function" && alumnoGuardEstaListo()) {
      iniciar();
      return;
    }
    window.addEventListener("alumno-guard-ready", iniciar, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancarTopics);
  } else {
    arrancarTopics();
  }
})();
