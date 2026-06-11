// Pantalla del quiz: el alumno responde preguntas, pierde vidas y gana monedas.
// Carga parámetros de la URL, valida acceso, sincroniza el avance con la nube
// y puede reanudar una partida que quedó a medias. También cubre niveles del
// maestro, modo vista previa y el plano de coordenadas (JXG) en temas 1 y 2.

(function () {
  "use strict";

  var tnId = null;
  var nivelMaestro = null;
  var quizOptsPartida = null;
  var temaId = "1";
  var modo = "facil";
  var quizModoPreview = false;

  // Lee los query params de la URL aunque el navegador no los exponga bien en search.
  function quizSearchParams() {
    var search = window.location.search || "";
    if (!search && window.location.href.indexOf("?") >= 0) {
      search = "?" + window.location.href.split("?")[1].split("#")[0];
    }
    return new URLSearchParams(search);
  }

  // Extrae de la URL el tema, modo, id de nivel maestro (tn) y si es vista previa.
  function quizLeerParamsPartida() {
    var params = quizSearchParams();
    var modoRaw = String(params.get("modo") || "facil")
      .trim()
      .toLowerCase();
    return {
      tnId: params.get("tn"),
      temaId: String(params.get("tema") || "1").trim() || "1",
      modo: modoRaw === "dificil" ? "dificil" : "facil",
      preview: params.get("preview") === "1"
    };
  }

  // Aplica los parámetros de partida a las variables globales y limpia config anterior.
  function aplicarParamsPartida(conf) {
    conf = conf || quizLeerParamsPartida();
    tnId = conf.tnId;
    temaId = conf.temaId;
    modo = conf.modo;
    quizModoPreview = !!conf.preview;
    nivelMaestro = null;
    quizOptsPartida = null;
    if (window.quizConfigPartida) {
      delete window.quizConfigPartida;
    }
  }

  aplicarParamsPartida();

  // Dice si esta partida puede mostrar el mapa JXG (solo temas 1 y 2, salvo que lo desactiven).
  function partidaUsaMapaJXG() {
    var t = String(temaId);
    if (t !== "1" && t !== "2") {
      return false;
    }
    if (
      window.quizConfigPartida &&
      window.quizConfigPartida.mostrarJxg === false
    ) {
      return false;
    }
    return true;
  }

  // En básico el mapa se dibuja al elegir opción; en avanzado, solo al confirmar un acierto.
  function jxgVistaAlSeleccionarOpcion() {
    return modo === "facil";
  }

  // Actualiza el texto de ayuda del panel del mapa según el modo y la pregunta.
  function actualizarHintMapaJXG(pregunta) {
    var hint = document.querySelector(".quiz-jxg-panel-hint");
    if (!hint || !pregunta) {
      return;
    }
    if (
      !partidaUsaMapaJXG() ||
      typeof quizPreguntaUsaMapaJXG !== "function" ||
      !quizPreguntaUsaMapaJXG(temaId, pregunta)
    ) {
      return;
    }
    hint.textContent =
      pregunta.jxg && pregunta.jxg.fijo
        ? "Plano de coordenadas — observa el punto y elige la respuesta correcta"
        : modo === "dificil"
        ? "Plano de coordenadas — se dibujará al confirmar la respuesta correcta"
        : "Plano de coordenadas — elige una opción para verla dibujada";
  }

  // Vuelve a preparar el mapa para la pregunta en la que estamos.
  function reiniciarMapaPreguntaActual() {
    if (!lista[indice]) {
      return;
    }
    prepararMapaPregunta(lista[indice]);
  }

  // Comprueba que el alumno haya desbloqueado el modo avanzado del tema antes de jugar.
  async function validarAccesoTemaModo() {
    if (tnId || modo !== "dificil") {
      return true;
    }
    if (typeof quizProgressCargarDesbloqueosTemas === "function") {
      await quizProgressCargarDesbloqueosTemas();
    }
    if (
      typeof isDificilDesbloqueado === "function" &&
      !isDificilDesbloqueado(temaId)
    ) {
      quizAvisar(
        "Completa el nivel básico de este tema antes de jugar el avanzado."
      );
      irATemasQuiz();
      return false;
    }
    return true;
  }

  // Muestra un aviso al usuario (toast si hay, si no alert clásico).
  function quizAvisar(msg) {
    if (typeof uiToastError === "function") {
      uiToastError(msg);
    } else {
      window.alert(msg);
    }
  }

  // Pinta u oculta el banner de modo vista previa (no guarda progreso ni monedas).
  function pintarBannerPreview() {
    var banner = document.getElementById("quiz-preview-banner");
    if (!banner) {
      return;
    }
    if (!quizModoPreview) {
      banner.hidden = true;
      return;
    }
    banner.textContent =
      typeof str === "function"
        ? str("quiz.previewBanner", "Modo vista previa — no se guarda progreso ni monedas.")
        : "Modo vista previa — no se guarda progreso ni monedas.";
    banner.hidden = false;
    document.body.classList.add("quiz--preview");
  }

  // Valida que el nivel del maestro exista, sea del grupo del alumno y no esté vencido.
  async function validarAccesoNivelMaestro() {
    if (!tnId) {
      return true;
    }
    if (!nivelMaestro) {
      quizAvisar("Este nivel no existe o fue eliminado.");
      irATemasQuiz();
      return false;
    }
    if (quizModoPreview) {
      if (!nivelMaestroContarPreguntas(nivelMaestro)) {
        quizAvisar("Este nivel aún no tiene preguntas.");
        return false;
      }
      return true;
    }
    var vinculo =
      typeof alumnoObtenerGrupoVinculadoAsync === "function"
        ? await alumnoObtenerGrupoVinculadoAsync()
        : null;
    if (!vinculo || !vinculo.grupoId) {
      quizAvisar("Este nivel no está disponible para tu grupo.");
      irATemasQuiz();
      return false;
    }
    if (!nivelMaestroVisibleParaGrupo(nivelMaestro, vinculo.grupoId)) {
      quizAvisar("Este nivel no está disponible para tu grupo.");
      irATemasQuiz();
      return false;
    }
    if (
      typeof nivelMaestroFechaVencida === "function" &&
      nivelMaestroFechaVencida(nivelMaestro, vinculo.grupoId)
    ) {
      quizAvisar("La fecha límite de este nivel ya pasó. Ya no puedes jugarlo.");
      irATemasQuiz();
      return false;
    }
    if (!nivelMaestroContarPreguntas(nivelMaestro)) {
      quizAvisar("Este nivel aún no tiene preguntas. Avísale a tu maestro.");
      irATemasQuiz();
      return false;
    }
    return true;
  }

  var lista = [];
  var indice = 0;
  var vidas = 3;
  var partidaTerminada = false;
  var respondidaBien = false;
  var monedaPagada = false;
  /* Guardamos los datos de las opciones de la pregunta actual para no depender
     de leer atributos del DOM al renderizar la retroalimentación. */
  var opcionesActuales = [];
  /** Incorrectas dadas ya en esta pregunta antes del primer acierto (se reinicia cada pregunta). */
  var erroresOpcionIncorrectaEstaPregunta = 0;
  /** Índice de opción elegida pendiente de confirmar (null = ninguna). */
  var seleccionPendienteIdx = null;
  var _quizSync = {
    porIndice: {},
    preguntasOk: 0,
    monedasGanadas: 0,
    monedasServidor: 0,
    lastSaveParams: null,
    preguntaInicioMs: Date.now(),
    finalizado: false,
    pausado: false
  };

  // Resetea el estado interno que usamos para sincronizar la partida con el servidor.
  function reiniciarQuizSync() {
    _quizSync = {
      porIndice: {},
      preguntasOk: 0,
      monedasGanadas: 0,
      monedasServidor: 0,
      lastSaveParams: null,
      preguntaInicioMs: Date.now(),
      finalizado: false,
      pausado: false
    };
  }

  // Cuántos segundos lleva el alumno en la pregunta actual (mínimo 1).
  function tiempoSegundosPreguntaActual() {
    return Math.max(
      1,
      Math.round((Date.now() - (_quizSync.preguntaInicioMs || Date.now())) / 1000)
    );
  }

  // Texto corto de la pregunta actual, para guardarlo en la actividad.
  function textoPreguntaActual() {
    var p = lista[indice];
    return p ? String(p.q || "").slice(0, 220) : "";
  }

  // Registra un fallo en la pregunta actual sin marcarla como contestada correctamente.
  function registrarErrorPreguntaActual() {
    var prev = _quizSync.porIndice[indice];
    _quizSync.porIndice[indice] = {
      indice: indice,
      ok: false,
      errores: erroresOpcionIncorrectaEstaPregunta,
      tiempo: prev ? prev.tiempo : tiempoSegundosPreguntaActual(),
      texto: textoPreguntaActual(),
      contestada: false,
      omitida: false
    };
  }

  // Anota en sync que la pregunta se contestó (bien o mal) con tiempo y errores.
  function registrarActividadPregunta(ok, texto) {
    _quizSync.porIndice[indice] = {
      indice: indice,
      ok: !!ok,
      errores: erroresOpcionIncorrectaEstaPregunta,
      tiempo: tiempoSegundosPreguntaActual(),
      texto: String(texto || "").slice(0, 220),
      contestada: true,
      omitida: false
    };
    if (ok) {
      _quizSync.preguntasOk += 1;
    }
  }

  // Arma el array de actividad que mandamos al guardar, según el estado de la partida.
  function construirActividadParaGuardar(estadoPartida) {
    var act = [];
    var i;
    for (i = 0; i < lista.length; i++) {
      var entry = _quizSync.porIndice[i];
      if (entry) {
        act.push({
          indice: entry.indice,
          ok: !!entry.ok,
          errores: entry.errores || 0,
          tiempo: entry.tiempo || 0,
          texto: entry.texto || "",
          contestada: entry.contestada !== false,
          omitida: !!entry.omitida
        });
        continue;
      }
      if (estadoPartida === "GAME_OVER") {
        act.push({
          indice: i,
          ok: false,
          errores: 0,
          tiempo: 0,
          texto: lista[i] ? String(lista[i].q || "").slice(0, 220) : "",
          contestada: false,
          omitida: true
        });
      } else if (
        (estadoPartida === "ABANDONADA" || estadoPartida === "EN_CURSO") &&
        i === indice
      ) {
        act.push({
          indice: i,
          ok: !!respondidaBien,
          errores: erroresOpcionIncorrectaEstaPregunta,
          tiempo: tiempoSegundosPreguntaActual(),
          texto: textoPreguntaActual(),
          contestada: !!respondidaBien,
          omitida: false
        });
      }
    }
    return act;
  }

  // Cuenta cuántas preguntas van bien en un array de actividad.
  function contarPreguntasOkActividad(act) {
    var n = 0;
    for (var i = 0; i < act.length; i++) {
      if (act[i] && act[i].ok) {
        n += 1;
      }
    }
    return n;
  }

  // Promedio de segundos por pregunta contestada en la actividad.
  function tiempoPromedioActividad(act) {
    if (!act.length) {
      return 0;
    }
    var sum = 0;
    var n = 0;
    for (var i = 0; i < act.length; i++) {
      if (act[i] && act[i].tiempo != null && act[i].contestada !== false) {
        sum += act[i].tiempo || 0;
        n += 1;
      }
    }
    return n ? Math.round(sum / n) : 0;
  }

  // Envío ligero al cerrar pestaña o navegar (keepalive), sin bloquear la salida.
  function enviarResultadoQuizKeepalive(estadoPartida) {
    if (
      quizModoPreview ||
      typeof quizProgressConstruirParamsGuardar !== "function" ||
      typeof quizProgressEnvioKeepalive !== "function" ||
      !lista.length
    ) {
      return false;
    }
    var actividadItems = construirActividadParaGuardar(estadoPartida);
    if (!actividadItems.length && estadoPartida !== "EN_CURSO") {
      return false;
    }
    var preguntaIds = idsPreguntasLista(lista);
    var preguntasSnapshot = lista.map(function (p) {
      return { id: p.id, texto: String(p.q || "").slice(0, 220) };
    });
    var actividadPayload =
      typeof quizProgressEmpaquetarActividad === "function"
        ? quizProgressEmpaquetarActividad(
            actividadItems,
            preguntaIds,
            preguntasSnapshot
          )
        : actividadItems;
    var params = quizProgressConstruirParamsGuardar({
      temaId: tnId ? null : parseInt(temaId, 10),
      nivelMaestroId:
        tnId && nivelMaestro
          ? nivelMaestro.dbId || parseInt(nivelMaestro.id, 10) || null
          : null,
      modo: modo,
      estado: estadoPartida,
      preguntasOk: contarPreguntasOkActividad(actividadItems),
      preguntasTotal: lista.length,
      tiempoPromedioSeg: tiempoPromedioActividad(actividadItems),
      monedasGanadas: _quizSync.monedasGanadas,
      vidasRestantes: vidas,
      indicePregunta: calcularIndiceParaGuardar(estadoPartida),
      actividad: actividadPayload
    });
    return quizProgressEnvioKeepalive(params);
  }

  // Guarda el resultado de la partida en Supabase (completada, game over, pausa, etc.).
  async function enviarResultadoQuiz(estadoPartida) {
    if (quizModoPreview) {
      return true;
    }
    if (typeof quizProgressGuardar !== "function") {
      return false;
    }
    if (tnId && !nivelMaestro) {
      return false;
    }
    var esFinal =
      estadoPartida === "COMPLETADA" || estadoPartida === "GAME_OVER";
    var esPausa =
      estadoPartida === "ABANDONADA" || estadoPartida === "EN_CURSO";
    if (_quizSync.finalizado && esFinal) {
      return false;
    }
    if (_quizSync.pausado && esPausa) {
      return true;
    }
    if (!lista.length) {
      return false;
    }

    var actividadItems = construirActividadParaGuardar(estadoPartida);
    if (!actividadItems.length && !esPausa) {
      return false;
    }

    var preguntaIds = idsPreguntasLista(lista);
    var preguntasSnapshot = lista.map(function (p) {
      return {
        id: p.id,
        texto: String(p.q || "").slice(0, 220)
      };
    });
    var actividadPayload =
      typeof quizProgressEmpaquetarActividad === "function"
        ? quizProgressEmpaquetarActividad(
            actividadItems,
            preguntaIds,
            preguntasSnapshot
          )
        : actividadItems;

    try {
      var payload = {
        temaId: tnId ? null : parseInt(temaId, 10),
        nivelMaestroId:
          tnId && nivelMaestro
            ? nivelMaestro.dbId || parseInt(nivelMaestro.id, 10) || null
            : null,
        modo: modo,
        estado: estadoPartida,
        preguntasOk: contarPreguntasOkActividad(actividadItems),
        preguntasTotal: lista.length,
        tiempoPromedioSeg: tiempoPromedioActividad(actividadItems),
        monedasGanadas: _quizSync.monedasGanadas,
        vidasRestantes: vidas,
        indicePregunta: calcularIndiceParaGuardar(estadoPartida),
        actividad: actividadPayload
      };
      if (typeof quizProgressConstruirParamsGuardar === "function") {
        _quizSync.lastSaveParams = quizProgressConstruirParamsGuardar(payload);
      }
      var res = await quizProgressGuardar(payload);
      if (!res || !res.ok) {
        console.warn("[quiz] sync:", res && res.error ? res.error : "Error desconocido");
        return false;
      }
      if (res.monedasPartida != null) {
        _quizSync.monedasGanadas = res.monedasPartida;
        _quizSync.monedasServidor = res.monedasPartida;
      }
      if (esFinal) {
        _quizSync.finalizado = true;
      }
      if (esPausa) {
        _quizSync.pausado = true;
      }
      return true;
    } catch (e) {
      console.warn("[quiz] sync:", e);
      return false;
    }
  }

  // Estado con el que guardamos al salir: sigue en curso si quedan vidas, si no abandonada.
  function estadoSalidaConVidas() {
    return vidas > 0 ? "EN_CURSO" : "ABANDONADA";
  }

  // Saca los ids de pregunta de la lista actual (para empaquetar actividad).
  function idsPreguntasLista(arr) {
    var ids = [];
    var i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i].id) {
        ids.push(arr[i].id);
      }
    }
    return ids;
  }

  // Índice de pregunta que guardamos: si acaba de acertar, apunta a la siguiente.
  function calcularIndiceParaGuardar(estadoPartida) {
    if (estadoPartida !== "EN_CURSO" && estadoPartida !== "ABANDONADA") {
      return indice;
    }
    if (respondidaBien && !partidaTerminada) {
      var next = indice + 1;
      return next < lista.length ? next : indice;
    }
    return indice;
  }

  // Restaura vidas, índice, monedas y actividad desde lo que vino de la base de datos.
  function aplicarEstadoPartidaDesdeDb(partida, itemsActividad) {
    var idx = Math.max(0, parseInt(partida.indice_pregunta, 10) || 0);
    if (idx >= lista.length) {
      idx = Math.max(0, lista.length - 1);
    }
    indice = idx;
    vidas = Math.min(3, Math.max(0, parseInt(partida.vidas_restantes, 10) || 0));
    partidaTerminada = false;
    respondidaBien = false;
    monedaPagada = false;
    reiniciarQuizSync();
    _quizSync.monedasGanadas = parseInt(partida.monedas_ganadas, 10) || 0;
    _quizSync.monedasServidor = _quizSync.monedasGanadas;
    var i;
    for (i = 0; i < itemsActividad.length; i++) {
      var it = itemsActividad[i];
      if (!it || it.indice == null) {
        continue;
      }
      _quizSync.porIndice[it.indice] = {
        indice: it.indice,
        ok: !!it.ok,
        errores: it.errores || 0,
        tiempo: it.tiempo || 0,
        texto: it.texto || "",
        contestada: it.contestada !== false,
        omitida: !!it.omitida
      };
      if (it.ok) {
        _quizSync.preguntasOk += 1;
      }
    }
  }

  // Si hay partida activa en la nube, la carga y deja al alumno donde la dejó.
  async function intentarReanudarPartidaDesdeDb() {
    if (
      quizModoPreview ||
      typeof quizProgressCargarPartidaActiva !== "function"
    ) {
      return false;
    }
    var nivelDbId =
      tnId && nivelMaestro
        ? nivelMaestro.dbId || parseInt(nivelMaestro.id, 10) || null
        : null;
    var res = await quizProgressCargarPartidaActiva({
      temaId: tnId ? null : parseInt(temaId, 10),
      modo: modo,
      nivelMaestroId: nivelDbId
    });
    if (!res || !res.ok || !res.partida) {
      return false;
    }

    var parsed =
      typeof quizProgressParsearActividad === "function"
        ? quizProgressParsearActividad(res.partida.actividad)
        : { items: [], preguntaIds: [] };
    if (!parsed.preguntaIds.length && parsed.preguntas.length) {
      parsed.preguntaIds = parsed.preguntas
        .map(function (p) {
          return p && p.id;
        })
        .filter(Boolean);
    }
    if (!parsed.preguntaIds.length) {
      return false;
    }

    var restaurada = null;
    if (
      nivelMaestro &&
      typeof nivelMaestroObtenerPreguntasPartida === "function"
    ) {
      var todas = nivelMaestroObtenerPreguntasPartida(nivelMaestro);
      restaurada =
        typeof quizFiltrarPreguntasPorIds === "function"
          ? quizFiltrarPreguntasPorIds(todas, parsed.preguntaIds)
          : null;
    } else if (typeof quizPreguntasPorIds === "function") {
      restaurada = quizPreguntasPorIds(temaId, modo, parsed.preguntaIds);
    }

    if (!restaurada || !restaurada.length) {
      return false;
    }

    lista = restaurada;
    if (typeof quizRestaurarColaDesdePartida === "function") {
      quizRestaurarColaDesdePartida(temaId, modo, parsed.preguntaIds, {
        nivelMaestroId: nivelDbId
      });
    }
    if (
      parseInt(res.partida.indice_pregunta, 10) >= lista.length &&
      contarPreguntasOkActividad(parsed.items) >= lista.length
    ) {
      aplicarEstadoPartidaDesdeDb(res.partida, parsed.items);
      indice = lista.length - 1;
      partidaTerminada = false;
      await terminarQuiz();
      return true;
    }
    aplicarEstadoPartidaDesdeDb(res.partida, parsed.items);
    pintarContextoQuiz();
    pintarVidas();
    mostrarPregunta();
    pintarSaldo();
    return true;
  }

  // Guarda el avance y redirige; si falla el guardado, se queda en la pantalla.
  async function guardarProgresoYSalir(destino) {
    if (!hayProgresoEnPartida()) {
      if (destino) {
        window.location.href = destino;
      }
      return true;
    }
    var ok = await enviarResultadoQuiz(estadoSalidaConVidas());
    if (!ok) {
      quizAvisar(
        "No se pudo guardar tu avance en la nube. Revisa tu conexión e inténtalo de nuevo."
      );
      return false;
    }
    if (destino) {
      if (
        typeof pageLoadDestinoEsTemas === "function" &&
        pageLoadDestinoEsTemas(destino) &&
        typeof pageLoadIrATemas === "function"
      ) {
        pageLoadIrATemas();
        return true;
      }
      window.location.href = destino;
    }
    return true;
  }

  // Navega de vuelta a la pantalla de temas.
  function irATemasQuiz() {
    if (typeof pageLoadIrATemas === "function") {
      pageLoadIrATemas();
      return;
    }
    window.location.href =
      typeof pagina === "function" ? pagina("topics.html") : "topics.html";
  }

  // True si ya hubo movimiento en la partida (preguntas, vidas, errores o monedas).
  function hayProgresoEnPartida() {
    if (partidaTerminada || !lista.length) {
      return false;
    }
    if (indice > 0) {
      return true;
    }
    if (vidas < 3) {
      return true;
    }
    if (erroresOpcionIncorrectaEstaPregunta > 0) {
      return true;
    }
    if (monedaPagada || respondidaBien) {
      return true;
    }
    return false;
  }

  // Diálogo de confirmación al volver a temas guardando el avance.
  function confirmarSalirTemas() {
    return window.confirm(
      "Se guardará tu avance en la nube (pregunta actual, vidas y errores).\n\n¿Volver a temas?"
    );
  }

  // Diálogo de confirmación al reiniciar el nivel desde cero.
  function confirmarReiniciarNivel() {
    return window.confirm(
      "Se guardará este intento como abandonado y empezarás el nivel desde cero.\n\n¿Reiniciar el nivel?"
    );
  }

  // Monedas que ganaría si acierta ahora: 10 a la primera, 5 con un fallo, 2 con más.
  function monedasQuizSiAhoraAcierta(numFallosYa) {
    if (numFallosYa <= 0) return 10;
    if (numFallosYa === 1) return 5;
    return 2;
  }

  // Si reanudó la partida, recupera cuántas veces ya falló en esta pregunta (para monedas y UI).
  function restaurarErroresPreguntaActualDesdeSync() {
    var entry = _quizSync.porIndice[indice];
    if (
      entry &&
      !entry.ok &&
      entry.contestada === false &&
      (Number(entry.errores) || 0) > 0
    ) {
      erroresOpcionIncorrectaEstaPregunta = Number(entry.errores) || 0;
      return;
    }
    erroresOpcionIncorrectaEstaPregunta = 0;
  }

  // Mezcla un array (Fisher-Yates) sin tocar el original.
  function barajar(arr) {
    var copia = arr.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copia[i];
      copia[i] = copia[j];
      copia[j] = tmp;
    }
    return copia;
  }

  // Pinta los corazones de vidas en el encabezado.
  function pintarVidas() {
    var el = document.getElementById("quiz-hearts");
    if (el) {
      el.textContent = "❤️".repeat(vidas) + "🤍".repeat(3 - vidas);
    }
  }

  // Muestra en qué pregunta va (ej. 3 / 10).
  function pintarProgreso() {
    var el = document.getElementById("quiz-progress");
    if (el) {
      el.textContent = indice + 1 + " / " + lista.length;
    }
  }

  // Actualiza el saldo de monedas y el hint de cuánto ganaría si acierta.
  function pintarSaldo() {
    var el = document.getElementById("quiz-saldo");
    if (!el) return;
    var base = duckObtenerSaldoMonedas();
    var pendiente = Math.max(
      0,
      (_quizSync.monedasGanadas || 0) - (_quizSync.monedasServidor || 0)
    );
    var extra = "";
    if (!respondidaBien && !partidaTerminada && lista.length) {
      var n = monedasQuizSiAhoraAcierta(erroresOpcionIncorrectaEstaPregunta);
      extra = " (+" + n + " si aciertas)";
    }
    el.textContent = "Monedas: " + (base + pendiente) + extra;
  }

  // Bloquea todos los botones de opción (tras acertar o game over).
  function deshabilitarOpciones() {
    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].disabled = true;
    }
  }

  // Vuelve a habilitar los botones de opción.
  function habilitarOpciones() {
    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].disabled = false;
    }
  }

  // Quita clases visuales de correcto, incorrecto y elegida en las opciones.
  function limpiarClasesOpciones() {
    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.remove("correct", "wrong", "option-elegida");
    }
  }

  // Oculta el botón confirmar y limpia la selección pendiente.
  function ocultarConfirmar() {
    seleccionPendienteIdx = null;
    var btn = document.getElementById("quiz-confirmar");
    if (btn) {
      btn.hidden = true;
    }
  }

  // Muestra confirmar cuando hay una opción marcada y aún no se respondió bien.
  function mostrarConfirmar() {
    var btn = document.getElementById("quiz-confirmar");
    if (btn && seleccionPendienteIdx !== null && !respondidaBien && !partidaTerminada) {
      btn.hidden = false;
    }
  }

  // Si la pregunta actual lleva mapa JXG para este tema.
  function preguntaUsaMapaJXG(pregunta) {
    return (
      partidaUsaMapaJXG() &&
      typeof quizPreguntaUsaMapaJXG === "function" &&
      !!quizPreguntaUsaMapaJXG(temaId, pregunta)
    );
  }

  // Ajusta clases del body para layout con o sin panel del mapa.
  function aplicarLayoutMapaQuiz(pregunta) {
    var conMapa = !!pregunta && preguntaUsaMapaJXG(pregunta);
    document.body.classList.toggle("quiz--con-mapa", conMapa);
    document.body.classList.toggle("quiz--sin-mapa", !conMapa);
  }

  // Prepara u oculta el mapa JXG según la pregunta y actualiza el hint.
  function prepararMapaPregunta(pregunta) {
    aplicarLayoutMapaQuiz(pregunta);
    if (typeof QuizJXGMapaFijo === "undefined") {
      return;
    }
    if (partidaUsaMapaJXG()) {
      QuizJXGMapaFijo.prepararPregunta(temaId, pregunta);
      actualizarHintMapaJXG(pregunta);
    } else {
      QuizJXGMapaFijo.ocultar();
    }
  }

  // Dibuja en el mapa la vista asociada a una opción elegida.
  function vistaMapaOpcion(opcion) {
    if (
      !partidaUsaMapaJXG() ||
      typeof QuizJXGMapaFijo === "undefined" ||
      !lista[indice]
    ) {
      return;
    }
    QuizJXGMapaFijo.vistaOpcion(temaId, lista[indice], opcion);
  }

  // Esconde el bloque de retroalimentación bajo las opciones.
  function ocultarFeedback() {
    var fb = document.getElementById("quiz-feedback");
    if (fb) {
      fb.hidden = true;
      fb.textContent = "";
    }
  }

  // Esconde el botón siguiente y le quita el manejador de click.
  function ocultarSiguiente() {
    var sig = document.getElementById("quiz-siguiente");
    if (sig) {
      sig.hidden = true;
      sig.onclick = null;
    }
  }

  // Muestra el botón siguiente (solo tras acertar o al terminar / game over).
  function mostrarSiguiente(texto, onClick) {
    var sig = document.getElementById("quiz-siguiente");
    if (!sig) return;
    sig.textContent = texto;
    sig.hidden = false;
    sig.onclick = onClick;
  }

  // Muestra el texto de retroalimentación de una opción incorrecta.
  function mostrarFeedback(texto) {
    var fb = document.getElementById("quiz-feedback");
    if (!fb) return;
    fb.innerHTML = "";
    var titulo = document.createElement("span");
    titulo.className = "quiz-feedback-title";
    titulo.textContent = "Retroalimentación";
    var cuerpo = document.createElement("span");
    cuerpo.textContent = texto;
    fb.appendChild(titulo);
    fb.appendChild(cuerpo);
    fb.hidden = false;
  }

  // Pantalla de sin vidas: guarda game over y ofrece salir a temas.
  async function mostrarGameOver() {
    partidaTerminada = true;
    deshabilitarOpciones();
    ocultarConfirmar();
    if (typeof QuizJXGMapaFijo !== "undefined") {
      QuizJXGMapaFijo.ocultar();
    }
    var guardado = await enviarResultadoQuiz("GAME_OVER");
    if (!guardado) {
      quizAvisar(
        "Sin vidas, pero no se pudo guardar el resultado. Revisa tu conexión."
      );
    }
    var go = document.getElementById("quiz-gameover");
    if (go) {
      go.textContent =
        "Sin vidas. Vuelve a intentarlo desde Temas cuando quieras.";
      go.hidden = false;
    }
    mostrarSiguiente("Salir", irATemasQuiz);
    pintarSaldo();
  }

  // Fin feliz: guarda completada y muestra mensaje de éxito.
  async function terminarQuiz() {
    var guardado = await enviarResultadoQuiz("COMPLETADA");
    if (!guardado) {
      document.getElementById("quiz-question-text").textContent =
        "Completaste el quiz, pero no se pudo guardar el progreso en la nube. Revisa tu conexión e inténtalo de nuevo.";
      mostrarSiguiente("Reintentar guardar", function () {
        terminarQuiz();
      });
      partidaTerminada = true;
      pintarSaldo();
      return;
    }
    mostrarSiguiente("Volver a temas", irATemasQuiz);
    document.getElementById("quiz-question-text").textContent =
      "¡Completaste el quiz! Monedas y progreso guardados.";
    document.getElementById("quiz-options").innerHTML = "";
    if (typeof QuizJXGMapaFijo !== "undefined") {
      QuizJXGMapaFijo.ocultar();
    }
    ocultarConfirmar();
    ocultarFeedback();
    partidaTerminada = true;
    pintarSaldo();
  }

  // Click en una opción: la marca como elegida y muestra confirmar (y el mapa en básico).
  function seleccionarOpcion(ev) {
    if (partidaTerminada) return;
    if (respondidaBien) return;

    ocultarSiguiente();

    var btn = ev.currentTarget;
    if (btn.disabled) return;

    var idx = parseInt(btn.getAttribute("data-idx"), 10);
    var opt = opcionesActuales[idx];
    if (!opt) return;

    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.remove("option-elegida");
    }
    btn.classList.add("option-elegida");
    seleccionPendienteIdx = idx;
    if (jxgVistaAlSeleccionarOpcion()) {
      vistaMapaOpcion(opt);
    } else {
      reiniciarMapaPreguntaActual();
    }
    mostrarConfirmar();
  }

  // Valida la opción elegida: suma monedas si acierta, resta vida si falla.
  function confirmarRespuesta() {
    if (partidaTerminada) return;
    if (respondidaBien) return;
    if (seleccionPendienteIdx === null) return;

    var idx = seleccionPendienteIdx;
    var opt = opcionesActuales[idx];
    if (!opt) return;

    var btn = document.querySelector(
      '#quiz-options .option[data-idx="' + idx + '"]'
    );
    if (!btn || btn.disabled) return;

    ocultarConfirmar();

    if (opt.ok) {
      if (!jxgVistaAlSeleccionarOpcion()) {
        vistaMapaOpcion(opt);
      }
      btn.classList.add("correct");
      respondidaBien = true;
      deshabilitarOpciones();
      ocultarFeedback();
      if (!monedaPagada && !quizModoPreview) {
        monedaPagada = true;
        var monedasGanadas = monedasQuizSiAhoraAcierta(
          erroresOpcionIncorrectaEstaPregunta
        );
        _quizSync.monedasGanadas += monedasGanadas;
      } else if (!monedaPagada && quizModoPreview) {
        monedaPagada = true;
      }
      registrarActividadPregunta(true, lista[indice] && lista[indice].q);
      mostrarSiguiente(
        indice + 1 >= lista.length ? "Finalizar" : "Siguiente pregunta",
        onSiguiente
      );
      pintarSaldo();
      return;
    }

    ocultarSiguiente();
    btn.classList.add("wrong");
    erroresOpcionIncorrectaEstaPregunta += 1;
    registrarErrorPreguntaActual();
    vidas -= 1;
    pintarVidas();

    if (opt.fb) {
      mostrarFeedback(opt.fb);
    } else {
      ocultarFeedback();
    }

    if (vidas <= 0) {
      deshabilitarOpciones();
      mostrarGameOver();
      return;
    }

    pintarSaldo();

    /* Deshabilitamos solo esta opción para que el usuario pueda releer la
       retroalimentación y elegir otra sin volver a sumar el mismo error. */
    btn.disabled = true;
    btn.classList.remove("option-elegida");
  }

  // Avanza a la siguiente pregunta o dispara terminarQuiz si era la última.
  function onSiguiente() {
    indice += 1;
    if (indice >= lista.length) {
      terminarQuiz();
      return;
    }
    respondidaBien = false;
    monedaPagada = false;
    ocultarConfirmar();
    ocultarSiguiente();
    mostrarPregunta();
  }

  // Renderiza la pregunta actual: texto, opciones barajadas, mapa y contadores.
  function mostrarPregunta() {
    var p = lista[indice];
    _quizSync.preguntaInicioMs = Date.now();
    restaurarErroresPreguntaActualDesdeSync();
    ocultarConfirmar();
    var qEl = document.getElementById("quiz-question-text");
    if (qEl) {
      qEl.textContent = p.q;
    }
    pintarProgreso();
    pintarSaldo();
    ocultarFeedback();

    prepararMapaPregunta(p);

    opcionesActuales = barajar(p.opts);

    var cont = document.getElementById("quiz-options");
    cont.innerHTML = "";
    for (var i = 0; i < opcionesActuales.length; i++) {
      (function (idx, opcionDat) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "option";
        b.textContent = opcionDat.t;
        b.setAttribute("data-idx", String(idx));
        cont.appendChild(b);

        b.addEventListener("click", seleccionarOpcion);
      })(i, opcionesActuales[i]);
    }

    var go = document.getElementById("quiz-gameover");
    if (go) go.hidden = true;
    ocultarSiguiente();
    ocultarCargandoTecduckAventura();
  }

  // Título del contexto: nombre del nivel maestro o tema + modo.
  function pintarContextoQuiz() {
    var ctx = document.getElementById("quiz-context");
    if (!ctx) {
      return;
    }
    if (nivelMaestro) {
      ctx.textContent = nivelMaestro.titulo;
      return;
    }
    ctx.textContent =
      "Tema " +
      temaId +
      " · " +
      (modo === "dificil" ? "Avanzado" : "Básico");
  }

  // Overlay de carga mientras arranca o recarga la partida.
  function mostrarCargandoTecduckAventura() {
    document.body.classList.add("is-quiz-loading");
    var overlay = document.getElementById("quiz-loading-overlay");
    if (overlay) {
      overlay.classList.remove("is-hidden");
    }
  }

  // Quita el overlay de carga cuando ya hay pregunta en pantalla.
  function ocultarCargandoTecduckAventura() {
    document.body.classList.remove("is-quiz-loading");
    var overlay = document.getElementById("quiz-loading-overlay");
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  }

  // Al volver desde caché del navegador (bfcache), relee la URL y recarga la partida.
  function reiniciarPartidaSegunUrl() {
    mostrarCargandoTecduckAventura();
    aplicarParamsPartida();
    _quizSync.pausado = false;
    _quizSync.finalizado = false;
    pintarContextoQuiz();
    cargarOReanudarPartida();
  }

  // Enlaza el botón reiniciar: abandona en nube si había avance y empieza de cero.
  function registrarBotonReiniciarQuiz() {
    var b = document.getElementById("quiz-reiniciar");
    if (!b || b.getAttribute("data-hook") === "1") return;
    b.setAttribute("data-hook", "1");
    b.addEventListener("click", function () {
      if (!hayProgresoEnPartida()) {
        reiniciarNivelQuizNuevaPartida();
        return;
      }
      if (!confirmarReiniciarNivel()) {
        return;
      }
      enviarResultadoQuiz("ABANDONADA").then(function (ok) {
        if (!ok) {
          quizAvisar(
            "No se pudo guardar el intento abandonado. Revisa tu conexión e inténtalo de nuevo."
          );
          return;
        }
        _quizSync.pausado = false;
        reiniciarNivelQuizNuevaPartida();
      });
    });
  }

  // Enlaza «volver a temas»: guarda avance si hace falta antes de salir.
  function registrarVolverTemasQuiz() {
    var link = document.getElementById("quiz-volver-temas");
    if (!link || link.getAttribute("data-hook") === "1") {
      return;
    }
    link.setAttribute("data-hook", "1");
    link.addEventListener("click", function (ev) {
      if (!hayProgresoEnPartida()) {
        ev.preventDefault();
        irATemasQuiz();
        return;
      }
      ev.preventDefault();
      if (!confirmarSalirTemas()) {
        return;
      }
      var destino =
        link.getAttribute("href") ||
        (typeof pagina === "function" ? pagina("topics.html") : "topics.html");
      guardarProgresoYSalir(destino).then(function (ok) {
        if (!ok) {
          return;
        }
      });
    });
  }

  // Enlaza el botón confirmar respuesta (una sola vez).
  function registrarBotonConfirmarQuiz() {
    var b = document.getElementById("quiz-confirmar");
    if (!b || b.getAttribute("data-hook") === "1") return;
    b.setAttribute("data-hook", "1");
    b.addEventListener("click", confirmarRespuesta);
  }

  // Intenta reanudar desde la nube; si no hay nada, arranca partida nueva.
  async function cargarOReanudarPartida() {
    ocultarFeedback();
    var go = document.getElementById("quiz-gameover");
    if (go) {
      go.hidden = true;
    }
    ocultarSiguiente();
    _quizSync.pausado = false;
    _quizSync.finalizado = false;

    if (await intentarReanudarPartidaDesdeDb()) {
      ocultarCargandoTecduckAventura();
      return;
    }
    reiniciarNivelQuizNuevaPartida();
  }

  // Carga preguntas frescas y resetea vidas, índice y sync para una partida nueva.
  function reiniciarNivelQuizNuevaPartida() {
    ocultarFeedback();
    var go = document.getElementById("quiz-gameover");
    if (go) {
      go.hidden = true;
    }
    ocultarSiguiente();

    if (
      nivelMaestro &&
      typeof nivelMaestroObtenerPreguntasPartida === "function"
    ) {
      lista = nivelMaestroObtenerPreguntasPartida(nivelMaestro);
    } else {
      lista = quizObtenerPreguntas(temaId, modo, quizOptsPartida);
    }
    if (!lista.length) {
      document.getElementById("quiz-question-text").textContent =
        nivelMaestro
          ? "Este nivel no tiene preguntas todavía."
          : "No hay preguntas para este tema.";
      document.getElementById("quiz-options").innerHTML = "";
      if (typeof QuizJXGMapaFijo !== "undefined") {
        QuizJXGMapaFijo.ocultar();
      }
      aplicarLayoutMapaQuiz(null);
      ocultarConfirmar();
      var prog = document.getElementById("quiz-progress");
      if (prog) prog.textContent = "—";
      indice = 0;
      vidas = 3;
      partidaTerminada = false;
      respondidaBien = false;
      monedaPagada = false;
      reiniciarQuizSync();
      pintarContextoQuiz();
      pintarVidas();
      pintarSaldo();
      ocultarCargandoTecduckAventura();
      return;
    }

    reiniciarQuizSync();
    indice = 0;
    vidas = 3;
    partidaTerminada = false;
    respondidaBien = false;
    monedaPagada = false;
    pintarContextoQuiz();
    pintarVidas();
    mostrarPregunta();
    pintarSaldo();
  }

  // Atajos: 1-4 eligen opción, flechas rotan, Enter confirma.
  function registrarAtajosTecladoQuiz() {
    if (document.body.getAttribute("data-quiz-keys") === "1") {
      return;
    }
    document.body.setAttribute("data-quiz-keys", "1");
    document.addEventListener("keydown", function (ev) {
      if (partidaTerminada || respondidaBien) {
        return;
      }
      var tag = ev.target && ev.target.tagName ? ev.target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || tag === "select") {
        return;
      }
      var key = ev.key;
      if (key === "Enter") {
        var btnConf = document.getElementById("quiz-confirmar");
        if (btnConf && !btnConf.hidden && seleccionPendienteIdx !== null) {
          ev.preventDefault();
          confirmarRespuesta();
        }
        return;
      }
      var mapa = { "1": 0, "2": 1, "3": 2, "4": 3 };
      var idx = mapa[key];
      if (idx == null && (key === "ArrowDown" || key === "ArrowUp")) {
        var opts = document.querySelectorAll("#quiz-options .option:not([disabled])");
        if (!opts.length) {
          return;
        }
        var actual = -1;
        for (var i = 0; i < opts.length; i++) {
          if (opts[i].classList.contains("option-elegida")) {
            actual = i;
            break;
          }
        }
        idx = key === "ArrowDown" ? (actual + 1) % opts.length : (actual <= 0 ? opts.length - 1 : actual - 1);
        opts[idx].click();
        ev.preventDefault();
        return;
      }
      if (idx == null) {
        return;
      }
      var boton = document.querySelector(
        '#quiz-options .option[data-idx="' + idx + '"]:not([disabled])'
      );
      if (boton) {
        ev.preventDefault();
        boton.click();
      }
    });
  }

  // Pinta el pato personalizado en la barra superior del quiz.
  function pintarPatoQuiz() {
    var wrap = document.querySelector(".quiz-duck-wrap");
    if (!wrap) {
      return;
    }
    if (quizModoPreview) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    if (typeof duckOutfitRefrescarQuiz === "function") {
      duckOutfitRefrescarQuiz();
    }
  }

  // Punto de entrada: auth, validaciones, hooks de UI y arranque de la partida.
  async function iniciar() {
    mostrarCargandoTecduckAventura();
    aplicarParamsPartida();
    pintarBannerPreview();

    if (quizModoPreview) {
      if (typeof teacherExigirSesionAsync === "function") {
        var okMaestro = await teacherExigirSesionAsync();
        if (!okMaestro) {
          return;
        }
      }
    } else if (typeof alumnoGuardEsperar === "function") {
      var okAlumno = await alumnoGuardEsperar();
      if (!okAlumno) {
        return;
      }
    }

    pintarPatoQuiz();

    if (typeof initSupabase === "function") {
      await initSupabase();
    }
    if (
      !quizModoPreview &&
      typeof duckEconomiaSyncDesdeDb === "function" &&
      (typeof alumnoGuardEstaListo !== "function" || !alumnoGuardEstaListo())
    ) {
      try {
        await duckEconomiaSyncDesdeDb();
      } catch (e) {
        console.warn("[quiz] economia:", e);
      }
    }
    if (tnId && typeof nivelMaestroPorIdAsync === "function") {
      nivelMaestro = await nivelMaestroPorIdAsync(tnId);
      if (nivelMaestro) {
        temaId = "1";
        modo = "facil";
        quizOptsPartida = { nivelMaestroCustom: true };
        window.quizConfigPartida = {
          mostrarJxg: false,
          titulo: nivelMaestro.titulo
        };
      }
    }
    if (!(await validarAccesoNivelMaestro())) {
      return;
    }
    if (!(await validarAccesoTemaModo())) {
      return;
    }
    if (nivelMaestro && typeof window.quizPreguntaUsaMapaJXG === "function") {
      window.quizPreguntaUsaMapaJXG = function () {
        return false;
      };
    }
    registrarBotonReiniciarQuiz();
    registrarVolverTemasQuiz();
    registrarBotonConfirmarQuiz();
    registrarAtajosTecladoQuiz();
    reiniciarQuizSync();
    pintarContextoQuiz();
    await cargarOReanudarPartida();

    window.addEventListener("pagehide", function () {
      if (
        partidaTerminada ||
        _quizSync.finalizado ||
        _quizSync.pausado ||
        !hayProgresoEnPartida()
      ) {
        return;
      }
      enviarResultadoQuizKeepalive(estadoSalidaConVidas());
    });

    window.addEventListener("pageshow", function (ev) {
      if (!ev.persisted) {
        return;
      }
      reiniciarPartidaSegunUrl();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
