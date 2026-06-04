/**
 * Lógica del banco de preguntas (colas, barajado, selección por partida).
 *
 * Las preguntas viven en:
 *   banco-preguntas/tema-1|2|3|4/{basico,avanzado}/preguntas.js
 *
 * Esquema por pregunta:
 *   { id, q, opts: [{ t, ok, fb?, jxg? }, ...] }
 *
 * Cargar en quiz.html: quiz-bank-loader.js → cada preguntas.js → este archivo.
 */
var QUIZ_PREGUNTAS_FACIL = 10;
var QUIZ_PREGUNTAS_DIFICIL = 7;

var CLAVE_QUIZ_COLA_PREGUNTAS = "tec_duck_quiz_cola_preguntas";

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

function quizLeerColasPreguntas() {
  try {
    var raw = localStorage.getItem(CLAVE_QUIZ_COLA_PREGUNTAS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function quizGuardarColasPreguntas(mapa) {
  localStorage.setItem(CLAVE_QUIZ_COLA_PREGUNTAS, JSON.stringify(mapa));
}

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

function quizTotalPreguntas(modo) {
  return String(modo).toLowerCase() === "dificil"
    ? QUIZ_PREGUNTAS_DIFICIL
    : QUIZ_PREGUNTAS_FACIL;
}
