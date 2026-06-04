/**
 * Tema 1 · Básico (40 preguntas)
 */
(function () {
  "use strict";
  if (typeof quizBankRegistrar !== "function") {
    throw new Error("Carga quiz-bank-loader.js antes de este archivo.");
  }
  quizBankRegistrar("1", "facil", [
  {
    id: "T1F01",
    q: "¿En qué coordenadas está el punto?",
    opts: [
      {
        t: "A) (2, 3)",
        ok: false,
        fb: "Recuerda el orden de las coordenadas  (x, y). Primero va el eje horizontal (x) y luego el vertical (y)."
      },
      {
        t: "B) (3, 2)",
        ok: true
      },
      {
        t: "C) (3, 3)",
        ok: false,
        fb: "Revisa el valor en el eje vertical (y). Identifica el número que corta la línea horizontal que sale desde el punto hacia el eje Y."
      },
      {
        t: "D) (2, 2)",
        ok: false,
        fb: "Revisa el valor en el eje horizontal (x). Identifica el número que corta la línea vertical que baja desde el punto hacia el eje X."
      }
    ]
  },
  {
    id: "T1F02",
    q: "¿En donde se encuentra el punto (0, 4)?",
    opts: [
      {
        t: "A) Sobre el eje X",
        ok: false,
        fb: "Para estar sobre el eje X, la coordenada vertical (y) debe ser 0. En este caso, el valor 4 indica un desplazamiento vertical."
      },
      {
        t: "B) Sobre el eje Y",
        ok: true
      },
      {
        t: "C) En el origen",
        ok: false,
        fb: "El origen se define por las coordenadas (0, 0). La existencia de un valor distinto a cero en la segunda posición indica que el punto no está en el origen."
      },
      {
        t: "D) En el cuadrante I",
        ok: false,
        fb: "Un punto pertenece a un cuadrante sólo si ambas coordenadas son distintas de cero. Si x = 0, el punto se ubica exactamente sobre uno de los ejes."
      }
    ]
  },
  {
    id: "T1F03",
    q: "¿Cuál es el punto en el origen?",
    opts: [
      {
        t: "A) (1, 1)",
        ok: false,
        fb: "Las coordenadas (1, 1) indican un desplazamiento de una unidad en ambos ejes. El origen representa la ausencia total de desplazamiento."
      },
      {
        t: "B) (0, 1)",
        ok: false,
        fb: "El valor 1 en la posición y sitúa al punto sobre el eje vertical, no en la intersección central de ambos ejes."
      },
      {
        t: "C) (0, 0)",
        ok: true
      },
      {
        t: "D) (1, 0)",
        ok: false,
        fb: "El valor 1 en la posición x desplaza al punto hacia la derecha, alejándolo del punto de intersección (0, 0)."
      }
    ]
  },
  {
    id: "T1F04",
    q: "¿En qué cuadrante está (-2, 3)?",
    opts: [
      {
        t: "A) I",
        ok: false,
        fb: "El cuadrante I requiere que tanto x como y sean positivos. En este caso, el valor de x es negativo."
      },
      {
        t: "B) II",
        ok: true
      },
      {
        t: "C) III",
        ok: false,
        fb: "En el cuadrante III, ambas coordenadas deben ser negativas. Aquí, el valor de y (3) es positivo."
      },
      {
        t: "D) IV",
        ok: false,
        fb: "El cuadrante IV se caracteriza por una x positiva y una y negativa. Los signos de este par ordenado son opuestos a esa condición."
      }
    ]
  },
  {
    id: "T1F05",
    q: "¿Qué par ordenado está en el cuadrante IV?",
    opts: [
      {
        t: "A) (3, -2)",
        ok: true
      },
      {
        t: "B) (-3, -2)",
        ok: false,
        fb: "Un par con ambos valores negativos (-x, -y) se ubica en el cuadrante III."
      },
      {
        t: "C) (-3, 2)",
        ok: false,
        fb: "Un par con x negativa e y positiva (-x, y) se ubica en el cuadrante II."
      },
      {
        t: "D) (3, 2)",
        ok: false,
        fb: "Un par con ambos valores positivos (x, y) se ubica siempre en el cuadrante I."
      }
    ]
  },
  {
    id: "T1F06",
    q: "¿Cuál es la coordenada X del punto (5, -1)?",
    opts: [
      {
        t: "A) -1",
        ok: false,
        fb: "En la notación (x, y), el segundo valor corresponde al eje vertical (y). El número -1 es la ordenada, no la abscisa."
      },
      {
        t: "B) 5",
        ok: true
      },
      {
        t: "C) 0",
        ok: false,
        fb: "La coordenada 0 indicaría que el punto está sobre el eje Y. El primer valor del paréntesis es 5."
      },
      {
        t: "D) 1",
        ok: false,
        fb: "Identifica el primer número dentro del paréntesis. El valor 1 positivo no forma parte de este par ordenado."
      }
    ]
  },
  {
    id: "T1F07",
    q: "¿Qué punto está más cerca del origen?",
    opts: [
      {
        t: "A) (1, 1)",
        ok: true
      },
      {
        t: "B) (2, 2)",
        ok: false,
        fb: "Compara la magnitud de los valores. Un desplazamiento de 2 unidades en cada eje resulta en una distancia lineal mayor respecto a (0, 0) que un desplazamiento de solo 1 unidad."
      },
      {
        t: "C) (0, 3)",
        ok: false,
        fb: "La distancia al origen se calcula con el valor absoluto de los desplazamientos. Tres unidades en el eje Y es una distancia superior a la que presentan las otras opciones."
      },
      {
        t: "D) (-1, -1)",
        ok: true
      }
    ]
  },
  {
    id: "T1F08",
    q: "¿Dónde se encuentra el punto (4, 0)?",
    opts: [
      {
        t: "A) Sobre el eje X",
        ok: true
      },
      {
        t: "B) Sobre el eje Y",
        ok: false,
        fb: "Para que un punto esté sobre el eje Y, su componente horizontal (x) debe ser 0. Aquí, el valor de x es 4."
      },
      {
        t: "C) En el origen",
        ok: false,
        fb: "El origen requiere que ambos componentes sean nulos. El valor 4 representa un desplazamiento real sobre el plano."
      },
      {
        t: "D) En el cuadrante II",
        ok: false,
        fb: "El cuadrante II requiere una x negativa y una y positiva. Al ser y = 0, el punto no entra en ningún cuadrante; se queda sobre la línea divisoria."
      }
    ]
  },
  {
    id: "T1F09",
    q: "¿Qué coordenada es negativa en (-5, -5)?",
    opts: [
      {
        t: "A) Solo X",
        ok: false,
        fb: "Observa el signo que precede a ambos números. La presencia del signo \"menos\" en las dos posiciones invalida que solo una sea negativa."
      },
      {
        t: "B) Solo Y",
        ok: false,
        fb: "El análisis del primer componente muestra un signo negativo, por lo que la negatividad no es exclusiva del eje Y."
      },
      {
        t: "C) Ambas",
        ok: true
      },
      {
        t: "D) Ninguna",
        ok: false,
        fb: "Identifica el símbolo matemático \"-\" delante de los valores. Este símbolo indica que los números se encuentran a la izquierda y debajo del origen."
      }
    ]
  },
  {
    id: "T1F10",
    q: "¿Cuál es el punto simétrico de (2, 3) respecto al eje Y?",
    opts: [
      {
        t: "A) (-2, 3)",
        ok: true
      },
      {
        t: "B) (2, -3)",
        ok: false,
        fb: "Al cambiar el signo de y, se obtiene una simetría respecto al eje X (horizontal), no respecto al eje Y."
      },
      {
        t: "C) (-2, -3)",
        ok: false,
        fb: "Cambiar ambos signos genera una simetría central respecto al origen, lo cual desplaza el punto al cuadrante opuesto (III)."
      },
      {
        t: "D) (3, 2)",
        ok: false,
        fb: "Intercambiar los valores (y, x) no produce una simetría axial, sino una reflexión sobre la recta y = x."
      }
    ]
  },
  {
    id: "T1F11",
    q: "¿En qué eje se encuentra el punto (0, -7)?",
    opts: [
      {
        t: "A) Eje X positivo",
        ok: false,
        fb: "Considera que en el eje X la coordenada vertical (y) siempre debe ser 0."
      },
      {
        t: "B) Eje X negativo",
        ok: false,
        fb: "Revisa si el valor de la coordenada horizontal (x) es realmente un número negativo distinto de cero."
      },
      {
        t: "C) Eje Y positivo",
        ok: false,
        fb: "Observa el signo de la coordenada vertical (y) para determinar si el movimiento es hacia la parte superior o inferior del plano."
      },
      {
        t: "D) Eje Y negativo",
        ok: true
      }
    ]
  },
  {
    id: "T1F12",
    q: "¿Qué punto tiene coordenadas (5, 0)?",
    opts: [
      {
        t: "A) 5 unidades arriba del origen",
        ok: false,
        fb: "Recuerda que un movimiento hacia \"arriba\" se refleja en la coordenada vertical (y), no en la horizontal (x)."
      },
      {
        t: "B) 5 unidades abajo del origen",
        ok: false,
        fb: "Un desplazamiento \"abajo\" del origen requeriría un valor negativo en la segunda posición del par ordenado."
      },
      {
        t: "C) 5 unidades a la derecha del origen",
        ok: true
      },
      {
        t: "D) 5 unidades a la izquierda del origen",
        ok: false,
        fb: "Verifica hacia qué lado del eje X se encuentran los valores positivos y hacia cuál los negativos."
      }
    ]
  },
  {
    id: "T1F13",
    q: "Un punto tiene coordenada x = -3 y coordenada y = 4. ¿En qué cuadrante está?",
    opts: [
      {
        t: "A) I",
        ok: false,
        fb: "Analiza si ambos signos del par ordenado (-3, 4) coinciden con los valores positivos que caracterizan al cuadrante I."
      },
      {
        t: "B) II",
        ok: true
      },
      {
        t: "C) III",
        ok: false,
        fb: "Para estar en el cuadrante III, piensa si la coordenada vertical (y) debería ser positiva o negativa."
      },
      {
        t: "D) IV",
        ok: false,
        fb: "Evalúa si la dirección de cada coordenada (izquierda/derecha y arriba/abajo) corresponde a los signos de este punto."
      }
    ]
  },
  {
    id: "T1F14",
    q: "¿Cuáles son las coordenadas de un punto que está 2 unidades a la izquierda y 3 unidades arriba del origen?",
    opts: [
      {
        t: "A) (2, 3)",
        ok: false,
        fb: "Si el punto está a la \"izquierda\", ¿debería su primera coordenada ser positiva o negativa?"
      },
      {
        t: "B) (-2, 3)",
        ok: true
      },
      {
        t: "C) (2, -3)",
        ok: false,
        fb: "Un movimiento \"hacia arriba\" se asocia con valores positivos en el eje vertical. Revisa el signo de tu segunda coordenada."
      },
      {
        t: "D) (-2, -3)",
        ok: false,
        fb: "Aunque acertaste con la dirección izquierda, revisa si \"arriba\" se representa con un signo menos."
      }
    ]
  },
  {
    id: "T1F15",
    q: "¿En qué cuadrante están todos los puntos con x > 0 y y < 0?",
    opts: [
      {
        t: "A) I",
        ok: false,
        fb: "En el cuadrante I, ambas coordenadas deben ser mayores a cero. Aquí se indica que y es menor a cero."
      },
      {
        t: "B) II",
        ok: false,
        fb: "Revisa la dirección de x. Si x es mayor a cero, el punto debe estar a la derecha, no a la izquierda."
      },
      {
        t: "C) III",
        ok: false,
        fb: "El cuadrante III se caracteriza por tener ambas coordenadas negativas. Aquí x es positiva."
      },
      {
        t: "D) IV",
        ok: true
      }
    ]
  },
  {
    id: "T1F16",
    q: "El punto (-5, 0) se encuentra:",
    opts: [
      {
        t: "A) En el cuadrante II",
        ok: false,
        fb: "Recuerda que para pertenecer a un cuadrante, ninguna de las coordenadas puede ser cero."
      },
      {
        t: "B) En el cuadrante III",
        ok: false,
        fb: "Identifica si el punto está \"dentro\" de una zona o exactamente sobre una de las líneas principales."
      },
      {
        t: "C) Sobre el eje X negativo",
        ok: true
      },
      {
        t: "D) Sobre el eje Y negativo",
        ok: false,
        fb: "Si el valor -5 está en la primera posición, ¿a qué eje corresponde ese desplazamiento: al horizontal o al vertical?"
      }
    ]
  },
  {
    id: "T1F17",
    q: "¿Qué coordenada es siempre positiva en el cuadrante II?",
    opts: [
      {
        t: "A) x",
        ok: false,
        fb: "Piensa en la dirección horizontal del cuadrante II. Al estar a la izquierda del origen, ¿cómo deberían ser los valores de x?"
      },
      {
        t: "B) y",
        ok: true
      },
      {
        t: "C) x y y",
        ok: false,
        fb: "Analiza si es posible que la x sea positiva estando en el lado izquierdo del plano."
      },
      {
        t: "D) Ninguna",
        ok: false,
        fb: "Recuerda que el cuadrante II está por encima del eje X; esto implica que una de sus dimensiones siempre tiene valores mayores a cero."
      }
    ]
  },
  {
    id: "T1F18",
    q: "Un punto está en el eje X y su coordenada x es negativa. ¿Dónde se encuentra?",
    opts: [
      {
        t: "A) En el cuadrante II",
        ok: false,
        fb: "Si un punto está \"en el eje\", significa que una de sus coordenadas es cero. Los puntos en los cuadrantes no tienen coordenadas en cero."
      },
      {
        t: "B) En el cuadrante III",
        ok: false,
        fb: "Revisa la diferencia entre estar sobre la línea divisoria y estar en el área sombreada del cuadrante."
      },
      {
        t: "C) En la parte negativa del eje X",
        ok: true
      },
      {
        t: "D) En la parte positiva del eje X",
        ok: false,
        fb: "Si la instrucción dice que la coordenada es negativa, ¿puede estar en la sección \"positiva\" del eje?"
      }
    ]
  },
  {
    id: "T1F19",
    q: "¿Qué punto está en el cuadrante III?",
    opts: [
      {
        t: "A) (3, -4)",
        ok: false,
        fb: "Este punto tiene x positiva. ¿Hacia qué lado se mueve y en qué cuadrantes estaríamos a la derecha?"
      },
      {
        t: "B) (-3, 4)",
        ok: false,
        fb: "Este punto va hacia arriba (y positiva). El cuadrante III se encuentra por debajo del eje horizontal."
      },
      {
        t: "C) (-3, -4)",
        ok: true
      },
      {
        t: "D) (3, 4)",
        ok: false,
        fb: "Aquí ambas son positivas. Recuerda que el cuadrante III es el \"opuesto\" total al cuadrante I."
      }
    ]
  },
  {
    id: "T1F20",
    q: "¿Cuál es la característica de todos los puntos en el cuadrante IV?",
    opts: [
      {
        t: "A) x > 0, y > 0",
        ok: false,
        fb: "Esta combinación de signos corresponde a los puntos que están arriba y a la derecha (Cuadrante I)."
      },
      {
        t: "B) x < 0, y > 0",
        ok: false,
        fb: "Si x es menor a cero, el punto está a la izquierda. El cuadrante IV se ubica en el lado derecho."
      },
      {
        t: "C) x < 0, y < 0",
        ok: false,
        fb: "Esta descripción pertenece al cuadrante que está abajo y a la izquierda."
      },
      {
        t: "D) x > 0, y < 0",
        ok: true
      }
    ]
  },
  {
    id: "T1F21",
    q: "¿Cuál es la distancia horizontal entre los puntos (2, 5) y (7, 5)?",
    opts: [
      {
        t: "A) 3",
        ok: false,
        fb: "Para hallar la distancia horizontal, resta los valores de x (7 - 2). Revisa tu cálculo."
      },
      {
        t: "B) 4",
        ok: false,
        fb: "Cuenta cuántos saltos hay en el eje X desde el 2 hasta el 7. ¿Son realmente 4?"
      },
      {
        t: "C) 5",
        ok: true
      },
      {
        t: "D) 6",
        ok: false,
        fb: "Verifica la resta de las abscisas; parece que sumaste una unidad de más al resultado."
      }
    ]
  },
  {
    id: "T1F22",
    q: "¿Cuál es la distancia vertical entre los puntos (3, 1) y (3, 8)?",
    opts: [
      {
        t: "A) 5",
        ok: false,
        fb: "Revisa la diferencia entre las coordenadas y (8 y 1). ¿Cuánto le falta al 1 para llegar al 8?"
      },
      {
        t: "B) 6",
        ok: false,
        fb: "Realiza la resta de las ordenadas nuevamente para asegurar el resultado exacto."
      },
      {
        t: "C) 7",
        ok: true
      },
      {
        t: "D) 8",
        ok: false,
        fb: "El número 8 es la posición final, pero la distancia se mide desde el punto de partida (1)."
      }
    ]
  },
  {
    id: "T1F23",
    q: "¿Qué punto está a la misma distancia horizontal del origen que (4, 0)?",
    opts: [
      {
        t: "A) (0, 4)",
        ok: false,
        fb: "El punto (0, 4) tiene una distancia de 4 unidades, pero es una distancia vertical. La pregunta pide distancia horizontal."
      },
      {
        t: "B) (-4, 0)",
        ok: true
      },
      {
        t: "C) (4, 4)",
        ok: false,
        fb: "Aunque está a 4 unidades a la derecha, este punto también se alejó verticalmente. Busca un punto que solo tenga desplazamiento horizontal."
      },
      {
        t: "D) (-4, -4)",
        ok: false,
        fb: "Similar a la opción anterior, este punto tiene desplazamientos en ambos ejes, no solo en el horizontal."
      }
    ]
  },
  {
    id: "T1F24",
    q: "Si TecDuck está en (2, 3) y se mueve 4 unidades a la derecha, ¿dónde termina?",
    opts: [
      {
        t: "A) (2, 7)",
        ok: false,
        fb: "Moverse a la \"derecha\" es un cambio horizontal. ¿Por qué cambiaste la coordenada y (la segunda)?"
      },
      {
        t: "B) (6, 3)",
        ok: true
      },
      {
        t: "C) (-2, 3)",
        ok: false,
        fb: "Ir a la derecha implica sumar al valor de x. Al llegar a -2, parece que restaste en lugar de sumar."
      },
      {
        t: "D) (2, -1)",
        ok: false,
        fb: "Recuerda que el eje horizontal controla la derecha y la izquierda. Has modificado el eje vertical."
      }
    ]
  },
  {
    id: "T1F25",
    q: "Si TecDuck está en (-3, 1) y se mueve 2 unidades hacia abajo, ¿dónde termina?",
    opts: [
      {
        t: "A) (-3, 3)",
        ok: false,
        fb: "Un movimiento \"hacia abajo\" significa disminuir el valor de y. Si a 1 le quitas 2, ¿el resultado debería ser mayor o menor?"
      },
      {
        t: "B) (-1, 1)",
        ok: false,
        fb: "Has cambiado la coordenada x. Recuerda que el movimiento vertical no afecta la posición horizontal."
      },
      {
        t: "C) (-3, -1)",
        ok: true
      },
      {
        t: "D) (-5, 1)",
        ok: false,
        fb: "Revisaste el eje equivocado. El movimiento arriba/abajo solo afecta a la segunda cifra del paréntesis."
      }
    ]
  },
  {
    id: "T1F26",
    q: "¿Qué punto está más cerca de (1, 1)?",
    opts: [
      {
        t: "A) (0, 0)",
        ok: false,
        fb: "El origen está a una distancia diagonal. Calcula cuántas unidades hay si solo te mueves por una de las líneas de la cuadrícula."
      },
      {
        t: "B) (2, 2)",
        ok: false,
        fb: "Al igual que el origen, este punto requiere un movimiento en dos direcciones. Busca uno que esté a solo \"un paso\" de distancia en la cuadrícula."
      },
      {
        t: "C) (1, 2)",
        ok: true
      },
      {
        t: "D) (0, 1)",
        ok: true
      }
    ]
  },
  {
    id: "T1F27",
    q: "Desde el origen, TecDuck se mueve primero a (3, 0) y luego a (3, 4). ¿Cuántas unidades se movió en total?",
    opts: [
      {
        t: "A) 5",
        ok: false,
        fb: "El número 5 es la distancia \"en línea recta\" (diagonal), pero TecDuck hizo dos tramos distintos. Suma la longitud de cada tramo."
      },
      {
        t: "B) 7",
        ok: true
      },
      {
        t: "C) 8",
        ok: false,
        fb: "Revisa cuánto miden los saltos: del (0,0) al (3,0) y del (3,0) al (3,4). La suma no da 8."
      },
      {
        t: "D) 12",
        ok: false,
        fb: "Parece que multiplicaste los valores. En un recorrido total, las distancias de cada paso se deben sumar."
      }
    ]
  },
  {
    id: "T1F28",
    q: "¿Qué punto es el resultado de mover (2, 5) tres unidades a la izquierda y dos unidades arriba?",
    opts: [
      {
        t: "A) (5, 7)",
        ok: false,
        fb: "\"Izquierda\" significa restar a la x. Si a 2 le quitas 3, ¿cómo puede dar 5? Revisa la dirección de tu operación."
      },
      {
        t: "B) (-1, 7)",
        ok: true
      },
      {
        t: "C) (2, 8)",
        ok: false,
        fb: "Solo aplicaste el cambio vertical. No olvides que también hubo un movimiento hacia la izquierda en el eje horizontal."
      },
      {
        t: "D) (5, 3)",
        ok: false,
        fb: "Aunque moviste la x, sumaste en lugar de restar. Además, para ir \"arriba\", ¿se debe sumar o restar a la y?"
      }
    ]
  },
  {
    id: "T1F29",
    q: "Si un punto está en (a, b) y a es positivo, b es negativo, ¿en qué cuadrante está?",
    opts: [
      {
        t: "A) I",
        ok: false,
        fb: "En el cuadrante I, tanto la x como la y deben ser positivas. Aquí 'b' es negativo."
      },
      {
        t: "B) II",
        ok: false,
        fb: "Si 'a' es positivo, el punto debe estar a la derecha del origen. El cuadrante II está a la izquierda."
      },
      {
        t: "C) III",
        ok: false,
        fb: "El cuadrante III requiere que 'a' sea negativo (izquierda). Aquí se especifica que 'a' es positivo."
      },
      {
        t: "D) IV",
        ok: true
      }
    ]
  },
  {
    id: "T1F30",
    q: "¿Cuál es la coordenada x del punto que está 4 unidades a la derecha de (-2, 3)?",
    opts: [
      {
        t: "A) 2",
        ok: true
      },
      {
        t: "B) -6",
        ok: false,
        fb: "Moverse a la derecha es sumar. Si a -2 le sumas 4, el resultado debe ser un número positivo."
      },
      {
        t: "C) 4",
        ok: false,
        fb: "El 4 es la cantidad que te mueves, pero la pregunta pide la posición final en el eje X después del salto."
      },
      {
        t: "D) -2",
        ok: false,
        fb: "Esa es la coordenada inicial. Recuerda aplicar el desplazamiento de 4 unidades."
      }
    ]
  },
  {
    id: "T1F31",
    q: "TecDuck está en el punto A(2, 2). Luego vuela al punto B(5, 6). ¿Cuántas unidades se movió horizontalmente?",
    opts: [
      {
        t: "A) 3",
        ok: true
      },
      {
        t: "B) 4",
        ok: false,
        fb: "El número 4 es la diferencia entre las coordenadas y (6-2). La pregunta pide el movimiento horizontal (eje X)."
      },
      {
        t: "C) 5",
        ok: false,
        fb: "Ese es el valor de la x final, pero la distancia es lo que recorrió desde el"
      },
      {
        t: "D) 2",
        ok: false,
        fb: "Ese es el valor de la x inicial. Resta la posición final menos la inicial para hallar el desplazamiento."
      }
    ]
  },
  {
    id: "T1F32",
    q: "¿Qué punto tiene la misma coordenada y que (4, 7)?",
    opts: [
      {
        t: "A) (4, 5)",
        ok: false,
        fb: "Aquí la x es igual (4), pero la coordenada y cambió de 7 a 5. Busca dónde la segunda cifra sea idéntica."
      },
      {
        t: "B) (7, 4)",
        ok: false,
        fb: "Ten cuidado, las coordenadas están al revés. En (7, 4), la y es 4, no 7."
      },
      {
        t: "C) (2, 7)",
        ok: true
      },
      {
        t: "D) (7, 7)",
        ok: true
      }
    ]
  },
  {
    id: "T1F33",
    q: "¿Cuál es el punto medio entre (0, 0) y (4, 6)?",
    opts: [
      {
        t: "A) (2, 3)",
        ok: true
      },
      {
        t: "B) (4, 6)",
        ok: false,
        fb: "Ese es el punto final del camino. El punto medio debe estar a la mitad de la distancia en ambos ejes."
      },
      {
        t: "C) (2, 6)",
        ok: false,
        fb: "Has dividido la x a la mitad, pero mantuviste la y completa. ¿Cuál es la mitad de 6?"
      },
      {
        t: "D) (4, 3)",
        ok: false,
        fb: "Dividiste la y correctamente, pero dejaste la x intacta. El punto medio requiere promediar ambas coordenadas."
      }
    ]
  },
  {
    id: "T1F34",
    q: "Si TecDuck está en (-1, -1) y se mueve según el desplazamiento (3, 4), ¿dónde termina?",
    opts: [
      {
        t: "A) (2, 3)",
        ok: true
      },
      {
        t: "B) (-4, -5)",
        ok: false,
        fb: "Parece que restaste los valores. Un desplazamiento positivo indica que debes sumarlos a la posición inicial."
      },
      {
        t: "C) (4, 5)",
        ok: false,
        fb: "Estas serían las coordenadas si empezaras desde el origen (0,0). No olvides que empezaste en (-1, -1)."
      },
      {
        t: "D) (-2, -3)",
        ok: false,
        fb: "Revisa los signos de tu suma: -1 + 3 y -1 + 4. El resultado no debería ser negativo."
      }
    ]
  },
  {
    id: "T1F35",
    q: "¿Qué punto es simétrico de (3, -2) respecto al eje X?",
    opts: [
      {
        t: "A) (3, 2)",
        ok: true
      },
      {
        t: "B) (-3, -2)",
        ok: false,
        fb: "Cambiar el signo de la x crea una simetría respecto al eje vertical (Y). La pregunta pide respecto al eje horizontal (X)."
      },
      {
        t: "C) (-3, 2)",
        ok: false,
        fb: "Al cambiar ambos signos, encontraste el punto simétrico respecto al origen, no respecto a un eje."
      },
      {
        t: "D) (3, -2)",
        ok: false,
        fb: "Un punto simétrico debe estar en una posición diferente (como un reflejo en un espejo). Este es el mismo punto."
      }
    ]
  },
  {
    id: "T1F36",
    q: "Un punto tiene coordenadas (x, y) donde |x| = 4 y |y| = 3. Si está en el cuadrante II, ¿cuáles son sus coordenadas?",
    opts: [
      {
        t: "A) (4, 3)",
        ok: false,
        fb: "Estas coordenadas corresponden al cuadrante I, donde todo es positivo. Revisa los signos del cuadrante II."
      },
      {
        t: "B) (-4, 3)",
        ok: true
      },
      {
        t: "C) (4, -3)",
        ok: false,
        fb: "En el cuadrante IV, la x es positiva y la y es negativa. Es justo lo contrario a lo que pide el cuadrante II."
      },
      {
        t: "D) (-4, -3)",
        ok: false,
        fb: "Si ambas fueran negativas, el punto estaría en el cuadrante III (abajo a la izquierda)."
      }
    ]
  },
  {
    id: "T1F37",
    q: "¿Cuánto se desplazó TecDuck si fue de (2, 5) a (2, 1)?",
    opts: [
      {
        t: "A) 4 unidades a la derecha",
        ok: false,
        fb: "Observa la coordenada x. Como no cambió (sigue siendo 2), no pudo haber un movimiento horizontal."
      },
      {
        t: "B) 4 unidades a la izquierda",
        ok: false,
        fb: "Si la primera cifra del paréntesis es igual en ambos puntos, TecDuck no se movió de izquierda a derecha."
      },
      {
        t: "C) 4 unidades arriba",
        ok: false,
        fb: "Para ir \"arriba\", el valor de y debería aumentar. Aquí pasó de 5 a 1. ¿Qué dirección implica disminuir el valor de y?"
      },
      {
        t: "D) 4 unidades abajo",
        ok: true
      }
    ]
  },
  {
    id: "T1F38",
    q: "¿Qué punto está en el eje Y positivo?",
    opts: [
      {
        t: "A) (0, 5)",
        ok: true
      },
      {
        t: "B) (5, 0)",
        ok: false,
        fb: "Este punto está sobre el eje horizontal (X) porque su segunda coordenada es 0."
      },
      {
        t: "C) (0, -5)",
        ok: false,
        fb: "Aunque está sobre el eje Y, el signo negativo indica que está por debajo del origen."
      },
      {
        t: "D) (-5, 0)",
        ok: false,
        fb: "El valor -5 en la primera posición lo sitúa en el eje X negativo."
      }
    ]
  },
  {
    id: "T1F39",
    q: "Si un punto tiene coordenadas (a, b) y a = b, ¿dónde se encuentra?",
    opts: [
      {
        t: "A) Siempre en el cuadrante I",
        ok: false,
        fb: "Considera el punto (-3, -3). Aquí a = b, pero están en el cuadrante III. No es exclusivo del cuadrante I."
      },
      {
        t: "B) Siempre en la diagonal y = x",
        ok: true
      },
      {
        t: "C) Siempre en el origen",
        ok: false,
        fb: "El origen (0,0) cumple la regla, pero ¿qué pasa con (2,2) o (5,5)? También cumplen que a = b y no son el origen."
      },
      {
        t: "D) Siempre en el eje X",
        ok: false,
        fb: "En el eje X, la b siempre debe ser 0. Si a fuera 5, entonces a no sería igual a b."
      }
    ]
  },
  {
    id: "T1F40",
    q: "TecDuck hizo el siguiente recorrido: comenzó en (0,0), fue a (4,0), luego a (4,3), luego a (0,3) y regresó a (0,0). ¿Qué figura formó?",
    opts: [
      {
        t: "A) Un triángulo",
        ok: false,
        fb: "Cuenta los puntos de giro. TecDuck pasó por 4 esquinas distintas antes de volver al inicio."
      },
      {
        t: "B) Un rectángulo",
        ok: true
      },
      {
        t: "C) Un cuadrado",
        ok: false,
        fb: "Compara las distancias. La base mide 4 unidades (4-0) y la altura mide 3 unidades (3-0). ¿Son todos los lados iguales?"
      },
      {
        t: "D) Una línea recta",
        ok: false,
        fb: "Al cambiar de dirección en el eje X y luego en el Y, se encierra un área. Una línea recta no vuelve al origen después de subir."
      }
    ]
  }
]);
})();
