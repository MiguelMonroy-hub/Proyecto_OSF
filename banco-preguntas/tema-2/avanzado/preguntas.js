/**
 * Tema 2 · Avanzado (25 preguntas)
 */
(function () {
  "use strict";
  if (typeof quizBankRegistrar !== "function") {
    throw new Error("Carga quiz-bank-loader.js antes de este archivo.");
  }
  quizBankRegistrar("2", "dificil", [
  {
    id: "T2D01",
    q: "Un vector tiene magnitud 10 y su componente x es 6. Si el vector está en el primer cuadrante, ¿cuál es su componente y?",
    opts: [
      {
        t: "A) 4",
        ok: false,
        fb: "Parece que sumaste los números linealmente o tuviste un error al elevar al cuadrado. Recuerda que en un vector, sus componentes forman un triángulo rectángulo con la magnitud. Si la hipotenusa al cuadrado es 100, la suma de los catetos al cuadrado debe igualar ese valor."
      },
      {
        t: "B) 8",
        ok: true
      },
      {
        t: "C) √136",
        ok: false,
        fb: "¡Sumaste los cuadrados en lugar de restarlos!. Recuerda que ya conoces la magnitud total (hipotenusa) y una de las componentes (un cateto), por lo que la fórmula requiere un despeje para encontrar el cateto faltante."
      },
      {
        t: "D) 2",
        ok: false,
        fb: "El cuadrado de 2 es 4, y si lo sumas al cuadrado de 6 (36), no llegas a 100. Revisa tu despeje de la ecuación de magnitud: ."
      }
    ]
  },
  {
    id: "T2D02",
    q: "Un vector tiene magnitud 13 y su componente y es -5. Si el vector está en el cuarto cuadrante, ¿cuál es su componente x?",
    opts: [
      {
        t: "A) 12",
        ok: true
      },
      {
        t: "B) -12",
        ok: false,
        fb: "Calculaste el número perfectamente, pero ¡cuidado con los signos! El problema nos ubica en el cuarto cuadrante. Imagina el plano cartesiano: ¿qué signo le corresponde a la coordenada 'x' si te mueves hacia la derecha y hacia abajo?."
      },
      {
        t: "C) √194",
        ok: false,
        fb: "En lugar de restar el cuadrado del cateto conocido a la hipotenusa, parece que los sumaste. ¡No estás buscando una nueva hipotenusa, sino un cateto!"
      },
      {
        t: "D) 8",
        ok: false,
        fb: "Tal vez intentaste restar los valores directamente (13 - 5) sin aplicar potencias. El Teorema de Pitágoras no funciona sin elevar los valores al cuadrado primero."
      }
    ]
  },
  {
    id: "T2D03",
    q: "La dirección de un vector (medida desde el eje X positivo, en sentido antihorario) es 120°. Si su magnitud es 8, ¿cuáles son sus componentes aproximadas?",
    opts: [
      {
        t: "A) (4, 6.93)",
        ok: false,
        fb: "Obtuviste resultados positivos en ambas componentes. Un ángulo de 120° se abre más allá de los 90°, situando al vector en el segundo cuadrante. Piensa: ¿cómo es el movimiento horizontal en esa zona?"
      },
      {
        t: "B) (-4, 6.93)",
        ok: true
      },
      {
        t: "C) (-4, -6.93)",
        ok: false,
        fb: "Al tener una componente 'y' negativa, estás indicando que el vector apunta hacia abajo (tercer o cuarto cuadrante). Revisa el signo de la función seno para ángulos entre 90° y 180°."
      },
      {
        t: "D) (4, -6.93)",
        ok: false,
        fb: "Este vector apunta hacia el cuarto cuadrante. Asegúrate de evaluar el coseno de 120° para la coordenada 'x' y el seno de 120° para la coordenada 'y' respetando los signos."
      }
    ]
  },
  {
    id: "T2D04",
    q: "Un vector tiene componentes (5, 12). ¿Qué ángulo forma con el eje X positivo?",
    opts: [
      {
        t: "A) Aproximadamente 22.6°",
        ok: false,
        fb: "Invertiste la relación trigonométrica. Recuerda que para obtener el ángulo a partir de las componentes, se usa la tangente, que es el cateto opuesto ('y') dividido entre el cateto adyacente ('x')."
      },
      {
        t: "B) Aproximadamente 67.4°",
        ok: true
      },
      {
        t: "C) Aproximadamente 112.6°",
        ok: false,
        fb: "Este ángulo sitúa al vector en el segundo cuadrante. Si observas tus componentes originales (5, 12), ambas son positivas. ¿En qué cuadrante ubicas valores positivos para 'x' e 'y'?"
      },
      {
        t: "D) Aproximadamente 157.4°",
        ok: false,
        fb: "Un ángulo así indicaría que vas hacia la izquierda y hacia arriba o hacia el tercer cuadrante en sus cercanías. Revisa los signos iniciales del vector antes de aplicar la función inversa."
      }
    ]
  },
  {
    id: "T2D05",
    q: "Un vector tiene dirección 30° y magnitud 10. Otro vector tiene dirección 120° y magnitud 10. ¿Cuál es el ángulo entre ellos?",
    opts: [
      {
        t: "A) 30°",
        ok: false,
        fb: "Esa es únicamente la dirección inicial de uno de los vectores. El problema busca determinar la abertura o distancia angular entre ambas flechas."
      },
      {
        t: "B) 60°",
        ok: false,
        fb: "Parece que intentaste calcular el complemento de 30° o la diferencia con 90°. Si un vector está a 120° y otro a 30°, dibuja ambos partiendo del mismo punto y busca qué operación matemática te da el espacio en medio."
      },
      {
        t: "C) 90°",
        ok: true
      },
      {
        t: "D) 150°",
        ok: false,
        fb: "Es muy probable que sumaras las direcciones (120° + 30°). Para encontrar qué tan separados están dos trayectos angulares entre sí, debes hacer una sustracción."
      }
    ]
  },
  {
    id: "T2D06",
    q: "Los vectores u = (a, 3) y v = (4, b) son perpendiculares y tienen la misma magnitud. ¿Cuáles son los valores de a y b? (a > 0, b > 0)",
    opts: [
      {
        t: "A) a = 3, b = 4",
        ok: true
      },
      {
        t: "B) a = 4, b = 3",
        ok: false,
        fb: "Estos números cumplen perfectamente con igualar las magnitudes de los vectores, pero verifica si al multiplicarlos y sumarlos obtienes 0 para demostrar perpendicularidad."
      },
      {
        t: "C) a = 2, b = 6",
        ok: false,
        fb: "Si elevas estos valores al cuadrado para armar las magnitudes ( frente a ), verás de inmediato que los \"tamaños\" de los vectores no cuadran."
      },
      {
        t: "D) a = 6, b = 2",
        ok: false,
        fb: "Sustituir estas variables en la fórmula del Teorema de Pitágoras te arrojará tamaños asimétricos (45 contra 20)."
      }
    ]
  },
  {
    id: "T2D07",
    q: "La resultante de dos vectores perpendiculares tiene magnitud 25. Si uno de ellos tiene magnitud 7, ¿cuál es la magnitud del otro?",
    opts: [
      {
        t: "A) 18",
        ok: false,
        fb: "Restar la hipotenusa (25) y un cateto (7) directamente es un error de geometría básico. Los vectores perpendiculares no se suman como números en línea, usa los cuadrados."
      },
      {
        t: "B) 24",
        ok: false,
        fb: "¡Tu cálculo mental es brillante! Has hallado el valor correcto, sin embargo, la instrucción pide marcar la expresión matemática exacta que te lleva a ese resultado paso a paso. Lee bien todas las alternativas."
      },
      {
        t: "C) √(625 - 49) = √576 = 24",
        ok: true
      },
      {
        t: "D) 32",
        ok: false,
        fb: "¿Sumaste los números? Recuerda que la resultante de vectores perpendiculares representa la hipotenusa. Ningún cateto individual puede ser mayor que el trayecto directo final."
      }
    ]
  },
  {
    id: "T2D08",
    q: "Un vector tiene componentes (k, k+2) y magnitud √52. ¿Cuáles son los posibles valores de k?",
    opts: [
      {
        t: "A) 4 o -6",
        ok: true
      },
      {
        t: "B) 2 o -4",
        ok: false,
        fb: "Haz la prueba sustituyendo estos números en la expresión de magnitud: . El resultado no llega a 52. ¡Cuidado al desarrollar el binomio!."
      },
      {
        t: "C) 6 o -4",
        ok: false,
        fb: "Si usas el 6, tendrás el vector (6, 8), cuya magnitud total es 10 (la raíz de 100), no la raíz de 52. Debes plantear una ecuación igualada a 52 y resolverla."
      },
      {
        t: "D) 3 o -5",
        ok: false,
        fb: "Estos números no cuadran con el tamaño que buscamos. Te sugiero armar la ecuación , igualar a cero y factorizar pacientemente."
      }
    ]
  },
  {
    id: "T2D09",
    q: "La suma de dos vectores es (7, 1) y su diferencia es (3, -5). ¿Cuáles son los vectores?",
    opts: [
      {
        t: "A) u = (5, -2), v = (2, 3)",
        ok: true
      },
      {
        t: "B) u = (2, 3), v = (5, -2)",
        ok: false
      },
      {
        t: "C) u = (5, 2), v = (2, -3)",
        ok: false
      },
      {
        t: "D) u = (2, -3), v = (5, 2)",
        ok: false
      }
    ]
  },
  {
    id: "T2D10",
    q: "Un vector tiene magnitud 17 y su componente x es 15. ¿Cuál es la componente y si el vector está en el cuarto cuadrante?",
    opts: [
      {
        t: "A) 8",
        ok: false,
        fb: "Un resultado positivo en 'y' significa que el vector se movió hacia arriba, lo cual lo sitúa en el primer cuadrante. ¿Qué te pide el enunciado sobre su ubicación final?."
      },
      {
        t: "B) -8",
        ok: false,
        fb: "¡Tienes la dirección y el número perfectos!. Pero vuelve a mirar las opciones: el problema busca la expresión matemática completa que denota ese cálculo, no solo el dígito final."
      },
      {
        t: "C) √(17²-15²)",
        ok: false
      },
      {
        t: "D) -√64 = -8",
        ok: true
      }
    ]
  },
  {
    id: "T2D11",
    q: "TecDuck vuela 20 km en dirección N30°E (30° al este del norte). Luego vuela 30 km en dirección S45°E (45° al este del sur). ¿Cuál es su desplazamiento neto desde el origen? (Considera norte como y positivo, este como x positivo)",
    opts: [
      {
        t: "A) (20 sen30° + 30 sen45°, 20 cos30° - 30 cos45°)",
        ok: true
      },
      {
        t: "B) (20 cos30° + 30 cos45°, 20 sen30° - 30 sen45°)",
        ok: false,
        fb: "Al observar tu fórmula, parece que cambiaste los catetos. Cuando mides \"N30°E\", abres el ángulo de 30° apoyado en el eje Norte (Y). Por trigonometría, el movimiento al este (X) usa el cateto opuesto."
      },
      {
        t: "C) (20 cos30° - 30 cos45°, 20 sen30° + 30 sen45°)",
        ok: false,
        fb: "Si viajas \"S45°E\", estás bajando y avanzando a la derecha. Eso significa que tu movimiento horizontal suma, pero tu movimiento vertical debe llevar un signo negativo."
      },
      {
        t: "D) (20 sen30° - 30 sen45°, 20 cos30° + 30 cos45°)",
        ok: false,
        fb: "Intercambiaste completamente los cálculos de avance vertical con los del horizontal. Un buen tip: dibuja triángulos para cada tramo y ubica a quién le toca el seno y a quién el coseno según desde qué eje mides el ángulo."
      }
    ]
  },
  {
    id: "T2D12",
    q: "Un barco navega 40 km hacia el este, luego 30 km hacia el norte, luego 20 km en dirección S30°O (30° al oeste del sur). ¿Cuáles son las coordenadas finales del barco? (Origen en el punto de partida)",
    opts: [
      {
        t: "A) (40 - 20 sen30°, 30 - 20 cos30°)",
        ok: true
      },
      {
        t: "B) (40 - 20 cos30°, 30 - 20 sen30°)",
        ok: false,
        fb: "Estás equivocando qué función usar para los componentes. \"S30°O\" significa empezar a medir en el Sur (eje Y negativo) y abrir 30° hacia la izquierda (Oeste). El avance hacia la izquierda es el cateto opuesto, ¿qué función le corresponde?."
      },
      {
        t: "C) (40 + 20 sen30°, 30 - 20 cos30°)",
        ok: false,
        fb: "Si vas hacia el Oeste en el último tramo, tus coordenadas en X deben reducirse, no aumentar. Revisa ese signo positivo intruso que dejaste en la primera parte de tu componente."
      },
      {
        t: "D) (40 + 20 cos30°, 30 + 20 sen30°)",
        ok: false,
        fb: "La frase \"al oeste del sur\" indica movimiento hacia la izquierda (X negativa) y hacia abajo (Y negativa). En tu opción, todo está sumando."
      }
    ]
  },
  {
    id: "T2D13",
    q: "Dos vectores u y v tienen magnitudes 8 y 15 respectivamente. Si |u + v| = 17, ¿cuál es el ángulo entre u y v?",
    opts: [
      {
        t: "A) 0°",
        ok: false,
        fb: "Si el ángulo es 0°, ambos vectores empujan exactamente hacia la misma línea, por lo que bastaría sumar sus tamaños (8 + 15) para tener 23. No encaja con nuestro 17."
      },
      {
        t: "B) 90°",
        ok: true
      },
      {
        t: "C) 180°",
        ok: false,
        fb: "Un ángulo de 180° indica una colisión de fuerzas frontales, tendrías que restarlos (15 - 8 = 7). Analiza los números 8, 15 y 17. Son conocidos en geometría como una \"terna pitagórica\" muy especial."
      },
      {
        t: "D) 60°",
        ok: false,
        fb: "Si aplicas la Ley de los Cosenos con un ángulo de 60°, el resultado será bastante mayor que 17. Piensa en qué ángulo logra que todo el término del coseno \"desaparezca\" en la fórmula."
      }
    ]
  },
  {
    id: "T2D14",
    q: "La resultante de dos vectores tiene magnitud 20. Si la magnitud de uno de ellos es 12 y el ángulo entre ellos es 90°, ¿cuál es la magnitud del otro?",
    opts: [
      {
        t: "A) 8",
        ok: false,
        fb: "Parece que restaste las magnitudes directamente (20 - 12). Recuerda que cuando los vectores son perpendiculares, sus magnitudes no se restan linealmente, sino que se relacionan a través del Teorema de Pitágoras."
      },
      {
        t: "B) 16",
        ok: true
      },
      {
        t: "C) 32",
        ok: false,
        fb: "¡Cuidado! Sumaste los valores como si fueran escalares en la misma dirección. En el mundo de los vectores, la magnitud total (resultante) siempre se ve afectada por el ángulo entre ellos."
      },
      {
        t: "D) 23.3",
        ok: false,
        fb: "Aplicaste correctamente la suma de cuadrados, pero la trataste como si estuvieras buscando una nueva hipotenusa. Revisa el enunciado: ¿la magnitud 20 es un cateto o es ya la resultante final (hipotenusa)?"
      }
    ]
  },
  {
    id: "T2D15",
    q: "TecDuck debe ir del punto A(2, 5) al punto B(10, 11). Decide hacerlo en línea recta. ¿Qué vector debe seguir?",
    opts: [
      {
        t: "A) (8, 6)",
        ok: true
      },
      {
        t: "B) (12, 16)",
        ok: false,
        fb: "Te equivocaste de operación y sumaste los puntos. Para crear un vector que conecte dos ubicaciones, necesitas encontrar la distancia que hay entre ellos a través de una diferencia."
      },
      {
        t: "C) (6, 8)",
        ok: false,
        fb: "Restaste el inicio menos el final o cruzaste las coordenadas. La fórmula irrompible para un vector entre puntos es siempre: Punto Final menos Punto Inicial."
      },
      {
        t: "D) (10, 11)",
        ok: false,
        fb: "Elegiste las coordenadas del lugar al que TecDuck llegó. Un vector no es un \"lugar\", es el \"trayecto\" que se necesitó para viajar desde la salida a la llegada."
      }
    ]
  },
  {
    id: "T2D16",
    q: "Los vértices de un triángulo son A(1, 2), B(5, 3) y C(3, 7). ¿Cuál es el vector que representa el lado AB?",
    opts: [
      {
        t: "A) (4, 1)",
        ok: true
      },
      {
        t: "B) (2, 5)",
        ok: false,
        fb: "Este conjunto de instrucciones de movimiento no representa el lado AB. De hecho, te llevaría desde A hasta C. Revisa las coordenadas de los vértices que necesitas conectar."
      },
      {
        t: "C) (4, 5)",
        ok: false,
        fb: "Tu matemática te traicionó en la segunda coordenada. Haz la resta paso a paso: ¿cuánto cambia la altura si vas de y=2 a y=3?."
      },
      {
        t: "D) (1, 4)",
        ok: false,
        fb: "Parece que cambiaste el orden de tus respuestas, poniendo el cambio vertical donde va el horizontal. En un par ordenado de vector (x, y), primero reportamos el desplazamiento lateral."
      }
    ]
  },
  {
    id: "T2D17",
    q: "Los vértices de un triángulo son A(1, 2), B(5, 3) y C(3, 7). ¿Cuál es el vector que va del punto medio de AB al vértice C?",
    opts: [
      {
        t: "A) (0, 4.5)",
        ok: true
      },
      {
        t: "B) (3, 2.5)",
        ok: false,
        fb: "Has encontrado las coordenadas exactas del punto medio de AB. Sin embargo, el problema te pide el vector (el trayecto) que conecta ese punto con el vértice C. ¿Qué operación te falta para hallar ese desplazamiento?"
      },
      {
        t: "C) (0, -4.5)",
        ok: false,
        fb: "Tienes la magnitud correcta, pero ¡revisa el sentido del vector! Recuerda que para ir \"del punto medio al vértice C\", la fórmula requiere restar el punto final menos el punto inicial."
      },
      {
        t: "D) (4, 1)",
        ok: false,
        fb: "Este vector representa el desplazamiento del lado AB. El problema te pide una conexión distinta: desde el centro de ese lado hacia el punto C. Revisa qué coordenadas estás restando."
      }
    ]
  },
  {
    id: "T2D18",
    q: "¿Cuál de los siguientes vectores NO es perpendicular a (3, -4)?",
    opts: [
      {
        t: "A) (4, 3)",
        ok: false,
        fb: "Producto punto: (3)(4) + (-4)(3) = 12 - 12 = 0. Sí es perpendicular."
      },
      {
        t: "B) (-4, -3)",
        ok: false,
        fb: "Producto punto: (3)(-4) + (-4)(-3) = -12 + 12 = 0. Sí es perpendicular (es el opuesto de A)."
      },
      {
        t: "C) (8, 6)",
        ok: false,
        fb: "Producto punto: (3)(8) + (-4)(6) = 24 - 24 = 0. Sí es perpendicular (es el doble de A)."
      },
      {
        t: "D) (6, 8)",
        ok: true
      }
    ]
  },
  {
    id: "T2D19",
    q: "Un vector tiene componentes (cos θ, sen θ). ¿Qué representa este vector?",
    opts: [
      {
        t: "A) Un vector de magnitud variable",
        ok: false,
        fb: "Si introduces el seno y el coseno en el Teorema de Pitágoras () para encontrar su magnitud, una famosa identidad trigonométrica te dirá que el tamaño es estático, no variable."
      },
      {
        t: "B) Un vector unitario en dirección θ",
        ok: true
      },
      {
        t: "C) Un vector siempre horizontal",
        ok: false,
        fb: "Si el vector fuera siempre horizontal, su componente 'y' tendría que ser permanentemente 0 sin importar cuánto cambies θ. Pero sabemos que el sinθ cambia de valor continuamente."
      },
      {
        t: "D) Un vector siempre vertical",
        ok: false,
        fb: "Si fuera un vector que solo sube o baja, carecería de avance lateral, es decir cosθ = 0 siempre, lo cual no es cierto para todos los ángulos."
      }
    ]
  },
  {
    id: "T2D20",
    q: "Si el vector (a, b) es unitario, ¿cuál de las siguientes afirmaciones es verdadera?",
    opts: [
      {
        t: "A) a² + b² = 1",
        ok: true
      },
      {
        t: "B) a + b = 1",
        ok: false,
        fb: "Que las partes sumen 1 no crea un tamaño de 1 en el espacio. Si camino medio metro a la derecha y medio metro arriba, la diagonal (magnitud) medirá menos que 1 debido a la forma del triángulo."
      },
      {
        t: "C) a = 1, b = 0",
        ok: false,
        fb: "¡Ese es un fantástico ejemplo de un vector unitario que apunta sobre la línea de las 'x'!. Sin embargo, el problema te pide la propiedad matemática general aplicable a todos."
      },
      {
        t: "D) a = 0, b = 1",
        ok: false,
        fb: "Esta afirmación solo abarca al vector que apunta hacia el techo. Busca en las opciones cuál es la fórmula inquebrantable de la magnitud igualada a 1."
      }
    ]
  },
  {
    id: "T2D21",
    q: "La proyección de un vector u sobre un vector v es 5. Si |v| = 3 y el ángulo entre u y v es 60°, ¿cuál es la magnitud de u?",
    opts: [
      {
        t: "A) 10/3",
        ok: false,
        fb: "Es muy común tratar de dividir usando todos los datos, ¡pero la magnitud de 'v' (3) es un distractor aquí! La fórmula matemática para la proyección de 'u' sobre un eje define que proyección = |u|cos(θ). Despeja partiendo de ahí."
      },
      {
        t: "B) 10",
        ok: true
      },
      {
        t: "C) 5√3",
        ok: false,
        fb: "Si llegaste a la raíz de 3, lo más seguro es que usaste la función seno en vez del coseno en el planteamiento. Para proyectar sombras de un vector sobre una base (como la adyacente), siempre requerimos el coseno."
      },
      {
        t: "D) 15/2",
        ok: false,
        fb: "Multiplicaste datos que no corresponden. Vuelve a la base conceptual: ¿qué nos dice exactamente que una proyección sea igual a 5?."
      }
    ]
  },
  {
    id: "T2D22",
    q: "Dados los vectores u = (2, 3) y v = (4, -1), ¿cuál es el vector w = 2u - 3v?",
    opts: [
      {
        t: "A) (16, 3)",
        ok: false,
        fb: "Te equivocaste de signo en la fase final; en vez de hacer una resta (2u - 3v), terminaste sumando los bloques de componentes."
      },
      {
        t: "B) (-8, 9)",
        ok: true
      },
      {
        t: "C) (8, -9)",
        ok: false,
        fb: "Cuidado con la resta de negativos. Cuando restas la parte 'x' tienes 4 - 12, y para la parte 'y' tienes 6 - (-3). Ley de los signos te ayudará a corregirlo."
      },
      {
        t: "D) (-16, -3)",
        ok: false,
        fb: "Multiplicaste mal el factor escalar sobre el vector. Tómalo con calma: primero escala el vector u, luego escala el vector v, y finalmente acomoda las restas individuales."
      }
    ]
  },
  {
    id: "T2D23",
    q: "La resultante de tres vectores es cero. Dos de ellos son u = (2, -1) y v = (-3, 4). ¿Cuál es el tercer vector w?",
    opts: [
      {
        t: "A) (1, -3)",
        ok: true
      },
      {
        t: "B) (-1, 3)",
        ok: false,
        fb: "Ese es exactamente el resultado de sumar los vectores 'u' y 'v' combinados. ¡Pero la meta es que todo llegue a cero! Piensa: si algo empuja (-1, 3), ¿qué fuerza necesitas en contra para detener el movimiento completamente?"
      },
      {
        t: "C) (5, -5)",
        ok: false,
        fb: "Este vector parece originarse si intentaras restar 'v' de 'u'. Eso no nos ayuda a lograr el balance. Establece la simple ecuación u + v + w = 0."
      },
      {
        t: "D) (-5, 5)",
        ok: false,
        fb: "Estás tratando de usar los signos al revés sobre un vector incorrecto. Solo suma las componentes reales paso a paso, y encuentra el vector w que equilibra la balanza hacia el cero."
      }
    ]
  },
  {
    id: "T2D24",
    q: "Un vector tiene magnitud 10 y forma un ángulo de 30° con el eje X. Otro vector tiene magnitud 15 y forma un ángulo de 120° con el eje X. La magnitud de la suma es:",
    opts: [
      {
        t: "A) 5√7",
        ok: false,
        fb: "Este resultado suele aparecer si hubo una confusión con los signos al sumar las componentes o si se usó la Ley de Cosenos de forma incorrecta para este ángulo. Verifica de nuevo tu suma de los componentes en el eje X."
      },
      {
        t: "B) 5√19",
        ok: false,
        fb: "Revisa el cálculo de tus cuadrados finales. Es posible que al elevar al cuadrado las componentes con raíces, algún valor se haya sumado de más. ¿Cómo quedó tu suma de ?"
      },
      {
        t: "C) 25",
        ok: false,
        fb: "Sumar las magnitudes directamente (10 + 15) solo funciona si ambos vectores apuntan exactamente hacia el mismo lugar. Como tienen ángulos diferentes (30° y 120°), debes trabajar con sus componentes rectangulares por separado."
      },
      {
        t: "D) 5√13",
        ok: true
      }
    ]
  },
  {
    id: "T2D25",
    q: "TecDuck vuela en un plano. Su posición inicial es (2, 3). Luego vuela según el vector (5, -1). Luego vuela según el vector (-3, 4). Finalmente, vuela según el vector (1, 2). ¿A qué distancia del origen se encuentra?",
    opts: [
      {
        t: "A) √34",
        ok: false,
        fb: "Olvidaste tomar en cuenta la posición inicial (2, 3). Solo sumaste los vectores de desplazamiento (5-3+1 = 3 y -1+4+2 = 5), calculando la distancia del puro desplazamiento: √(3² + 5²) = √34."
      },
      {
        t: "B) 13",
        ok: false,
        fb: "Calculaste correctamente la posición final (5, 8), pero en lugar de aplicar el teorema de Pitágoras para la magnitud, simplemente sumaste las dos coordenadas (5 + 8 = 13)."
      },
      {
        t: "C) √89",
        ok: true
      },
      {
        t: "D) 5",
        ok: false,
        fb: "Te equivocaste en los signos del último vector o lo restaste en lugar de sumarlo. Si la posición final hubiera sido (3, 4), la distancia al origen sería √(3² + 4²) = √25 = 5."
      }
    ]
  }
]);
})();
