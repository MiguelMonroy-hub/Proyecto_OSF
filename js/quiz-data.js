/**
 * 2 preguntas por nivel (fácil y difícil), muy fáciles, alineadas al tema 1–4.
 * Formato: { q: "...", a: [ { t: "A) ...", ok: true|false }, ... ] }
 */
function quizItem(q, opcionesCorrectaPrimero) {
  var letras = ["A", "B", "C", "D"];
  var a = [];
  for (var i = 0; i < opcionesCorrectaPrimero.length; i++) {
    a.push({
      t: letras[i] + ") " + opcionesCorrectaPrimero[i][0],
      ok: opcionesCorrectaPrimero[i][1]
    });
  }
  return { q: q, a: a };
}

var QUIZ_FACIL = {
  "1": [
    quizItem("Tema 1 · El punto (4, 0) está sobre el eje:", [
      ["El eje X", true],
      ["El eje Y", false],
      ["Ninguno de los dos", false],
      ["Solo el origen", false]
    ]),
    quizItem("Tema 1 · El par (0, 0) es:", [
      ["El origen del plano", true],
      ["El cuadrante III", false],
      ["Un vector unitario", false],
      ["La pendiente", false]
    ])
  ],
  "2": [
    quizItem("Tema 2 · Un vector en el plano suele dibujarse como:", [
      ["Una flecha (segmento con sentido)", true],
      ["Un círculo sin dirección", false],
      ["Un solo número aislado", false],
      ["Una curva cerrada", false]
    ]),
    quizItem("Tema 2 · La longitud del vector se llama también:", [
      ["Módulo o magnitud", true],
      ["Abscisa", false],
      ["Pendiente", false],
      ["Cuadrante", false]
    ])
  ],
  "3": [
    quizItem("Tema 3 · Para sumar dos vectores en forma de componentes:", [
      ["Sumas x con x e y con y", true],
      ["Multiplicas x por y", false],
      ["Solo sumas la primera componente", false],
      ["Los restas siempre", false]
    ]),
    quizItem("Tema 3 · La resta u − v es lo mismo que:", [
      ["u + (−v)", true],
      ["v − u siempre", false],
      ["u · v", false],
      ["u ÷ v", false]
    ])
  ],
  "4": [
    quizItem("Tema 4 · Si multiplicas un vector por 3 (escalar positivo):", [
      ["Se estira en la misma dirección", true],
      ["Cambia a perpendicular", false],
      ["Se vuelve cero", false],
      ["Cambia el sentido siempre", false]
    ]),
    quizItem("Tema 4 · Un escalar negativo aplicado a un vector:", [
      ["Invierte el sentido (misma línea)", true],
      ["No cambia nada", false],
      ["Solo rota 90°", false],
      ["Hace el módulo cero", false]
    ])
  ]
};

var QUIZ_DIFICIL = {
  "1": [
    quizItem("Tema 1 · El punto (−1, 4) está en el cuadrante:", [
      ["II", true],
      ["I", false],
      ["III", false],
      ["IV", false]
    ]),
    quizItem("Tema 1 · La coordenada y del punto (2, −5) es:", [
      ["−5", true],
      ["2", false],
      ["5", false],
      ["0", false]
    ])
  ],
  "2": [
    quizItem("Tema 2 · Si un vector va de (0,0) a (3,4), sus componentes son:", [
      ["(3, 4)", true],
      ["(4, 3)", false],
      ["(7, 0)", false],
      ["(0, 7)", false]
    ]),
    quizItem("Tema 2 · Dos vectores con mismo módulo y dirección pero sentido opuesto:", [
      ["Son opuestos (uno es el negativo del otro en la misma línea)", true],
      ["Son iguales", false],
      ["No tienen relación", false],
      ["Siempre son perpendiculares", false]
    ])
  ],
  "3": [
    quizItem("Tema 3 · Si a = (1,2) y b = (3,1), entonces a + b es:", [
      ["(4, 3)", true],
      ["(3, 2)", false],
      ["(1, 1)", false],
      ["(4, 1)", false]
    ]),
    quizItem("Tema 3 · El método del paralelogramo sirve para:", [
      ["Ver la suma de dos vectores desde un mismo origen", true],
      ["Multiplicar escalares", false],
      ["Dividir por cero", false],
      ["Borrar vectores", false]
    ])
  ],
  "4": [
    quizItem("Tema 4 · Si |v| = 10 y k = 0.5, el módulo de k·v es:", [
      ["5", true],
      ["10", false],
      ["20", false],
      ["0", false]
    ]),
    quizItem("Tema 4 · k·v con k = 0 da:", [
      ["Vector cero", true],
      ["El mismo v", false],
      ["Vector unitario", false],
      ["Error sin definir", false]
    ])
  ]
};

function quizObtenerPreguntas(temaId, modo) {
  var id = String(temaId || "1");
  if (id !== "1" && id !== "2" && id !== "3" && id !== "4") {
    id = "1";
  }
  var m = String(modo || "facil").toLowerCase();
  if (m === "dificil") {
    return QUIZ_DIFICIL[id];
  }
  return QUIZ_FACIL[id];
}
