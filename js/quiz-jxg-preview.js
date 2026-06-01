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

  var BBOX_DEFECTO = [-8, 8, 8, -8];

  /** [xmin, ymax, xmax, ymin] — solo el tablero JSXGraph, no la página. */
  function bboxSimetrico(half, minHalf) {
    var h = Math.max(half, minHalf != null ? minHalf : 3);
    return [-h, h, h, -h];
  }

  function bboxCuadrante(n, radio) {
    var r = radio != null && isFinite(radio) ? radio : 5;
    var pad = 0.75;
    if (n === 1) {
      return [-pad, r + pad, r + pad, -pad];
    }
    if (n === 2) {
      return [-r - pad, r + pad, pad, -pad];
    }
    if (n === 3) {
      return [-r - pad, pad, pad, -r - pad];
    }
    return [-pad, pad, r + pad, -r - pad];
  }

  function radioCuadranteDesdeBbox(bb) {
    return Math.max(
      Math.abs(bb[2] - bb[0]),
      Math.abs(bb[1] - bb[3])
    ) * 0.42;
  }

  /**
   * Zoom según contenido: puntos pequeños → acercar; grandes → alejar.
   * Cuadrante: encuadra solo el cuadrante indicado.
   */
  function calcularBoundingBoxEscena(scene) {
    if (!scene || !scene.tipo) {
      return BBOX_DEFECTO.slice();
    }
    if (scene.boundingbox && scene.boundingbox.length === 4) {
      return scene.boundingbox.slice();
    }

    var px;
    var py;
    var m;

    switch (scene.tipo) {
      case "rellenoCuadrante":
        return bboxCuadrante(scene.cuadrante, scene.radioCuadrante);

      case "puntoProyecciones":
      case "puntoEtiqueta":
      case "vectorOrigen":
      case "vectorOrigenEtiqueta":
        px = Number(scene.x);
        py = Number(scene.y);
        if (!isFinite(px)) {
          px = 0;
        }
        if (!isFinite(py)) {
          py = 0;
        }
        m = Math.max(Math.abs(px), Math.abs(py), 0.25);
        if (m <= 2.5) {
          return bboxSimetrico(m + 1.8, 3.5);
        }
        if (m <= 7) {
          return bboxSimetrico(m + 2.5, 5);
        }
        return bboxSimetrico(Math.min(22, m * 1.3 + 3), 8);

      case "ejeHighlight":
        if (scene.cual === "y") {
          return [-3.5, 9, 3.5, -3.5];
        }
        return [-9, 3.5, 9, -3.5];

      case "origenCoords":
      case "origenEtiqueta":
        return bboxSimetrico(3.5, 3);

      case "ejemploHorizontal":
        return bboxSimetrico(6.5, 4);

      case "ejemploVertical":
        return bboxSimetrico(6, 4);

      default:
        return BBOX_DEFECTO.slice();
    }
  }

  function aplicarBoundingBox(bbox) {
    var b = brd;
    if (!b || !bbox || bbox.length !== 4) {
      return;
    }
    try {
      if (typeof b.setBoundingBox === "function") {
        b.setBoundingBox(bbox, false);
      } else {
        b.attr({ boundingbox: bbox });
      }
      b.update();
    } catch (_e) {
      /* noop */
    }
  }

  function opcionesTablero(bbox) {
    var bb = bbox && bbox.length === 4 ? bbox : BBOX_DEFECTO;
    return {
      boundingbox: bb.slice(),
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

  function asegurarTablero(bbox) {
    if (typeof JXG === "undefined") {
      return null;
    }
    document.getElementById(BOX_ID);
    if (brd) {
      if (bbox) {
        aplicarBoundingBox(bbox);
      }
      return brd;
    }
    brd = JXG.JSXGraph.initBoard(
      BOX_ID,
      opcionesTablero(bbox || BBOX_DEFECTO)
    );
    return brd;
  }

  function pintarEscena(scene) {
    if (!scene) {
      return;
    }
    var bbox = calcularBoundingBoxEscena(scene);
    var b = asegurarTablero(bbox);
    if (!b) {
      return;
    }

    limpiarCapaDinamica();
    curAnimacion = { x: 0, y: 0 };
    var c = curAnimacion;

    if (scene.tipo === "rellenoCuadrante") {
      origenMarcado(b);
      var rCuad =
        scene.radioCuadrante != null && isFinite(scene.radioCuadrante)
          ? scene.radioCuadrante
          : radioCuadranteDesdeBbox(bbox);
      poligonoCuadrante(b, scene.cuadrante, rCuad);
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
      asegurarTablero(BBOX_DEFECTO);
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
        String(temaId || "1"),
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
