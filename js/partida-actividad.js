// Formato común de actividad de partida: parseo, pesos, monedas y métricas (quiz + maestro).
(function (global) {
  "use strict";

  // Descompone lo guardado en BD (array viejo u objeto v1).
  function partidaActividadParsear(raw) {
    if (!raw) {
      return { items: [], preguntaIds: [], preguntas: [] };
    }
    if (Array.isArray(raw)) {
      return { items: raw, preguntaIds: [], preguntas: [] };
    }
    if (typeof raw === "object") {
      return {
        items: Array.isArray(raw.items) ? raw.items : [],
        preguntaIds: Array.isArray(raw.preguntaIds) ? raw.preguntaIds : [],
        preguntas: Array.isArray(raw.preguntas) ? raw.preguntas : []
      };
    }
    return { items: [], preguntaIds: [], preguntas: [] };
  }

  // Vuelve a empaquetar para guardar (objeto v1 o array simple).
  function partidaActividadEmpaquetar(items, preguntaIds, preguntas) {
    var listaItems = Array.isArray(items) ? items : [];
    var ids = Array.isArray(preguntaIds) ? preguntaIds : [];
    var listaPreguntas = Array.isArray(preguntas) ? preguntas : [];
    if (ids.length || listaPreguntas.length) {
      var out = { v: 1, preguntaIds: ids, items: listaItems };
      if (listaPreguntas.length) {
        out.preguntas = listaPreguntas;
      }
      return out;
    }
    return listaItems;
  }

  // Atajo: solo el array items.
  function partidaActividadItems(raw) {
    return partidaActividadParsear(raw).items;
  }

  // Peso 0–1 según si acertó y cuántos errores tuvo.
  function partidaPesoPregunta(entry) {
    if (!entry || entry.omitida) {
      return 0;
    }
    if (!entry.ok) {
      return 0;
    }
    var e = Number(entry.errores) || 0;
    if (e <= 0) {
      return 1;
    }
    if (e === 1) {
      return 0.5;
    }
    return 0.2;
  }

  // Monedas de una pregunta: 10, 5 o 2 según los errores.
  function partidaMonedasPregunta(entry) {
    if (!entry || !entry.ok) {
      return 0;
    }
    var e = Number(entry.errores) || 0;
    if (e <= 0) {
      return 10;
    }
    if (e === 1) {
      return 5;
    }
    return 2;
  }

  // Suma de monedas de todas las respuestas de la actividad.
  function partidaMonedasDesdeActividad(items) {
    var sum = 0;
    var act = Array.isArray(items) ? items : [];
    for (var i = 0; i < act.length; i++) {
      sum += partidaMonedasPregunta(act[i]);
    }
    return sum;
  }

  // Porcentaje, puntaje /10 y monedas de un bloque de respuestas.
  function partidaMetricasDesdeActividad(items, total) {
    var act = Array.isArray(items) ? items : [];
    var ok = 0;
    var sumPeso = 0;
    for (var i = 0; i < act.length; i++) {
      if (act[i] && act[i].ok) {
        ok += 1;
      }
      sumPeso += partidaPesoPregunta(act[i]);
    }
    total = Number(total) || 0;
    if (total <= 0 && act.length) {
      total = act.length;
    }
    var pct = total > 0 ? Math.round((sumPeso / total) * 100) : 0;
    var puntaje = total > 0 ? Math.round((sumPeso / total) * 10) : 0;
    return {
      ok: ok,
      total: total,
      sumPeso: sumPeso,
      pct: pct,
      puntaje: puntaje,
      monedas: partidaMonedasDesdeActividad(act)
    };
  }

  // Resuelve FACIL o DIFICIL desde el nivel o el campo modo.
  function partidaModoDesdePartida(partida) {
    if (partida && partida.nivel && partida.nivel.codigo) {
      return String(partida.nivel.codigo).toUpperCase() === "DIFICIL"
        ? "DIFICIL"
        : "FACIL";
    }
    return String(partida && partida.modo ? partida.modo : "FACIL").toUpperCase() ===
      "DIFICIL"
      ? "DIFICIL"
      : "FACIL";
  }

  global.partidaActividadParsear = partidaActividadParsear;
  global.partidaActividadEmpaquetar = partidaActividadEmpaquetar;
  global.partidaActividadItems = partidaActividadItems;
  global.partidaPesoPregunta = partidaPesoPregunta;
  global.partidaMonedasPregunta = partidaMonedasPregunta;
  global.partidaMonedasDesdeActividad = partidaMonedasDesdeActividad;
  global.partidaMetricasDesdeActividad = partidaMetricasDesdeActividad;
  global.partidaModoDesdePartida = partidaModoDesdePartida;

  global.quizProgressParsearActividad = partidaActividadParsear;
  global.quizProgressEmpaquetarActividad = partidaActividadEmpaquetar;
  global.teacherParsearActividadPartida = partidaActividadParsear;
})(typeof window !== "undefined" ? window : globalThis);
