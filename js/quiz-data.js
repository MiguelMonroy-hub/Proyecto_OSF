/**
 * Banco de preguntas TecDuck. 130 preguntas en total:
 *   - Tema 1 (Coordenadas): 40 básico + 25 avanzado
 *   - Tema 2 (Vectores):    40 básico + 25 avanzado
 *
 * Esquema por pregunta:
 *   { id, q, opts: [{ t, ok, fb? }, ...], img? }
 *
 * `img`: ruta opcional desde la raíz del sitio, p. ej. "img/quiz/T1F/q01.png"
 *       (quizImagenParaPregunta convierte para pages/quiz.html).
 *
 *   - t  : texto visible de la opción (ya incluye "A) ...")
 *   - ok : true si es respuesta correcta
 *   - fb : retroalimentación a mostrar SOLO si el usuario falla
 *          (se omite en opciones correctas)
 *
 * Generado automáticamente desde los .docx con _parse_quiz.py + _gen_quizdata.py.
 * No editar a mano salvo correcciones puntuales.
 */
var QUIZ_BANK = {
  "1": {
    "facil": [
      {
        "id": "T1F01",
        "q": "¿En qué coordenadas está el punto?",
        "opts": [
          {
            "t": "A) (2, 3)",
            "ok": false,
            "fb": "Recuerda el orden de las coordenadas  (x, y). Primero va el eje horizontal (x) y luego el vertical (y)."
          },
          {
            "t": "B) (3, 2)",
            "ok": true
          },
          {
            "t": "C) (3, 3)",
            "ok": false,
            "fb": "Revisa el valor en el eje vertical (y). Identifica el número que corta la línea horizontal que sale desde el punto hacia el eje Y."
          },
          {
            "t": "D) (2, 2)",
            "ok": false,
            "fb": "Revisa el valor en el eje horizontal (x). Identifica el número que corta la línea vertical que baja desde el punto hacia el eje X."
          }
        ],
        "img": "img/quiz/T1F/q01.png"
      },
      {
        "id": "T1F02",
        "q": "¿En donde se encuentra el punto (0, 4)?",
        "opts": [
          {
            "t": "A) Sobre el eje X",
            "ok": false,
            "fb": "Para estar sobre el eje X, la coordenada vertical (y) debe ser 0. En este caso, el valor 4 indica un desplazamiento vertical."
          },
          {
            "t": "B) Sobre el eje Y",
            "ok": true
          },
          {
            "t": "C) En el origen",
            "ok": false,
            "fb": "El origen se define por las coordenadas (0, 0). La existencia de un valor distinto a cero en la segunda posición indica que el punto no está en el origen."
          },
          {
            "t": "D) En el cuadrante I",
            "ok": false,
            "fb": "Un punto pertenece a un cuadrante sólo si ambas coordenadas son distintas de cero. Si x = 0, el punto se ubica exactamente sobre uno de los ejes."
          }
        ]
      },
      {
        "id": "T1F03",
        "q": "¿Cuál es el punto en el origen?",
        "opts": [
          {
            "t": "A) (1, 1)",
            "ok": false,
            "fb": "Las coordenadas (1, 1) indican un desplazamiento de una unidad en ambos ejes. El origen representa la ausencia total de desplazamiento."
          },
          {
            "t": "B) (0, 1)",
            "ok": false,
            "fb": "El valor 1 en la posición y sitúa al punto sobre el eje vertical, no en la intersección central de ambos ejes."
          },
          {
            "t": "C) (0, 0)",
            "ok": true
          },
          {
            "t": "D) (1, 0)",
            "ok": false,
            "fb": "El valor 1 en la posición x desplaza al punto hacia la derecha, alejándolo del punto de intersección (0, 0)."
          }
        ]
      },
      {
        "id": "T1F04",
        "q": "¿En qué cuadrante está (-2, 3)?",
        "opts": [
          {
            "t": "A) I",
            "ok": false,
            "fb": "El cuadrante I requiere que tanto x como y sean positivos. En este caso, el valor de x es negativo."
          },
          {
            "t": "B) II",
            "ok": true
          },
          {
            "t": "C) III",
            "ok": false,
            "fb": "En el cuadrante III, ambas coordenadas deben ser negativas. Aquí, el valor de y (3) es positivo."
          },
          {
            "t": "D) IV",
            "ok": false,
            "fb": "El cuadrante IV se caracteriza por una x positiva y una y negativa. Los signos de este par ordenado son opuestos a esa condición."
          }
        ]
      },
      {
        "id": "T1F05",
        "q": "¿Qué par ordenado está en el cuadrante IV?",
        "opts": [
          {
            "t": "A) (3, -2)",
            "ok": true
          },
          {
            "t": "B) (-3, -2)",
            "ok": false,
            "fb": "Un par con ambos valores negativos (-x, -y) se ubica en el cuadrante III."
          },
          {
            "t": "C) (-3, 2)",
            "ok": false,
            "fb": "Un par con x negativa e y positiva (-x, y) se ubica en el cuadrante II."
          },
          {
            "t": "D) (3, 2)",
            "ok": false,
            "fb": "Un par con ambos valores positivos (x, y) se ubica siempre en el cuadrante I."
          }
        ]
      },
      {
        "id": "T1F06",
        "q": "¿Cuál es la coordenada X del punto (5, -1)?",
        "opts": [
          {
            "t": "A) -1",
            "ok": false,
            "fb": "En la notación (x, y), el segundo valor corresponde al eje vertical (y). El número -1 es la ordenada, no la abscisa."
          },
          {
            "t": "B) 5",
            "ok": true
          },
          {
            "t": "C) 0",
            "ok": false,
            "fb": "La coordenada 0 indicaría que el punto está sobre el eje Y. El primer valor del paréntesis es 5."
          },
          {
            "t": "D) 1",
            "ok": false,
            "fb": "Identifica el primer número dentro del paréntesis. El valor 1 positivo no forma parte de este par ordenado."
          }
        ]
      },
      {
        "id": "T1F07",
        "q": "¿Qué punto está más cerca del origen?",
        "opts": [
          {
            "t": "A) (1, 1)",
            "ok": true
          },
          {
            "t": "B) (2, 2)",
            "ok": false,
            "fb": "Compara la magnitud de los valores. Un desplazamiento de 2 unidades en cada eje resulta en una distancia lineal mayor respecto a (0, 0) que un desplazamiento de solo 1 unidad."
          },
          {
            "t": "C) (0, 3)",
            "ok": false,
            "fb": "La distancia al origen se calcula con el valor absoluto de los desplazamientos. Tres unidades en el eje Y es una distancia superior a la que presentan las otras opciones."
          },
          {
            "t": "D) (-1, -1)",
            "ok": true
          }
        ]
      },
      {
        "id": "T1F08",
        "q": "¿Dónde se encuentra el punto (4, 0)?",
        "opts": [
          {
            "t": "A) Sobre el eje X",
            "ok": true
          },
          {
            "t": "B) Sobre el eje Y",
            "ok": false,
            "fb": "Para que un punto esté sobre el eje Y, su componente horizontal (x) debe ser 0. Aquí, el valor de x es 4."
          },
          {
            "t": "C) En el origen",
            "ok": false,
            "fb": "El origen requiere que ambos componentes sean nulos. El valor 4 representa un desplazamiento real sobre el plano."
          },
          {
            "t": "D) En el cuadrante II",
            "ok": false,
            "fb": "El cuadrante II requiere una x negativa y una y positiva. Al ser y = 0, el punto no entra en ningún cuadrante; se queda sobre la línea divisoria."
          }
        ]
      },
      {
        "id": "T1F09",
        "q": "¿Qué coordenada es negativa en (-5, -5)?",
        "opts": [
          {
            "t": "A) Solo X",
            "ok": false,
            "fb": "Observa el signo que precede a ambos números. La presencia del signo \"menos\" en las dos posiciones invalida que solo una sea negativa."
          },
          {
            "t": "B) Solo Y",
            "ok": false,
            "fb": "El análisis del primer componente muestra un signo negativo, por lo que la negatividad no es exclusiva del eje Y."
          },
          {
            "t": "C) Ambas",
            "ok": true
          },
          {
            "t": "D) Ninguna",
            "ok": false,
            "fb": "Identifica el símbolo matemático \"-\" delante de los valores. Este símbolo indica que los números se encuentran a la izquierda y debajo del origen."
          }
        ]
      },
      {
        "id": "T1F10",
        "q": "¿Cuál es el punto simétrico de (2, 3) respecto al eje Y?",
        "opts": [
          {
            "t": "A) (-2, 3)",
            "ok": true
          },
          {
            "t": "B) (2, -3)",
            "ok": false,
            "fb": "Al cambiar el signo de y, se obtiene una simetría respecto al eje X (horizontal), no respecto al eje Y."
          },
          {
            "t": "C) (-2, -3)",
            "ok": false,
            "fb": "Cambiar ambos signos genera una simetría central respecto al origen, lo cual desplaza el punto al cuadrante opuesto (III)."
          },
          {
            "t": "D) (3, 2)",
            "ok": false,
            "fb": "Intercambiar los valores (y, x) no produce una simetría axial, sino una reflexión sobre la recta y = x."
          }
        ],
        "img": "img/quiz/T1F/q10.png"
      },
      {
        "id": "T1F11",
        "q": "¿En qué eje se encuentra el punto (0, -7)?",
        "opts": [
          {
            "t": "A) Eje X positivo",
            "ok": false,
            "fb": "Considera que en el eje X la coordenada vertical (y) siempre debe ser 0."
          },
          {
            "t": "B) Eje X negativo",
            "ok": false,
            "fb": "Revisa si el valor de la coordenada horizontal (x) es realmente un número negativo distinto de cero."
          },
          {
            "t": "C) Eje Y positivo",
            "ok": false,
            "fb": "Observa el signo de la coordenada vertical (y) para determinar si el movimiento es hacia la parte superior o inferior del plano."
          },
          {
            "t": "D) Eje Y negativo",
            "ok": true
          }
        ]
      },
      {
        "id": "T1F12",
        "q": "¿Qué punto tiene coordenadas (5, 0)?",
        "opts": [
          {
            "t": "A) 5 unidades arriba del origen",
            "ok": false,
            "fb": "Recuerda que un movimiento hacia \"arriba\" se refleja en la coordenada vertical (y), no en la horizontal (x)."
          },
          {
            "t": "B) 5 unidades abajo del origen",
            "ok": false,
            "fb": "Un desplazamiento \"abajo\" del origen requeriría un valor negativo en la segunda posición del par ordenado."
          },
          {
            "t": "C) 5 unidades a la derecha del origen",
            "ok": true
          },
          {
            "t": "D) 5 unidades a la izquierda del origen",
            "ok": false,
            "fb": "Verifica hacia qué lado del eje X se encuentran los valores positivos y hacia cuál los negativos."
          }
        ]
      },
      {
        "id": "T1F13",
        "q": "Un punto tiene coordenada x = -3 y coordenada y = 4. ¿En qué cuadrante está?",
        "opts": [
          {
            "t": "A) I",
            "ok": false,
            "fb": "Analiza si ambos signos del par ordenado (-3, 4) coinciden con los valores positivos que caracterizan al cuadrante I."
          },
          {
            "t": "B) II",
            "ok": true
          },
          {
            "t": "C) III",
            "ok": false,
            "fb": "Para estar en el cuadrante III, piensa si la coordenada vertical (y) debería ser positiva o negativa."
          },
          {
            "t": "D) IV",
            "ok": false,
            "fb": "Evalúa si la dirección de cada coordenada (izquierda/derecha y arriba/abajo) corresponde a los signos de este punto."
          }
        ]
      },
      {
        "id": "T1F14",
        "q": "¿Cuáles son las coordenadas de un punto que está 2 unidades a la izquierda y 3 unidades arriba del origen?",
        "opts": [
          {
            "t": "A) (2, 3)",
            "ok": false,
            "fb": "Si el punto está a la \"izquierda\", ¿debería su primera coordenada ser positiva o negativa?"
          },
          {
            "t": "B) (-2, 3)",
            "ok": true
          },
          {
            "t": "C) (2, -3)",
            "ok": false,
            "fb": "Un movimiento \"hacia arriba\" se asocia con valores positivos en el eje vertical. Revisa el signo de tu segunda coordenada."
          },
          {
            "t": "D) (-2, -3)",
            "ok": false,
            "fb": "Aunque acertaste con la dirección izquierda, revisa si \"arriba\" se representa con un signo menos."
          }
        ]
      },
      {
        "id": "T1F15",
        "q": "¿En qué cuadrante están todos los puntos con x > 0 y y < 0?",
        "opts": [
          {
            "t": "A) I",
            "ok": false,
            "fb": "En el cuadrante I, ambas coordenadas deben ser mayores a cero. Aquí se indica que y es menor a cero."
          },
          {
            "t": "B) II",
            "ok": false,
            "fb": "Revisa la dirección de x. Si x es mayor a cero, el punto debe estar a la derecha, no a la izquierda."
          },
          {
            "t": "C) III",
            "ok": false,
            "fb": "El cuadrante III se caracteriza por tener ambas coordenadas negativas. Aquí x es positiva."
          },
          {
            "t": "D) IV",
            "ok": true
          }
        ]
      },
      {
        "id": "T1F16",
        "q": "El punto (-5, 0) se encuentra:",
        "opts": [
          {
            "t": "A) En el cuadrante II",
            "ok": false,
            "fb": "Recuerda que para pertenecer a un cuadrante, ninguna de las coordenadas puede ser cero."
          },
          {
            "t": "B) En el cuadrante III",
            "ok": false,
            "fb": "Identifica si el punto está \"dentro\" de una zona o exactamente sobre una de las líneas principales."
          },
          {
            "t": "C) Sobre el eje X negativo",
            "ok": true
          },
          {
            "t": "D) Sobre el eje Y negativo",
            "ok": false,
            "fb": "Si el valor -5 está en la primera posición, ¿a qué eje corresponde ese desplazamiento: al horizontal o al vertical?"
          }
        ]
      },
      {
        "id": "T1F17",
        "q": "¿Qué coordenada es siempre positiva en el cuadrante II?",
        "opts": [
          {
            "t": "A) x",
            "ok": false,
            "fb": "Piensa en la dirección horizontal del cuadrante II. Al estar a la izquierda del origen, ¿cómo deberían ser los valores de x?"
          },
          {
            "t": "B) y",
            "ok": true
          },
          {
            "t": "C) x y y",
            "ok": false,
            "fb": "Analiza si es posible que la x sea positiva estando en el lado izquierdo del plano."
          },
          {
            "t": "D) Ninguna",
            "ok": false,
            "fb": "Recuerda que el cuadrante II está por encima del eje X; esto implica que una de sus dimensiones siempre tiene valores mayores a cero."
          }
        ]
      },
      {
        "id": "T1F18",
        "q": "Un punto está en el eje X y su coordenada x es negativa. ¿Dónde se encuentra?",
        "opts": [
          {
            "t": "A) En el cuadrante II",
            "ok": false,
            "fb": "Si un punto está \"en el eje\", significa que una de sus coordenadas es cero. Los puntos en los cuadrantes no tienen coordenadas en cero."
          },
          {
            "t": "B) En el cuadrante III",
            "ok": false,
            "fb": "Revisa la diferencia entre estar sobre la línea divisoria y estar en el área sombreada del cuadrante."
          },
          {
            "t": "C) En la parte negativa del eje X",
            "ok": true
          },
          {
            "t": "D) En la parte positiva del eje X",
            "ok": false,
            "fb": "Si la instrucción dice que la coordenada es negativa, ¿puede estar en la sección \"positiva\" del eje?"
          }
        ]
      },
      {
        "id": "T1F19",
        "q": "¿Qué punto está en el cuadrante III?",
        "opts": [
          {
            "t": "A) (3, -4)",
            "ok": false,
            "fb": "Este punto tiene x positiva. ¿Hacia qué lado se mueve y en qué cuadrantes estaríamos a la derecha?"
          },
          {
            "t": "B) (-3, 4)",
            "ok": false,
            "fb": "Este punto va hacia arriba (y positiva). El cuadrante III se encuentra por debajo del eje horizontal."
          },
          {
            "t": "C) (-3, -4)",
            "ok": true
          },
          {
            "t": "D) (3, 4)",
            "ok": false,
            "fb": "Aquí ambas son positivas. Recuerda que el cuadrante III es el \"opuesto\" total al cuadrante I."
          }
        ]
      },
      {
        "id": "T1F20",
        "q": "¿Cuál es la característica de todos los puntos en el cuadrante IV?",
        "opts": [
          {
            "t": "A) x > 0, y > 0",
            "ok": false,
            "fb": "Esta combinación de signos corresponde a los puntos que están arriba y a la derecha (Cuadrante I)."
          },
          {
            "t": "B) x < 0, y > 0",
            "ok": false,
            "fb": "Si x es menor a cero, el punto está a la izquierda. El cuadrante IV se ubica en el lado derecho."
          },
          {
            "t": "C) x < 0, y < 0",
            "ok": false,
            "fb": "Esta descripción pertenece al cuadrante que está abajo y a la izquierda."
          },
          {
            "t": "D) x > 0, y < 0",
            "ok": true
          }
        ]
      },
      {
        "id": "T1F21",
        "q": "¿Cuál es la distancia horizontal entre los puntos (2, 5) y (7, 5)?",
        "opts": [
          {
            "t": "A) 3",
            "ok": false,
            "fb": "Para hallar la distancia horizontal, resta los valores de x (7 - 2). Revisa tu cálculo."
          },
          {
            "t": "B) 4",
            "ok": false,
            "fb": "Cuenta cuántos saltos hay en el eje X desde el 2 hasta el 7. ¿Son realmente 4?"
          },
          {
            "t": "C) 5",
            "ok": true
          },
          {
            "t": "D) 6",
            "ok": false,
            "fb": "Verifica la resta de las abscisas; parece que sumaste una unidad de más al resultado."
          }
        ],
        "img": "img/quiz/T1F/q21.png"
      },
      {
        "id": "T1F22",
        "q": "¿Cuál es la distancia vertical entre los puntos (3, 1) y (3, 8)?",
        "opts": [
          {
            "t": "A) 5",
            "ok": false,
            "fb": "Revisa la diferencia entre las coordenadas y (8 y 1). ¿Cuánto le falta al 1 para llegar al 8?"
          },
          {
            "t": "B) 6",
            "ok": false,
            "fb": "Realiza la resta de las ordenadas nuevamente para asegurar el resultado exacto."
          },
          {
            "t": "C) 7",
            "ok": true
          },
          {
            "t": "D) 8",
            "ok": false,
            "fb": "El número 8 es la posición final, pero la distancia se mide desde el punto de partida (1)."
          }
        ],
        "img": "img/quiz/T1F/q22.png"
      },
      {
        "id": "T1F23",
        "q": "¿Qué punto está a la misma distancia horizontal del origen que (4, 0)?",
        "opts": [
          {
            "t": "A) (0, 4)",
            "ok": false,
            "fb": "El punto (0, 4) tiene una distancia de 4 unidades, pero es una distancia vertical. La pregunta pide distancia horizontal."
          },
          {
            "t": "B) (-4, 0)",
            "ok": true
          },
          {
            "t": "C) (4, 4)",
            "ok": false,
            "fb": "Aunque está a 4 unidades a la derecha, este punto también se alejó verticalmente. Busca un punto que solo tenga desplazamiento horizontal."
          },
          {
            "t": "D) (-4, -4)",
            "ok": false,
            "fb": "Similar a la opción anterior, este punto tiene desplazamientos en ambos ejes, no solo en el horizontal."
          }
        ],
        "img": "img/quiz/T1F/q23.png"
      },
      {
        "id": "T1F24",
        "q": "Si TecDuck está en (2, 3) y se mueve 4 unidades a la derecha, ¿dónde termina?",
        "opts": [
          {
            "t": "A) (2, 7)",
            "ok": false,
            "fb": "Moverse a la \"derecha\" es un cambio horizontal. ¿Por qué cambiaste la coordenada y (la segunda)?"
          },
          {
            "t": "B) (6, 3)",
            "ok": true
          },
          {
            "t": "C) (-2, 3)",
            "ok": false,
            "fb": "Ir a la derecha implica sumar al valor de x. Al llegar a -2, parece que restaste en lugar de sumar."
          },
          {
            "t": "D) (2, -1)",
            "ok": false,
            "fb": "Recuerda que el eje horizontal controla la derecha y la izquierda. Has modificado el eje vertical."
          }
        ],
        "img": "img/quiz/T1F/q24.png"
      },
      {
        "id": "T1F25",
        "q": "Si TecDuck está en (-3, 1) y se mueve 2 unidades hacia abajo, ¿dónde termina?",
        "opts": [
          {
            "t": "A) (-3, 3)",
            "ok": false,
            "fb": "Un movimiento \"hacia abajo\" significa disminuir el valor de y. Si a 1 le quitas 2, ¿el resultado debería ser mayor o menor?"
          },
          {
            "t": "B) (-1, 1)",
            "ok": false,
            "fb": "Has cambiado la coordenada x. Recuerda que el movimiento vertical no afecta la posición horizontal."
          },
          {
            "t": "C) (-3, -1)",
            "ok": true
          },
          {
            "t": "D) (-5, 1)",
            "ok": false,
            "fb": "Revisaste el eje equivocado. El movimiento arriba/abajo solo afecta a la segunda cifra del paréntesis."
          }
        ],
        "img": "img/quiz/T1F/q25.png"
      },
      {
        "id": "T1F26",
        "q": "¿Qué punto está más cerca de (1, 1)?",
        "opts": [
          {
            "t": "A) (0, 0)",
            "ok": false,
            "fb": "El origen está a una distancia diagonal. Calcula cuántas unidades hay si solo te mueves por una de las líneas de la cuadrícula."
          },
          {
            "t": "B) (2, 2)",
            "ok": false,
            "fb": "Al igual que el origen, este punto requiere un movimiento en dos direcciones. Busca uno que esté a solo \"un paso\" de distancia en la cuadrícula."
          },
          {
            "t": "C) (1, 2)",
            "ok": true
          },
          {
            "t": "D) (0, 1)",
            "ok": true
          }
        ],
        "img": "img/quiz/T1F/q26.png"
      },
      {
        "id": "T1F27",
        "q": "Desde el origen, TecDuck se mueve primero a (3, 0) y luego a (3, 4). ¿Cuántas unidades se movió en total?",
        "opts": [
          {
            "t": "A) 5",
            "ok": false,
            "fb": "El número 5 es la distancia \"en línea recta\" (diagonal), pero TecDuck hizo dos tramos distintos. Suma la longitud de cada tramo."
          },
          {
            "t": "B) 7",
            "ok": true
          },
          {
            "t": "C) 8",
            "ok": false,
            "fb": "Revisa cuánto miden los saltos: del (0,0) al (3,0) y del (3,0) al (3,4). La suma no da 8."
          },
          {
            "t": "D) 12",
            "ok": false,
            "fb": "Parece que multiplicaste los valores. En un recorrido total, las distancias de cada paso se deben sumar."
          }
        ],
        "img": "img/quiz/T1F/q27.png"
      },
      {
        "id": "T1F28",
        "q": "¿Qué punto es el resultado de mover (2, 5) tres unidades a la izquierda y dos unidades arriba?",
        "opts": [
          {
            "t": "A) (5, 7)",
            "ok": false,
            "fb": "\"Izquierda\" significa restar a la x. Si a 2 le quitas 3, ¿cómo puede dar 5? Revisa la dirección de tu operación."
          },
          {
            "t": "B) (-1, 7)",
            "ok": true
          },
          {
            "t": "C) (2, 8)",
            "ok": false,
            "fb": "Solo aplicaste el cambio vertical. No olvides que también hubo un movimiento hacia la izquierda en el eje horizontal."
          },
          {
            "t": "D) (5, 3)",
            "ok": false,
            "fb": "Aunque moviste la x, sumaste en lugar de restar. Además, para ir \"arriba\", ¿se debe sumar o restar a la y?"
          }
        ],
        "img": "img/quiz/T1F/q28.png"
      },
      {
        "id": "T1F29",
        "q": "Si un punto está en (a, b) y a es positivo, b es negativo, ¿en qué cuadrante está?",
        "opts": [
          {
            "t": "A) I",
            "ok": false,
            "fb": "En el cuadrante I, tanto la x como la y deben ser positivas. Aquí 'b' es negativo."
          },
          {
            "t": "B) II",
            "ok": false,
            "fb": "Si 'a' es positivo, el punto debe estar a la derecha del origen. El cuadrante II está a la izquierda."
          },
          {
            "t": "C) III",
            "ok": false,
            "fb": "El cuadrante III requiere que 'a' sea negativo (izquierda). Aquí se especifica que 'a' es positivo."
          },
          {
            "t": "D) IV",
            "ok": true
          }
        ]
      },
      {
        "id": "T1F30",
        "q": "¿Cuál es la coordenada x del punto que está 4 unidades a la derecha de (-2, 3)?",
        "opts": [
          {
            "t": "A) 2",
            "ok": true
          },
          {
            "t": "B) -6",
            "ok": false,
            "fb": "Moverse a la derecha es sumar. Si a -2 le sumas 4, el resultado debe ser un número positivo."
          },
          {
            "t": "C) 4",
            "ok": false,
            "fb": "El 4 es la cantidad que te mueves, pero la pregunta pide la posición final en el eje X después del salto."
          },
          {
            "t": "D) -2",
            "ok": false,
            "fb": "Esa es la coordenada inicial. Recuerda aplicar el desplazamiento de 4 unidades."
          }
        ],
        "img": "img/quiz/T1F/q30.png"
      },
      {
        "id": "T1F31",
        "q": "TecDuck está en el punto A(2, 2). Luego vuela al punto B(5, 6). ¿Cuántas unidades se movió horizontalmente?",
        "opts": [
          {
            "t": "A) 3",
            "ok": true
          },
          {
            "t": "B) 4",
            "ok": false,
            "fb": "El número 4 es la diferencia entre las coordenadas y (6-2). La pregunta pide el movimiento horizontal (eje X)."
          },
          {
            "t": "C) 5",
            "ok": false,
            "fb": "Ese es el valor de la x final, pero la distancia es lo que recorrió desde el"
          },
          {
            "t": "D) 2",
            "ok": false,
            "fb": "Ese es el valor de la x inicial. Resta la posición final menos la inicial para hallar el desplazamiento."
          }
        ],
        "img": "img/quiz/T1F/q31.png"
      },
      {
        "id": "T1F32",
        "q": "¿Qué punto tiene la misma coordenada y que (4, 7)?",
        "opts": [
          {
            "t": "A) (4, 5)",
            "ok": false,
            "fb": "Aquí la x es igual (4), pero la coordenada y cambió de 7 a 5. Busca dónde la segunda cifra sea idéntica."
          },
          {
            "t": "B) (7, 4)",
            "ok": false,
            "fb": "Ten cuidado, las coordenadas están al revés. En (7, 4), la y es 4, no 7."
          },
          {
            "t": "C) (2, 7)",
            "ok": true
          },
          {
            "t": "D) (7, 7)",
            "ok": true
          }
        ],
        "img": "img/quiz/T1F/q32.png"
      },
      {
        "id": "T1F33",
        "q": "¿Cuál es el punto medio entre (0, 0) y (4, 6)?",
        "opts": [
          {
            "t": "A) (2, 3)",
            "ok": true
          },
          {
            "t": "B) (4, 6)",
            "ok": false,
            "fb": "Ese es el punto final del camino. El punto medio debe estar a la mitad de la distancia en ambos ejes."
          },
          {
            "t": "C) (2, 6)",
            "ok": false,
            "fb": "Has dividido la x a la mitad, pero mantuviste la y completa. ¿Cuál es la mitad de 6?"
          },
          {
            "t": "D) (4, 3)",
            "ok": false,
            "fb": "Dividiste la y correctamente, pero dejaste la x intacta. El punto medio requiere promediar ambas coordenadas."
          }
        ],
        "img": "img/quiz/T1F/q33.png"
      },
      {
        "id": "T1F34",
        "q": "Si TecDuck está en (-1, -1) y se mueve según el desplazamiento (3, 4), ¿dónde termina?",
        "opts": [
          {
            "t": "A) (2, 3)",
            "ok": true
          },
          {
            "t": "B) (-4, -5)",
            "ok": false,
            "fb": "Parece que restaste los valores. Un desplazamiento positivo indica que debes sumarlos a la posición inicial."
          },
          {
            "t": "C) (4, 5)",
            "ok": false,
            "fb": "Estas serían las coordenadas si empezaras desde el origen (0,0). No olvides que empezaste en (-1, -1)."
          },
          {
            "t": "D) (-2, -3)",
            "ok": false,
            "fb": "Revisa los signos de tu suma: -1 + 3 y -1 + 4. El resultado no debería ser negativo."
          }
        ],
        "img": "img/quiz/T1F/q34.png"
      },
      {
        "id": "T1F35",
        "q": "¿Qué punto es simétrico de (3, -2) respecto al eje X?",
        "opts": [
          {
            "t": "A) (3, 2)",
            "ok": true
          },
          {
            "t": "B) (-3, -2)",
            "ok": false,
            "fb": "Cambiar el signo de la x crea una simetría respecto al eje vertical (Y). La pregunta pide respecto al eje horizontal (X)."
          },
          {
            "t": "C) (-3, 2)",
            "ok": false,
            "fb": "Al cambiar ambos signos, encontraste el punto simétrico respecto al origen, no respecto a un eje."
          },
          {
            "t": "D) (3, -2)",
            "ok": false,
            "fb": "Un punto simétrico debe estar en una posición diferente (como un reflejo en un espejo). Este es el mismo punto."
          }
        ],
        "img": "img/quiz/T1F/q35.png"
      },
      {
        "id": "T1F36",
        "q": "Un punto tiene coordenadas (x, y) donde |x| = 4 y |y| = 3. Si está en el cuadrante II, ¿cuáles son sus coordenadas?",
        "opts": [
          {
            "t": "A) (4, 3)",
            "ok": false,
            "fb": "Estas coordenadas corresponden al cuadrante I, donde todo es positivo. Revisa los signos del cuadrante II."
          },
          {
            "t": "B) (-4, 3)",
            "ok": true
          },
          {
            "t": "C) (4, -3)",
            "ok": false,
            "fb": "En el cuadrante IV, la x es positiva y la y es negativa. Es justo lo contrario a lo que pide el cuadrante II."
          },
          {
            "t": "D) (-4, -3)",
            "ok": false,
            "fb": "Si ambas fueran negativas, el punto estaría en el cuadrante III (abajo a la izquierda)."
          }
        ]
      },
      {
        "id": "T1F37",
        "q": "¿Cuánto se desplazó TecDuck si fue de (2, 5) a (2, 1)?",
        "opts": [
          {
            "t": "A) 4 unidades a la derecha",
            "ok": false,
            "fb": "Observa la coordenada x. Como no cambió (sigue siendo 2), no pudo haber un movimiento horizontal."
          },
          {
            "t": "B) 4 unidades a la izquierda",
            "ok": false,
            "fb": "Si la primera cifra del paréntesis es igual en ambos puntos, TecDuck no se movió de izquierda a derecha."
          },
          {
            "t": "C) 4 unidades arriba",
            "ok": false,
            "fb": "Para ir \"arriba\", el valor de y debería aumentar. Aquí pasó de 5 a 1. ¿Qué dirección implica disminuir el valor de y?"
          },
          {
            "t": "D) 4 unidades abajo",
            "ok": true
          }
        ],
        "img": "img/quiz/T1F/q37.png"
      },
      {
        "id": "T1F38",
        "q": "¿Qué punto está en el eje Y positivo?",
        "opts": [
          {
            "t": "A) (0, 5)",
            "ok": true
          },
          {
            "t": "B) (5, 0)",
            "ok": false,
            "fb": "Este punto está sobre el eje horizontal (X) porque su segunda coordenada es 0."
          },
          {
            "t": "C) (0, -5)",
            "ok": false,
            "fb": "Aunque está sobre el eje Y, el signo negativo indica que está por debajo del origen."
          },
          {
            "t": "D) (-5, 0)",
            "ok": false,
            "fb": "El valor -5 en la primera posición lo sitúa en el eje X negativo."
          }
        ]
      },
      {
        "id": "T1F39",
        "q": "Si un punto tiene coordenadas (a, b) y a = b, ¿dónde se encuentra?",
        "opts": [
          {
            "t": "A) Siempre en el cuadrante I",
            "ok": false,
            "fb": "Considera el punto (-3, -3). Aquí a = b, pero están en el cuadrante III. No es exclusivo del cuadrante I."
          },
          {
            "t": "B) Siempre en la diagonal y = x",
            "ok": true
          },
          {
            "t": "C) Siempre en el origen",
            "ok": false,
            "fb": "El origen (0,0) cumple la regla, pero ¿qué pasa con (2,2) o (5,5)? También cumplen que a = b y no son el origen."
          },
          {
            "t": "D) Siempre en el eje X",
            "ok": false,
            "fb": "En el eje X, la b siempre debe ser 0. Si a fuera 5, entonces a no sería igual a b."
          }
        ]
      },
      {
        "id": "T1F40",
        "q": "TecDuck hizo el siguiente recorrido: comenzó en (0,0), fue a (4,0), luego a (4,3), luego a (0,3) y regresó a (0,0). ¿Qué figura formó?",
        "opts": [
          {
            "t": "A) Un triángulo",
            "ok": false,
            "fb": "Cuenta los puntos de giro. TecDuck pasó por 4 esquinas distintas antes de volver al inicio."
          },
          {
            "t": "B) Un rectángulo",
            "ok": true
          },
          {
            "t": "C) Un cuadrado",
            "ok": false,
            "fb": "Compara las distancias. La base mide 4 unidades (4-0) y la altura mide 3 unidades (3-0). ¿Son todos los lados iguales?"
          },
          {
            "t": "D) Una línea recta",
            "ok": false,
            "fb": "Al cambiar de dirección en el eje X y luego en el Y, se encierra un área. Una línea recta no vuelve al origen después de subir."
          }
        ]
      }
    ],
    "dificil": [
      {
        "id": "T1D01",
        "q": "TecDuck comienza en el punto A(3, -2). Luego se mueve 5 unidades a la izquierda y 4 unidades hacia arriba. Después de este movimiento, TecDuck se encuentra en el punto B, y luego se desplaza según el vector (-2, -3). ¿Cuáles son las coordenadas finales de TecDuck?",
        "opts": [
          {
            "t": "A) (-4, -1)",
            "ok": true
          },
          {
            "t": "B) (6, -1)",
            "ok": false,
            "fb": "Revisa el primer paso. Si vas a la \"izquierda\", ¿debes sumar o restar al valor de x? Parece que sumaste en lugar de restar."
          },
          {
            "t": "C) (-4, 5)",
            "ok": false,
            "fb": "En el último paso (el vector), observa los signos. Si restas 3 a un valor"
          },
          {
            "t": "D) (1, -1)",
            "ok": false,
            "fb": "Verifica el cálculo de la primera coordenada (x). Asegúrate de aplicar tanto el movimiento de 5 unidades como el del vector -2 partiendo desde el 3 inicial."
          }
        ],
        "img": "img/quiz/T1D/q01.png"
      },
      {
        "id": "T1D02",
        "q": "Un punto P tiene coordenadas (x, y) tales que |x| = 5 y |y| = 3, y se encuentra en el tercer cuadrante. Si este punto se refleja primero respecto al eje Y y luego respecto al eje X, ¿cuáles son las coordenadas finales?",
        "opts": [
          {
            "t": "A) (5, -3)",
            "ok": false,
            "fb": "Al reflejar un punto respecto al eje X, imagina que el eje horizontal es un espejo en el suelo. ¿Qué coordenada debería cambiar, la horizontal o la vertical?"
          },
          {
            "t": "B) (-5, 3)",
            "ok": false,
            "fb": "El punto ya se encuentra en el tercer cuadrante, lo que significa que ambas coordenadas son negativas inicialmente. Si reflejas sobre el eje Y (espejo vertical), piensa qué signo es el que debe invertirse."
          },
          {
            "t": "C) (5, 3)",
            "ok": true
          },
          {
            "t": "D) (-5, -3)",
            "ok": false,
            "fb": "Este es tu punto original de partida en el tercer cuadrante. Recuerda que el problema te pide aplicar dos reflexiones (una en cada eje) para llegar a la posición final."
          }
        ]
      },
      {
        "id": "T1D03",
        "q": "TecDuck debe ir del punto A(-4, 7) al punto B(5, -3). Decide hacerlo en dos etapas: primero viaja horizontalmente hasta alcanzar la misma coordenada x de B, y luego verticalmente hasta B. ¿Cuántas unidades viaja TecDuck en total?",
        "opts": [
          {
            "t": "A) 19",
            "ok": true
          },
          {
            "t": "B) 9",
            "ok": false,
            "fb": "Parece que solo calculaste la distancia del trayecto horizontal. Recuerda que el viaje consta de dos etapas; te falta incluir el movimiento vertical para llegar a B."
          },
          {
            "t": "C) 10",
            "ok": false,
            "fb": "Este valor corresponde únicamente al desplazamiento vertical. El recorrido total debe sumar también la distancia recorrida a lo largo del eje horizontal."
          },
          {
            "t": "D) 21",
            "ok": false,
            "fb": "Revisa tus sumas y restas al calcular la diferencia de las coordenadas. Asegúrate de contar la distancia total absoluta de ambos tramos sin añadir unidades extra por error."
          }
        ],
        "img": "img/quiz/T1D/q03.png"
      },
      {
        "id": "T1D04",
        "q": "Los puntos A(a, b), B(c, d) y C(e, f) son los vértices de un triángulo rectángulo con el ángulo recto en A. Si a = 2, b = 3, c = 2, d = 7, y e = 6, ¿cuál es el valor de f?",
        "opts": [
          {
            "t": "A) 3",
            "ok": true
          },
          {
            "t": "B) 7",
            "ok": false,
            "fb": "Ese valor corresponde a la altura del punto B. Para que se forme un ángulo recto en A (que está alineado verticalmente con B), piensa en cómo debe ser la línea que conecta A con C."
          },
          {
            "t": "C) 5",
            "ok": false,
            "fb": "Si usas este valor, la línea no sería completamente horizontal, lo que arruinaría el ángulo de 90 grados. Revisa qué coordenada debe mantenerse constante para formar una \"L\" perfecta."
          },
          {
            "t": "D) 4",
            "ok": false,
            "fb": "Observa las coordenadas del punto A. Para mantener una línea perpendicular al segmento AB (que es vertical), el segmento AC debe compartir una altura exacta."
          }
        ]
      },
      {
        "id": "T1D05",
        "q": "Un punto M es el punto medio entre P(2a, 3b) y Q(4a, b). Si las coordenadas de M son (9, 6), ¿cuáles son los valores de a y b?",
        "opts": [
          {
            "t": "A) a = 3, b = 3",
            "ok": true
          },
          {
            "t": "B) a = 2, b = 4",
            "ok": false,
            "fb": "Recuerda la fórmula del punto medio: se suman las coordenadas de los extremos y se dividen entre dos. Revisa el resultado de tu despeje inicial."
          },
          {
            "t": "C) a = 4, b = 2",
            "ok": false,
            "fb": "Verifica tu ecuación para la coordenada horizontal. Si el punto medio es 9, la suma de las 'x' originales promediada debe dar ese resultado."
          },
          {
            "t": "D) a = 3, b = 4",
            "ok": false,
            "fb": "Calculaste correctamente el valor de 'a', pero revisa tu despeje para la coordenada vertical. Sumar las componentes 'y' y dividirlas a la mitad debe resultar en 6."
          }
        ]
      },
      {
        "id": "T1D06",
        "q": "El punto A(3, -5) se refleja respecto al eje X, obteniendo A'. Luego A' se refleja respecto al eje Y, obteniendo A''. ¿Cuáles son las coordenadas de A''?",
        "opts": [
          {
            "t": "A) (-3, 5)",
            "ok": true
          },
          {
            "t": "B) (3, 5)",
            "ok": false,
            "fb": "Este resultado es correcto para el primer reflejo sobre el eje X. Sin embargo, te falta aplicar el segundo paso requerido en el problema."
          },
          {
            "t": "C) (-3, -5)",
            "ok": false,
            "fb": "Analiza el orden de los reflejos. Si reflejas primero sobre X y luego sobre Y, estás cruzando el plano en ambas direcciones. ¿Cómo deberían quedar los signos finales en comparación al reflejo respecto al origen?"
          },
          {
            "t": "D) (3, -5)",
            "ok": false,
            "fb": "Estas son las coordenadas exactas del punto de partida. Asegúrate de aplicar los cambios de signo correspondientes a cada reflexión solicitada."
          }
        ],
        "img": "img/quiz/T1D/q06.png"
      },
      {
        "id": "T1D07",
        "q": "Dos puntos P y Q son simétricos respecto al origen. Si P = (-2, 7), ¿cuáles son las coordenadas de Q?",
        "opts": [
          {
            "t": "A) (2, -7)",
            "ok": true
          },
          {
            "t": "B) (-2, -7)",
            "ok": false,
            "fb": "Al cambiar solo el signo de la segunda coordenada, estás realizando una simetría respecto al eje X. La simetría respecto al origen tiene un efecto diferente."
          },
          {
            "t": "C) (2, 7)",
            "ok": false,
            "fb": "Este cambio indica una simetría únicamente respecto al eje Y. Recuerda que cruzar por el origen (0,0) como si fuera un espejo central invierte tu posición en todas las dimensiones."
          },
          {
            "t": "D) (-2, 7)",
            "ok": false,
            "fb": "Estas son las coordenadas iniciales del punto P. Una simetría respecto al origen siempre debe alterar tu par ordenado."
          }
        ],
        "img": "img/quiz/T1D/q07.png"
      },
      {
        "id": "T1D08",
        "q": "El punto R se refleja respecto al eje Y y se obtiene (-3, 4). ¿Cuáles eran las coordenadas originales de R?",
        "opts": [
          {
            "t": "A) (3, 4)",
            "ok": true
          },
          {
            "t": "B) (-3, -4)",
            "ok": false,
            "fb": "Si este fuera el punto original, al reflejarlo sobre el eje Y (cambiando el signo horizontal), no llegarías al resultado deseado. Revisa qué signo se debe invertir."
          },
          {
            "t": "C) (3, -4)",
            "ok": false,
            "fb": "Piensa en el proceso inverso: si un punto se reflejó sobre el eje vertical (Y) para llegar a su posición final, ¿qué coordenada se vio afectada y cuál debió mantenerse intacta?"
          },
          {
            "t": "D) (-3, 4)",
            "ok": false,
            "fb": "Este es el punto final después del reflejo. Para encontrar el punto original, debes \"deshacer\" el efecto del espejo que ocurrió al cruzar el eje Y."
          }
        ],
        "img": "img/quiz/T1D/q08.png"
      },
      {
        "id": "T1D09",
        "q": "Un cuadrado tiene vértices en (1, 1), (5, 1), (5, 5) y (1, 5). Si se refleja respecto al eje X, ¿cuáles son las coordenadas del vértice que originalmente estaba en (1, 5)?",
        "opts": [
          {
            "t": "A) (1, -5)",
            "ok": true
          },
          {
            "t": "B) (-1, 5)",
            "ok": false,
            "fb": "Este resultado se obtendría si el cuadrado se reflejara respecto al eje vertical (Y). Lee cuidadosamente sobre qué eje te pide hacer el ejercicio la reflexión."
          },
          {
            "t": "C) (-1, -5)",
            "ok": false,
            "fb": "Al cambiar los signos de ambas coordenadas, el vértice se reflejaría respecto al origen de forma diagonal. Un reflejo sobre un solo eje debe afectar a una sola dimensión."
          },
          {
            "t": "D) (5, 1)",
            "ok": false,
            "fb": "Has seleccionado las coordenadas de otro de los vértices del cuadrado original. Identifica el vértice (1, 5) y analiza qué le sucede a su altura cuando \"cruza\" el eje horizontal hacia abajo."
          }
        ],
        "img": "img/quiz/T1D/q09.png"
      },
      {
        "id": "T1D10",
        "q": "Tres puntos A, B y C son tales que B es el punto medio entre A y C. Si A = (-3, 2) y B = (1, -1), ¿cuáles son las coordenadas de C?",
        "opts": [
          {
            "t": "A) (5, -4)",
            "ok": true
          },
          {
            "t": "B) (-1, 0.5)",
            "ok": false,
            "fb": "Parece que calculaste el punto medio entre A y B. Sin embargo, lee bien el enunciado: B ya es el punto medio, por lo que tu objetivo es encontrar el extremo C faltante."
          },
          {
            "t": "C) (2, -3)",
            "ok": false,
            "fb": "Verifica tu despeje en la fórmula del punto medio. Recuerda que el valor de B debe ser igual a la suma de los extremos A y C, dividida a la mitad."
          },
          {
            "t": "D) (-5, 4)",
            "ok": false,
            "fb": "Estas coordenadas corresponden a una simetría respecto al origen. Plantea la ecuación del punto medio para cada eje de forma independiente y despeja la incógnita."
          }
        ],
        "img": "img/quiz/T1D/q10.png"
      },
      {
        "id": "T1D11",
        "q": "La distancia entre dos puntos P y Q es de 10 unidades. Si P = (-2, 3) y Q = (6, y), ¿cuál es el valor de y?",
        "opts": [
          {
            "t": "A) 9 o -3",
            "ok": true
          },
          {
            "t": "B) 7 o -1",
            "ok": false,
            "fb": "Revisa el cálculo dentro de la fórmula de distancia. Al elevar al cuadrado la diferencia de las coordenadas 'y', ¿la suma total dentro de la raíz realmente da como resultado 100?"
          },
          {
            "t": "C) 5 o 1",
            "ok": false,
            "fb": "Verifica tu despeje. Si la diferencia en las abscisas (eje x) ya aporta un valor considerable, ¿cuánto falta sumar para alcanzar el cuadrado de la distancia requerida?"
          },
          {
            "t": "D) 11 o -5",
            "ok": false,
            "fb": "Parece que la suma de los cuadrados superó la distancia límite dada en el problema. Recuerda restar correctamente la posición antes de elevar al cuadrado."
          }
        ]
      },
      {
        "id": "T1D12",
        "q": "TecDuck vuela en línea recta desde el punto (-5, -2) hasta el punto (7, 3). ¿Cuál es la distancia que recorre? (Expresa el resultado simplificado)",
        "opts": [
          {
            "t": "A) 13",
            "ok": true
          },
          {
            "t": "B) 12",
            "ok": false,
            "fb": "Este valor refleja únicamente la diferencia de distancia en el eje horizontal. Para vuelos en línea recta (diagonales), es necesario aplicar el Teorema de Pitágoras."
          },
          {
            "t": "C) √194",
            "ok": false,
            "fb": "Verifica las sumas y restas de tus coordenadas antes de elevarlas al cuadrado. Un pequeño error aritmético pudo haber alterado el resultado final dentro de la raíz."
          },
          {
            "t": "D) √169",
            "ok": false,
            "fb": "Tu planteamiento matemático inicial es correcto, pero lee con cuidado la instrucción del problema. Se te pide expresar el resultado final de la forma más simplificada posible."
          }
        ],
        "img": "img/quiz/T1D/q12.png"
      },
      {
        "id": "T1D13",
        "q": "Los puntos A(2, 3), B(5, 7) y C(x, y) forman un triángulo isósceles con AB = AC. Si C está sobre el eje X, ¿cuáles son las coordenadas de C?",
        "opts": [
          {
            "t": "A) (6, 0) o (-2, 0)",
            "ok": true
          },
          {
            "t": "B) (4, 0) o (0, 0)",
            "ok": false,
            "fb": "Para que el triángulo sea isósceles bajo esta condición, la distancia de A hacia C debe medir exactamente lo mismo que de A hacia B. Sustituye estos puntos en la fórmula de distancia y comprueba si se cumple la igualdad."
          },
          {
            "t": "C) (8, 0) o (-4, 0)",
            "ok": false,
            "fb": "Verifica tus ecuaciones paso a paso. Al igualar las distancias al cuadrado, asegúrate de realizar el desarrollo del binomio o el despeje de la raíz de forma correcta."
          },
          {
            "t": "D) (5, 0) o (-1, 0)",
            "ok": false,
            "fb": "Estos puntos no generan la misma longitud al calcular la distancia desde el vértice A. Revisa cuidadosamente el despeje de tu variable sobre el eje X."
          }
        ],
        "img": "img/quiz/T1D/q13.png"
      },
      {
        "id": "T1D14",
        "q": "Si el punto (k, 2k) está a distancia 5 del origen, ¿cuáles son los posibles valores de k?",
        "opts": [
          {
            "t": "A) √5 o -√5",
            "ok": true
          },
          {
            "t": "B) 1 o -1",
            "ok": false,
            "fb": "Si sustituyes este valor en las coordenadas y calculas la distancia al origen, notarás que no llegas a 5. Revisa cómo elevaste al cuadrado los términos que incluyen la variable k."
          },
          {
            "t": "C) 5 o -5",
            "ok": false,
            "fb": "Parece que olvidaste aplicar una raíz cuadrada al final de tu despeje. Recuerda que la fórmula iguala la raíz a 5, por lo que el contenido interno debe sumar 25."
          },
          {
            "t": "D) √3 o -√3",
            "ok": false,
            "fb": "Revisa la suma de los términos con incógnita. Elevar una multiplicación al cuadrado afecta a ambos elementos. Vuelve a intentar el despeje final de k."
          }
        ]
      },
      {
        "id": "T1D15",
        "q": "Un rectángulo tiene vértices en (1, 2), (1, 5), (4, 5) y (4, 2). Si se traslada 3 unidades a la izquierda y 2 unidades hacia abajo, ¿cuáles son las coordenadas del vértice que originalmente estaba en (4, 5)?",
        "opts": [
          {
            "t": "A) (1, 3)",
            "ok": true
          },
          {
            "t": "B) (7, 7)",
            "ok": false,
            "fb": "Una traslación a la izquierda y hacia abajo requiere disminuir valores en el plano. Parece que realizaste la operación opuesta y sumaste en ambas direcciones."
          },
          {
            "t": "C) (1, 7)",
            "ok": false,
            "fb": "Aplicaste correctamente el movimiento horizontal. Sin embargo, revisa la instrucción vertical: moverse \"hacia abajo\" indica una reducción en el valor, no un aumento."
          },
          {
            "t": "D) (7, 3)",
            "ok": false,
            "fb": "Tu movimiento vertical es correcto. Pero un desplazamiento \"a la izquierda\" debe reducir tu posición en el eje X, no alejarla hacia valores más positivos."
          }
        ],
        "img": "img/quiz/T1D/q15.png"
      },
      {
        "id": "T1D16",
        "q": "Los puntos A(2, 3), B(5, 7) y C(8, 11) están alineados. ¿Cuál de los siguientes puntos también está en la misma recta?",
        "opts": [
          {
            "t": "A) (11, 15)",
            "ok": true
          },
          {
            "t": "B) (4, 6)",
            "ok": false,
            "fb": "Para que varios puntos pertenezcan a la misma recta, la pendiente entre cualquier par de ellos debe ser idéntica. Calcula la razón de cambio y comprueba si este punto encaja."
          },
          {
            "t": "C) (6, 9)",
            "ok": false,
            "fb": "Calcula la pendiente entre los puntos que ya conoces de la recta. Luego, verifica si al intentar llegar a este nuevo punto se mantiene la misma inclinación exacta."
          },
          {
            "t": "D) (10, 14)",
            "ok": false,
            "fb": "Intenta establecer la ecuación de la recta o sigue el \"patrón\" de incrementos regulares. Este punto se desvía ligeramente de la trayectoria trazada."
          }
        ],
        "img": "img/quiz/T1D/q16.png"
      },
      {
        "id": "T1D17",
        "q": "El punto P(x, y) está en el primer cuadrante y cumple que su distancia al eje X es el doble de su distancia al eje Y. Si su distancia al origen es √20, ¿cuáles son sus coordenadas?",
        "opts": [
          {
            "t": "A) (2, 4)",
            "ok": true
          },
          {
            "t": "B) (4, 2)",
            "ok": false,
            "fb": "La distancia al eje X está representada por el valor de la coordenada vertical (y). Revisa el enunciado: esa distancia debe ser el doble que la distancia al eje Y. Has invertido los valores."
          },
          {
            "t": "C) (3, 6)",
            "ok": false,
            "fb": "Este punto cumple con la proporción correcta entre sus coordenadas. Sin embargo, si calculas su distancia total al origen usando el Teorema de Pitágoras, el valor sobrepasa lo solicitado."
          },
          {
            "t": "D) (1, 2)",
            "ok": false,
            "fb": "Aunque la relación de doble distancia es correcta aquí, si analizas su posición real, este punto se encuentra más cerca del origen de lo que indica el problema."
          }
        ]
      },
      {
        "id": "T1D18",
        "q": "La recta que pasa por los puntos (2, 1) y (5, 7) corta al eje Y en un punto. ¿Cuáles son las coordenadas de ese punto?",
        "opts": [
          {
            "t": "A) (0, -3)",
            "ok": true
          },
          {
            "t": "B) (0, 3)",
            "ok": false,
            "fb": "Verifica el signo de tu ecuación final. Después de encontrar la pendiente de la recta, asegúrate de respetar las leyes de los signos al despejar para encontrar la intersección con el eje Y."
          },
          {
            "t": "C) (0, -5)",
            "ok": false,
            "fb": "Revisa cómo calculaste la inclinación de la recta (la diferencia vertical entre la diferencia horizontal) y qué punto utilizaste como referencia para proyectar la línea hasta cortar el eje."
          },
          {
            "t": "D) (0, 5)",
            "ok": false,
            "fb": "Este resultado sería correcto si la pendiente de la recta fuera distinta o si hubieras cometido un error aritmético de suma al usar la fórmula de punto-pendiente."
          }
        ],
        "img": "img/quiz/T1D/q18.png"
      },
      {
        "id": "T1D19",
        "q": "Tres puntos A(1, 2), B(4, 5) y C(7, y) están alineados. ¿Cuál es el valor de y?",
        "opts": [
          {
            "t": "A) 8",
            "ok": true
          },
          {
            "t": "B) 9",
            "ok": false,
            "fb": "Estar alineados significa mantener exactamente la misma pendiente. Calcula primero la pendiente del tramo A-B, y asegúrate de que el salto hacia C mantenga el mismo ritmo."
          },
          {
            "t": "C) 10",
            "ok": false,
            "fb": "Observa el patrón: por cada unidad que avanzas a la derecha entre A y B, ¿cuánto subes? Aplica ese mismo crecimiento constante para llegar hasta el punto C."
          },
          {
            "t": "D) 11",
            "ok": false,
            "fb": "Esta elevación hace que la recta cambie de inclinación. Usa la pendiente constante del primer segmento para proyectar matemáticamente a qué altura debe estar el punto cuando alcanza el valor 7 horizontal."
          }
        ]
      },
      {
        "id": "T1D20",
        "q": "La distancia entre los puntos (k, 3) y (4, k) es √10. ¿Cuáles son los posibles valores de k?",
        "opts": [
          {
            "t": "A) 2 o 4",
            "ok": false,
            "fb": "Haz la prueba sustituyendo estos números en la fórmula original de distancia. Verás que no se logra el resultado pedido. Revisa cuidadosamente la factorización de tu polinomio."
          },
          {
            "t": "B) 3 o 5",
            "ok": false,
            "fb": "Si usaras estos valores, los puntos estarían alineados paralelos a los ejes, lo que no generaría la diagonal solicitada. Un ligero error en los coeficientes pudo desviar tu respuesta."
          },
          {
            "t": "C) 1 o 3",
            "ok": false,
            "fb": "Verifica el desarrollo de todos tus binomios al cuadrado. Al agrupar términos semejantes para aplicar la fórmula cuadrática, asegúrate de no haber perdido ningún número por el camino."
          },
          {
            "t": "D) 2 o 5",
            "ok": true
          }
        ]
      },
      {
        "id": "T1D21",
        "q": "¿Cuál es el punto sobre el eje X que está a la misma distancia de A(2, 3) que de B(6, 1)?",
        "opts": [
          {
            "t": "A) (5, 0)",
            "ok": false,
            "fb": "Calcula usando la fórmula de distancia desde este punto hacia A y luego hacia B. Te darás cuenta de que la balanza se inclina fuertemente hacia uno de ellos."
          },
          {
            "t": "B) (4, 0)",
            "ok": false,
            "fb": "Aunque a simple vista en un dibujo pueda parecer un candidato a punto medio, la geometría requiere cálculos precisos. Igualar las expresiones de distancia te revelará que no es equidistante."
          },
          {
            "t": "C) (3, 0)",
            "ok": true
          },
          {
            "t": "D) (2, 0)",
            "ok": false,
            "fb": "Este punto se alinea en el plano verticalmente con A, pero su trayecto hacia B es considerablemente más largo. Busca un equilibrio sobre el eje X."
          }
        ],
        "img": "img/quiz/T1D/q21.png"
      },
      {
        "id": "T1D22",
        "q": "¿Cuál es el punto más cercano al origen sobre la recta que pasa por (2, 0) y (0, 4)?",
        "opts": [
          {
            "t": "A) (1, 2)",
            "ok": false,
            "fb": "Este punto pertenece a la recta, pero calcula su distancia al origen usando el Teorema de Pitágoras (). ¿Hay algún otro punto en las opciones que resulte en un valor menor?"
          },
          {
            "t": "B) (0.8, 2.4)",
            "ok": false,
            "fb": "Verifica tu cálculo de la distancia. Aunque el punto cumple con la ecuación de la recta, al elevar al cuadrado sus coordenadas (), notarás que se aleja más del centro del plano que otros candidatos."
          },
          {
            "t": "C) (1.2, 1.6)",
            "ok": true
          },
          {
            "t": "D) (0.6, 2.8)",
            "ok": false,
            "fb": "Observa la posición de este punto. Al tener una coordenada vertical tan alta, su distancia total al origen aumenta considerablemente. Busca el punto que equilibre mejor ambas coordenadas para estar lo más cerca posible del (0,0)."
          }
        ],
        "img": "img/quiz/T1D/q22.png"
      },
      {
        "id": "T1D23",
        "q": "El área de un triángulo con vértices en (0,0), (4,0) y (0,3) es 6. Si se traslada el triángulo 2 unidades a la derecha y 1 hacia arriba, ¿cuál es el área del nuevo triángulo?",
        "opts": [
          {
            "t": "A) 6",
            "ok": true
          },
          {
            "t": "B) 8",
            "ok": false,
            "fb": "Las traslaciones son simplemente deslizamientos de una figura a otra zona del plano cartesiano. Reflexiona: ¿el simple hecho de mover algo de lugar cambia su tamaño o su área?"
          },
          {
            "t": "C) 10",
            "ok": false,
            "fb": "Parece que combinaste de forma incorrecta el área original con los valores de las coordenadas de la traslación. La forma geométrica mantiene sus proporciones intactas tras el movimiento."
          },
          {
            "t": "D) 12",
            "ok": false,
            "fb": "El área inicial se halla multiplicando base por altura y dividiendo el resultado. Un deslizamiento no escala la figura ni duplica mágicamente el espacio que ocupa."
          }
        ],
        "img": "img/quiz/T1D/q23.png"
      },
      {
        "id": "T1D24",
        "q": "¿Cuál de los siguientes puntos NO está a la misma distancia de (1, 2) que de (5, 4)?",
        "opts": [
          {
            "t": "A) (2, 5)",
            "ok": false,
            "fb": "Prueba a calcular la distancia de este punto hacia (1, 2) y luego hacia (5, 4). Si ambas distancias resultan ser iguales, entonces este punto sí cumple la condición y no es el que buscas."
          },
          {
            "t": "B) (5, -1)",
            "ok": false,
            "fb": "Sustituye estas coordenadas en la ecuación de la mediatriz (2x + y = 9). ¿Se mantiene la igualdad? Si el resultado es exactamente 9, significa que el punto está a la misma distancia de ambos extremos."
          },
          {
            "t": "C) (1, 7)",
            "ok": false,
            "fb": "Este punto se encuentra justo en la trayectoria donde las distancias hacia (1, 2) y (5, 4) se cancelan entre sí. Recuerda que el problema te pide identificar específicamente cuál de las opciones rompe esa regla de igualdad."
          },
          {
            "t": "D) (3, 6)",
            "ok": true
          }
        ],
        "img": "img/quiz/T1D/q24.png"
      },
      {
        "id": "T1D25",
        "q": "TecDuck debe ir desde el origen hasta el punto (8, 6), pero solo puede moverse horizontal y verticalmente. ¿Cuál es la longitud del camino más corto que puede tomar?",
        "opts": [
          {
            "t": "A) 10",
            "ok": false,
            "fb": "Este valor representa la medición de la trayectoria en línea recta o diagonal. Vuelve a leer el enunciado: TecDuck tiene una restricción específica sobre cómo puede volar."
          },
          {
            "t": "B) 14",
            "ok": true
          },
          {
            "t": "C) 48",
            "ok": false,
            "fb": "Parece que multiplicaste las dimensiones del plano. Para calcular la longitud total de un recorrido escalonado o en forma de \"L\", reflexiona sobre qué operación matemática te permite juntar los segmentos."
          },
          {
            "t": "D) 100",
            "ok": false,
            "fb": "Obtuviste la suma de los cuadrados. Este es un paso intermedio para sacar distancias diagonales usando Pitágoras, pero aquí el recorrido exige sumar pasos directos."
          }
        ],
        "img": "img/quiz/T1D/q25.png"
      }
    ]
  },
  "2": {
    "facil": [
      {
        "id": "T2F01",
        "q": "Un vector se representa gráficamente como:",
        "opts": [
          {
            "t": "A) Un punto",
            "ok": false,
            "fb": "Considera que un punto solo indica una ubicación fija. ¿Cómo podrías mostrar que hay un movimiento o una fuerza aplicada hacia algún lugar?"
          },
          {
            "t": "B) Una flecha",
            "ok": true
          },
          {
            "t": "C) Una línea recta sin dirección",
            "ok": false,
            "fb": "Si dibujas solo una línea, sabemos \"cuánto\" mide, pero ¿cómo sabríamos hacia qué lado se dirige el desplazamiento?"
          },
          {
            "t": "D) Un círculo",
            "ok": false,
            "fb": "Las figuras cerradas no suelen indicar trayectoria o sentido. Piensa en qué símbolo universal se usa para \"señalar\" un camino."
          }
        ]
      },
      {
        "id": "T2F02",
        "q": "¿Qué elementos necesita un vector para quedar completamente definido?",
        "opts": [
          {
            "t": "A) Solo su magnitud",
            "ok": false,
            "fb": "Si solo conoces el tamaño (magnitud), tendrías un número, pero no sabrías si el objeto se mueve al norte o al sur."
          },
          {
            "t": "B) Solo su dirección",
            "ok": false,
            "fb": "Conocer la dirección te dice hacia dónde apunta, pero ¿sabes qué tan largo es el recorrido?"
          },
          {
            "t": "C) Magnitud y dirección",
            "ok": true
          },
          {
            "t": "D) Su punto de inicio solamente",
            "ok": false,
            "fb": "El punto de inicio ayuda a ubicarlo, pero recuerda que un vector representa un desplazamiento que puede ocurrir en cualquier parte del plano y seguir siendo el mismo."
          }
        ]
      },
      {
        "id": "T2F03",
        "q": "¿Qué indica la dirección de un vector?",
        "opts": [
          {
            "t": "A) Su longitud",
            "ok": false,
            "fb": "Revisa tus conceptos. La longitud tiene que ver con el \"tamaño\" o \"fuerza\", no con la inclinación del trayecto."
          },
          {
            "t": "B) Hacia dónde apunta",
            "ok": true
          },
          {
            "t": "C) Su punto de inicio",
            "ok": false,
            "fb": "Confundiste el \"dónde empieza\" con el \"hacia dónde va\". La dirección es una propiedad de la trayectoria, no del origen."
          },
          {
            "t": "D) Su color en la gráfica",
            "ok": false,
            "fb": "El color es un apoyo visual para distinguir un vector de otro, pero no define su comportamiento matemático."
          }
        ]
      },
      {
        "id": "T2F04",
        "q": "¿Qué nombre recibe la longitud de un vector?",
        "opts": [
          {
            "t": "A) Dirección",
            "ok": false,
            "fb": "La dirección es el ángulo o la recta sobre la que descansa el vector, no la medida de su extensión."
          },
          {
            "t": "B) Magnitud o norma",
            "ok": true
          },
          {
            "t": "C) Componente",
            "ok": false,
            "fb": "Las componentes son como las \"instrucciones\" (pasos en x e y) para construir el vector, no su largo total."
          },
          {
            "t": "D) Sentido",
            "ok": false,
            "fb": "El sentido te dice si vas de A hacia B o de B hacia A, pero no cuánta distancia hay entre ellos."
          }
        ]
      },
      {
        "id": "T2F05",
        "q": "El vector v = (3, 2) comienza en el origen (0, 0). ¿En qué punto termina?",
        "opts": [
          {
            "t": "A) (3, 2)",
            "ok": true
          },
          {
            "t": "B) (2, 3)",
            "ok": false,
            "fb": "¡Cuidado con el orden! En un par ordenado (x, y), la primera cifra siempre es el avance horizontal. ¿Seguro que no los intercambiaste?"
          },
          {
            "t": "C) (3, 0)",
            "ok": false,
            "fb": "Observa el vector (3, 2). Al elegir esta opción, estás ignorando por completo el movimiento hacia \"arriba\" o \"abajo\"."
          },
          {
            "t": "D) (0, 2)",
            "ok": false,
            "fb": "Aquí solo consideraste la altura, pero el vector indica que también hubo un desplazamiento hacia los lados."
          }
        ]
      },
      {
        "id": "T2F06",
        "q": "Un vector que comienza en (1, 1) y termina en (4, 5) tiene componentes:",
        "opts": [
          {
            "t": "A) (3, 4)",
            "ok": true
          },
          {
            "t": "B) (5, 6)",
            "ok": false,
            "fb": "Parece que sumaste los valores de los puntos. Recuerda que para hallar el desplazamiento (vector), debes encontrar la diferencia entre el final y el inicio."
          },
          {
            "t": "C) (4, 5)",
            "ok": false,
            "fb": "Esta opción solo menciona dónde terminó el viaje, pero no describe el trayecto realizado desde el punto (1, 1)."
          },
          {
            "t": "D) (1, 1)",
            "ok": false,
            "fb": "Elegiste el punto de partida. ¿Qué operación te permitiría saber cuánto avanzó realmente?"
          }
        ],
        "img": "img/quiz/T2F/q06.png"
      },
      {
        "id": "T2F07",
        "q": "¿Qué vector es horizontal?",
        "opts": [
          {
            "t": "A) (0, 4)",
            "ok": false,
            "fb": "Si la componente x es cero, significa que no hay movimiento lateral. ¿Cómo llamamos a una línea que solo sube o baja?"
          },
          {
            "t": "B) (4, 0)",
            "ok": true
          },
          {
            "t": "C) (3, 3)",
            "ok": false,
            "fb": "Al tener valores en ambos ejes, el vector se inclina. Busca aquel donde la \"altura\" (y) no cambie."
          },
          {
            "t": "D) (-2, -2)",
            "ok": false,
            "fb": "Similar a la anterior, este vector se mueve tanto a la izquierda como hacia abajo. No es una línea plana sobre el horizonte."
          }
        ]
      },
      {
        "id": "T2F08",
        "q": "¿Qué vector es vertical?",
        "opts": [
          {
            "t": "A) (5, 0)",
            "ok": false,
            "fb": "Este vector tiene toda su fuerza en el eje horizontal. Para que sea vertical, la componente x debería ser nula."
          },
          {
            "t": "B) (0, -5)",
            "ok": true
          },
          {
            "t": "C) (3, 2)",
            "ok": false,
            "fb": "Observa que hay desplazamiento en ambos ejes. Eso lo convierte en una diagonal."
          },
          {
            "t": "D) (-4, 4)",
            "ok": false,
            "fb": "Aunque se mueve hacia arriba, también se desplaza hacia la izquierda. Busca uno que sea puramente \"arriba\" o \"abajo\"."
          }
        ]
      },
      {
        "id": "T2F09",
        "q": "¿Cuál es la magnitud del vector (3, 0)?",
        "opts": [
          {
            "t": "A) 0",
            "ok": false,
            "fb": "Una magnitud de 0 significaría que no hubo movimiento. Aquí avanzamos 3 unidades en el eje X."
          },
          {
            "t": "B) 3",
            "ok": true
          },
          {
            "t": "C) √3",
            "ok": false,
            "fb": "¿Aplicaste la raíz cuadrada al valor final? Recuerda que  para (3, 0) es simplemente la raíz de ."
          },
          {
            "t": "D) 9",
            "ok": false,
            "fb": "Olvidaste el último paso del Teorema de Pitágoras. El valor 9 es el cuadrado de la distancia, no la distancia real."
          }
        ],
        "img": "img/quiz/T2F/q09.png"
      },
      {
        "id": "T2F10",
        "q": "¿Cuál es la magnitud del vector (1, 1)?",
        "opts": [
          {
            "t": "A) 1",
            "ok": false,
            "fb": "Elegir 1 significa que ignoraste una de las dos dimensiones. Un camino que avanza en dos direcciones siempre será más largo que sus partes individuales."
          },
          {
            "t": "B) √2",
            "ok": true
          },
          {
            "t": "C) 2",
            "ok": false,
            "fb": "Sumar 1 + 1 es un error común. Visualiza el triángulo: la hipotenusa no es igual a la suma de los catetos. Usa Pitágoras."
          },
          {
            "t": "D) 0",
            "ok": false,
            "fb": "El vector (1, 1) claramente tiene una longitud física en el plano; no puede ser nulo."
          }
        ],
        "img": "img/quiz/T2F/q10.png"
      },
      {
        "id": "T2F11",
        "q": "Las componentes de un vector representan:",
        "opts": [
          {
            "t": "A) El punto donde termina",
            "ok": false,
            "fb": "Las componentes nos dicen cuánto nos movimos. Si el punto inicial no es (0,0), el punto final será muy distinto a las componentes."
          },
          {
            "t": "B) Cuánto se desplaza en x y en y",
            "ok": true
          },
          {
            "t": "C) La dirección solamente",
            "ok": false,
            "fb": "Si solo dieran la dirección, no sabríamos si el vector mide 1 o 100 unidades."
          },
          {
            "t": "D) El color del vector",
            "ok": false,
            "fb": "Las matemáticas de los vectores se basan en coordenadas, no en atributos estéticos."
          }
        ]
      },
      {
        "id": "T2F12",
        "q": "Un vector con componentes (a, b) tiene magnitud:",
        "opts": [
          {
            "t": "A) a + b",
            "ok": false,
            "fb": "La distancia más corta entre dos puntos es una línea recta, no la suma de los caminos laterales. Piensa en geometría triangular."
          },
          {
            "t": "B) √(a² + b²)",
            "ok": true
          },
          {
            "t": "C) a × b",
            "ok": false,
            "fb": "Multiplicar las dimensiones no tiene sentido físico para medir una longitud."
          },
          {
            "t": "D) |a| + |b|",
            "ok": false,
            "fb": "Sumar valores absolutos te da una distancia recorrida en \"bloques\", pero no la línea diagonal directa (magnitud euclidiana)."
          }
        ]
      },
      {
        "id": "T2F13",
        "q": "¿Qué vector tiene dirección diagonal (45°)?",
        "opts": [
          {
            "t": "A) (3, 0)",
            "ok": false,
            "fb": "Para que sea diagonal, el movimiento debe estar repartido. Aquí solo hay avance en el eje horizontal."
          },
          {
            "t": "B) (0, 4)",
            "ok": false,
            "fb": "Este vector es puramente vertical. Busca uno donde el avance en \"x\" sea igual al avance en \"y\"."
          },
          {
            "t": "C) (2, 2)",
            "ok": true
          },
          {
            "t": "D) (-3, 0)",
            "ok": false,
            "fb": "Aunque apunta en sentido contrario al primero, sigue siendo una línea horizontal sobre el eje."
          }
        ]
      },
      {
        "id": "T2F14",
        "q": "Si un vector es (0, -5), ¿hacia dónde apunta?",
        "opts": [
          {
            "t": "A) Arriba",
            "ok": false,
            "fb": "Si la componente \"y\" es negativa, ¿cómo podría estar subiendo?"
          },
          {
            "t": "B) Abajo",
            "ok": true
          },
          {
            "t": "C) Derecha",
            "ok": false,
            "fb": "Para ir a la derecha, necesitarías que la primera componente (x) fuera positiva y la segunda (y) fuera cero."
          },
          {
            "t": "D) Izquierda",
            "ok": false,
            "fb": "Izquierda implicaría un valor negativo en la primera posición del paréntesis."
          }
        ]
      },
      {
        "id": "T2F15",
        "q": "El vector opuesto a (2, -3) es:",
        "opts": [
          {
            "t": "A) (-2, 3)",
            "ok": true
          },
          {
            "t": "B) (2, 3)",
            "ok": false,
            "fb": "Solo cambiaste la dirección vertical. El opuesto debe ser como un espejo total: si uno va a la derecha y abajo, el otro debe ir a..."
          },
          {
            "t": "C) (-2, -3)",
            "ok": false,
            "fb": "Aquí solo invertiste el eje horizontal. Recuerda que el opuesto es (-x, -y)."
          },
          {
            "t": "D) (3, -2)",
            "ok": false,
            "fb": "Intercambiar los números cambia la inclinación del vector, no lo hace \"opuesto\"."
          }
        ],
        "img": "img/quiz/T2F/q15.png"
      },
      {
        "id": "T2F16",
        "q": "Dos vectores son iguales si:",
        "opts": [
          {
            "t": "A) Tienen la misma magnitud",
            "ok": false,
            "fb": "Imagina un vector de 5 unidades al norte y otro de 5 al este. Tienen el mismo tamaño, pero ¿te llevan al mismo lugar?"
          },
          {
            "t": "B) Tienen la misma dirección",
            "ok": false,
            "fb": "Si dos personas caminan hacia el norte, pero una camina 1 km y la otra 10 km, ¿sus desplazamientos son iguales?"
          },
          {
            "t": "C) Tienen las mismas componentes",
            "ok": true
          },
          {
            "t": "D) Empiezan en el mismo punto",
            "ok": false,
            "fb": "El lugar donde empieza un vector no lo define. Dos flechas idénticas en diferentes partes del papel representan el mismo vector."
          }
        ]
      },
      {
        "id": "T2F17",
        "q": "El vector que va del punto A(2, 3) al punto B(5, 7) es:",
        "opts": [
          {
            "t": "A) (2, 3)",
            "ok": false,
            "fb": "Ese es solo el origen del movimiento. Un vector debe expresar cuánto cambió la posición."
          },
          {
            "t": "B) (5, 7)",
            "ok": false,
            "fb": "Ese es el destino. ¿Qué operación matemática te permite saber el \"salto\" que hubo entre el inicio y el fin?"
          },
          {
            "t": "C) (3, 4)",
            "ok": true
          },
          {
            "t": "D) (7, 10)",
            "ok": false,
            "fb": "Al sumar las coordenadas, obtienes un punto alejado, no el desplazamiento relativo entre A y B."
          }
        ],
        "img": "img/quiz/T2F/q17.png"
      },
      {
        "id": "T2F18",
        "q": "¿Cuál es la magnitud del vector (-3, 4)?",
        "opts": [
          {
            "t": "A) 5",
            "ok": true
          },
          {
            "t": "B) 7",
            "ok": false,
            "fb": "Sumar 3 + 4 ignora que los movimientos son perpendiculares. Aplica la fórmula de la hipotenusa."
          },
          {
            "t": "C) 1",
            "ok": false,
            "fb": "Un vector con componentes tan grandes no puede medir solo 1. Revisa tu cálculo de ."
          },
          {
            "t": "D) 25",
            "ok": false,
            "fb": "Te detuviste antes de tiempo. El número 25 es el área del cuadrado formado, ahora falta obtener su lado (raíz)."
          }
        ],
        "img": "img/quiz/T2F/q18.png"
      },
      {
        "id": "T2F19",
        "q": "Un vector con magnitud 5 y dirección horizontal hacia la derecha puede ser:",
        "opts": [
          {
            "t": "A) (5, 0)",
            "ok": true
          },
          {
            "t": "B) (0, 5)",
            "ok": false,
            "fb": "Este mide 5, pero su dirección es vertical (hacia arriba). El problema pide uno horizontal."
          },
          {
            "t": "C) (3, 4)",
            "ok": false,
            "fb": "Aunque mide 5, su trayectoria es inclinada. Busca uno que no tenga \"altura\" (componente y = 0)."
          },
          {
            "t": "D) (-5, 0)",
            "ok": false,
            "fb": "Este va en la dirección correcta (horizontal), pero el sentido es hacia la izquierda."
          }
        ]
      },
      {
        "id": "T2F20",
        "q": "¿Qué vector tiene la misma dirección que (1, 2)?",
        "opts": [
          {
            "t": "A) (2, 4)",
            "ok": true
          },
          {
            "t": "B) (2, 1)",
            "ok": false,
            "fb": "Intercambiar los valores cambia la pendiente. Compara: ¿es lo mismo subir 2 gradas por cada paso que dar 2 pasos por cada grada?"
          },
          {
            "t": "C) (-1, -2)",
            "ok": false,
            "fb": "Este vector es paralelo, pero apunta exactamente al revés. El problema busca la misma dirección y sentido."
          },
          {
            "t": "D) (1, -2)",
            "ok": false,
            "fb": "Al cambiar el signo de solo una componente, el vector ahora apunta hacia abajo, cambiando su ángulo."
          }
        ],
        "img": "img/quiz/T2F/q20.png"
      },
      {
        "id": "T2F21",
        "q": "Un vector unitario es aquel que:",
        "opts": [
          {
            "t": "A) Tiene magnitud 1",
            "ok": true
          },
          {
            "t": "B) Tiene componentes (1,1)",
            "ok": false,
            "fb": "Calcula la magnitud de (1, 1). Si el resultado es √(2), ¿puede ser unitario?"
          },
          {
            "t": "C) Empieza en el origen",
            "ok": false,
            "fb": "Estar en el origen es una cuestión de ubicación, no de tamaño."
          },
          {
            "t": "D) Tiene dirección horizontal",
            "ok": false,
            "fb": "No hay restricciones de ángulo para los vectores unitarios; pueden apuntar hacia cualquier lado."
          }
        ]
      },
      {
        "id": "T2F22",
        "q": "El vector unitario en la dirección de (3, 0) es:",
        "opts": [
          {
            "t": "A) (1, 0)",
            "ok": true
          },
          {
            "t": "B) (3, 0)",
            "ok": false,
            "fb": "Este vector mide 3 unidades. Para hacerlo unitario, necesitas \"encogerlo\" hasta que mida 1."
          },
          {
            "t": "C) (0, 1)",
            "ok": false,
            "fb": "Aunque mide 1, cambiaste la dirección de horizontal a vertical."
          },
          {
            "t": "D) (1/3, 0)",
            "ok": false,
            "fb": "Si divides una componente de 3 entre 9, obtienes 1/3. ¿Seguro que dividiste por la magnitud correcta?"
          }
        ]
      },
      {
        "id": "T2F23",
        "q": "La magnitud de un vector siempre es:",
        "opts": [
          {
            "t": "A) Un número negativo",
            "ok": false,
            "fb": "¿Puede una distancia física ser menor que cero? La magnitud siempre mide \"cuánto\", y eso no puede ser negativo."
          },
          {
            "t": "B) Un número positivo o cero",
            "ok": true
          },
          {
            "t": "C) Un número complejo",
            "ok": false,
            "fb": "En el nivel básico, trabajamos con distancias reales. Los números complejos no se usan para medir largos de vectores simples."
          },
          {
            "t": "D) Un vector",
            "ok": false,
            "fb": "Confundiste el objeto (vector) con su medida (magnitud). La magnitud es solo el número que nos dice el tamaño."
          }
        ]
      },
      {
        "id": "T2F24",
        "q": "Si un vector tiene componentes (a, b) y a = 0, b ≠ 0, el vector es:",
        "opts": [
          {
            "t": "A) Horizontal",
            "ok": false,
            "fb": "Si no hay avance en el eje X, el vector no puede ser horizontal."
          },
          {
            "t": "B) Vertical",
            "ok": true
          },
          {
            "t": "C) Diagonal",
            "ok": false,
            "fb": "Para ser diagonal, necesitarías moverte un poco en ambos ejes (que a y b no sean cero)."
          },
          {
            "t": "D) Nulo",
            "ok": false,
            "fb": "Para que sea nulo, la componente b también tendría que ser cero."
          }
        ]
      },
      {
        "id": "T2F25",
        "q": "Si un vector tiene componentes (a, b) y b = 0, a ≠ 0, el vector es:",
        "opts": [
          {
            "t": "A) Horizontal",
            "ok": true
          },
          {
            "t": "B) Vertical",
            "ok": false,
            "fb": "Si no hay altura (b = 0), el vector no puede subir ni bajar."
          },
          {
            "t": "C) Diagonal",
            "ok": false,
            "fb": "Si una de las dos \"instrucciones\" es cero, el movimiento es recto sobre un eje, nunca inclinado."
          },
          {
            "t": "D) Nulo",
            "ok": false,
            "fb": "Como a es distinto de cero, el vector sí tiene una longitud. No es un punto vacío."
          }
        ]
      },
      {
        "id": "T2F26",
        "q": "¿Cuál es la magnitud del vector (0, 0)?",
        "opts": [
          {
            "t": "A) 0",
            "ok": true
          },
          {
            "t": "B) 1",
            "ok": false,
            "fb": "Un vector unitario mide 1. El vector (0, 0) representa la ausencia total de movimiento."
          },
          {
            "t": "C) No tiene magnitud",
            "ok": false,
            "fb": "Sí la tiene, y es un valor numérico muy específico que representa que no hay distancia."
          },
          {
            "t": "D) Infinito",
            "ok": false,
            "fb": "La infinitud implicaría una flecha que nunca termina, todo lo contrario al vector nulo."
          }
        ],
        "img": "img/quiz/T2F/q26.png"
      },
      {
        "id": "T2F27",
        "q": "El vector que va de (1, 2) a (1, 2) es:",
        "opts": [
          {
            "t": "A) (0, 0)",
            "ok": true
          },
          {
            "t": "B) (1, 2)",
            "ok": false,
            "fb": "Este es el punto de ubicación. El vector de desplazamiento debe indicar cuánto te moviste para ir de un lugar... al mismo lugar."
          },
          {
            "t": "C) (2, 4)",
            "ok": false,
            "fb": "Sumar las coordenadas no te da el desplazamiento. Piensa en la resta: punto final - punto inicial."
          },
          {
            "t": "D) No existe",
            "ok": false,
            "fb": "Sí existe en matemáticas y es fundamental para representar el reposo."
          }
        ],
        "img": "img/quiz/T2F/q27.png"
      },
      {
        "id": "T2F28",
        "q": "¿Qué vector es perpendicular a (0, 1)?",
        "opts": [
          {
            "t": "A) (1, 0)",
            "ok": true
          },
          {
            "t": "B) (0, -1)",
            "ok": false,
            "fb": "Este vector va hacia abajo, mientras que (0, 1) va hacia arriba. Son opuestos (paralelos), no perpendiculares."
          },
          {
            "t": "C) (1, 1)",
            "ok": false,
            "fb": "Prueba el producto punto. Si no da cero, el ángulo entre ellos no es de 90 grados."
          },
          {
            "t": "D) (0, 2)",
            "ok": false,
            "fb": "Este es el doble de largo, pero sigue apuntando en la misma dirección vertical."
          }
        ],
        "img": "img/quiz/T2F/q28.png"
      },
      {
        "id": "T2F29",
        "q": "¿Qué vector es paralelo a (2, 3)?",
        "opts": [
          {
            "t": "A) (4, 6)",
            "ok": true
          },
          {
            "t": "B) (3, 2)",
            "ok": false,
            "fb": "Intercambiar componentes cambia la inclinación. Un vector paralelo debe mantener la misma \"proporción\" (como una fracción equivalente)."
          },
          {
            "t": "C) (2, -3)",
            "ok": false,
            "fb": "Cambiar un signo inclina el vector hacia el otro lado del eje. Ya no viajarían en vías de tren paralelas."
          },
          {
            "t": "D) (-2, 3)",
            "ok": false,
            "fb": "Similar a la anterior, este apunta en una dirección que cruza a la original."
          }
        ],
        "img": "img/quiz/T2F/q29.png"
      },
      {
        "id": "T2F30",
        "q": "La dirección de un vector con componentes iguales (a, a) con a > 0 es:",
        "opts": [
          {
            "t": "A) 0°",
            "ok": false,
            "fb": "Si la dirección fuera 0°, la componente \"y\" tendría que ser cero."
          },
          {
            "t": "B) 45°",
            "ok": true
          },
          {
            "t": "C) 90°",
            "ok": false,
            "fb": "90° significaría que no hay avance horizontal (a = 0)."
          },
          {
            "t": "D) 135°",
            "ok": false,
            "fb": "Para estar en este ángulo, una de las componentes tendría que ser negativa."
          }
        ]
      },
      {
        "id": "T2F31",
        "q": "TecDuck vuela 3 km al este y 4 km al norte. El vector que representa su desplazamiento es:",
        "opts": [
          {
            "t": "A) (3, 4)",
            "ok": true
          },
          {
            "t": "B) (4, 3)",
            "ok": false,
            "fb": "Revisa el enunciado: \"3 al este\" es el eje horizontal (x) y \"4 al norte\" es el vertical (y)."
          },
          {
            "t": "C) (3, 0)",
            "ok": false,
            "fb": "Aquí olvidaste que TecDuck también voló hacia el norte después de ir al este."
          },
          {
            "t": "D) (0, 4)",
            "ok": false,
            "fb": "Elegiste solo el segundo movimiento, ignorando el primer tramo del viaje."
          }
        ]
      },
      {
        "id": "T2F32",
        "q": "Si TecDuck vuela el vector (-3, -4) desde dónde el punto (3, 4) ¿dónde termina respecto al origen?",
        "opts": [
          {
            "t": "A) En el origen (0, 0)",
            "ok": true
          },
          {
            "t": "B) En (3, 4)",
            "ok": false,
            "fb": "Si TecDuck estaba en (3, 4) y se movió con el vector (-3, -4), es imposible que se haya quedado quieto."
          },
          {
            "t": "C) En (-3, -4)",
            "ok": false,
            "fb": "Ese es el vector de movimiento, no su posición final. Suma (-3, -4) a su ubicación actual (3, 4)."
          },
          {
            "t": "D) En (6, 8)",
            "ok": false,
            "fb": "Parece que sumaste los valores absolutos. Si estás en la posición 3 y retrocedes 3, ¿llegas a 6 o a otro número?"
          }
        ],
        "img": "img/quiz/T2F/q32.png"
      },
      {
        "id": "T2F33",
        "q": "La distancia total que recorrió TecDuck en los dos vuelos (preguntas 31 y 32) es:",
        "opts": [
          {
            "t": "A) 5 km",
            "ok": false,
            "fb": "Este valor es el desplazamiento de una sola etapa. TecDuck hizo dos viajes de la misma longitud."
          },
          {
            "t": "B) 10 km",
            "ok": true
          },
          {
            "t": "C) 14 km",
            "ok": false,
            "fb": "Probablemente sumaste las componentes (3 + 4 + 3 + 4). Recuerda que la distancia de cada tramo es la hipotenusa ."
          },
          {
            "t": "D) 0 km",
            "ok": false,
            "fb": "Aunque regresó al punto de partida (desplazamiento nulo), sus alas sí trabajaron. El total recorrido no puede ser cero."
          }
        ]
      },
      {
        "id": "T2F34",
        "q": "Un vector con magnitud 10 y dirección suroeste (45° entre sur y oeste) tiene componentes aproximadamente:",
        "opts": [
          {
            "t": "A) (7.07, -7.07)",
            "ok": false,
            "fb": "Si el valor en x es positivo, TecDuck se está moviendo hacia el este. El suroeste requiere ir al oeste."
          },
          {
            "t": "B) (-7.07, -7.07)",
            "ok": true
          },
          {
            "t": "C) (-7.07, 7.07)",
            "ok": false,
            "fb": "Una componente y positiva indica movimiento al norte. Revisa los signos para el sur."
          },
          {
            "t": "D) (7.07, 7.07)",
            "ok": false,
            "fb": "Aquí ambas componentes son positivas, lo que apunta al noreste."
          }
        ]
      },
      {
        "id": "T2F35",
        "q": "Si un vector tiene componentes (a, b) y a es negativo, b es positivo, ¿hacia qué dirección apunta aproximadamente?",
        "opts": [
          {
            "t": "A) Noreste",
            "ok": false,
            "fb": "Para ir al noreste, TecDuck necesitaría que tanto el avance horizontal como el vertical fueran positivos."
          },
          {
            "t": "B) Noroeste",
            "ok": true
          },
          {
            "t": "C) Sureste",
            "ok": false,
            "fb": "El sureste implica avanzar a la derecha (positivo) y bajar (negativo)."
          },
          {
            "t": "D) Suroeste",
            "ok": false,
            "fb": "En el suroeste, ambos valores (x e y) deben ser negativos."
          }
        ]
      },
      {
        "id": "T2F36",
        "q": "La suma de dos vectores perpendiculares de magnitudes 3 y 4 tiene magnitud:",
        "opts": [
          {
            "t": "A) 5",
            "ok": true
          },
          {
            "t": "B) 7",
            "ok": false,
            "fb": "No sumes las magnitudes como si fueran números simples. Si los vectores forman un ángulo de 90°, debes usar el Teorema de Pitágoras."
          },
          {
            "t": "C) 12",
            "ok": false,
            "fb": "Multiplicar las magnitudes no tiene una interpretación física en la suma de vectores."
          },
          {
            "t": "D) 1",
            "ok": false,
            "fb": "El valor 1 resultaría si los vectores fueran opuestos (4 - 3), no perpendiculares."
          }
        ]
      },
      {
        "id": "T2F37",
        "q": "El vector (3, 4) y el vector (6, 8) son:",
        "opts": [
          {
            "t": "A) Perpendiculares",
            "ok": false,
            "fb": "Prueba el producto punto. Si no es cero, no pueden ser perpendiculares."
          },
          {
            "t": "B) Paralelos (misma dirección)",
            "ok": true
          },
          {
            "t": "C) Opuestos",
            "ok": false,
            "fb": "Los vectores opuestos tienen signos contrarios. Estos tienen exactamente el mismo signo y proporción."
          },
          {
            "t": "D) No relacionados",
            "ok": false,
            "fb": "Observa bien: ¿qué pasa si multiplicas el primer vector por 2?"
          }
        ]
      },
      {
        "id": "T2F38",
        "q": "La dirección del vector (0, -1) es:",
        "opts": [
          {
            "t": "A) 0°",
            "ok": false,
            "fb": "El ángulo 0° apunta a la derecha (eje X positivo)."
          },
          {
            "t": "B) 90°",
            "ok": false,
            "fb": "90° es la dirección hacia arriba (eje Y positivo)."
          },
          {
            "t": "C) 180°",
            "ok": false,
            "fb": "180° apunta hacia la izquierda (eje X negativo)."
          },
          {
            "t": "D) 270°",
            "ok": true
          }
        ],
        "img": "img/quiz/T2F/q38.png"
      },
      {
        "id": "T2F39",
        "q": "¿Cuál es el vector unitario en la dirección de (0, -5)?",
        "opts": [
          {
            "t": "A) (0, -1)",
            "ok": true
          },
          {
            "t": "B) (0, 1)",
            "ok": false,
            "fb": "Este vector mide 1, pero apunta hacia arriba. Necesitas uno que mantenga el sentido hacia abajo del original."
          },
          {
            "t": "C) (-1, 0)",
            "ok": false,
            "fb": "Cambiaste la dirección de vertical a horizontal (izquierda)."
          },
          {
            "t": "D) (1, 0)",
            "ok": false,
            "fb": "Similar al anterior, este apunta a la derecha."
          }
        ],
        "img": "img/quiz/T2F/q39.png"
      },
      {
        "id": "T2F40",
        "q": "Si un vector tiene magnitud 0, entonces:",
        "opts": [
          {
            "t": "A) Es el vector nulo",
            "ok": false,
            "fb": "Es una verdad parcial. Pero piensa: si no hay longitud, ¿podemos decir realmente hacia dónde apunta?"
          },
          {
            "t": "B) No existe",
            "ok": false,
            "fb": "El vector existe y es una herramienta matemática real, simplemente sus componentes son (0, 0)."
          },
          {
            "t": "C) Tiene dirección indefinida",
            "ok": false,
            "fb": "Es correcto, pero no es la única propiedad que define a este vector especial."
          },
          {
            "t": "D) A y C son correctas",
            "ok": true
          }
        ]
      }
    ],
    "dificil": [
      {
        "id": "T2D01",
        "q": "Un vector tiene magnitud 10 y su componente x es 6. Si el vector está en el primer cuadrante, ¿cuál es su componente y?",
        "opts": [
          {
            "t": "A) 4",
            "ok": false,
            "fb": "Parece que sumaste los números linealmente o tuviste un error al elevar al cuadrado. Recuerda que en un vector, sus componentes forman un triángulo rectángulo con la magnitud. Si la hipotenusa al cuadrado es 100, la suma de los catetos al cuadrado debe igualar ese valor."
          },
          {
            "t": "B) 8",
            "ok": true
          },
          {
            "t": "C) √136",
            "ok": false,
            "fb": "¡Sumaste los cuadrados en lugar de restarlos!. Recuerda que ya conoces la magnitud total (hipotenusa) y una de las componentes (un cateto), por lo que la fórmula requiere un despeje para encontrar el cateto faltante."
          },
          {
            "t": "D) 2",
            "ok": false,
            "fb": "El cuadrado de 2 es 4, y si lo sumas al cuadrado de 6 (36), no llegas a 100. Revisa tu despeje de la ecuación de magnitud: ."
          }
        ]
      },
      {
        "id": "T2D02",
        "q": "Un vector tiene magnitud 13 y su componente y es -5. Si el vector está en el cuarto cuadrante, ¿cuál es su componente x?",
        "opts": [
          {
            "t": "A) 12",
            "ok": true
          },
          {
            "t": "B) -12",
            "ok": false,
            "fb": "Calculaste el número perfectamente, pero ¡cuidado con los signos! El problema nos ubica en el cuarto cuadrante. Imagina el plano cartesiano: ¿qué signo le corresponde a la coordenada 'x' si te mueves hacia la derecha y hacia abajo?."
          },
          {
            "t": "C) √194",
            "ok": false,
            "fb": "En lugar de restar el cuadrado del cateto conocido a la hipotenusa, parece que los sumaste. ¡No estás buscando una nueva hipotenusa, sino un cateto!"
          },
          {
            "t": "D) 8",
            "ok": false,
            "fb": "Tal vez intentaste restar los valores directamente (13 - 5) sin aplicar potencias. El Teorema de Pitágoras no funciona sin elevar los valores al cuadrado primero."
          }
        ]
      },
      {
        "id": "T2D03",
        "q": "La dirección de un vector (medida desde el eje X positivo, en sentido antihorario) es 120°. Si su magnitud es 8, ¿cuáles son sus componentes aproximadas?",
        "opts": [
          {
            "t": "A) (4, 6.93)",
            "ok": false,
            "fb": "Obtuviste resultados positivos en ambas componentes. Un ángulo de 120° se abre más allá de los 90°, situando al vector en el segundo cuadrante. Piensa: ¿cómo es el movimiento horizontal en esa zona?"
          },
          {
            "t": "B) (-4, 6.93)",
            "ok": true
          },
          {
            "t": "C) (-4, -6.93)",
            "ok": false,
            "fb": "Al tener una componente 'y' negativa, estás indicando que el vector apunta hacia abajo (tercer o cuarto cuadrante). Revisa el signo de la función seno para ángulos entre 90° y 180°."
          },
          {
            "t": "D) (4, -6.93)",
            "ok": false,
            "fb": "Este vector apunta hacia el cuarto cuadrante. Asegúrate de evaluar el coseno de 120° para la coordenada 'x' y el seno de 120° para la coordenada 'y' respetando los signos."
          }
        ]
      },
      {
        "id": "T2D04",
        "q": "Un vector tiene componentes (5, 12). ¿Qué ángulo forma con el eje X positivo?",
        "opts": [
          {
            "t": "A) Aproximadamente 22.6°",
            "ok": false,
            "fb": "Invertiste la relación trigonométrica. Recuerda que para obtener el ángulo a partir de las componentes, se usa la tangente, que es el cateto opuesto ('y') dividido entre el cateto adyacente ('x')."
          },
          {
            "t": "B) Aproximadamente 67.4°",
            "ok": true
          },
          {
            "t": "C) Aproximadamente 112.6°",
            "ok": false,
            "fb": "Este ángulo sitúa al vector en el segundo cuadrante. Si observas tus componentes originales (5, 12), ambas son positivas. ¿En qué cuadrante ubicas valores positivos para 'x' e 'y'?"
          },
          {
            "t": "D) Aproximadamente 157.4°",
            "ok": false,
            "fb": "Un ángulo así indicaría que vas hacia la izquierda y hacia arriba o hacia el tercer cuadrante en sus cercanías. Revisa los signos iniciales del vector antes de aplicar la función inversa."
          }
        ],
        "img": "img/quiz/T2D/q04.png"
      },
      {
        "id": "T2D05",
        "q": "Un vector tiene dirección 30° y magnitud 10. Otro vector tiene dirección 120° y magnitud 10. ¿Cuál es el ángulo entre ellos?",
        "opts": [
          {
            "t": "A) 30°",
            "ok": false,
            "fb": "Esa es únicamente la dirección inicial de uno de los vectores. El problema busca determinar la abertura o distancia angular entre ambas flechas."
          },
          {
            "t": "B) 60°",
            "ok": false,
            "fb": "Parece que intentaste calcular el complemento de 30° o la diferencia con 90°. Si un vector está a 120° y otro a 30°, dibuja ambos partiendo del mismo punto y busca qué operación matemática te da el espacio en medio."
          },
          {
            "t": "C) 90°",
            "ok": true
          },
          {
            "t": "D) 150°",
            "ok": false,
            "fb": "Es muy probable que sumaras las direcciones (120° + 30°). Para encontrar qué tan separados están dos trayectos angulares entre sí, debes hacer una sustracción."
          }
        ]
      },
      {
        "id": "T2D06",
        "q": "Los vectores u = (a, 3) y v = (4, b) son perpendiculares y tienen la misma magnitud. ¿Cuáles son los valores de a y b? (a > 0, b > 0)",
        "opts": [
          {
            "t": "A) a = 3, b = 4",
            "ok": true
          },
          {
            "t": "B) a = 4, b = 3",
            "ok": false,
            "fb": "Estos números cumplen perfectamente con igualar las magnitudes de los vectores, pero verifica si al multiplicarlos y sumarlos obtienes 0 para demostrar perpendicularidad."
          },
          {
            "t": "C) a = 2, b = 6",
            "ok": false,
            "fb": "Si elevas estos valores al cuadrado para armar las magnitudes ( frente a ), verás de inmediato que los \"tamaños\" de los vectores no cuadran."
          },
          {
            "t": "D) a = 6, b = 2",
            "ok": false,
            "fb": "Sustituir estas variables en la fórmula del Teorema de Pitágoras te arrojará tamaños asimétricos (45 contra 20)."
          }
        ]
      },
      {
        "id": "T2D07",
        "q": "La resultante de dos vectores perpendiculares tiene magnitud 25. Si uno de ellos tiene magnitud 7, ¿cuál es la magnitud del otro?",
        "opts": [
          {
            "t": "A) 18",
            "ok": false,
            "fb": "Restar la hipotenusa (25) y un cateto (7) directamente es un error de geometría básico. Los vectores perpendiculares no se suman como números en línea, usa los cuadrados."
          },
          {
            "t": "B) 24",
            "ok": false,
            "fb": "¡Tu cálculo mental es brillante! Has hallado el valor correcto, sin embargo, la instrucción pide marcar la expresión matemática exacta que te lleva a ese resultado paso a paso. Lee bien todas las alternativas."
          },
          {
            "t": "C) √(625 - 49) = √576 = 24",
            "ok": true
          },
          {
            "t": "D) 32",
            "ok": false,
            "fb": "¿Sumaste los números? Recuerda que la resultante de vectores perpendiculares representa la hipotenusa. Ningún cateto individual puede ser mayor que el trayecto directo final."
          }
        ]
      },
      {
        "id": "T2D08",
        "q": "Un vector tiene componentes (k, k+2) y magnitud √52. ¿Cuáles son los posibles valores de k?",
        "opts": [
          {
            "t": "A) 4 o -6",
            "ok": true
          },
          {
            "t": "B) 2 o -4",
            "ok": false,
            "fb": "Haz la prueba sustituyendo estos números en la expresión de magnitud: . El resultado no llega a 52. ¡Cuidado al desarrollar el binomio!."
          },
          {
            "t": "C) 6 o -4",
            "ok": false,
            "fb": "Si usas el 6, tendrás el vector (6, 8), cuya magnitud total es 10 (la raíz de 100), no la raíz de 52. Debes plantear una ecuación igualada a 52 y resolverla."
          },
          {
            "t": "D) 3 o -5",
            "ok": false,
            "fb": "Estos números no cuadran con el tamaño que buscamos. Te sugiero armar la ecuación , igualar a cero y factorizar pacientemente."
          }
        ]
      },
      {
        "id": "T2D09",
        "q": "La suma de dos vectores es (7, 1) y su diferencia es (3, -5). ¿Cuáles son los vectores?",
        "opts": [
          {
            "t": "A) u = (5, -2), v = (2, 3)",
            "ok": true
          },
          {
            "t": "B) u = (2, 3), v = (5, -2)",
            "ok": false
          },
          {
            "t": "C) u = (5, 2), v = (2, -3)",
            "ok": false
          },
          {
            "t": "D) u = (2, -3), v = (5, 2)",
            "ok": false
          }
        ]
      },
      {
        "id": "T2D10",
        "q": "Un vector tiene magnitud 17 y su componente x es 15. ¿Cuál es la componente y si el vector está en el cuarto cuadrante?",
        "opts": [
          {
            "t": "A) 8",
            "ok": false,
            "fb": "Un resultado positivo en 'y' significa que el vector se movió hacia arriba, lo cual lo sitúa en el primer cuadrante. ¿Qué te pide el enunciado sobre su ubicación final?."
          },
          {
            "t": "B) -8",
            "ok": false,
            "fb": "¡Tienes la dirección y el número perfectos!. Pero vuelve a mirar las opciones: el problema busca la expresión matemática completa que denota ese cálculo, no solo el dígito final."
          },
          {
            "t": "C) √(17²-15²)",
            "ok": false
          },
          {
            "t": "D) -√64 = -8",
            "ok": true
          }
        ]
      },
      {
        "id": "T2D11",
        "q": "TecDuck vuela 20 km en dirección N30°E (30° al este del norte). Luego vuela 30 km en dirección S45°E (45° al este del sur). ¿Cuál es su desplazamiento neto desde el origen? (Considera norte como y positivo, este como x positivo)",
        "opts": [
          {
            "t": "A) (20 sen30° + 30 sen45°, 20 cos30° - 30 cos45°)",
            "ok": true
          },
          {
            "t": "B) (20 cos30° + 30 cos45°, 20 sen30° - 30 sen45°)",
            "ok": false,
            "fb": "Al observar tu fórmula, parece que cambiaste los catetos. Cuando mides \"N30°E\", abres el ángulo de 30° apoyado en el eje Norte (Y). Por trigonometría, el movimiento al este (X) usa el cateto opuesto."
          },
          {
            "t": "C) (20 cos30° - 30 cos45°, 20 sen30° + 30 sen45°)",
            "ok": false,
            "fb": "Si viajas \"S45°E\", estás bajando y avanzando a la derecha. Eso significa que tu movimiento horizontal suma, pero tu movimiento vertical debe llevar un signo negativo."
          },
          {
            "t": "D) (20 sen30° - 30 sen45°, 20 cos30° + 30 cos45°)",
            "ok": false,
            "fb": "Intercambiaste completamente los cálculos de avance vertical con los del horizontal. Un buen tip: dibuja triángulos para cada tramo y ubica a quién le toca el seno y a quién el coseno según desde qué eje mides el ángulo."
          }
        ]
      },
      {
        "id": "T2D12",
        "q": "Un barco navega 40 km hacia el este, luego 30 km hacia el norte, luego 20 km en dirección S30°O (30° al oeste del sur). ¿Cuáles son las coordenadas finales del barco? (Origen en el punto de partida)",
        "opts": [
          {
            "t": "A) (40 - 20 sen30°, 30 - 20 cos30°)",
            "ok": true
          },
          {
            "t": "B) (40 - 20 cos30°, 30 - 20 sen30°)",
            "ok": false,
            "fb": "Estás equivocando qué función usar para los componentes. \"S30°O\" significa empezar a medir en el Sur (eje Y negativo) y abrir 30° hacia la izquierda (Oeste). El avance hacia la izquierda es el cateto opuesto, ¿qué función le corresponde?."
          },
          {
            "t": "C) (40 + 20 sen30°, 30 - 20 cos30°)",
            "ok": false,
            "fb": "Si vas hacia el Oeste en el último tramo, tus coordenadas en X deben reducirse, no aumentar. Revisa ese signo positivo intruso que dejaste en la primera parte de tu componente."
          },
          {
            "t": "D) (40 + 20 cos30°, 30 + 20 sen30°)",
            "ok": false,
            "fb": "La frase \"al oeste del sur\" indica movimiento hacia la izquierda (X negativa) y hacia abajo (Y negativa). En tu opción, todo está sumando."
          }
        ]
      },
      {
        "id": "T2D13",
        "q": "Dos vectores u y v tienen magnitudes 8 y 15 respectivamente. Si |u + v| = 17, ¿cuál es el ángulo entre u y v?",
        "opts": [
          {
            "t": "A) 0°",
            "ok": false,
            "fb": "Si el ángulo es 0°, ambos vectores empujan exactamente hacia la misma línea, por lo que bastaría sumar sus tamaños (8 + 15) para tener 23. No encaja con nuestro 17."
          },
          {
            "t": "B) 90°",
            "ok": true
          },
          {
            "t": "C) 180°",
            "ok": false,
            "fb": "Un ángulo de 180° indica una colisión de fuerzas frontales, tendrías que restarlos (15 - 8 = 7). Analiza los números 8, 15 y 17. Son conocidos en geometría como una \"terna pitagórica\" muy especial."
          },
          {
            "t": "D) 60°",
            "ok": false,
            "fb": "Si aplicas la Ley de los Cosenos con un ángulo de 60°, el resultado será bastante mayor que 17. Piensa en qué ángulo logra que todo el término del coseno \"desaparezca\" en la fórmula."
          }
        ]
      },
      {
        "id": "T2D14",
        "q": "La resultante de dos vectores tiene magnitud 20. Si la magnitud de uno de ellos es 12 y el ángulo entre ellos es 90°, ¿cuál es la magnitud del otro?",
        "opts": [
          {
            "t": "A) 8",
            "ok": false,
            "fb": "Parece que restaste las magnitudes directamente (20 - 12). Recuerda que cuando los vectores son perpendiculares, sus magnitudes no se restan linealmente, sino que se relacionan a través del Teorema de Pitágoras."
          },
          {
            "t": "B) 16",
            "ok": true
          },
          {
            "t": "C) 32",
            "ok": false,
            "fb": "¡Cuidado! Sumaste los valores como si fueran escalares en la misma dirección. En el mundo de los vectores, la magnitud total (resultante) siempre se ve afectada por el ángulo entre ellos."
          },
          {
            "t": "D) 23.3",
            "ok": false,
            "fb": "Aplicaste correctamente la suma de cuadrados, pero la trataste como si estuvieras buscando una nueva hipotenusa. Revisa el enunciado: ¿la magnitud 20 es un cateto o es ya la resultante final (hipotenusa)?"
          }
        ]
      },
      {
        "id": "T2D15",
        "q": "TecDuck debe ir del punto A(2, 5) al punto B(10, 11). Decide hacerlo en línea recta. ¿Qué vector debe seguir?",
        "opts": [
          {
            "t": "A) (8, 6)",
            "ok": true
          },
          {
            "t": "B) (12, 16)",
            "ok": false,
            "fb": "Te equivocaste de operación y sumaste los puntos. Para crear un vector que conecte dos ubicaciones, necesitas encontrar la distancia que hay entre ellos a través de una diferencia."
          },
          {
            "t": "C) (6, 8)",
            "ok": false,
            "fb": "Restaste el inicio menos el final o cruzaste las coordenadas. La fórmula irrompible para un vector entre puntos es siempre: Punto Final menos Punto Inicial."
          },
          {
            "t": "D) (10, 11)",
            "ok": false,
            "fb": "Elegiste las coordenadas del lugar al que TecDuck llegó. Un vector no es un \"lugar\", es el \"trayecto\" que se necesitó para viajar desde la salida a la llegada."
          }
        ],
        "img": "img/quiz/T2D/q15.png"
      },
      {
        "id": "T2D16",
        "q": "Los vértices de un triángulo son A(1, 2), B(5, 3) y C(3, 7). ¿Cuál es el vector que representa el lado AB?",
        "opts": [
          {
            "t": "A) (4, 1)",
            "ok": true
          },
          {
            "t": "B) (2, 5)",
            "ok": false,
            "fb": "Este conjunto de instrucciones de movimiento no representa el lado AB. De hecho, te llevaría desde A hasta C. Revisa las coordenadas de los vértices que necesitas conectar."
          },
          {
            "t": "C) (4, 5)",
            "ok": false,
            "fb": "Tu matemática te traicionó en la segunda coordenada. Haz la resta paso a paso: ¿cuánto cambia la altura si vas de y=2 a y=3?."
          },
          {
            "t": "D) (1, 4)",
            "ok": false,
            "fb": "Parece que cambiaste el orden de tus respuestas, poniendo el cambio vertical donde va el horizontal. En un par ordenado de vector (x, y), primero reportamos el desplazamiento lateral."
          }
        ],
        "img": "img/quiz/T2D/q16.png"
      },
      {
        "id": "T2D17",
        "q": "Los vértices de un triángulo son A(1, 2), B(5, 3) y C(3, 7). ¿Cuál es el vector que va del punto medio de AB al vértice C?",
        "opts": [
          {
            "t": "A) (0, 4.5)",
            "ok": true
          },
          {
            "t": "B) (3, 2.5)",
            "ok": false,
            "fb": "Has encontrado las coordenadas exactas del punto medio de AB. Sin embargo, el problema te pide el vector (el trayecto) que conecta ese punto con el vértice C. ¿Qué operación te falta para hallar ese desplazamiento?"
          },
          {
            "t": "C) (0, -4.5)",
            "ok": false,
            "fb": "Tienes la magnitud correcta, pero ¡revisa el sentido del vector! Recuerda que para ir \"del punto medio al vértice C\", la fórmula requiere restar el punto final menos el punto inicial."
          },
          {
            "t": "D) (4, 1)",
            "ok": false,
            "fb": "Este vector representa el desplazamiento del lado AB. El problema te pide una conexión distinta: desde el centro de ese lado hacia el punto C. Revisa qué coordenadas estás restando."
          }
        ],
        "img": "img/quiz/T2D/q16.png"
      },
      {
        "id": "T2D18",
        "q": "¿Cuál de los siguientes vectores NO es perpendicular a (3, -4)?",
        "opts": [
          {
            "t": "A) (4, 3)",
            "ok": false,
            "fb": "Producto punto: (3)(4) + (-4)(3) = 12 - 12 = 0. Sí es perpendicular."
          },
          {
            "t": "B) (-4, -3)",
            "ok": false,
            "fb": "Producto punto: (3)(-4) + (-4)(-3) = -12 + 12 = 0. Sí es perpendicular (es el opuesto de A)."
          },
          {
            "t": "C) (8, 6)",
            "ok": false,
            "fb": "Producto punto: (3)(8) + (-4)(6) = 24 - 24 = 0. Sí es perpendicular (es el doble de A)."
          },
          {
            "t": "D) (6, 8)",
            "ok": true
          }
        ],
        "img": "img/quiz/T2D/q18.png"
      },
      {
        "id": "T2D19",
        "q": "Un vector tiene componentes (cos θ, sen θ). ¿Qué representa este vector?",
        "opts": [
          {
            "t": "A) Un vector de magnitud variable",
            "ok": false,
            "fb": "Si introduces el seno y el coseno en el Teorema de Pitágoras () para encontrar su magnitud, una famosa identidad trigonométrica te dirá que el tamaño es estático, no variable."
          },
          {
            "t": "B) Un vector unitario en dirección θ",
            "ok": true
          },
          {
            "t": "C) Un vector siempre horizontal",
            "ok": false,
            "fb": "Si el vector fuera siempre horizontal, su componente 'y' tendría que ser permanentemente 0 sin importar cuánto cambies θ. Pero sabemos que el sinθ cambia de valor continuamente."
          },
          {
            "t": "D) Un vector siempre vertical",
            "ok": false,
            "fb": "Si fuera un vector que solo sube o baja, carecería de avance lateral, es decir cosθ = 0 siempre, lo cual no es cierto para todos los ángulos."
          }
        ]
      },
      {
        "id": "T2D20",
        "q": "Si el vector (a, b) es unitario, ¿cuál de las siguientes afirmaciones es verdadera?",
        "opts": [
          {
            "t": "A) a² + b² = 1",
            "ok": true
          },
          {
            "t": "B) a + b = 1",
            "ok": false,
            "fb": "Que las partes sumen 1 no crea un tamaño de 1 en el espacio. Si camino medio metro a la derecha y medio metro arriba, la diagonal (magnitud) medirá menos que 1 debido a la forma del triángulo."
          },
          {
            "t": "C) a = 1, b = 0",
            "ok": false,
            "fb": "¡Ese es un fantástico ejemplo de un vector unitario que apunta sobre la línea de las 'x'!. Sin embargo, el problema te pide la propiedad matemática general aplicable a todos."
          },
          {
            "t": "D) a = 0, b = 1",
            "ok": false,
            "fb": "Esta afirmación solo abarca al vector que apunta hacia el techo. Busca en las opciones cuál es la fórmula inquebrantable de la magnitud igualada a 1."
          }
        ]
      },
      {
        "id": "T2D21",
        "q": "La proyección de un vector u sobre un vector v es 5. Si |v| = 3 y el ángulo entre u y v es 60°, ¿cuál es la magnitud de u?",
        "opts": [
          {
            "t": "A) 10/3",
            "ok": false,
            "fb": "Es muy común tratar de dividir usando todos los datos, ¡pero la magnitud de 'v' (3) es un distractor aquí! La fórmula matemática para la proyección de 'u' sobre un eje define que proyección = |u|cos(θ). Despeja partiendo de ahí."
          },
          {
            "t": "B) 10",
            "ok": true
          },
          {
            "t": "C) 5√3",
            "ok": false,
            "fb": "Si llegaste a la raíz de 3, lo más seguro es que usaste la función seno en vez del coseno en el planteamiento. Para proyectar sombras de un vector sobre una base (como la adyacente), siempre requerimos el coseno."
          },
          {
            "t": "D) 15/2",
            "ok": false,
            "fb": "Multiplicaste datos que no corresponden. Vuelve a la base conceptual: ¿qué nos dice exactamente que una proyección sea igual a 5?."
          }
        ]
      },
      {
        "id": "T2D22",
        "q": "Dados los vectores u = (2, 3) y v = (4, -1), ¿cuál es el vector w = 2u - 3v?",
        "opts": [
          {
            "t": "A) (16, 3)",
            "ok": false,
            "fb": "Te equivocaste de signo en la fase final; en vez de hacer una resta (2u - 3v), terminaste sumando los bloques de componentes."
          },
          {
            "t": "B) (-8, 9)",
            "ok": true
          },
          {
            "t": "C) (8, -9)",
            "ok": false,
            "fb": "Cuidado con la resta de negativos. Cuando restas la parte 'x' tienes 4 - 12, y para la parte 'y' tienes 6 - (-3). Ley de los signos te ayudará a corregirlo."
          },
          {
            "t": "D) (-16, -3)",
            "ok": false,
            "fb": "Multiplicaste mal el factor escalar sobre el vector. Tómalo con calma: primero escala el vector u, luego escala el vector v, y finalmente acomoda las restas individuales."
          }
        ],
        "img": "img/quiz/T2D/q22.png"
      },
      {
        "id": "T2D23",
        "q": "La resultante de tres vectores es cero. Dos de ellos son u = (2, -1) y v = (-3, 4). ¿Cuál es el tercer vector w?",
        "opts": [
          {
            "t": "A) (1, -3)",
            "ok": true
          },
          {
            "t": "B) (-1, 3)",
            "ok": false,
            "fb": "Ese es exactamente el resultado de sumar los vectores 'u' y 'v' combinados. ¡Pero la meta es que todo llegue a cero! Piensa: si algo empuja (-1, 3), ¿qué fuerza necesitas en contra para detener el movimiento completamente?"
          },
          {
            "t": "C) (5, -5)",
            "ok": false,
            "fb": "Este vector parece originarse si intentaras restar 'v' de 'u'. Eso no nos ayuda a lograr el balance. Establece la simple ecuación u + v + w = 0."
          },
          {
            "t": "D) (-5, 5)",
            "ok": false,
            "fb": "Estás tratando de usar los signos al revés sobre un vector incorrecto. Solo suma las componentes reales paso a paso, y encuentra el vector w que equilibra la balanza hacia el cero."
          }
        ],
        "img": "img/quiz/T2D/q23.png"
      },
      {
        "id": "T2D24",
        "q": "Un vector tiene magnitud 10 y forma un ángulo de 30° con el eje X. Otro vector tiene magnitud 15 y forma un ángulo de 120° con el eje X. La magnitud de la suma es:",
        "opts": [
          {
            "t": "A) 5√7",
            "ok": false,
            "fb": "Este resultado suele aparecer si hubo una confusión con los signos al sumar las componentes o si se usó la Ley de Cosenos de forma incorrecta para este ángulo. Verifica de nuevo tu suma de los componentes en el eje X."
          },
          {
            "t": "B) 5√19",
            "ok": false,
            "fb": "Revisa el cálculo de tus cuadrados finales. Es posible que al elevar al cuadrado las componentes con raíces, algún valor se haya sumado de más. ¿Cómo quedó tu suma de ?"
          },
          {
            "t": "C) 25",
            "ok": false,
            "fb": "Sumar las magnitudes directamente (10 + 15) solo funciona si ambos vectores apuntan exactamente hacia el mismo lugar. Como tienen ángulos diferentes (30° y 120°), debes trabajar con sus componentes rectangulares por separado."
          },
          {
            "t": "D) 5√13",
            "ok": true
          }
        ]
      },
      {
        "id": "T2D25",
        "q": "TecDuck vuela en un plano. Su posición inicial es (2, 3). Luego vuela según el vector (5, -1). Luego vuela según el vector (-3, 4). Finalmente, vuela según el vector (1, 2). ¿A qué distancia del origen se encuentra?",
        "opts": [
          {
            "t": "A) √34",
            "ok": false,
            "fb": "Olvidaste tomar en cuenta la posición inicial (2, 3). Solo sumaste los vectores de desplazamiento (5-3+1 = 3 y -1+4+2 = 5), calculando la distancia del puro desplazamiento: √(3² + 5²) = √34."
          },
          {
            "t": "B) 13",
            "ok": false,
            "fb": "Calculaste correctamente la posición final (5, 8), pero en lugar de aplicar el teorema de Pitágoras para la magnitud, simplemente sumaste las dos coordenadas (5 + 8 = 13)."
          },
          {
            "t": "C) √89",
            "ok": true
          },
          {
            "t": "D) 5",
            "ok": false,
            "fb": "Te equivocaste en los signos del último vector o lo restaste en lugar de sumarlo. Si la posición final hubiera sido (3, 4), la distancia al origen sería √(3² + 4²) = √25 = 5."
          }
        ],
        "img": "img/quiz/T2D/q25.png"
      }
    ]
  }
};

/**
 * Índice de todas las PNG en img/quiz (por número de pregunta en el Word).
 * Si una entrada no aparece aquí, no hay gráfico extraído aún para esa pregunta.
 */
var QUIZ_IMG_INDEX = {
  "1": {
    facil: {
      "1": "../img/quiz/T1F/q01.png",
      "10": "../img/quiz/T1F/q10.png",
      "21": "../img/quiz/T1F/q21.png",
      "22": "../img/quiz/T1F/q22.png",
      "23": "../img/quiz/T1F/q23.png",
      "24": "../img/quiz/T1F/q24.png",
      "25": "../img/quiz/T1F/q25.png",
      "26": "../img/quiz/T1F/q26.png",
      "27": "../img/quiz/T1F/q27.png",
      "28": "../img/quiz/T1F/q28.png",
      "30": "../img/quiz/T1F/q30.png",
      "31": "../img/quiz/T1F/q31.png",
      "32": "../img/quiz/T1F/q32.png",
      "33": "../img/quiz/T1F/q33.png",
      "34": "../img/quiz/T1F/q34.png",
      "35": "../img/quiz/T1F/q35.png",
      "37": "../img/quiz/T1F/q37.png"
    },
    dificil: {
      "1": "../img/quiz/T1D/q01.png",
      "3": "../img/quiz/T1D/q03.png",
      "6": "../img/quiz/T1D/q06.png",
      "7": "../img/quiz/T1D/q07.png",
      "8": "../img/quiz/T1D/q08.png",
      "9": "../img/quiz/T1D/q09.png",
      "10": "../img/quiz/T1D/q10.png",
      "12": "../img/quiz/T1D/q12.png",
      "13": "../img/quiz/T1D/q13.png",
      "15": "../img/quiz/T1D/q15.png",
      "16": "../img/quiz/T1D/q16.png",
      "18": "../img/quiz/T1D/q18.png",
      "21": "../img/quiz/T1D/q21.png",
      "22": "../img/quiz/T1D/q22.png",
      "23": "../img/quiz/T1D/q23.png",
      "24": "../img/quiz/T1D/q24.png",
      "25": "../img/quiz/T1D/q25.png"
    }
  },
  "2": {
    facil: {
      "6": "../img/quiz/T2F/q06.png",
      "9": "../img/quiz/T2F/q09.png",
      "10": "../img/quiz/T2F/q10.png",
      "15": "../img/quiz/T2F/q15.png",
      "17": "../img/quiz/T2F/q17.png",
      "18": "../img/quiz/T2F/q18.png",
      "20": "../img/quiz/T2F/q20.png",
      "26": "../img/quiz/T2F/q26.png",
      "27": "../img/quiz/T2F/q27.png",
      "28": "../img/quiz/T2F/q28.png",
      "29": "../img/quiz/T2F/q29.png",
      "32": "../img/quiz/T2F/q32.png",
      "38": "../img/quiz/T2F/q38.png",
      "39": "../img/quiz/T2F/q39.png"
    },
    dificil: {
      "4": "../img/quiz/T2D/q04.png",
      "15": "../img/quiz/T2D/q15.png",
      "16": "../img/quiz/T2D/q16.png",
      "18": "../img/quiz/T2D/q18.png",
      "22": "../img/quiz/T2D/q22.png",
      "23": "../img/quiz/T2D/q23.png",
      "25": "../img/quiz/T2D/q25.png"
    }
  }
};

/**
 * Resuelve la URL para mostrar en pages/quiz.html.
 * Preferencia: campo img del banco; si falta, busca QUIZ_IMG_INDEX por id de pregunta.
 */
function quizImagenParaPregunta(p) {
  function resolver(s) {
    s = String(s).trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    if (/^\.\.\//.test(s)) return s;
    if (s.charAt(0) === "/") return s;
    return "../" + s.replace(/^\/+/, "");
  }

  if (p && p.img != null && String(p.img).trim() !== "") {
    return resolver(p.img);
  }

  var m = p && /^T(\d)([FD])(\d{2})$/.exec(p.id);
  if (!m) return "";
  var tema = m[1];
  var modo = m[2] === "D" ? "dificil" : "facil";
  var n = String(parseInt(m[3], 10));
  var sub = QUIZ_IMG_INDEX[tema] && QUIZ_IMG_INDEX[tema][modo];
  return sub && sub[n] ? sub[n] : "";
}

var QUIZ_PREGUNTAS_FACIL = 10;
var QUIZ_PREGUNTAS_DIFICIL = 7;

/** Baraja una copia del array (Fisher-Yates). */
function quizBarajar(arr) {
  var copia = arr.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = copia[i];
    copia[i] = copia[j];
    copia[j] = tmp;
  }
  return copia;
}

/**
 * Devuelve N preguntas aleatorias del banco para el tema/modo indicado.
 * Si el banco es menor que N (por seguridad), devuelve todo el banco barajado.
 */
function quizObtenerPreguntas(temaId, modo) {
  var id = String(temaId || "1");
  if (!QUIZ_BANK[id]) {
    id = "1";
  }
  var m = String(modo || "facil").toLowerCase();
  if (m !== "facil" && m !== "dificil") {
    m = "facil";
  }
  var banco = QUIZ_BANK[id][m] || [];
  var n = m === "dificil" ? QUIZ_PREGUNTAS_DIFICIL : QUIZ_PREGUNTAS_FACIL;
  var barajado = quizBarajar(banco);
  return barajado.slice(0, Math.min(n, barajado.length));
}

function quizTotalPreguntas(modo) {
  return String(modo).toLowerCase() === "dificil"
    ? QUIZ_PREGUNTAS_DIFICIL
    : QUIZ_PREGUNTAS_FACIL;
}
