/**
 * Carga y ensambla el banco global de preguntas (QUIZ_BANK).
 *
 * Cada archivo banco-preguntas/tema-N/{basico,avanzado}/preguntas.js
 * llama a quizBankRegistrar al ejecutarse; este módulo debe cargarse primero
 * en quiz.html para que el objeto QUIZ_BANK exista antes de los demás scripts.
 */
var QUIZ_BANK = {};

/** Registra el listado de preguntas de un tema y modo en QUIZ_BANK. */
function quizBankRegistrar(temaId, modo, preguntas) {
  var t = String(temaId);
  var m = String(modo || "facil").toLowerCase();
  if (m !== "facil" && m !== "dificil") {
    m = "facil";
  }
  if (!QUIZ_BANK[t]) {
    QUIZ_BANK[t] = { facil: [], dificil: [] };
  }
  QUIZ_BANK[t][m] = Array.isArray(preguntas) ? preguntas : [];
}
