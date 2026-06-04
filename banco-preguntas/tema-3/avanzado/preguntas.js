/**
 * Tema 3 · Avanzado — Desafíos de suma y resta de vectores (25 preguntas)
 */
(function () {
  "use strict";
  if (typeof quizBankRegistrar !== "function") {
    throw new Error("Carga quiz-bank-loader.js antes de este archivo.");
  }
  quizBankRegistrar("3", "dificil", [
  {
    id: "T3D01",
    q: "Dados los vectores u = (2, -3), v = (-1, 4) y w = (3, 2), calcula 2u - 3v + w.",
    opts: [
      { t: "A) (4, -16)", ok: false, fb: "Calculaste bien la coordenada y, pero parece que en x tuviste un traspié con los signos. Al restar vectores multiplicados por escalares, recuerda que restar un negativo se convierte en suma. ¡Revisa tu cálculo de 2u - 3v!" },
      { t: "B) (10, -16)", ok: true },
      { t: "C) (10, -4)", ok: false, fb: "¡Tu coordenada x es correcta! Sin embargo, en y sumaste los términos en lugar de aplicar la resta correcta. Si tienes -18 y le sumas 2, ¿hacia dónde se mueve el valor en la recta numérica?" },
      { t: "D) (4, -4)", ok: false, fb: "Hay un pequeño desajuste en ambos ejes. Te sugiero resolverlo por partes: primero escala el vector u, luego el v, y finalmente agrupa todo con cuidado de los signos negativos." }
    ]
  },
  {
    id: "T3D02",
    q: "Si u + v = (5, 2) y u - v = (1, 6), ¿cuáles son los vectores u y v?",
    opts: [
      { t: "A) u = (4, 3), v = (1, -1)", ok: false, fb: "Estos vectores cumplen con la primera regla (u + v), pero ¿qué sucede al restarlos? Recuerda que la pareja elegida debe satisfacer ambas ecuaciones al mismo tiempo." },
      { t: "B) u = (6, 8), v = (4, -4)", ok: false, fb: "Recuerda que al sumar las ecuaciones obtienes el doble del vector original, no el vector simple. ¿Qué operación matemática te falta aplicar a tus coordenadas para despejar los vectores finales?" },
      { t: "C) u = (2, -2), v = (3, 4)", ok: false, fb: "Planteaste muy bien el sistema de ecuaciones, pero asignaste los valores al revés. Vuelve a revisar qué variable estabas despejando primero al sumar o restar tus ecuaciones." },
      { t: "D) u = (3, 4), v = (2, -2)", ok: true }
    ]
  },
  {
    id: "T3D03",
    q: "La resultante de dos vectores es (8, -3). Si uno de ellos es (5, 2), ¿cuál es el otro?",
    opts: [
      { t: "A) (3, -5)", ok: true },
      { t: "B) (13, -1)", ok: false, fb: "Parece que sumaste el vector resultante con el vector que ya conocías. Piensa en esto: si conoces el gran total y una de las partes que lo conforman, debes usar la operación inversa (resta) para descubrir la pieza faltante." },
      { t: "C) (3, -1)", ok: false, fb: "Tu cálculo en el eje x es correcto. Para el eje y, te faltó restar con la misma lógica. Si el total es -3 y le quitas 2, ¿qué valor obtienes?" },
      { t: "D) (13, -5)", ok: false, fb: "Restaste bien la componente vertical, pero sumaste la horizontal. Aplica la fórmula Resultante - v1 uniformemente a ambas coordenadas." }
    ]
  },
  {
    id: "T3D04",
    q: "Si 2u + v = (7, 1) y u - 2v = (-4, 3), encuentra u.",
    opts: [
      { t: "A) (2, -1)", ok: false, fb: "Encontraste la coordenada x correcta, pero la y falló. Al aplicar el método de eliminación multiplicando ecuaciones, vigila muy bien cómo se comportan los signos al sumar las columnas." },
      { t: "B) (1, 2)", ok: false, fb: "Parece que invertiste los valores finales de x e y. Intenta comprobar tu respuesta sustituyendo esta opción directamente en las ecuaciones originales. Verás que los números no encajan." },
      { t: "C) (2, 1)", ok: true },
      { t: "D) (1, -2)", ok: false, fb: "Te alejaste un poco del resultado. Plantear un sistema de ecuaciones 2×2 para x y otro para y por separado evitará confusiones y cruces de variables." }
    ]
  },
  {
    id: "T3D05",
    q: "La suma de tres vectores es (0, 0). Dos de ellos son a = (2, -5) y b = (-3, 4). El tercer vector c es:",
    opts: [
      { t: "A) (5, -9)", ok: false, fb: "Hubo un error combinando los signos, tal vez sumaste valores absolutos o restaste en la dirección incorrecta. Respeta los signos de cada coordenada original antes de despejar la variable faltante." },
      { t: "B) (-1, -1)", ok: false, fb: "¡Encontraste la suma de los vectores a y b! Pero la meta es el vector c que equilibre todo para llegar a cero. Si ya estás en (-1, -1), ¿qué movimiento necesitas para volver al origen?" },
      { t: "C) (1, 1)", ok: true },
      { t: "D) (1, -1)", ok: false, fb: "Estás muy cerca, pero el signo en y te falló. Si la combinación de los primeros vectores te deja en un valor negativo, necesitas su opuesto exacto para anularlo." }
    ]
  },
  {
    id: "T3D06",
    q: "En un paralelogramo ABCD, A = (1, 2), B = (4, 3), C = (6, 7). Encuentra el vértice D.",
    opts: [
      { t: "A) (9, 8)", ok: false, fb: "Sumaste los vértices opuestos A y C y ahí te quedaste. La geometría del paralelogramo indica que la suma de diagonales es igual (A + C = B + D). ¡Aún te falta despejar la D!" },
      { t: "B) (3, 6)", ok: true },
      { t: "C) (3, 8)", ok: false, fb: "Tu x es perfecta, pero en y la suma te traicionó. Si Ay + Cy da 9, y By es 3, ¿qué número falta para completar el 9 en el otro lado de la ecuación?" },
      { t: "D) (9, 6)", ok: false, fb: "Resolviste bien la componente vertical, pero erraste en la horizontal por no restar correctamente el vértice B al momento de despejar." }
    ]
  },
  {
    id: "T3D07",
    q: "Los puntos medios de los lados de un triángulo son M(2, 3), N(4, 5) y P(6, 1). Encuentra el vector que va del vértice correspondiente a M al vértice correspondiente a N.",
    opts: [
      { t: "A) (2, 4)", ok: false, fb: "Escalaste el vector incorrectamente, multiplicando solo una de sus componentes. Cualquier factor escalar debe afectar a ambas coordenadas por igual." },
      { t: "B) (2, 2)", ok: false, fb: "Encontraste el vector de los puntos medios MN. Sin embargo, la teoría geométrica establece que el lado completo paralelo es proporcional. ¿Acaso debe ser la mitad o el doble?" },
      { t: "C) (4, 2)", ok: false, fb: "Escalaste el vector incorrectamente, multiplicando solo una de sus componentes. Cualquier factor escalar debe afectar a ambas coordenadas por igual." },
      { t: "D) (4, 4)", ok: true }
    ]
  },
  {
    id: "T3D08",
    q: "Dados los puntos A(1, 2), B(5, 5) y C(3, 8), encuentra el vector que va del vértice A al vértice C del paralelogramo ABCD (con vértices en orden A, B, C, D).",
    opts: [
      { t: "A) (2, 6)", ok: true },
      { t: "B) (4, 3)", ok: false, fb: "Ese es el trayecto de A hacia B. El problema pide cruzar el paralelogramo conectando el inicio con el vértice opuesto C." },
      { t: "C) (2, 3)", ok: false, fb: "Tuviste éxito con el avance lateral (eje x), pero el vertical no cuadra. Si estás en y=2 y vas a y=8, calcula bien la diferencia (Punto Final menos Punto Inicial)." },
      { t: "D) (4, 6)", ok: false, fb: "La diferencia de altura es correcta, pero la distancia lateral está mal restada. De 1 a 3 hay un trecho más corto que el que marcaste." }
    ]
  },
  {
    id: "T3D09",
    q: "La resultante de dos fuerzas es de 50 N en dirección 30°. Una de las fuerzas es de 30 N en dirección 0°. ¿Cuál es la magnitud y dirección de la otra fuerza?",
    opts: [
      { t: "A) Aproximadamente 20 N a 30°", ok: false, fb: "Restar directamente las magnitudes de las fuerzas es una trampa muy común. Los vectores no se comportan como números simples; debes descomponer cada fuerza en sus componentes horizontal y vertical usando funciones trigonométricas antes de operarlos." },
      { t: "B) Aproximadamente 28.3 N a 62°", ok: true },
      { t: "C) Aproximadamente 40 N a 60°", ok: false, fb: "Este resultado sugiere que usaste el teorema de Pitágoras pensando en un triángulo rectángulo clásico. Sin embargo, este atajo no te dará el resultado correcto si las fuerzas no forman un ángulo exacto de 90° entre sí." },
      { t: "D) Aproximadamente 76 N a 19°", ok: false, fb: "Parece que sumaste los vectores en lugar de buscar la fuerza faltante. Si ya conoces la resultante y una de las partes que la conforman, la operación que necesitas para hallar la otra pieza es una resta vectorial." }
    ]
  },
  {
    id: "T3D10",
    q: "Un avión vuela 200 km/h en dirección N30°E. El viento sopla a 50 km/h en dirección S45°E. ¿Cuál es la velocidad resultante del avión?",
    opts: [
      { t: "A) (200 sen30° - 50 sen45°, 200 cos30° + 50 cos45°)", ok: false, fb: "Tienes un signo negativo intruso. Ambos trayectos te llevan hacia el Este, por lo tanto, las componentes horizontales deben sumar esfuerzo, no contrarrestarse." },
      { t: "B) (200 cos30° + 50 cos45°, 200 sen30° - 50 sen45°)", ok: false, fb: "Intercambiaste las funciones seno y coseno. Al decir \"N30°E\", abres el ángulo desde el eje Y (Norte), por lo que el cateto opuesto (X, este) corresponde al seno." },
      { t: "C) (200 sen30° + 50 sen45°, 200 cos30° - 50 cos45°)", ok: true },
      { t: "D) (200 cos30° - 50 cos45°, 200 sen30° + 50 sen45°)", ok: false, fb: "Confundiste qué direcciones suman y restan. Ir al Sur significa que el vector desciende (eje Y negativo), por lo que ese término lleva el signo menos." }
    ]
  },
  {
    id: "T3D11",
    q: "Resuelve para x y y: (2x, y+1) + (x-1, 3y) = (7, 8)",
    opts: [
      { t: "A) x = 8/3, y = 7/4", ok: true },
      { t: "B) x = 3, y = 2", ok: false, fb: "Es tentador buscar números enteros que se acerquen al resultado, pero en matemáticas vectoriales la precisión es clave. Te sugiero plantear las ecuaciones para cada componente por separado." },
      { t: "C) x = 8, y = 7", ok: false, fb: "¡Hiciste un gran trabajo agrupando los términos semejantes en cada componente! Sin embargo, olvidaste el último paso del despeje. Si obtienes una ecuación donde la variable está multiplicada por un coeficiente, ¿qué debes hacer para dejarla completamente sola?" },
      { t: "D) x = 2, y = 1", ok: false, fb: "Si sustituyes estos valores en las ecuaciones originales, notarás que no logras la igualdad buscada. Revisa cuidadosamente cómo agrupaste las variables; recuerda que debes sumar las componentes horizontales por un lado, y las verticales por el otro." }
    ]
  },
  {
    id: "T3D12",
    q: "Si 3u - 2v = (5, -4) y u + v = (3, 2), encuentra u.",
    opts: [
      { t: "A) u = (1, 2)", ok: false, fb: "Hay un error al intentar resolver el sistema por tanteo o cruce de variables. Para ir a la segura, te recomiendo igualar los coeficientes; si la primera ecuación tiene un coeficiente negativo, multiplicar la segunda ecuación te permitirá cancelar esa variable al sumarlas." },
      { t: "B) u = (4/5, 2)", ok: false, fb: "El proceso de eliminación o sustitución que utilizaste es el adecuado, pero este resultado corresponde al vector secundario, no al principal. Asegúrate de leer bien cuál es la incógnita específica que te pide el problema." },
      { t: "C) u = (2, 1)", ok: false, fb: "Si introduces este par en la primera ecuación original, notarás que no consigues la igualdad del otro lado. Multiplica la segunda ecuación entera por 2 para eliminar la variable v y facilitar tu despeje." },
      { t: "D) u = (11/5, 0)", ok: true }
    ]
  },
  {
    id: "T3D13",
    q: "La resultante de dos vectores es máxima cuando el ángulo entre ellos es:",
    opts: [
      { t: "A) 270°", ok: false, fb: "Te da el mismo escenario intermedio que los 90°. Piensa: ¿qué ángulo deben tener dos personas para empujar un coche uniendo toda su fuerza hacia adelante?" },
      { t: "B) 90°", ok: false, fb: "Formarías un triángulo rectángulo que da una magnitud fuerte, pero no es el pico máximo." },
      { t: "C) 180°", ok: false, fb: "¡Cuidado! A este ángulo las fuerzas compiten en sentidos opuestos, lo que te generaría la resultante mínima posible." },
      { t: "D) 0°", ok: true }
    ]
  },
  {
    id: "T3D14",
    q: "La resultante de dos vectores es mínima cuando el ángulo entre ellos es:",
    opts: [
      { t: "A) 0°", ok: false, fb: "Aquí las fuerzas corren hombro con hombro, sumando sus capacidades y logrando el valor máximo." },
      { t: "B) 90°", ok: false, fb: "Te darán valores equilibrados intermedios. Para destruir el impacto de una fuerza, otra debe apuntar de frente hacia ella." },
      { t: "C) 180°", ok: true },
      { t: "D) 270°", ok: false, fb: "Te darán valores equilibrados intermedios. Para destruir el impacto de una fuerza, otra debe apuntar de frente hacia ella." }
    ]
  },
  {
    id: "T3D15",
    q: "Dos vectores de magnitudes 8 y 15 tienen resultante de magnitud 17. El ángulo entre ellos es:",
    opts: [
      { t: "A) 0°", ok: false, fb: "Si estuvieran alineados sumando, la resultante sería 8 + 15 = 23." },
      { t: "B) 90°", ok: true },
      { t: "C) 180°", ok: false, fb: "Si chocaran frontalmente, se restarían resultando en 7." },
      { t: "D) 60°", ok: false, fb: "Al insertar este ángulo en la Ley de los Cosenos, la resultante sube por encima de 20. Fíjate en los números 8, 15 y 17; juntos forman una terna pitagórica clásica, lo cual es un indicador directo de que requieren un ángulo recto." }
    ]
  },
  {
    id: "T3D16",
    q: "Un barco navega 30 km hacia el este, luego 40 km hacia el norte, luego 20 km en dirección S30°O. ¿A qué distancia del punto de partida se encuentra?",
    opts: [
      { t: "A) √( (30 - 20 sen30°)² + (40 - 20 cos30°)² )", ok: true },
      { t: "B) √( (30 + 20 sen30°)² + (40 - 20 cos30°)² )", ok: false, fb: "Ir hacia el \"Oeste\" implica movimiento en el eje x negativo. En tu fórmula dejaste ese componente con un signo positivo sumando." },
      { t: "C) √( (30 - 20 cos30°)² + (40 - 20 sen30°)² )", ok: false, fb: "Cruzaste el seno con el coseno en el tramo final. El ángulo S30°O se mide desde el Sur (eje Y), convirtiendo al avance horizontal en el cateto opuesto (seno)." },
      { t: "D) √( (30 + 20 cos30°)² + (40 + 20 sen30°)² )", ok: false, fb: "Un avance hacia el Suroeste requiere disminuir coordenadas en ambos ejes. Tenías que aplicar restas en ambos componentes dentro de la fórmula final." }
    ]
  },
  {
    id: "T3D17",
    q: "Un robot se mueve según la secuencia: desde el origen va a (2, 3), luego a (5, 1), luego a (1, 4), luego a (4, 2). ¿Cuál es su desplazamiento neto?",
    opts: [
      { t: "A) (2, 4)", ok: false, fb: "Invertiste la posición de los datos. En pares ordenados (x, y), primero reportamos el desplazamiento lateral." },
      { t: "B) (4, 2)", ok: true },
      { t: "C) (4, -1)", ok: false, fb: "Fallaste la suma final de las y. El atajo es Punto Final menos Punto Inicial: si aterriza en (4, 2) viniendo del origen, no requieres sumar mal el viaje intermedio." },
      { t: "D) (12, 10)", ok: false, fb: "Trataste las posiciones como si fueran flechas directas que se acumulan desde el origen. La redacción es de lugares absolutos; el último punto es donde termina." }
    ]
  },
  {
    id: "T3D18",
    q: "La suma de dos vectores es (8, 3). La diferencia (primero menos segundo) es (2, 5). ¿Cuáles son los vectores?",
    opts: [
      { t: "A) u = (4, 5), v = (4, -2)", ok: false, fb: "Estos números aprueban la parte de la suma, pero reprueban la resta. Planta ambas ecuaciones como un sistema conjunto." },
      { t: "B) u = (10, 8), v = (6, -2)", ok: false, fb: "Lograste plantear el sistema, pero estos valores corresponden al doble de cada vector. Te falta dividir entre 2 para obtener u y v." },
      { t: "C) u = (3, -1), v = (5, 4)", ok: false, fb: "Encontraste magnitudes cercanas, pero las asignaste a los vectores equivocados. Revisa a qué vector corresponde cada valor al resolver la resta." },
      { t: "D) u = (5, 4), v = (3, -1)", ok: true }
    ]
  },
  {
    id: "T3D19",
    q: "En un hexágono regular centrado en el origen, con un vértice en (1, 0), la suma de todos los vectores desde el origen a cada vértice es:",
    opts: [
      { t: "A) (0, 0)", ok: true },
      { t: "B) (6, 0)", ok: false, fb: "Eso significaría que todos los vértices empujan en un solo eje, como si estuvieran alineados, y perdería su forma de polígono regular." },
      { t: "C) (0, 6)", ok: false, fb: "Eso significaría que todos los vértices empujan en un solo eje, como si estuvieran alineados, y perdería su forma de polígono regular." },
      { t: "D) (3, 3√3)", ok: false, fb: "Parece que sumaste un subconjunto de vectores. La simetría de una figura regular garantiza que por cada vector hay uno opuesto neutralizándolo." }
    ]
  },
  {
    id: "T3D20",
    q: "La resultante de dos fuerzas de magnitudes 10 N y 20 N puede ser (elige la opción correcta):",
    opts: [
      { t: "A) 5 N", ok: false, fb: "La resultante más débil ocurre cuando chocan (20 - 10 = 10 N). Cualquier valor menor a 10 N es inalcanzable." },
      { t: "B) 10 N o 25 N (ambas son posibles)", ok: true },
      { t: "C) Solo 25 N", ok: false, fb: "25 N sí es posible (está entre 10 y 30), pero no es la única: 10 N también lo es si las fuerzas van en sentidos opuestos." },
      { t: "D) 35 N", ok: false, fb: "30 N es el techo máximo si ambos vectores tiran perfectamente unidos. 35 N está fuera de la realidad física del problema." }
    ]
  },
  {
    id: "T3D21",
    q: "En 3 dimensiones, la suma de vectores (2, 3, -1) + (1, -2, 4) es:",
    opts: [
      { t: "A) (3, 1, -5)", ok: false, fb: "En lugar de sumar (-1 + 4), restaste y hundiste la coordenada Z en los negativos." },
      { t: "B) (3, 1, 3)", ok: true },
      { t: "C) (3, 5, 3)", ok: false, fb: "Ignoraste el signo del -2 al sumar las variables y. 3 + (-2) no es lo mismo que 3 + 2." },
      { t: "D) (1, 5, 3)", ok: false, fb: "Tuviste problemas con la primera coordenada. Organiza cada componente de manera lineal." }
    ]
  },
  {
    id: "T3D22",
    q: "La resta (5, -2, 3) - (2, 1, 4) en 3D es:",
    opts: [
      { t: "A) (7, -1, -1)", ok: false, fb: "El signo principal dicta una resta, pero sumaste la coordenada x." },
      { t: "B) (3, -3, 7)", ok: false, fb: "Tu despiste ocurrió en el eje z al sumar en vez de restar. Es 3 - 4, no 3 + 4." },
      { t: "C) (3, -1, -1)", ok: false, fb: "En el eje y, calcular -2 - 1 debe hacerte descender más en los negativos. ¡No restes valores absolutos!" },
      { t: "D) (3, -3, -1)", ok: true }
    ]
  },
  {
    id: "T3D23",
    q: "Si u = (2, -1, 3), v = (1, 2, -2), entonces 2u - 3v es:",
    opts: [
      { t: "A) (1, -8, 12)", ok: true },
      { t: "B) (7, -8, 0)", ok: false, fb: "Fallaste en x y en z al sumar partes en lugar de mantener la sustracción. Además, 6 - (-6) no se anula a 0." },
      { t: "C) (1, -8, 0)", ok: false, fb: "Llegaste bien a la coordenada x, pero olvidaste aplicar el menos del vector v en z." },
      { t: "D) (7, 4, 12)", ok: false, fb: "Perdiste el hilo con los signos. Arma un bloque para 2u, otro para 3v, y al final resta con calma uno a uno." }
    ]
  },
  {
    id: "T3D24",
    q: "La condición para que tres puntos A, B, C estén alineados es que exista un escalar k tal que:",
    opts: [
      { t: "A) AB · AC = 0", ok: false, fb: "Este es el test de perpendicularidad (hacer un cruce en \"L\"). No tiene que ver con estar en la misma línea." },
      { t: "B) AB + AC = 0", ok: false, fb: "Eso limita la respuesta a un caso de simetría muy específico. Te falta la noción del múltiplo escalar." },
      { t: "C) AB = k·AC", ok: true },
      { t: "D) |AB| = |AC|", ok: false, fb: "Eso solo indica igualdad de tamaños. Los vectores podrían apuntar en cualquier ángulo. Necesitas proporcionalidad lineal." }
    ]
  },
  {
    id: "T3D25",
    q: "Dados los puntos A(1, 2, 3), B(3, 5, 7) y C(5, 8, 11), ¿están alineados?",
    opts: [
      { t: "A) No, porque las componentes no son proporcionales", ok: false, fb: "¡Sí son proporcionales! Si calculas AB y BC, notarás que sus componentes son idénticos: son un múltiplo perfecto del otro." },
      { t: "B) Sí, porque AB = (2,3,4) y BC = (2,3,4)", ok: true },
      { t: "C) Sí, porque AB + BC = AC", ok: false, fb: "Esa es la regla de la suma de vectores que dibuja un triángulo válido, pero no sirve como diagnóstico de alineación perfecta." },
      { t: "D) No, porque la suma no es cero", ok: false, fb: "Para comprobar la alineación en 3D, basta probar que A→B y B→C tienen la misma inclinación; no necesitas que el trayecto se cancele." }
    ]
  }
  ]);
})();
