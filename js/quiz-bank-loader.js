/**
 * Ensambla QUIZ_BANK desde banco-preguntas/tema-N/{basico,avanzado}/preguntas.js
 */
var QUIZ_BANK = {};

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
