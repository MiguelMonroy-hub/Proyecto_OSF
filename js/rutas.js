/**
 * Rutas absolutas para páginas en /pages/ (evita 404 con npx serve).
 */
(function () {
  "use strict";

  var BASE = "/pages/";

  window.pagina = function (archivo) {
    return BASE + String(archivo || "").replace(/^\//, "");
  };

  /** Sin .html: serve redirige quiz.html → /pages/quiz y pierde ?tema=&modo= */
  window.paginaQuiz = function (tema, modoQuiz) {
    var t = encodeURIComponent(String(tema || "1"));
    var m = String(modoQuiz || "facil").toLowerCase() === "dificil" ? "dificil" : "facil";
    return "/pages/quiz?tema=" + t + "&modo=" + m;
  };

  window.paginaQuizMaestro = function (nivelId) {
    return "/pages/quiz?tn=" + encodeURIComponent(String(nivelId || ""));
  };

  window.irPagina = function (archivo) {
    window.location.href = pagina(archivo);
  };
})();
