/**
 * Tema 4 · Básico — Multiplicación por escalar (40 preguntas)
 */
(function () {
  "use strict";
  if (typeof quizBankRegistrar !== "function") {
    throw new Error("Carga quiz-bank-loader.js antes de este archivo.");
  }
  quizBankRegistrar("4", "facil", [
  {
    id: "T4F01",
    q: "Si multiplicas el vector (2, 3) por el escalar 2, ¿cuál es el resultado?",
    opts: [
      { t: "A) (4, 3)", ok: false, fb: "Parece que solo multiplicaste la componente horizontal (x). El escalar afecta a todo el vector." },
      { t: "B) (4, 6)", ok: true },
      { t: "C) (2, 6)", ok: false, fb: "Multiplicaste correctamente la componente vertical, pero el avance horizontal se quedó igual." },
      { t: "D) (4, 5)", ok: false, fb: "Aquí sumaste el escalar (2+2, 3+2) en lugar de multiplicarlo." }
    ]
  },
  {
    id: "T4F02",
    q: "Calcula 3 * (1, 4):",
    opts: [
      { t: "A) (3, 4)", ok: false, fb: "Olvidaste multiplicar la segunda coordenada por 3." },
      { t: "B) (4, 7)", ok: false, fb: "Realizaste una suma (1+3, 4+3). Recuerda que el escalar amplifica multiplicando." },
      { t: "C) (3, 12)", ok: true },
      { t: "D) (12, 3)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y). Las has invertido." }
    ]
  },
  {
    id: "T4F03",
    q: "¿Cuál es el resultado de 4 * (0, 2)?",
    opts: [
      { t: "A) (4, 8)", ok: false, fb: "Si multiplicas 4 por 0, el resultado no es 4. Todo número multiplicado por cero da cero." },
      { t: "B) (0, 8)", ok: true },
      { t: "C) (0, 6)", ok: false, fb: "Parece que sumaste 4 + 2 en el eje vertical en vez de multiplicar 4 * 2." },
      { t: "D) (4, 2)", ok: false, fb: "Aquí cambiaste el cero por un 4, pero no multiplicaste la componente vertical." }
    ]
  },
  {
    id: "T4F04",
    q: "Calcula 5 * (2, 0):",
    opts: [
      { t: "A) (10, 0)", ok: true },
      { t: "B) (10, 5)", ok: false, fb: "Multiplicaste bien el primer número, pero sumaste 5 al segundo. 5 * 0 sigue siendo 0." },
      { t: "C) (7, 0)", ok: false, fb: "Hiciste una suma (2+5) en el eje horizontal. La operación es multiplicación." },
      { t: "D) (0, 10)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F05",
    q: "Si TecDuck tiene un vector de velocidad (4, 4) y activa un turbo que multiplica su velocidad por 2, ¿cuál es su nuevo vector?",
    opts: [
      { t: "A) (6, 6)", ok: false, fb: "Sumaste 2 a cada componente. El turbo multiplica, no suma." },
      { t: "B) (8, 4)", ok: false, fb: "Solo duplicaste el avance horizontal (x), olvidando el vertical." },
      { t: "C) (4, 8)", ok: false, fb: "Solo duplicaste el avance vertical (y). El escalar se aplica a ambas partes." },
      { t: "D) (8, 8)", ok: true }
    ]
  },
  {
    id: "T4F06",
    q: "¿Cuál es el resultado de 3 * (-1, 2)?",
    opts: [
      { t: "A) (-3, 6)", ok: true },
      { t: "B) (3, 6)", ok: false, fb: "Ignoraste el signo negativo original. Multiplicar un positivo por un negativo da negativo." },
      { t: "C) (-1, 6)", ok: false, fb: "Te faltó multiplicar la componente horizontal por el escalar 3." },
      { t: "D) (-3, 2)", ok: false, fb: "Multiplicaste bien el eje X, pero olvidaste hacer lo mismo con el eje Y." }
    ]
  },
  {
    id: "T4F07",
    q: "Calcula 2 * (3, -2):",
    opts: [
      { t: "A) (6, -2)", ok: false, fb: "Solo aplicaste la multiplicación a la primera coordenada." },
      { t: "B) (6, -4)", ok: true },
      { t: "C) (5, 0)", ok: false, fb: "Realizaste una suma (3+2, -2+2). Debes usar multiplicación." },
      { t: "D) (6, 4)", ok: false, fb: "Multiplicaste bien los números, pero cambiaste el signo negativo de la Y a positivo." }
    ]
  },
  {
    id: "T4F08",
    q: "Si multiplicas el vector (-2, -1) por 4, obtienes:",
    opts: [
      { t: "A) (-8, -1)", ok: false, fb: "Olvidaste multiplicar la coordenada vertical por 4." },
      { t: "B) (-6, -5)", ok: false, fb: "En lugar de multiplicar, restaste 4 a cada componente." },
      { t: "C) (-8, -4)", ok: true },
      { t: "D) (8, 4)", ok: false, fb: "Perdiste los signos negativos originales. Positivo por negativo da negativo." }
    ]
  },
  {
    id: "T4F09",
    q: "Calcula 10 * (-1, 0):",
    opts: [
      { t: "A) (-10, 10)", ok: false, fb: "Multiplicaste el 0 por 10 y te dio 10. Recuerda que cualquier número por 0 es 0." },
      { t: "B) (-1, 0)", ok: false, fb: "Este es el vector original. ¡Te faltó aplicarle la multiplicación!" },
      { t: "C) (-10, 0)", ok: true },
      { t: "D) (0, -10)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F10",
    q: "El resultado de 5 * (0, -3) es:",
    opts: [
      { t: "A) (0, -15)", ok: true },
      { t: "B) (5, -15)", ok: false, fb: "En el primer componente sumaste el escalar en vez de multiplicarlo por 0." },
      { t: "C) (0, -8)", ok: false, fb: "En la componente Y aplicaste una resta (-3 - 5) en lugar de multiplicar." },
      { t: "D) (-15, 0)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F11",
    q: "¿Qué sucede si multiplicas el vector (5, 7) por 0?",
    opts: [
      { t: "A) (5, 7)", ok: false, fb: "Eso pasaría si multiplicaras por 1." },
      { t: "B) (0, 0)", ok: true },
      { t: "C) (0, 7)", ok: false, fb: "Solo multiplicaste la X por cero. El escalar afecta a ambos." },
      { t: "D) (5, 0)", ok: false, fb: "Solo anulaste la Y. Recuerda que ambas coordenadas deben multiplicarse por 0." }
    ]
  },
  {
    id: "T4F12",
    q: "Calcula 1 * (8, -2):",
    opts: [
      { t: "A) (9, -1)", ok: false, fb: "Sumaste 1 a las componentes en vez de multiplicar." },
      { t: "B) (8, -2)", ok: true },
      { t: "C) (1, 1)", ok: false, fb: "Reemplazaste las coordenadas por el escalar." },
      { t: "D) (-8, 2)", ok: false, fb: "Invertiste los signos. Eso ocurriría si multiplicaras por -1, no por 1." }
    ]
  },
  {
    id: "T4F13",
    q: "¿Cuál es el resultado de -1 * (3, 4)?",
    opts: [
      { t: "A) (3, 4)", ok: false, fb: "Este es el mismo vector original. Multiplicar por -1 debe invertir la dirección." },
      { t: "B) (-3, 4)", ok: false, fb: "Solo cambiaste el signo de la componente X. El escalar aplica a ambas." },
      { t: "C) (-3, -4)", ok: true },
      { t: "D) (-4, -3)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F14",
    q: "Calcula -2 * (1, 2):",
    opts: [
      { t: "A) (-2, -4)", ok: true },
      { t: "B) (2, 4)", ok: false, fb: "Multiplicaste por 2 positivo en vez de -2." },
      { t: "C) (-2, 2)", ok: false, fb: "Olvidaste multiplicar la coordenada vertical por el escalar." },
      { t: "D) (-1, 0)", ok: false, fb: "Aquí realizaste una resta (1-2, 2-2) en lugar de una multiplicación." }
    ]
  },
  {
    id: "T4F15",
    q: "Si multiplicas -3 * (-2, 1), obtienes:",
    opts: [
      { t: "A) (-6, -3)", ok: false, fb: "Menos por menos da más. La primera coordenada debe ser positiva." },
      { t: "B) (6, -3)", ok: true },
      { t: "C) (6, 3)", ok: false, fb: "Menos por más da menos. La segunda coordenada debe ser negativa." },
      { t: "D) (-5, -2)", ok: false, fb: "Sumaste el escalar a las componentes (-2-3, 1-3). ¡Debes multiplicar!" }
    ]
  },
  {
    id: "T4F16",
    q: "Calcula -1 * (-4, -4):",
    opts: [
      { t: "A) (-4, -4)", ok: false, fb: "El vector se quedó igual. Al multiplicar por un negativo, los signos deben cambiar." },
      { t: "B) (0, 0)", ok: false, fb: "Multiplicar por -1 invierte el vector, no lo anula." },
      { t: "C) (4, 4)", ok: true },
      { t: "D) (-5, -5)", ok: false, fb: "Realizaste una resta sumando -1 a cada número en vez de multiplicarlos." }
    ]
  },
  {
    id: "T4F17",
    q: "¿Cuál es el resultado de -4 * (0, 2)?",
    opts: [
      { t: "A) (0, -8)", ok: true },
      { t: "B) (-4, -8)", ok: false, fb: "Multiplicaste -4 por 0 y te dio -4. ¡Recuerda que da 0!" },
      { t: "C) (0, 8)", ok: false, fb: "Ignoraste el signo negativo del escalar. El resultado en Y debe ser negativo." },
      { t: "D) (0, -6)", ok: false, fb: "Restaste en lugar de multiplicar en la componente vertical." }
    ]
  },
  {
    id: "T4F18",
    q: "Calcula -2 * (-3, 0):",
    opts: [
      { t: "A) (-6, 0)", ok: false, fb: "Menos por menos da más. El 6 debe ser positivo." },
      { t: "B) (6, -2)", ok: false, fb: "Multiplicar 0 por -2 da 0, no -2." },
      { t: "C) (6, 0)", ok: true },
      { t: "D) (0, 6)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F19",
    q: "Un vector u = (x, y) multiplicado por un escalar negativo siempre:",
    opts: [
      { t: "A) Mantiene su misma dirección y sentido.", ok: false, fb: "Eso ocurre solo si el escalar es positivo." },
      { t: "B) Apunta en sentido exactamente opuesto.", ok: true },
      { t: "C) Se vuelve cero.", ok: false, fb: "Eso solo ocurre si el escalar es exactamente 0." },
      { t: "D) Gira 90 grados.", ok: false, fb: "Multiplicar por un escalar no rota el vector 90 grados, simplemente lo alarga, lo encoge o lo invierte en la misma línea." }
    ]
  },
  {
    id: "T4F20",
    q: "Si TecDuck vuela en dirección (2, 3) y el viento lo empuja con un vector -1 * (2, 3), el viento lo está llevando hacia:",
    opts: [
      { t: "A) Atrás (sentido opuesto a su vuelo).", ok: true },
      { t: "B) Adelante (el mismo sentido).", ok: false, fb: "Para que vaya en el mismo sentido, el escalar tendría que ser positivo." },
      { t: "C) Un lado (perpendicular).", ok: false, fb: "Un escalar solo cambia la longitud o invierte el sentido sobre la misma línea, no lo desvía hacia los lados." },
      { t: "D) No lo mueve.", ok: false, fb: "El vector resultante es (-2, -3), por lo que sí hay un movimiento real." }
    ]
  },
  {
    id: "T4F21",
    q: "Calcula (1/2) * (4, 6):",
    opts: [
      { t: "A) (2, 6)", ok: false, fb: "Solo dividiste la primera componente a la mitad." },
      { t: "B) (4, 3)", ok: false, fb: "Solo dividiste la segunda componente a la mitad." },
      { t: "C) (2, 3)", ok: true },
      { t: "D) (8, 12)", ok: false, fb: "Aquí multiplicaste por 2 en lugar de multiplicar por 1/2 (que es lo mismo que dividir entre 2)." }
    ]
  },
  {
    id: "T4F22",
    q: "¿Cuál es el resultado de (1/3) * (9, 3)?",
    opts: [
      { t: "A) (3, 1)", ok: true },
      { t: "B) (27, 9)", ok: false, fb: "Multiplicaste por 3 en lugar de dividir entre 3." },
      { t: "C) (3, 3)", ok: false, fb: "Olvidaste dividir la componente Y." },
      { t: "D) (1, 3)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F23",
    q: "Calcula (1/2) * (-2, 8):",
    opts: [
      { t: "A) (-1, 8)", ok: false, fb: "El escalar 1/2 debe aplicarse también a la componente vertical." },
      { t: "B) (-2, 4)", ok: false, fb: "Olvidaste aplicar el escalar a la componente horizontal." },
      { t: "C) (1, -4)", ok: false, fb: "Invertiste los signos. El escalar 1/2 es positivo, así que los signos originales se mantienen." },
      { t: "D) (-1, 4)", ok: true }
    ]
  },
  {
    id: "T4F24",
    q: "¿Qué efecto tiene multiplicar un vector por el escalar 1/2?",
    opts: [
      { t: "A) Duplica su longitud.", ok: false, fb: "Eso sucedería si multiplicaras por 2, no por una fracción menor a 1." },
      { t: "B) Reduce su longitud a la mitad.", ok: true },
      { t: "C) Cambia su sentido.", ok: false, fb: "Para cambiar el sentido, el escalar tendría que ser un número negativo." },
      { t: "D) Lo vuelve nulo.", ok: false, fb: "Solo se volvería nulo si lo multiplicas por 0." }
    ]
  },
  {
    id: "T4F25",
    q: "Calcula -(1/2) * (6, -4):",
    opts: [
      { t: "A) (3, -2)", ok: false, fb: "Dividiste a la mitad correctamente, pero olvidaste que el escalar es negativo y cambia los signos." },
      { t: "B) (-3, -2)", ok: false, fb: "En la componente Y, menos por menos da más. ¡Cuidado con el signo!" },
      { t: "C) (-3, 2)", ok: true },
      { t: "D) (3, 2)", ok: false, fb: "En la componente X, un positivo por un negativo debe dar negativo." }
    ]
  },
  {
    id: "T4F26",
    q: "Si multiplicas un vector por 3, su magnitud (distancia):",
    opts: [
      { t: "A) Se reduce a una tercera parte.", ok: false, fb: "Eso ocurriría si multiplicaras por la fracción 1/3." },
      { t: "B) Se triplica.", ok: true },
      { t: "C) Se queda igual.", ok: false, fb: "El escalar 3 es mayor que 1, por lo que el tamaño del vector forzosamente debe cambiar." },
      { t: "D) Se suma 3.", ok: false, fb: "En los vectores, el escalar amplifica multiplicando, no funciona como una suma de distancias." }
    ]
  },
  {
    id: "T4F27",
    q: "¿Es el vector 2 * (1, 5) paralelo al vector (1, 5)?",
    opts: [
      { t: "A) No, porque son perpendiculares.", ok: false, fb: "Multiplicar por un escalar nunca gira el vector 90 grados." },
      { t: "B) Sí, tienen la misma dirección (paralelos).", ok: true },
      { t: "C) No, porque se cruzan.", ok: false, fb: "Un vector escalarmente múltiple de otro siempre yace sobre la misma línea o una paralela; jamás se cruzan." },
      { t: "D) No se puede saber.", ok: false, fb: "La teoría de vectores establece que todo múltiplo escalar produce un vector paralelo al original." }
    ]
  },
  {
    id: "T4F28",
    q: "¿El vector -3 * (2, 2) es paralelo a (2, 2)?",
    opts: [
      { t: "A) Sí, pero apunta en sentido opuesto.", ok: true },
      { t: "B) No, el signo negativo rompe el paralelismo.", ok: false, fb: "El paralelismo se refiere a la inclinación de la línea. El signo solo indica si vas hacia adelante o hacia atrás en esa misma línea." },
      { t: "C) No, se vuelve perpendicular.", ok: false, fb: "Un escalar negativo invierte el sentido, pero no rota el vector para hacerlo perpendicular." },
      { t: "D) Sí, y apunta en el mismo sentido.", ok: false, fb: "Como el escalar es negativo, es imposible que apunten hacia el mismo lado." }
    ]
  },
  {
    id: "T4F29",
    q: "¿Cuál de los siguientes es el resultado de un escalar k multiplicado por el vector (a, b)?",
    opts: [
      { t: "A) (k+a, k+b)", ok: false, fb: "El escalar no se suma a las coordenadas, se multiplica por ellas." },
      { t: "B) (ka, b)", ok: false, fb: "Te faltó aplicar el escalar \"k\" a la coordenada vertical \"b\"." },
      { t: "C) (ka, kb)", ok: true },
      { t: "D) (kb, ka)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Has multiplicado cruzado invirtiendo los ejes." }
    ]
  },
  {
    id: "T4F30",
    q: "Si k = 0 y el vector es (100, -50), el resultado de k * (100, -50) es:",
    opts: [
      { t: "A) (100, -50)", ok: false, fb: "Multiplicar por cero anula el vector, no lo deja intacto." },
      { t: "B) (0, 0)", ok: true },
      { t: "C) (1, 1)", ok: false, fb: "Cero por cualquier número da cero, no da uno." },
      { t: "D) (1000, -500)", ok: false, fb: "Multiplicaste por 10 en lugar de multiplicar por 0." }
    ]
  },
  {
    id: "T4F31",
    q: "TecDuck avanza con un vector (2, 1). Si repite exactamente este mismo movimiento 3 veces seguidas, ¿cuál es su desplazamiento total?",
    opts: [
      { t: "A) (5, 4)", ok: false, fb: "Parece que sumaste 3 a cada número en vez de multiplicarlos por 3." },
      { t: "B) (2, 3)", ok: false, fb: "Solo multiplicaste el movimiento vertical (y)." },
      { t: "C) (6, 3)", ok: true },
      { t: "D) (6, 1)", ok: false, fb: "Solo multiplicaste el avance horizontal (x), olvidando que también subió 3 veces." }
    ]
  },
  {
    id: "T4F32",
    q: "El viento empuja a TecDuck con un vector (1, -2). Si una ráfaga llega con el doble de fuerza, ¿qué vector representa la ráfaga?",
    opts: [
      { t: "A) (3, 0)", ok: false, fb: "Sumaste 2 a cada coordenada en vez de multiplicar." },
      { t: "B) (2, -4)", ok: true },
      { t: "C) (2, -2)", ok: false, fb: "Olvidaste multiplicar la componente Y por el doble." },
      { t: "D) (-2, 4)", ok: false, fb: "Invertiste los signos. El \"doble\" es un escalar positivo (2), por lo que el sentido no cambia." }
    ]
  },
  {
    id: "T4F33",
    q: "TecDuck quiere retroceder sobre un camino descrito por el vector (-3, 2) recorriendo exactamente la misma distancia. ¿Qué vector debe usar?",
    opts: [
      { t: "A) (3, -2)", ok: true },
      { t: "B) (-3, -2)", ok: false, fb: "Solo le cambiaste el signo a la componente vertical. Para retroceder, ambas deben invertirse." },
      { t: "C) (3, 2)", ok: false, fb: "Cambiaste el signo a la primera pero no a la segunda." },
      { t: "D) (2, -3)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F34",
    q: "Un cohete viaja en la trayectoria (4, 8). Si solo quiere recorrer la mitad del camino con la misma dirección, ¿cuál es su vector?",
    opts: [
      { t: "A) (4, 4)", ok: false, fb: "Redujiste a la mitad la Y, pero la X se quedó igual." },
      { t: "B) (2, 4)", ok: true },
      { t: "C) (2, 8)", ok: false, fb: "Redujiste la X, pero olvidaste hacer lo mismo con la altura." },
      { t: "D) (8, 16)", ok: false, fb: "Multiplicaste por 2 en lugar de dividir entre 2 (o multiplicar por 1/2)." }
    ]
  },
  {
    id: "T4F35",
    q: "Si k * (2, 3) = (6, 9), ¿cuál es el valor del escalar k?",
    opts: [
      { t: "A) 2", ok: false, fb: "Si k fuera 2, el resultado sería (4, 6). Busca qué número multiplicado por 2 da 6." },
      { t: "B) 3", ok: true },
      { t: "C) 4", ok: false, fb: "Si k fuera 4, el resultado sería (8, 12)." },
      { t: "D) 1/3", ok: false, fb: "Si usas 1/3, el vector se haría más pequeño (fracciones), pero aquí los números crecieron." }
    ]
  },
  {
    id: "T4F36",
    q: "Si -2 * (x, y) = (-8, 10), ¿cuál era el vector original (x, y)?",
    opts: [
      { t: "A) (4, -5)", ok: true },
      { t: "B) (-4, 5)", ok: false, fb: "Si el vector fuera (-4, 5) y lo multiplicas por -2, el resultado daría (+8, -10). Los signos están al revés." },
      { t: "C) (16, -20)", ok: false, fb: "En lugar de dividir el resultado entre -2 para hallar el original, lo volviste a multiplicar." },
      { t: "D) (-10, 8)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F37",
    q: "TecDuck calcula la operación: 2 * (1, 1) + 3 * (1, 1). ¿Cuál es el resultado final?",
    opts: [
      { t: "A) (6, 6)", ok: false, fb: "Parece que multiplicaste 2 * 3 en lugar de sumar los vectores resultantes (2+3 = 5)." },
      { t: "B) (5, 5)", ok: true },
      { t: "C) (1, 1)", ok: false, fb: "Este es el vector base sin aplicar los escalares. Debes realizar las operaciones." },
      { t: "D) (10, 10)", ok: false, fb: "Has sumado (2+3) y luego lo multiplicaste por 2 otra vez. Solo junta las partes: (2,2) + (3,3)." }
    ]
  },
  {
    id: "T4F38",
    q: "Resuelve: 4 * (2, 0) - (8, 0).",
    opts: [
      { t: "A) (8, 0)", ok: false, fb: "Realizaste la multiplicación (8, 0) pero se te olvidó restar el segundo vector." },
      { t: "B) (0, 0)", ok: true },
      { t: "C) (16, 0)", ok: false, fb: "En lugar de restar (8,0), lo sumaste. Observa el signo de la operación." },
      { t: "D) (0, 8)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F39",
    q: "Si multiplicas un vector de magnitud 5 por el escalar -2, la nueva magnitud del vector es:",
    opts: [
      { t: "A) -10", ok: false, fb: "La magnitud (distancia o tamaño) siempre es un valor positivo. El signo negativo solo cambia hacia dónde apunta." },
      { t: "B) 10", ok: true },
      { t: "C) 3", ok: false, fb: "Realizaste una resta (5 - 2). Debes multiplicar la magnitud base por el valor absoluto del escalar." },
      { t: "D) -3", ok: false, fb: "Las magnitudes no pueden ser negativas." }
    ]
  },
  {
    id: "T4F40",
    q: "TecDuck recorre (5, 5) en un día. Para regresar al punto de inicio, debe aplicar un escalar de:",
    opts: [
      { t: "A) 0", ok: false, fb: "Multiplicar por 0 lo dejaría estático en el lugar donde terminó su viaje, no lo llevaría de regreso." },
      { t: "B) -1", ok: true },
      { t: "C) 1", ok: false, fb: "Multiplicar por 1 significa volver a hacer exactamente el mismo recorrido, alejándose más del inicio." },
      { t: "D) 2", ok: false, fb: "Multiplicar por 2 lo haría avanzar el doble de lejos en la misma dirección. Necesita el sentido opuesto." }
    ]
  }
  ]);
})();
