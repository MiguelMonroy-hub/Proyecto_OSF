/**
 * Selección y rotación de preguntas del quiz.
 *
 * Gestiona colas en localStorage para no repetir preguntas entre partidas
 * hasta agotar el banco. Las preguntas se cargan antes en QUIZ_BANK
 * (ver quiz-bank-loader.js y banco-preguntas/tema-N/{basico,avanzado}/preguntas.js).
 *
 * Esquema por pregunta: { id, q, opts: [{ t, ok, fb?, jxg? }, ...] }
 */
var QUIZ_PREGUNTAS_FACIL = 10;
var QUIZ_PREGUNTAS_DIFICIL = 7;

var CLAVE_QUIZ_COLA_PREGUNTAS = "tec_duck_quiz_cola_preguntas";

/** Devuelve un entero aleatorio entre 0 y maxExcl - 1; usa crypto si está disponible. */
function quizEnteroAleatorio(maxExcl) {
  if (maxExcl <= 0) {
    return 0;
  }
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    var buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % maxExcl;
  }
  return Math.floor(Math.random() * maxExcl);
}

/** Baraja una copia del array (Fisher-Yates) con aleatorio fuerte. */
function quizBarajar(arr) {
  var copia = arr.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = quizEnteroAleatorio(i + 1);
    var tmp = copia[i];
    copia[i] = copia[j];
    copia[j] = tmp;
  }
  return copia;
}

/** Lee del localStorage el mapa de colas pendientes por tema y modo. */
function quizLeerColasPreguntas() {
  try {
    var raw = localStorage.getItem(CLAVE_QUIZ_COLA_PREGUNTAS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/** Persiste en localStorage el mapa completo de colas de preguntas. */
function quizGuardarColasPreguntas(mapa) {
  localStorage.setItem(CLAVE_QUIZ_COLA_PREGUNTAS, JSON.stringify(mapa));
}

/** Arma la clave única de cola: tema, modo (fácil/difícil) y nivel de maestro opcional. */
function quizClaveCola(temaId, modo, nivelMaestroId) {
  var clave =
    String(temaId || "1") + "_" + String(modo || "facil").toLowerCase();
  if (nivelMaestroId) {
    clave += "_tn_" + String(nivelMaestroId);
  }
  return clave;
}

/**
 * Devuelve N preguntas sin repetir dentro de la partida ni en partidas
 * siguientes hasta agotar el banco (luego se baraja de nuevo todo el banco).
 */
function quizObtenerPreguntas(temaId, modo, opts) {
  opts = opts || {};
  var id = String(temaId || "1");
  if (!QUIZ_BANK[id]) {
    return [];
  }
  var m = String(modo || "facil").toLowerCase();
  if (m !== "facil" && m !== "dificil") {
    m = "facil";
  }
  var banco = QUIZ_BANK[id][m] || [];
  var nDefault =
    m === "dificil" ? QUIZ_PREGUNTAS_DIFICIL : QUIZ_PREGUNTAS_FACIL;
  var nPedido = parseInt(opts.numPreguntas, 10);
  var n =
    !isNaN(nPedido) && nPedido > 0
      ? Math.min(nPedido, banco.length)
      : Math.min(nDefault, banco.length);
  if (!n) {
    return [];
  }

  var porId = {};
  var todosLosIds = [];
  for (var i = 0; i < banco.length; i++) {
    porId[banco[i].id] = banco[i];
    todosLosIds.push(banco[i].id);
  }

  var colas = quizLeerColasPreguntas();
  var clave = quizClaveCola(id, m, opts.nivelMaestroId);
  var restantes = colas[clave];

  if (!Array.isArray(restantes)) {
    restantes = [];
  }

  restantes = restantes.filter(function (pid) {
    return porId[pid];
  });

  if (restantes.length < n) {
    restantes = todosLosIds.slice();
  }

  restantes = quizBarajar(restantes);

  var idsElegidos = restantes.slice(0, n);
  colas[clave] = restantes.slice(n);
  quizGuardarColasPreguntas(colas);

  var salida = [];
  for (var j = 0; j < idsElegidos.length; j++) {
    if (porId[idsElegidos[j]]) {
      salida.push(porId[idsElegidos[j]]);
    }
  }
  return salida;
}

/** Reinicia la cola de un tema/modo (todas las preguntas disponibles otra vez). */
function quizReiniciarColaPreguntas(temaId, modo) {
  var colas = quizLeerColasPreguntas();
  delete colas[quizClaveCola(temaId, modo)];
  quizGuardarColasPreguntas(colas);
}

/** Indica cuántas preguntas lleva una partida según el modo (fácil o difícil). */
function quizTotalPreguntas(modo) {
  return String(modo).toLowerCase() === "dificil"
    ? QUIZ_PREGUNTAS_DIFICIL
    : QUIZ_PREGUNTAS_FACIL;
}

/** Reconstruye la lista de la partida en el mismo orden guardado en la nube. */
function quizPreguntasPorIds(temaId, modo, ids) {
  var id = String(temaId || "1");
  var m = String(modo || "facil").toLowerCase();
  if (m !== "facil" && m !== "dificil") {
    m = "facil";
  }
  if (!QUIZ_BANK[id] || !Array.isArray(ids) || !ids.length) {
    return null;
  }
  var banco = QUIZ_BANK[id][m] || [];
  var porId = {};
  var i;
  for (i = 0; i < banco.length; i++) {
    porId[banco[i].id] = banco[i];
  }
  var salida = [];
  for (i = 0; i < ids.length; i++) {
    if (!porId[ids[i]]) {
      return null;
    }
    salida.push(porId[ids[i]]);
  }
  return salida.length ? salida : null;
}

/** Ordena un arreglo de preguntas ya cargado según una lista de IDs; falla si falta alguno. */
function quizFiltrarPreguntasPorIds(preguntas, ids) {
  if (!Array.isArray(preguntas) || !Array.isArray(ids) || !ids.length) {
    return null;
  }
  var porId = {};
  var i;
  for (i = 0; i < preguntas.length; i++) {
    if (preguntas[i] && preguntas[i].id) {
      porId[preguntas[i].id] = preguntas[i];
    }
  }
  var salida = [];
  for (i = 0; i < ids.length; i++) {
    if (!porId[ids[i]]) {
      return null;
    }
    salida.push(porId[ids[i]]);
  }
  return salida.length ? salida : null;
}

/** Sincroniza la cola local con los IDs ya usados en una partida reanudada. */
function quizRestaurarColaDesdePartida(temaId, modo, preguntaIds, opts) {
  if (!Array.isArray(preguntaIds) || !preguntaIds.length) {
    return;
  }
  opts = opts || {};
  var id = String(temaId || "1");
  var m = String(modo || "facil").toLowerCase();
  if (m !== "facil" && m !== "dificil") {
    m = "facil";
  }
  if (!QUIZ_BANK[id] || !QUIZ_BANK[id][m]) {
    return;
  }
  var banco = QUIZ_BANK[id][m];
  var todosLosIds = [];
  var usados = {};
  var i;
  for (i = 0; i < banco.length; i++) {
    todosLosIds.push(banco[i].id);
  }
  for (i = 0; i < preguntaIds.length; i++) {
    usados[preguntaIds[i]] = true;
  }
  var colas = quizLeerColasPreguntas();
  var clave = quizClaveCola(id, m, opts.nivelMaestroId);
  colas[clave] = todosLosIds.filter(function (pid) {
    return !usados[pid];
  });
  quizGuardarColasPreguntas(colas);
}
