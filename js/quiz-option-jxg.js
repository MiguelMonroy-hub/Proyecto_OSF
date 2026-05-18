(function () {
  "use strict";

  /**
   * Infiera una mini escena JSXGraph opcional desde el texto del quiz.
   * Soportado: punto o vector (coordenadas), cuadrante romano I–IV, eje X/Y,
   * texto de origen, y número puro usando el vector mencionado en la pregunta.
   */

  function num(s) {
    if (s == null || s === "") {
      return NaN;
    }
    var t = String(s).replace(",", ".");
    return parseFloat(t);
  }

  function extraerTupla(texto) {
    var re = /\(\s*(-?\d+(?:[\.,]\d+)?)\s*,\s*(-?\d+(?:[\.,]\d+)?)\s*\)/;
    var m = texto.match(re);
    if (!m) {
      return null;
    }
    var x = num(m[1]);
    var y = num(m[2]);
    if (!isFinite(x) || !isFinite(y)) {
      return null;
    }
    if (Math.abs(x) > 20 || Math.abs(y) > 20) {
      return null;
    }
    return [x, y];
  }

  /**
   * Primer vector (a,b) en el enunciado; útil en preguntas de magnitud solo con números en opciones.
   */
  function extraerTuplaDelEnunciado(q) {
    return extraerTupla(q || "");
  }

  function romanCuadrante(t) {
    var m = t.match(/\b[A-D]\)\s*(III|II|IV|I)\b/i);
    if (!m) {
      return null;
    }
    return String(m[1]).toUpperCase();
  }

  function detectarOrigenYEjes(tNorm) {
    if (/[\(\[\{]\s*0\s*[,\.;]\s*0\s*[\)\]\}]/.test(tNorm)) {
      return { tipo: "origenCoords" };
    }
    var low = tNorm.toLowerCase();

    var orig =
      /\bel\s+origen\b/.test(low) ||
      /\b(?:está\s+)?en\s+el\s+origen\b/.test(low);

    var ex =
      /\beje\s*x\b|\beje\s+horizontal\b/.test(low) ||
      /\bsobre\s+el\s+eje\s*x\b/.test(low);

    var ey =
      /\beje\s*y\b|\beje\s+vertical\b/.test(low) ||
      /\bsobre\s+el\s+eje\s*y\b/.test(low);

    if (ey && !ex) {
      return { tipo: "ejeHighlight", cual: "y" };
    }
    if (ex && !ey) {
      return { tipo: "ejeHighlight", cual: "x" };
    }
    if (orig && extraerTupla(tNorm) === null) {
      return { tipo: "origenEtiqueta" };
    }

    var sinTuplaSinRomano =
      romanCuadrante(tNorm) === null && extraerTupla(tNorm) === null;
    var soloEjex =
      sinTuplaSinRomano &&
      /\b(?:solo|solamente|exclusivemente)\b[^\n]{0,40}\b(?:horizontal(?:es)?|eje\s*x)\b/i.test(tNorm);

    var soloEjey =
      sinTuplaSinRomano &&
      /\b(?:solo|solamente|exclusivemente)\b[^\n]{0,40}\b(?:vertical(?:es)?|eje\s*y)\b/i.test(tNorm);

    if (soloEjex && !soloEjey) {
      return { tipo: "ejeHighlight", cual: "x" };
    }
    if (soloEjey && !soloEjex) {
      return { tipo: "ejeHighlight", cual: "y" };
    }

    var horVec =
      sinTuplaSinRomano && /\bvector(?:es)?\s+horizontal/i.test(tNorm);

    var verVec =
      sinTuplaSinRomano && /\bvector(?:es)?\s+vertical/i.test(tNorm);

    if (horVec && !verVec) {
      return { tipo: "ejemploHorizontal" };
    }
    if (verVec && !horVec) {
      return { tipo: "ejemploVertical" };
    }

    return null;
  }

  function cuadranteRomaNumeral(roman) {
    switch (roman) {
      case "I":
        return 1;
      case "II":
        return 2;
      case "III":
        return 3;
      case "IV":
        return 4;
      default:
        return null;
    }
  }

  function quizInferEscenaJXGDesdeOpcion(temaId, textoPregunta, opcion) {
    if (!opcion) {
      return null;
    }
    if (opcion.jxg && typeof opcion.jxg === "object") {
      return opcion.jxg;
    }

    var tema = String(temaId || "1");
    var tOpc = opcion.t || "";

    var tuplaOpc = extraerTupla(tOpc);
    var tuplaQue = textoPregunta ? extraerTuplaDelEnunciado(textoPregunta) : null;

    if (tuplaOpc) {
      return {
        tipo: tema === "2" ? "vectorOrigen" : "puntoProyecciones",
        x: tuplaOpc[0],
        y: tuplaOpc[1]
      };
    }

    var rom = romanCuadrante(tOpc);
    if (rom) {
      var n = cuadranteRomaNumeral(rom);
      if (n) {
        return { tipo: "rellenoCuadrante", cuadrante: n };
      }
    }

    var ax = detectarOrigenYEjes(tOpc);
    if (ax) {
      return ax;
    }

    /**
     * Opción solo con número: usa el vector mencionado en la pregunta (p. ej. magnitud).
     */
    var numOp = (tOpc || "").trim().match(/^[A-D]\)\s*([\d.,]+)\s*$/i);
    if (
      numOp &&
      tuplaQue &&
      !extraerTupla(tOpc)
    ) {
      return {
        tipo: tema === "2" ? "vectorOrigenEtiqueta" : "puntoEtiqueta",
        x: tuplaQue[0],
        y: tuplaQue[1],
        etiqueta: numOp[1].replace(",", ".")
      };
    }

    /**
     * “√2”, “√3” muy breve en algunas opciones (p. ej. magnitud √(1²+1²)).
     */
    var sqrtOp = (tOpc || "").trim().match(/^[A-D]\)\s*√([\d]+)\s*$/i);
    if (sqrtOp && tuplaQue) {
      return {
        tipo: tema === "2" ? "vectorOrigenEtiqueta" : "puntoEtiqueta",
        x: tuplaQue[0],
        y: tuplaQue[1],
        etiqueta: "√" + sqrtOp[1]
      };
    }

    return null;
  }

  /** Tema 2: mapa fijo si alguna opción se puede dibujar con JSXGraph. */
  function quizPreguntaUsaMapaJXG(temaId, pregunta) {
    if (String(temaId) !== "2" || !pregunta) {
      return false;
    }
    var opts = pregunta.opts || [];
    var q = pregunta.q || "";
    for (var i = 0; i < opts.length; i++) {
      if (quizInferEscenaJXGDesdeOpcion("2", q, opts[i])) {
        return true;
      }
    }
    return false;
  }

  window.quizInferEscenaJXGDesdeOpcion = quizInferEscenaJXGDesdeOpcion;
  window.quizPreguntaUsaMapaJXG = quizPreguntaUsaMapaJXG;
})();
