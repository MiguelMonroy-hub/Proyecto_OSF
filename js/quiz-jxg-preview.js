(function () {
  "use strict";

  var BOX_ID = "quizJXGMapaFijo";
  var brd = null;
  var capaDinamica = [];
  var curAnimacion = null;
  var animRaf = null;
  var panelEl = null;

  function panel() {
    if (!panelEl) {
      panelEl = document.getElementById("quiz-jxg-panel");
    }
    return panelEl;
  }

  function cancelarAnimacion() {
    if (animRaf) {
      cancelAnimationFrame(animRaf);
      animRaf = null;
    }
  }

  function limpiarCapaDinamica() {
    cancelarAnimacion();
    if (!brd || !capaDinamica.length) {
      capaDinamica = [];
      return;
    }
    for (var i = 0; i < capaDinamica.length; i++) {
      try {
        brd.removeObject(capaDinamica[i]);
      } catch (_e) {
        /* noop */
      }
    }
    capaDinamica = [];
    try {
      brd.update();
    } catch (_e2) {
      /* noop */
    }
  }

  function destruirTablero() {
    limpiarCapaDinamica();
    if (
      brd &&
      typeof JXG !== "undefined" &&
      JXG.JSXGraph &&
      typeof JXG.JSXGraph.freeBoard === "function"
    ) {
      try {
        JXG.JSXGraph.freeBoard(brd);
      } catch (_e) {
        /* noop */
      }
    }
    brd = null;
    var b = document.getElementById(BOX_ID);
    if (b) {
      while (b.firstChild) {
        b.removeChild(b.firstChild);
      }
    }
  }

  function easeOutQuad(t) {
    return t < 1 ? t * (2 - t) : 1;
  }

  function animarCoordenadas(hastaX, hastaY, dur) {
    if (!brd || !curAnimacion) {
      return;
    }
    cancelarAnimacion();
    dur = dur == null ? 480 : dur;
    curAnimacion.x = 0;
    curAnimacion.y = 0;

    var t0 = null;
    function frame(now) {
      if (!t0) {
        t0 = now;
      }
      var u = Math.min(1, (now - t0) / dur);
      var v = easeOutQuad(u);
      curAnimacion.x = hastaX * v;
      curAnimacion.y = hastaY * v;
      try {
        brd.update();
      } catch (_e) {}
      if (u < 1) {
        animRaf = requestAnimationFrame(frame);
      } else {
        curAnimacion.x = hastaX;
        curAnimacion.y = hastaY;
        try {
          brd.update();
        } catch (_e2) {}
        animRaf = null;
      }
    }
    animRaf = requestAnimationFrame(frame);
  }

  function pushObj(obj) {
    capaDinamica.push(obj);
    return obj;
  }

  function origenMarcado(b) {
    pushObj(
      b.create(
        "point",
        [0, 0],
        estiloSinResaltado({
          name: "O",
          size: 5,
          strokeColor: "#0369a1",
          strokeWidth: 2,
          fillColor: "#38bdf8",
          fillOpacity: 1,
          label: { strokeColor: "#f1f5f9", fontSize: 12 }
        })
      )
    );
  }

  /** Flecha dinámica sin puntos invisibles (evita anillos blancos de JSXGraph). */
  function flechaDesdeOrigen(b, c, estiloFlecha) {
    pushObj(
      b.create(
        "arrow",
        [
          [0, 0],
          [
            function () {
              return c.x;
            },
            function () {
              return c.y;
            }
          ]
        ],
        estiloSinResaltado(
          Object.assign(
            {
              strokeWidth: 3,
              strokeColor: "#38bdf8",
              lastArrow: { type: 4, size: 9 }
            },
            estiloFlecha || {}
          )
        )
      )
    );
  }

  function poligonoCuadrante(b, n, R) {
    var rr = R || 8;
    var ps;
    if (n === 1) {
      ps = [[0, 0], [rr, 0], [rr, rr], [0, rr]];
    } else if (n === 2) {
      ps = [[0, 0], [-rr, 0], [-rr, rr], [0, rr]];
    } else if (n === 3) {
      ps = [[0, 0], [-rr, 0], [-rr, -rr], [0, -rr]];
    } else {
      ps = [[0, 0], [rr, 0], [rr, -rr], [0, -rr]];
    }
    pushObj(
      b.create("polygon", ps, {
        fillColor: "#fbbf24",
        borders: { strokeColor: "#f59e0b", strokeWidth: 1 },
        fillOpacity: 0.28,
        fixed: true,
        highlight: false,
        selectable: false
      })
    );
  }

  function estiloSinResaltado(extra) {
    var base = {
      fixed: true,
      highlight: false,
      showInfobox: false,
      showCross: false,
      hasInnerPoints: false,
      highlightStrokeColor: "none",
      highlightFillColor: "none"
    };
    if (!extra) {
      return base;
    }
    for (var k in extra) {
      if (Object.prototype.hasOwnProperty.call(extra, k)) {
        base[k] = extra[k];
      }
    }
    return base;
  }

  function opcionesTablero() {
    return {
      boundingbox: [-8, 8, 8, -8],
      axis: true,
      showCopyright: false,
      showNavigation: false,
      showInfobox: false,
      keepAspectRatio: true,
      resize: {},
      point: estiloSinResaltado({ size: 4 }),
      circle: estiloSinResaltado({ fillOpacity: 0.2 }),
      segment: estiloSinResaltado(),
      arrow: estiloSinResaltado(),
      polygon: estiloSinResaltado(),
      defaultAxes: {
        x: {
          strokeColor: "#64748b",
          ticks: {
            strokeColor: "#475569",
            label: { strokeColor: "#94a3b8", fontSize: 10 }
          },
          name: "x",
          withLabel: true,
          label: { strokeColor: "#cbd5e1", fontSize: 12 }
        },
        y: {
          strokeColor: "#64748b",
          ticks: {
            strokeColor: "#475569",
            label: { strokeColor: "#94a3b8", fontSize: 10 }
          },
          name: "y",
          withLabel: true,
          label: { strokeColor: "#cbd5e1", fontSize: 12 }
        }
      }
    };
  }

  function asegurarTablero() {
    if (brd) {
      return brd;
    }
    if (typeof JXG === "undefined") {
      return null;
    }
    document.getElementById(BOX_ID);
    brd = JXG.JSXGraph.initBoard(BOX_ID, opcionesTablero());
    return brd;
  }

  function pintarEscena(scene) {
    var b = asegurarTablero();
    if (!b || !scene) {
      return;
    }

    limpiarCapaDinamica();
    curAnimacion = { x: 0, y: 0 };
    var c = curAnimacion;

    if (scene.tipo === "rellenoCuadrante") {
      origenMarcado(b);
      poligonoCuadrante(b, scene.cuadrante, 8);
      return;
    }

    if (scene.tipo === "ejeHighlight") {
      if (scene.cual === "x") {
        pushObj(
          b.create("segment", [[-10, 0], [10, 0]], {
            strokeColor: "#fcd34d",
            strokeWidth: 5,
            fixed: true,
            highlight: false
          })
        );
      } else if (scene.cual === "y") {
        pushObj(
          b.create("segment", [[0, -10], [0, 10]], {
            strokeColor: "#fcd34d",
            strokeWidth: 5,
            fixed: true,
            highlight: false
          })
        );
      }
      origenMarcado(b);
      return;
    }

    if (scene.tipo === "origenCoords" || scene.tipo === "origenEtiqueta") {
      origenMarcado(b);
      return;
    }

    if (scene.tipo === "ejemploHorizontal") {
      origenMarcado(b);
      pushObj(
        b.create(
          "point",
          [
            function () {
              return c.x;
            },
            function () {
              return c.y;
            }
          ],
          estiloSinResaltado({
            name: "",
            size: 5,
            strokeColor: "#fbbf24",
            strokeWidth: 2,
            fillColor: "#fde68a",
            visible: function () {
              return Math.abs(c.x) > 0.08 || Math.abs(c.y) > 0.08;
            }
          })
        )
      );
      flechaDesdeOrigen(b, c);
      animarCoordenadas(5, 0);
      return;
    }

    if (scene.tipo === "ejemploVertical") {
      origenMarcado(b);
      pushObj(
        b.create(
          "point",
          [
            function () {
              return c.x;
            },
            function () {
              return c.y;
            }
          ],
          estiloSinResaltado({
            name: "",
            size: 5,
            strokeColor: "#fbbf24",
            strokeWidth: 2,
            fillColor: "#fde68a",
            visible: function () {
              return Math.abs(c.x) > 0.08 || Math.abs(c.y) > 0.08;
            }
          })
        )
      );
      flechaDesdeOrigen(b, c);
      animarCoordenadas(0, 4.5);
      return;
    }

    if (scene.tipo === "puntoProyecciones" || scene.tipo === "puntoEtiqueta") {
      origenMarcado(b);
      var px = scene.x;
      var py = scene.y;
      pushObj(
        b.create(
          "point",
          [
            function () {
              return c.x;
            },
            function () {
              return c.y;
            }
          ],
          estiloSinResaltado({
            name: "",
            size: 6,
            strokeColor: "#ea580c",
            strokeWidth: 2,
            fillColor: "#fdba74",
            visible: function () {
              return Math.abs(c.x) > 0.08 || Math.abs(c.y) > 0.08;
            }
          })
        )
      );
      pushObj(
        b.create(
          "segment",
          [
            [
              function () {
                return c.x;
              },
              0
            ],
            [
              function () {
                return c.x;
              },
              function () {
                return c.y;
              }
            ]
          ],
          estiloSinResaltado({
            strokeColor: "rgba(148, 163, 184, 0.9)",
            dash: 2,
            strokeWidth: 1
          })
        )
      );
      pushObj(
        b.create(
          "segment",
          [
            [
              0,
              function () {
                return c.y;
              }
            ],
            [
              function () {
                return c.x;
              },
              function () {
                return c.y;
              }
            ]
          ],
          estiloSinResaltado({
            strokeColor: "rgba(148, 163, 184, 0.9)",
            dash: 2,
            strokeWidth: 1
          })
        )
      );
      animarCoordenadas(px, py);
      return;
    }

    if (scene.tipo === "vectorOrigen" || scene.tipo === "vectorOrigenEtiqueta") {
      origenMarcado(b);
      var vx = scene.x;
      var vy = scene.y;
      pushObj(
        b.create(
          "point",
          [
            function () {
              return c.x;
            },
            function () {
              return c.y;
            }
          ],
          estiloSinResaltado({
            name: "",
            size: 5,
            strokeColor: "#fbbf24",
            strokeWidth: 2,
            fillColor: "#fde68a",
            visible: function () {
              return Math.abs(c.x) > 0.08 || Math.abs(c.y) > 0.08;
            }
          })
        )
      );
      flechaDesdeOrigen(b, c);
      pushObj(
        b.create(
          "segment",
          [
            [
              function () {
                return c.x;
              },
              0
            ],
            [
              function () {
                return c.x;
              },
              function () {
                return c.y;
              }
            ]
          ],
          estiloSinResaltado({
            strokeColor: "rgba(148, 163, 184, 0.75)",
            dash: 2,
            strokeWidth: 1
          })
        )
      );
      pushObj(
        b.create(
          "segment",
          [
            [
              0,
              function () {
                return c.y;
              }
            ],
            [
              function () {
                return c.x;
              },
              function () {
                return c.y;
              }
            ]
          ],
          estiloSinResaltado({
            strokeColor: "rgba(148, 163, 184, 0.75)",
            dash: 2,
            strokeWidth: 1
          })
        )
      );
      animarCoordenadas(vx, vy);
    }
  }

  window.QuizJXGMapaFijo = {
    prepararPregunta: function (temaId, pregunta) {
      var p = panel();
      if (!p) {
        return;
      }
      if (
        typeof quizPreguntaUsaMapaJXG !== "function" ||
        !quizPreguntaUsaMapaJXG(temaId, pregunta)
      ) {
        p.hidden = true;
        p.setAttribute("aria-hidden", "true");
        destruirTablero();
        return;
      }
      p.hidden = false;
      p.setAttribute("aria-hidden", "false");
      destruirTablero();
      asegurarTablero();
      limpiarCapaDinamica();
      if (brd) {
        try {
          brd.update();
        } catch (_e) {
          /* noop */
        }
      }
    },

    vistaOpcion: function (temaId, pregunta, opcion) {
      if (
        typeof quizInferEscenaJXGDesdeOpcion !== "function" ||
        !pregunta
      ) {
        return;
      }
      var qtext = pregunta.q || "";
      var escena = quizInferEscenaJXGDesdeOpcion(
        String(temaId || "2"),
        qtext,
        opcion || {}
      );
      if (!escena) {
        limpiarCapaDinamica();
        return;
      }
      try {
        pintarEscena(escena);
      } catch (_err) {
        limpiarCapaDinamica();
      }
    },

    ocultar: function () {
      var p = panel();
      if (p) {
        p.hidden = true;
        p.setAttribute("aria-hidden", "true");
      }
      destruirTablero();
    }
  };
})();
