/**
 * Tema 4 · Avanzado — Desafíos de escala (25 preguntas)
 */
(function () {
  "use strict";
  if (typeof quizBankRegistrar !== "function") {
    throw new Error("Carga quiz-bank-loader.js antes de este archivo.");
  }
  quizBankRegistrar("4", "dificil", [
  {
    id: "T4D01",
    q: "Calcula el resultado de la siguiente operación: -(1/2) * (-4, 6)",
    opts: [
      { t: "A) (2, -3)", ok: true },
      { t: "B) (-2, 3)", ok: false, fb: "Aplicaste la división a la mitad, pero ignoraste la regla de los signos. Multiplicar un número negativo por otro negativo debe dar como resultado un número positivo." },
      { t: "C) (2, 3)", ok: false, fb: "Multiplicaste correctamente el componente horizontal, pero olvidaste que el signo negativo del escalar también debe afectar a la coordenada vertical." },
      { t: "D) (-8, 12)", ok: false, fb: "Parece que multiplicaste por el inverso del escalar (es decir, por 2). Recuerda que multiplicar por la fracción 1/2 equivale a dividir entre 2." }
    ]
  },
  {
    id: "T4D02",
    q: "Si resuelves la ecuación k(6, -9) = (-2, 3), ¿cuál es el valor del escalar k?",
    opts: [
      { t: "A) -1/3", ok: true },
      { t: "B) 1/3", ok: false, fb: "Verifica tus signos. Si el vector original era positivo en X y el resultado es negativo, forzosamente el escalar debe ser un número negativo." },
      { t: "C) -3", ok: false, fb: "Recuerda que k = (valor resultante) / (valor original). Parece que dividiste al revés, tomando el número mayor como numerador." },
      { t: "D) 3", ok: false, fb: "Observa el vector final. Si las componentes pasaron de 6 a 2, el tamaño se encogió, por lo que el escalar debe ser una fracción, no un número entero." }
    ]
  },
  {
    id: "T4D03",
    q: "Calcula la siguiente combinación lineal: 2(3, -1) - 3(-1, 2)",
    opts: [
      { t: "A) (9, -8)", ok: true },
      { t: "B) (3, 4)", ok: false, fb: "Recuerda la jerarquía de operaciones. Realizaste primero la resta de los vectores base sin aplicar la multiplicación por los escalares." },
      { t: "C) (9, 4)", ok: false, fb: "Tuviste un error con los signos en el eje Y. Tienes un -2 y le estás restando un 6 positivo, lo cual debe hacer que el número descienda más en los negativos." },
      { t: "D) (3, -8)", ok: false, fb: "Revisa tu resta horizontal. Tienes 6 y debes restarle un -3. Restar un número negativo equivale a realizar una suma." }
    ]
  },
  {
    id: "T4D04",
    q: "Despeja el vector v en la siguiente ecuación: 3v + (2, -4) = (11, 5)",
    opts: [
      { t: "A) (3, 3)", ok: true },
      { t: "B) (13/3, 1/3)", ok: false, fb: "En lugar de restar el vector (2, -4) para pasarlo al otro lado del signo igual, lo sumaste. Usa siempre la operación inversa para despejar." },
      { t: "C) (3, 1/3)", ok: false, fb: "Restaste bien en X, pero en Y cometiste un error aritmético. Si a 5 le quitas un -4, el número debe crecer (se vuelve una suma)." },
      { t: "D) (9, 9)", ok: false, fb: "Lograste despejar la suma correctamente, pero encontraste el valor de 3v. Te faltó el último paso: dividir entre el escalar para dejar a la v completamente sola." }
    ]
  },
  {
    id: "T4D05",
    q: "Resuelve la ecuación vectorial para encontrar v: 2(v - (1, 1)) = v + (3, -2)",
    opts: [
      { t: "A) (5, 0)", ok: true },
      { t: "B) (4, -1)", ok: false, fb: "Parece que restaste el vector (2, 2) en el lado derecho en lugar de pasarlo sumando. Las reglas del álgebra aplican idéntico para los vectores." },
      { t: "C) (5, -4)", ok: false, fb: "Fallaste al combinar las componentes Y. Si sumas -2 con 2, el resultado debe neutralizarse, no acumularse negativamente." },
      { t: "D) (1, -3)", ok: false, fb: "Reagrupaste mal los términos. Sumaste v en el lado izquierdo en vez de restarlo para despejarlo correctamente." }
    ]
  },
  {
    id: "T4D06",
    q: "Si la magnitud del vector escalado ||k(3, 4)|| = 20, ¿cuáles son los posibles valores de k?",
    opts: [
      { t: "A) 4 o -4", ok: true },
      { t: "B) 4", ok: false, fb: "Encontraste un valor correcto, pero recuerda que en matemáticas el valor absoluto de una variable en una ecuación tiene dos soluciones posibles que afectan la dirección." },
      { t: "C) 16 o -16", ok: false, fb: "Parece que en lugar de dividir 20 entre la magnitud del vector, restaste los valores intentando despejar la k." },
      { t: "D) 5 o -5", ok: false, fb: "Calculaste la magnitud del vector (que es 5), pero elegiste ese número como la respuesta final sin resolver la ecuación completa para k." }
    ]
  },
  {
    id: "T4D07",
    q: "Encuentra un vector que tenga una magnitud de 15, pero que apunte en la dirección exactamente opuesta al vector (4, -3).",
    opts: [
      { t: "A) (-12, 9)", ok: true },
      { t: "B) (12, -9)", ok: false, fb: "Este vector tiene el tamaño correcto (15), pero apunta en la misma dirección que el original. El enunciado pedía el sentido opuesto." },
      { t: "C) (-15, 15)", ok: false, fb: "Intentaste usar el número 15 directamente en las componentes. La magnitud es la longitud de la hipotenusa, no el valor directo de los catetos." },
      { t: "D) (-12, -9)", ok: false, fb: "Multiplicaste por -3, pero solo le cambiaste el signo a la primera componente. El escalar negativo afecta a ambas." }
    ]
  },
  {
    id: "T4D08",
    q: "Los vectores u = (a, 4) y v = (-6, 3) son paralelos. ¿Cuál debe ser el valor del escalar a?",
    opts: [
      { t: "A) -8", ok: true },
      { t: "B) 8", ok: false, fb: "Observa los signos. Para que la coordenada Y creciera de 3 a 4, el escalar debió ser positivo. Al multiplicar un número positivo por la X original (-6), el resultado no puede volverse positivo." },
      { t: "C) -2", ok: false, fb: "Parece que dividiste las componentes de Y al revés (3/4 en vez de 4/3) antes de multiplicarlo por el -6." },
      { t: "D) 2", ok: false, fb: "Usaste la proporción incorrecta y además perdiste el signo negativo por el camino." }
    ]
  },
  {
    id: "T4D09",
    q: "Si tienes la ecuación vectorial (2a, b+3) = -2(a-4, 2b), ¿cuáles son los valores de a y b?",
    opts: [
      { t: "A) a = 2, b = -3/5", ok: true },
      { t: "B) a = 2, b = 3/5", ok: false, fb: "Tu valor para 'a' es perfecto, pero en 'b' ignoraste el signo al realizar la división de -3 entre 5." },
      { t: "C) a = -2, b = -3/5", ok: false, fb: "Revisa el despeje en el componente X. Al pasar el -2a al lado izquierdo, pasa sumando (4a), no restando." },
      { t: "D) a = 4, b = -3", ok: false, fb: "Al distribuir el escalar -2 sobre (a-4), olvidaste multiplicar el -2 por el -4 para obtener el +8." }
    ]
  },
  {
    id: "T4D10",
    q: "Considera que el vector v es unitario (magnitud de 1). ¿Cuál es la magnitud del vector -5v?",
    opts: [
      { t: "A) 5", ok: true },
      { t: "B) -5", ok: false, fb: "Recuerda que la magnitud representa una distancia física en el plano espacial. Las distancias no pueden ser valores negativos." },
      { t: "C) 1", ok: false, fb: "Ignoraste por completo el escalar. El vector base mide 1, pero le estás aplicando un factor que estira su tamaño de manera proporcional." },
      { t: "D) 25", ok: false, fb: "Elevaste el escalar al cuadrado. Eso aplica cuando escalas el área de una figura, pero la longitud de un vector se escala de manera lineal y directa." }
    ]
  },
  {
    id: "T4D11",
    q: "Resuelve la siguiente operación combinada con escalares en 3D: (1/2)(4, -2, 6) - 2(1, 0, -1)",
    opts: [
      { t: "A) (0, -1, 5)", ok: true },
      { t: "B) (0, -1, 1)", ok: false, fb: "En el eje Z, restaste el número ignorando su signo propio. Tenías 3 y le restabas un -2, lo cual equivale a sumar." },
      { t: "C) (4, -1, 5)", ok: false, fb: "En el eje X, sumaste las componentes en vez de seguir la instrucción de resta que une a ambas partes de la ecuación." },
      { t: "D) (0, 1, 5)", ok: false, fb: "En el eje Y, si a -1 le quitas 0, el número se mantiene negativo. Tú le cambiaste el signo sin justificación." }
    ]
  },
  {
    id: "T4D12",
    q: "En el sistema de ecuaciones vectoriales: u + v = (4, 2) y 2u - v = (5, 4). ¿Qué coordenadas tiene el vector u?",
    opts: [
      { t: "A) (3, 2)", ok: true },
      { t: "B) (1, 0)", ok: false, fb: "Ese es el valor del vector v, no de u. Presta atención a qué variable lograste despejar o averigua el resultado faltante sustituyendo el valor que hallaste en la primera ecuación." },
      { t: "C) (9, 6)", ok: false, fb: "Resolviste perfectamente la combinación de las ecuaciones para eliminar la variable, pero hallaste el valor de 3u. ¡Falta aplicar el escalar dividiendo todo entre 3!" },
      { t: "D) (2, 1)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y). Has intercambiado los valores de tu respuesta." }
    ]
  },
  {
    id: "T4D13",
    q: "En el sistema u + v = (4, 2) y 2u - v = (5, 4). Sabiendo que u = (3, 2), ¿qué coordenadas tiene el vector v?",
    opts: [
      { t: "A) (1, 0)", ok: true },
      { t: "B) (3, 2)", ok: false, fb: "Estas coordenadas le pertenecen a la incógnita u. Lee con detenimiento cuál es la variable exacta que te pide el problema." },
      { t: "C) (7, 4)", ok: false, fb: "En lugar de pasar el vector u restando para despejar v, lo sumaste al otro lado del signo de igual. Usa la operación inversa." },
      { t: "D) (1, 2)", ok: false, fb: "Cometiste un error aritmético al restar el componente vertical Y. Si a 2 le quitas 2, no te sobra 2." }
    ]
  },
  {
    id: "T4D14",
    q: "Resuelve la ecuación con combinación de escalares para encontrar x e y: x(2, 1) + y(-1, 3) = (8, -3).",
    opts: [
      { t: "A) x = 3, y = -2", ok: true },
      { t: "B) x = -3, y = 2", ok: false, fb: "Intercambiaste los signos finales de tus variables. Verifica tu despeje al sustituir la X encontrada en la primera ecuación lineal." },
      { t: "C) x = 4, y = 0", ok: false, fb: "Si usas estos valores e introduces y=0, el segundo vector desaparece. Si multiplicas 4 por (2,1) el resultado es (8, 4), lo cual no cumple la igualdad con (8, -3)." },
      { t: "D) x = 3, y = 2", ok: false, fb: "El valor de X es correcto, pero un error de signo al restar el 6 en el paso final provocó que tu Y saliera positiva en lugar de negativa." }
    ]
  },
  {
    id: "T4D15",
    q: "Encuentra k sabiendo que la magnitud del vector en 3D cumple: ||-k(1, -1, √2)|| = 8.",
    opts: [
      { t: "A) 4 o -4", ok: true },
      { t: "B) 4", ok: false, fb: "Encontraste la raíz principal, pero en ecuaciones de valor absoluto existen dos caminos numéricos (positivo y negativo) que llevan a la misma distancia." },
      { t: "C) -4", ok: false, fb: "No descartes la posibilidad de la contraparte positiva que cumple con el mismo resultado escalar." },
      { t: "D) 2 o -2", ok: false, fb: "Olvidaste sacarle la raíz cuadrada a la suma de los componentes antes de hacer el despeje. Dividiste 8 entre 4 en lugar de entre 2." }
    ]
  },
  {
    id: "T4D16",
    q: "Si los puntos A(1, 2), B(3, 5) y C(7, y) son colineales, ¿cuál es el valor de y?",
    opts: [
      { t: "A) 11", ok: true },
      { t: "B) 9", ok: false, fb: "Encontraste el componente Y del vector resultante (que mide 9), pero olvidaste sumarle la coordenada de origen de A para hallar el punto C real en el plano." },
      { t: "C) 14", ok: false, fb: "Calculaste el factor escalar (3) y por descuido lo multiplicaste por la coordenada del punto intermedio B en lugar de usarlo sobre el vector de desplazamiento." },
      { t: "D) 10", ok: false, fb: "Hubo un error de proporción geométrica. Si en X el avance global fue el triple (de 2 a 6), en Y también debes asegurar el triple de salto respecto al origen original." }
    ]
  },
  {
    id: "T4D17",
    q: "En un triángulo, M es el punto medio del lado AB. Si A = (-2, 4) y M = (1, 1), encuentra B usando B = A + 2AM.",
    opts: [
      { t: "A) (4, -2)", ok: true },
      { t: "B) (-0.5, 2.5)", ok: false, fb: "Lo que hiciste fue calcular el punto medio de un nuevo segmento entre A y M. Queríamos usar a M como trampolín para encontrar el borde lejano B." },
      { t: "C) (0, -2)", ok: false, fb: "Te equivocaste sumando el avance de X. Si estás en -2 y debes avanzar 6 posiciones, pasas el cero y terminas en el lado de los positivos." },
      { t: "D) (3, -3)", ok: false, fb: "Este es el vector de desplazamiento desde A hacia M. Para llegar a las coordenadas de B, tenías que escalar ese vector al doble y sumarlo al punto de partida." }
    ]
  },
  {
    id: "T4D18",
    q: "El centroide G de un triángulo cumple G = 1/3 (A + B + C). Si A(0,0), B(6,0) y C(3,9), calcula G.",
    opts: [
      { t: "A) (3, 3)", ok: true },
      { t: "B) (9, 9)", ok: false, fb: "Te quedaste únicamente con la primera parte del procedimiento. Sumaste los tres vértices, pero olvidaste multiplicarlo por la fracción que extrae el centro geométrico." },
      { t: "C) (4.5, 4.5)", ok: false, fb: "Parece que usaste el factor de escala 1/2, como si estuvieras sacando el punto medio entre dos puntos. El centroide promedia tres puntos, por lo que el escalar es 1/3." },
      { t: "D) (3, 0)", ok: false, fb: "Promediaste bien la componente X, pero ignoraste la altura proporcionada por el punto C en la componente vertical." }
    ]
  },
  {
    id: "T4D19",
    q: "El punto P descansa sobre el segmento de A(-1, 2) a B(8, 11). El vector cumple AP = 2/3 AB. ¿Cuáles son las coordenadas de P?",
    opts: [
      { t: "A) (5, 8)", ok: true },
      { t: "B) (6, 6)", ok: false, fb: "Ese es únicamente el valor del vector escalado AP. No olvides que P es una ubicación; necesitas sumar este avance a las coordenadas originales de A." },
      { t: "C) (7, 9)", ok: false, fb: "Hiciste un cálculo erróneo sumando el vector AP directamente a las coordenadas del punto de destino B, en lugar de hacerlo desde el punto de inicio A." },
      { t: "D) (8, 5)", ok: false, fb: "Recuerda el orden de las coordenadas (x, y). Primero va el eje horizontal (x) y luego el vertical (y). Las has invertido." }
    ]
  },
  {
    id: "T4D20",
    q: "Un triángulo tiene un área de 5 unidades. Si multiplicas cada vector posición de sus vértices por el escalar -2, ¿cuál será la nueva área?",
    opts: [
      { t: "A) 20", ok: true },
      { t: "B) -10", ok: false, fb: "Recuerda que el área es una medida de superficie física; siempre debe expresarse como un valor positivo, independientemente del signo del escalar." },
      { t: "C) 10", ok: false, fb: "Escalaste el área tomando solo el valor absoluto de la constante (|k|), pero multiplicar los lados afecta tanto a la base como a la altura." },
      { t: "D) -20", ok: false, fb: "Elevaste el escalar al cuadrado de manera correcta, pero decidiste conservar el signo negativo arrastrándolo a un concepto espacial bidimensional." }
    ]
  },
  {
    id: "T4D21",
    q: "TecDuck calcula w = 2u - (1/2)v. Si u = (-1, 4) y v = (-6, 2), ¿cuál es el vector w?",
    opts: [
      { t: "A) (1, 7)", ok: true },
      { t: "B) (-5, 7)", ok: false, fb: "Sumaste las componentes en X en vez de realizar la resta de un número negativo. Tenías -2 y debías restar un -3 (lo que se convierte en suma)." },
      { t: "C) (1, 9)", ok: false, fb: "Restaste mal el componente vertical Y. Tienes 8 y debes quitarle 1, no agregarlo." },
      { t: "D) (-5, 9)", ok: false, fb: "Tuviste fallas tanto en el cambio de signo de la coordenada X al restar, como en la operación básica de la coordenada Y. Agrupa con paréntesis." }
    ]
  },
  {
    id: "T4D22",
    q: "El vector de vuelo v = (a, b) cumple a = 3b. Si ||v|| = √40 y b es positivo, ¿cuál es el valor de b?",
    opts: [
      { t: "A) 2", ok: true },
      { t: "B) 4", ok: false, fb: "Este es el valor de b², no de b. Te detuviste un paso antes de aplicar la raíz cuadrada requerida al despejar la incógnita." },
      { t: "C) √10", ok: false, fb: "Parece que sacaste la raíz cuadrada del coeficiente 10 que multiplicaba a b² en lugar de pasarlo dividiendo hacia el 40 en el otro lado de la igualdad." },
      { t: "D) 6", ok: false, fb: "Confundiste la variable resuelta. Si hallas que b=2, entonces a=6. El problema te pidió específicamente el valor de la coordenada b." }
    ]
  },
  {
    id: "T4D23",
    q: "TecDuck empuja con F = (-2, 3). Para detener un objeto con momento P = (8, -12), debe usar k tal que kF + P = (0,0). ¿Qué valor tiene k?",
    opts: [
      { t: "A) 4", ok: true },
      { t: "B) -4", ok: false, fb: "Si utilizas un escalar negativo, al multiplicarlo por tu fuerza original se invertiría tu propio empuje, ayudando al objeto entrante en lugar de contrarrestarlo." },
      { t: "C) 1/4", ok: false, fb: "Invertiste la relación al dividir. El escalar k es igual a la fuerza final requerida dividida entre tu fuerza actual, no al revés." },
      { t: "D) -1/4", ok: false, fb: "Dividiste erróneamente los componentes y además arrastraste un signo negativo que rompe el equilibrio de la ecuación de balance." }
    ]
  },
  {
    id: "T4D24",
    q: "Resuelve: ||k(3, -4)|| + 2 = 17. ¿Cuáles son los valores posibles de k?",
    opts: [
      { t: "A) 3 o -3", ok: true },
      { t: "B) 3", ok: false, fb: "Encontraste una de las dos respuestas viables, pero obviaste que el valor absoluto dentro de la fórmula de magnitud admite que el escalar original haya sido negativo." },
      { t: "C) 5 o -5", ok: false, fb: "Utilizaste el valor de la magnitud del vector (que es 5) como la respuesta directa del escalar. Recuerda que había que despejar esa cifra pasándola a dividir el 15." },
      { t: "D) -3", ok: false, fb: "Marcar solo la respuesta negativa descarta una de las verdades del concepto matemático del valor absoluto." }
    ]
  },
  {
    id: "T4D25",
    q: "TecDuck tiene u = (2, 5). El viento añade v con la misma dirección y sentido que u. Si u + v es el triple de u, ¿qué vector representa el viento (v)?",
    opts: [
      { t: "A) (4, 10)", ok: true },
      { t: "B) (6, 15)", ok: false, fb: "Este es el vector de empuje total combinado (3u). Se te pidió aislar únicamente el vector de contribución del viento." },
      { t: "C) (2, 5)", ok: false, fb: "Esa es la fuerza inicial del propio TecDuck. El viento debe aportar el doble para que el resultado final triplique esa fuerza." },
      { t: "D) (8, 20)", ok: false, fb: "Multiplicaste la fuerza original por 4, lo que crearía un resultado combinado de 5 veces el empuje original, rompiendo la condición establecida." }
    ]
  }
  ]);
})();
