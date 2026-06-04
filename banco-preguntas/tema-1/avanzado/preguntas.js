/**
 * Tema 1 · Avanzado (25 preguntas)
 */
(function () {
  "use strict";
  if (typeof quizBankRegistrar !== "function") {
    throw new Error("Carga quiz-bank-loader.js antes de este archivo.");
  }
  quizBankRegistrar("1", "dificil", [
  {
    id: "T1D01",
    q: "TecDuck comienza en el punto A(3, -2). Luego se mueve 5 unidades a la izquierda y 4 unidades hacia arriba. Después de este movimiento, TecDuck se encuentra en el punto B, y luego se desplaza según el vector (-2, -3). ¿Cuáles son las coordenadas finales de TecDuck?",
    opts: [
      {
        t: "A) (-4, -1)",
        ok: true
      },
      {
        t: "B) (6, -1)",
        ok: false,
        fb: "Revisa el primer paso. Si vas a la \"izquierda\", ¿debes sumar o restar al valor de x? Parece que sumaste en lugar de restar."
      },
      {
        t: "C) (-4, 5)",
        ok: false,
        fb: "En el último paso (el vector), observa los signos. Si restas 3 a un valor"
      },
      {
        t: "D) (1, -1)",
        ok: false,
        fb: "Verifica el cálculo de la primera coordenada (x). Asegúrate de aplicar tanto el movimiento de 5 unidades como el del vector -2 partiendo desde el 3 inicial."
      }
    ]
  },
  {
    id: "T1D02",
    q: "Un punto P tiene coordenadas (x, y) tales que |x| = 5 y |y| = 3, y se encuentra en el tercer cuadrante. Si este punto se refleja primero respecto al eje Y y luego respecto al eje X, ¿cuáles son las coordenadas finales?",
    opts: [
      {
        t: "A) (5, -3)",
        ok: false,
        fb: "Al reflejar un punto respecto al eje X, imagina que el eje horizontal es un espejo en el suelo. ¿Qué coordenada debería cambiar, la horizontal o la vertical?"
      },
      {
        t: "B) (-5, 3)",
        ok: false,
        fb: "El punto ya se encuentra en el tercer cuadrante, lo que significa que ambas coordenadas son negativas inicialmente. Si reflejas sobre el eje Y (espejo vertical), piensa qué signo es el que debe invertirse."
      },
      {
        t: "C) (5, 3)",
        ok: true
      },
      {
        t: "D) (-5, -3)",
        ok: false,
        fb: "Este es tu punto original de partida en el tercer cuadrante. Recuerda que el problema te pide aplicar dos reflexiones (una en cada eje) para llegar a la posición final."
      }
    ]
  },
  {
    id: "T1D03",
    q: "TecDuck debe ir del punto A(-4, 7) al punto B(5, -3). Decide hacerlo en dos etapas: primero viaja horizontalmente hasta alcanzar la misma coordenada x de B, y luego verticalmente hasta B. ¿Cuántas unidades viaja TecDuck en total?",
    opts: [
      {
        t: "A) 19",
        ok: true
      },
      {
        t: "B) 9",
        ok: false,
        fb: "Parece que solo calculaste la distancia del trayecto horizontal. Recuerda que el viaje consta de dos etapas; te falta incluir el movimiento vertical para llegar a B."
      },
      {
        t: "C) 10",
        ok: false,
        fb: "Este valor corresponde únicamente al desplazamiento vertical. El recorrido total debe sumar también la distancia recorrida a lo largo del eje horizontal."
      },
      {
        t: "D) 21",
        ok: false,
        fb: "Revisa tus sumas y restas al calcular la diferencia de las coordenadas. Asegúrate de contar la distancia total absoluta de ambos tramos sin añadir unidades extra por error."
      }
    ]
  },
  {
    id: "T1D04",
    q: "Los puntos A(a, b), B(c, d) y C(e, f) son los vértices de un triángulo rectángulo con el ángulo recto en A. Si a = 2, b = 3, c = 2, d = 7, y e = 6, ¿cuál es el valor de f?",
    opts: [
      {
        t: "A) 3",
        ok: true
      },
      {
        t: "B) 7",
        ok: false,
        fb: "Ese valor corresponde a la altura del punto B. Para que se forme un ángulo recto en A (que está alineado verticalmente con B), piensa en cómo debe ser la línea que conecta A con C."
      },
      {
        t: "C) 5",
        ok: false,
        fb: "Si usas este valor, la línea no sería completamente horizontal, lo que arruinaría el ángulo de 90 grados. Revisa qué coordenada debe mantenerse constante para formar una \"L\" perfecta."
      },
      {
        t: "D) 4",
        ok: false,
        fb: "Observa las coordenadas del punto A. Para mantener una línea perpendicular al segmento AB (que es vertical), el segmento AC debe compartir una altura exacta."
      }
    ]
  },
  {
    id: "T1D05",
    q: "Un punto M es el punto medio entre P(2a, 3b) y Q(4a, b). Si las coordenadas de M son (9, 6), ¿cuáles son los valores de a y b?",
    opts: [
      {
        t: "A) a = 3, b = 3",
        ok: true
      },
      {
        t: "B) a = 2, b = 4",
        ok: false,
        fb: "Recuerda la fórmula del punto medio: se suman las coordenadas de los extremos y se dividen entre dos. Revisa el resultado de tu despeje inicial."
      },
      {
        t: "C) a = 4, b = 2",
        ok: false,
        fb: "Verifica tu ecuación para la coordenada horizontal. Si el punto medio es 9, la suma de las 'x' originales promediada debe dar ese resultado."
      },
      {
        t: "D) a = 3, b = 4",
        ok: false,
        fb: "Calculaste correctamente el valor de 'a', pero revisa tu despeje para la coordenada vertical. Sumar las componentes 'y' y dividirlas a la mitad debe resultar en 6."
      }
    ]
  },
  {
    id: "T1D06",
    q: "El punto A(3, -5) se refleja respecto al eje X, obteniendo A'. Luego A' se refleja respecto al eje Y, obteniendo A''. ¿Cuáles son las coordenadas de A''?",
    opts: [
      {
        t: "A) (-3, 5)",
        ok: true
      },
      {
        t: "B) (3, 5)",
        ok: false,
        fb: "Este resultado es correcto para el primer reflejo sobre el eje X. Sin embargo, te falta aplicar el segundo paso requerido en el problema."
      },
      {
        t: "C) (-3, -5)",
        ok: false,
        fb: "Analiza el orden de los reflejos. Si reflejas primero sobre X y luego sobre Y, estás cruzando el plano en ambas direcciones. ¿Cómo deberían quedar los signos finales en comparación al reflejo respecto al origen?"
      },
      {
        t: "D) (3, -5)",
        ok: false,
        fb: "Estas son las coordenadas exactas del punto de partida. Asegúrate de aplicar los cambios de signo correspondientes a cada reflexión solicitada."
      }
    ]
  },
  {
    id: "T1D07",
    q: "Dos puntos P y Q son simétricos respecto al origen. Si P = (-2, 7), ¿cuáles son las coordenadas de Q?",
    opts: [
      {
        t: "A) (2, -7)",
        ok: true
      },
      {
        t: "B) (-2, -7)",
        ok: false,
        fb: "Al cambiar solo el signo de la segunda coordenada, estás realizando una simetría respecto al eje X. La simetría respecto al origen tiene un efecto diferente."
      },
      {
        t: "C) (2, 7)",
        ok: false,
        fb: "Este cambio indica una simetría únicamente respecto al eje Y. Recuerda que cruzar por el origen (0,0) como si fuera un espejo central invierte tu posición en todas las dimensiones."
      },
      {
        t: "D) (-2, 7)",
        ok: false,
        fb: "Estas son las coordenadas iniciales del punto P. Una simetría respecto al origen siempre debe alterar tu par ordenado."
      }
    ]
  },
  {
    id: "T1D08",
    q: "El punto R se refleja respecto al eje Y y se obtiene (-3, 4). ¿Cuáles eran las coordenadas originales de R?",
    opts: [
      {
        t: "A) (3, 4)",
        ok: true
      },
      {
        t: "B) (-3, -4)",
        ok: false,
        fb: "Si este fuera el punto original, al reflejarlo sobre el eje Y (cambiando el signo horizontal), no llegarías al resultado deseado. Revisa qué signo se debe invertir."
      },
      {
        t: "C) (3, -4)",
        ok: false,
        fb: "Piensa en el proceso inverso: si un punto se reflejó sobre el eje vertical (Y) para llegar a su posición final, ¿qué coordenada se vio afectada y cuál debió mantenerse intacta?"
      },
      {
        t: "D) (-3, 4)",
        ok: false,
        fb: "Este es el punto final después del reflejo. Para encontrar el punto original, debes \"deshacer\" el efecto del espejo que ocurrió al cruzar el eje Y."
      }
    ]
  },
  {
    id: "T1D09",
    q: "Un cuadrado tiene vértices en (1, 1), (5, 1), (5, 5) y (1, 5). Si se refleja respecto al eje X, ¿cuáles son las coordenadas del vértice que originalmente estaba en (1, 5)?",
    opts: [
      {
        t: "A) (1, -5)",
        ok: true
      },
      {
        t: "B) (-1, 5)",
        ok: false,
        fb: "Este resultado se obtendría si el cuadrado se reflejara respecto al eje vertical (Y). Lee cuidadosamente sobre qué eje te pide hacer el ejercicio la reflexión."
      },
      {
        t: "C) (-1, -5)",
        ok: false,
        fb: "Al cambiar los signos de ambas coordenadas, el vértice se reflejaría respecto al origen de forma diagonal. Un reflejo sobre un solo eje debe afectar a una sola dimensión."
      },
      {
        t: "D) (5, 1)",
        ok: false,
        fb: "Has seleccionado las coordenadas de otro de los vértices del cuadrado original. Identifica el vértice (1, 5) y analiza qué le sucede a su altura cuando \"cruza\" el eje horizontal hacia abajo."
      }
    ]
  },
  {
    id: "T1D10",
    q: "Tres puntos A, B y C son tales que B es el punto medio entre A y C. Si A = (-3, 2) y B = (1, -1), ¿cuáles son las coordenadas de C?",
    opts: [
      {
        t: "A) (5, -4)",
        ok: true
      },
      {
        t: "B) (-1, 0.5)",
        ok: false,
        fb: "Parece que calculaste el punto medio entre A y B. Sin embargo, lee bien el enunciado: B ya es el punto medio, por lo que tu objetivo es encontrar el extremo C faltante."
      },
      {
        t: "C) (2, -3)",
        ok: false,
        fb: "Verifica tu despeje en la fórmula del punto medio. Recuerda que el valor de B debe ser igual a la suma de los extremos A y C, dividida a la mitad."
      },
      {
        t: "D) (-5, 4)",
        ok: false,
        fb: "Estas coordenadas corresponden a una simetría respecto al origen. Plantea la ecuación del punto medio para cada eje de forma independiente y despeja la incógnita."
      }
    ]
  },
  {
    id: "T1D11",
    q: "La distancia entre dos puntos P y Q es de 10 unidades. Si P = (-2, 3) y Q = (6, y), ¿cuál es el valor de y?",
    opts: [
      {
        t: "A) 9 o -3",
        ok: true
      },
      {
        t: "B) 7 o -1",
        ok: false,
        fb: "Revisa el cálculo dentro de la fórmula de distancia. Al elevar al cuadrado la diferencia de las coordenadas 'y', ¿la suma total dentro de la raíz realmente da como resultado 100?"
      },
      {
        t: "C) 5 o 1",
        ok: false,
        fb: "Verifica tu despeje. Si la diferencia en las abscisas (eje x) ya aporta un valor considerable, ¿cuánto falta sumar para alcanzar el cuadrado de la distancia requerida?"
      },
      {
        t: "D) 11 o -5",
        ok: false,
        fb: "Parece que la suma de los cuadrados superó la distancia límite dada en el problema. Recuerda restar correctamente la posición antes de elevar al cuadrado."
      }
    ]
  },
  {
    id: "T1D12",
    q: "TecDuck vuela en línea recta desde el punto (-5, -2) hasta el punto (7, 3). ¿Cuál es la distancia que recorre? (Expresa el resultado simplificado)",
    opts: [
      {
        t: "A) 13",
        ok: true
      },
      {
        t: "B) 12",
        ok: false,
        fb: "Este valor refleja únicamente la diferencia de distancia en el eje horizontal. Para vuelos en línea recta (diagonales), es necesario aplicar el Teorema de Pitágoras."
      },
      {
        t: "C) √194",
        ok: false,
        fb: "Verifica las sumas y restas de tus coordenadas antes de elevarlas al cuadrado. Un pequeño error aritmético pudo haber alterado el resultado final dentro de la raíz."
      },
      {
        t: "D) √169",
        ok: false,
        fb: "Tu planteamiento matemático inicial es correcto, pero lee con cuidado la instrucción del problema. Se te pide expresar el resultado final de la forma más simplificada posible."
      }
    ]
  },
  {
    id: "T1D13",
    q: "Los puntos A(2, 3), B(5, 7) y C(x, y) forman un triángulo isósceles con AB = AC. Si C está sobre el eje X, ¿cuáles son las coordenadas de C?",
    opts: [
      {
        t: "A) (6, 0) o (-2, 0)",
        ok: true
      },
      {
        t: "B) (4, 0) o (0, 0)",
        ok: false,
        fb: "Para que el triángulo sea isósceles bajo esta condición, la distancia de A hacia C debe medir exactamente lo mismo que de A hacia B. Sustituye estos puntos en la fórmula de distancia y comprueba si se cumple la igualdad."
      },
      {
        t: "C) (8, 0) o (-4, 0)",
        ok: false,
        fb: "Verifica tus ecuaciones paso a paso. Al igualar las distancias al cuadrado, asegúrate de realizar el desarrollo del binomio o el despeje de la raíz de forma correcta."
      },
      {
        t: "D) (5, 0) o (-1, 0)",
        ok: false,
        fb: "Estos puntos no generan la misma longitud al calcular la distancia desde el vértice A. Revisa cuidadosamente el despeje de tu variable sobre el eje X."
      }
    ]
  },
  {
    id: "T1D14",
    q: "Si el punto (k, 2k) está a distancia 5 del origen, ¿cuáles son los posibles valores de k?",
    opts: [
      {
        t: "A) √5 o -√5",
        ok: true
      },
      {
        t: "B) 1 o -1",
        ok: false,
        fb: "Si sustituyes este valor en las coordenadas y calculas la distancia al origen, notarás que no llegas a 5. Revisa cómo elevaste al cuadrado los términos que incluyen la variable k."
      },
      {
        t: "C) 5 o -5",
        ok: false,
        fb: "Parece que olvidaste aplicar una raíz cuadrada al final de tu despeje. Recuerda que la fórmula iguala la raíz a 5, por lo que el contenido interno debe sumar 25."
      },
      {
        t: "D) √3 o -√3",
        ok: false,
        fb: "Revisa la suma de los términos con incógnita. Elevar una multiplicación al cuadrado afecta a ambos elementos. Vuelve a intentar el despeje final de k."
      }
    ]
  },
  {
    id: "T1D15",
    q: "Un rectángulo tiene vértices en (1, 2), (1, 5), (4, 5) y (4, 2). Si se traslada 3 unidades a la izquierda y 2 unidades hacia abajo, ¿cuáles son las coordenadas del vértice que originalmente estaba en (4, 5)?",
    opts: [
      {
        t: "A) (1, 3)",
        ok: true
      },
      {
        t: "B) (7, 7)",
        ok: false,
        fb: "Una traslación a la izquierda y hacia abajo requiere disminuir valores en el plano. Parece que realizaste la operación opuesta y sumaste en ambas direcciones."
      },
      {
        t: "C) (1, 7)",
        ok: false,
        fb: "Aplicaste correctamente el movimiento horizontal. Sin embargo, revisa la instrucción vertical: moverse \"hacia abajo\" indica una reducción en el valor, no un aumento."
      },
      {
        t: "D) (7, 3)",
        ok: false,
        fb: "Tu movimiento vertical es correcto. Pero un desplazamiento \"a la izquierda\" debe reducir tu posición en el eje X, no alejarla hacia valores más positivos."
      }
    ]
  },
  {
    id: "T1D16",
    q: "Los puntos A(2, 3), B(5, 7) y C(8, 11) están alineados. ¿Cuál de los siguientes puntos también está en la misma recta?",
    opts: [
      {
        t: "A) (11, 15)",
        ok: true
      },
      {
        t: "B) (4, 6)",
        ok: false,
        fb: "Para que varios puntos pertenezcan a la misma recta, la pendiente entre cualquier par de ellos debe ser idéntica. Calcula la razón de cambio y comprueba si este punto encaja."
      },
      {
        t: "C) (6, 9)",
        ok: false,
        fb: "Calcula la pendiente entre los puntos que ya conoces de la recta. Luego, verifica si al intentar llegar a este nuevo punto se mantiene la misma inclinación exacta."
      },
      {
        t: "D) (10, 14)",
        ok: false,
        fb: "Intenta establecer la ecuación de la recta o sigue el \"patrón\" de incrementos regulares. Este punto se desvía ligeramente de la trayectoria trazada."
      }
    ]
  },
  {
    id: "T1D17",
    q: "El punto P(x, y) está en el primer cuadrante y cumple que su distancia al eje X es el doble de su distancia al eje Y. Si su distancia al origen es √20, ¿cuáles son sus coordenadas?",
    opts: [
      {
        t: "A) (2, 4)",
        ok: true
      },
      {
        t: "B) (4, 2)",
        ok: false,
        fb: "La distancia al eje X está representada por el valor de la coordenada vertical (y). Revisa el enunciado: esa distancia debe ser el doble que la distancia al eje Y. Has invertido los valores."
      },
      {
        t: "C) (3, 6)",
        ok: false,
        fb: "Este punto cumple con la proporción correcta entre sus coordenadas. Sin embargo, si calculas su distancia total al origen usando el Teorema de Pitágoras, el valor sobrepasa lo solicitado."
      },
      {
        t: "D) (1, 2)",
        ok: false,
        fb: "Aunque la relación de doble distancia es correcta aquí, si analizas su posición real, este punto se encuentra más cerca del origen de lo que indica el problema."
      }
    ]
  },
  {
    id: "T1D18",
    q: "La recta que pasa por los puntos (2, 1) y (5, 7) corta al eje Y en un punto. ¿Cuáles son las coordenadas de ese punto?",
    opts: [
      {
        t: "A) (0, -3)",
        ok: true
      },
      {
        t: "B) (0, 3)",
        ok: false,
        fb: "Verifica el signo de tu ecuación final. Después de encontrar la pendiente de la recta, asegúrate de respetar las leyes de los signos al despejar para encontrar la intersección con el eje Y."
      },
      {
        t: "C) (0, -5)",
        ok: false,
        fb: "Revisa cómo calculaste la inclinación de la recta (la diferencia vertical entre la diferencia horizontal) y qué punto utilizaste como referencia para proyectar la línea hasta cortar el eje."
      },
      {
        t: "D) (0, 5)",
        ok: false,
        fb: "Este resultado sería correcto si la pendiente de la recta fuera distinta o si hubieras cometido un error aritmético de suma al usar la fórmula de punto-pendiente."
      }
    ]
  },
  {
    id: "T1D19",
    q: "Tres puntos A(1, 2), B(4, 5) y C(7, y) están alineados. ¿Cuál es el valor de y?",
    opts: [
      {
        t: "A) 8",
        ok: true
      },
      {
        t: "B) 9",
        ok: false,
        fb: "Estar alineados significa mantener exactamente la misma pendiente. Calcula primero la pendiente del tramo A-B, y asegúrate de que el salto hacia C mantenga el mismo ritmo."
      },
      {
        t: "C) 10",
        ok: false,
        fb: "Observa el patrón: por cada unidad que avanzas a la derecha entre A y B, ¿cuánto subes? Aplica ese mismo crecimiento constante para llegar hasta el punto C."
      },
      {
        t: "D) 11",
        ok: false,
        fb: "Esta elevación hace que la recta cambie de inclinación. Usa la pendiente constante del primer segmento para proyectar matemáticamente a qué altura debe estar el punto cuando alcanza el valor 7 horizontal."
      }
    ]
  },
  {
    id: "T1D20",
    q: "La distancia entre los puntos (k, 3) y (4, k) es √10. ¿Cuáles son los posibles valores de k?",
    opts: [
      {
        t: "A) 2 o 4",
        ok: false,
        fb: "Haz la prueba sustituyendo estos números en la fórmula original de distancia. Verás que no se logra el resultado pedido. Revisa cuidadosamente la factorización de tu polinomio."
      },
      {
        t: "B) 3 o 5",
        ok: false,
        fb: "Si usaras estos valores, los puntos estarían alineados paralelos a los ejes, lo que no generaría la diagonal solicitada. Un ligero error en los coeficientes pudo desviar tu respuesta."
      },
      {
        t: "C) 1 o 3",
        ok: false,
        fb: "Verifica el desarrollo de todos tus binomios al cuadrado. Al agrupar términos semejantes para aplicar la fórmula cuadrática, asegúrate de no haber perdido ningún número por el camino."
      },
      {
        t: "D) 2 o 5",
        ok: true
      }
    ]
  },
  {
    id: "T1D21",
    q: "¿Cuál es el punto sobre el eje X que está a la misma distancia de A(2, 3) que de B(6, 1)?",
    opts: [
      {
        t: "A) (5, 0)",
        ok: false,
        fb: "Calcula usando la fórmula de distancia desde este punto hacia A y luego hacia B. Te darás cuenta de que la balanza se inclina fuertemente hacia uno de ellos."
      },
      {
        t: "B) (4, 0)",
        ok: false,
        fb: "Aunque a simple vista en un dibujo pueda parecer un candidato a punto medio, la geometría requiere cálculos precisos. Igualar las expresiones de distancia te revelará que no es equidistante."
      },
      {
        t: "C) (3, 0)",
        ok: true
      },
      {
        t: "D) (2, 0)",
        ok: false,
        fb: "Este punto se alinea en el plano verticalmente con A, pero su trayecto hacia B es considerablemente más largo. Busca un equilibrio sobre el eje X."
      }
    ]
  },
  {
    id: "T1D22",
    q: "¿Cuál es el punto más cercano al origen sobre la recta que pasa por (2, 0) y (0, 4)?",
    opts: [
      {
        t: "A) (1, 2)",
        ok: false,
        fb: "Este punto pertenece a la recta, pero calcula su distancia al origen usando el Teorema de Pitágoras (). ¿Hay algún otro punto en las opciones que resulte en un valor menor?"
      },
      {
        t: "B) (0.8, 2.4)",
        ok: false,
        fb: "Verifica tu cálculo de la distancia. Aunque el punto cumple con la ecuación de la recta, al elevar al cuadrado sus coordenadas (), notarás que se aleja más del centro del plano que otros candidatos."
      },
      {
        t: "C) (1.2, 1.6)",
        ok: true
      },
      {
        t: "D) (0.6, 2.8)",
        ok: false,
        fb: "Observa la posición de este punto. Al tener una coordenada vertical tan alta, su distancia total al origen aumenta considerablemente. Busca el punto que equilibre mejor ambas coordenadas para estar lo más cerca posible del (0,0)."
      }
    ]
  },
  {
    id: "T1D23",
    q: "El área de un triángulo con vértices en (0,0), (4,0) y (0,3) es 6. Si se traslada el triángulo 2 unidades a la derecha y 1 hacia arriba, ¿cuál es el área del nuevo triángulo?",
    opts: [
      {
        t: "A) 6",
        ok: true
      },
      {
        t: "B) 8",
        ok: false,
        fb: "Las traslaciones son simplemente deslizamientos de una figura a otra zona del plano cartesiano. Reflexiona: ¿el simple hecho de mover algo de lugar cambia su tamaño o su área?"
      },
      {
        t: "C) 10",
        ok: false,
        fb: "Parece que combinaste de forma incorrecta el área original con los valores de las coordenadas de la traslación. La forma geométrica mantiene sus proporciones intactas tras el movimiento."
      },
      {
        t: "D) 12",
        ok: false,
        fb: "El área inicial se halla multiplicando base por altura y dividiendo el resultado. Un deslizamiento no escala la figura ni duplica mágicamente el espacio que ocupa."
      }
    ]
  },
  {
    id: "T1D24",
    q: "¿Cuál de los siguientes puntos NO está a la misma distancia de (1, 2) que de (5, 4)?",
    opts: [
      {
        t: "A) (2, 5)",
        ok: false,
        fb: "Prueba a calcular la distancia de este punto hacia (1, 2) y luego hacia (5, 4). Si ambas distancias resultan ser iguales, entonces este punto sí cumple la condición y no es el que buscas."
      },
      {
        t: "B) (5, -1)",
        ok: false,
        fb: "Sustituye estas coordenadas en la ecuación de la mediatriz (2x + y = 9). ¿Se mantiene la igualdad? Si el resultado es exactamente 9, significa que el punto está a la misma distancia de ambos extremos."
      },
      {
        t: "C) (1, 7)",
        ok: false,
        fb: "Este punto se encuentra justo en la trayectoria donde las distancias hacia (1, 2) y (5, 4) se cancelan entre sí. Recuerda que el problema te pide identificar específicamente cuál de las opciones rompe esa regla de igualdad."
      },
      {
        t: "D) (3, 6)",
        ok: true
      }
    ]
  },
  {
    id: "T1D25",
    q: "TecDuck debe ir desde el origen hasta el punto (8, 6), pero solo puede moverse horizontal y verticalmente. ¿Cuál es la longitud del camino más corto que puede tomar?",
    opts: [
      {
        t: "A) 10",
        ok: false,
        fb: "Este valor representa la medición de la trayectoria en línea recta o diagonal. Vuelve a leer el enunciado: TecDuck tiene una restricción específica sobre cómo puede volar."
      },
      {
        t: "B) 14",
        ok: true
      },
      {
        t: "C) 48",
        ok: false,
        fb: "Parece que multiplicaste las dimensiones del plano. Para calcular la longitud total de un recorrido escalonado o en forma de \"L\", reflexiona sobre qué operación matemática te permite juntar los segmentos."
      },
      {
        t: "D) 100",
        ok: false,
        fb: "Obtuviste la suma de los cuadrados. Este es un paso intermedio para sacar distancias diagonales usando Pitágoras, pero aquí el recorrido exige sumar pasos directos."
      }
    ]
  }
]);
})();
