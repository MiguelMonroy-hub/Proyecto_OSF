/**
 * Tema 2 · Básico (40 preguntas)
 */
(function () {
  "use strict";
  if (typeof quizBankRegistrar !== "function") {
    throw new Error("Carga quiz-bank-loader.js antes de este archivo.");
  }
  quizBankRegistrar("2", "facil", [
  {
    id: "T2F01",
    q: "Un vector se representa gráficamente como:",
    opts: [
      {
        t: "A) Un punto",
        ok: false,
        fb: "Considera que un punto solo indica una ubicación fija. ¿Cómo podrías mostrar que hay un movimiento o una fuerza aplicada hacia algún lugar?"
      },
      {
        t: "B) Una flecha",
        ok: true
      },
      {
        t: "C) Una línea recta sin dirección",
        ok: false,
        fb: "Si dibujas solo una línea, sabemos \"cuánto\" mide, pero ¿cómo sabríamos hacia qué lado se dirige el desplazamiento?"
      },
      {
        t: "D) Un círculo",
        ok: false,
        fb: "Las figuras cerradas no suelen indicar trayectoria o sentido. Piensa en qué símbolo universal se usa para \"señalar\" un camino."
      }
    ]
  },
  {
    id: "T2F02",
    q: "¿Qué elementos necesita un vector para quedar completamente definido?",
    opts: [
      {
        t: "A) Solo su magnitud",
        ok: false,
        fb: "Si solo conoces el tamaño (magnitud), tendrías un número, pero no sabrías si el objeto se mueve al norte o al sur."
      },
      {
        t: "B) Solo su dirección",
        ok: false,
        fb: "Conocer la dirección te dice hacia dónde apunta, pero ¿sabes qué tan largo es el recorrido?"
      },
      {
        t: "C) Magnitud y dirección",
        ok: true
      },
      {
        t: "D) Su punto de inicio solamente",
        ok: false,
        fb: "El punto de inicio ayuda a ubicarlo, pero recuerda que un vector representa un desplazamiento que puede ocurrir en cualquier parte del plano y seguir siendo el mismo."
      }
    ]
  },
  {
    id: "T2F03",
    q: "¿Qué indica la dirección de un vector?",
    opts: [
      {
        t: "A) Su longitud",
        ok: false,
        fb: "Revisa tus conceptos. La longitud tiene que ver con el \"tamaño\" o \"fuerza\", no con la inclinación del trayecto."
      },
      {
        t: "B) Hacia dónde apunta",
        ok: true
      },
      {
        t: "C) Su punto de inicio",
        ok: false,
        fb: "Confundiste el \"dónde empieza\" con el \"hacia dónde va\". La dirección es una propiedad de la trayectoria, no del origen."
      },
      {
        t: "D) Su color en la gráfica",
        ok: false,
        fb: "El color es un apoyo visual para distinguir un vector de otro, pero no define su comportamiento matemático."
      }
    ]
  },
  {
    id: "T2F04",
    q: "¿Qué nombre recibe la longitud de un vector?",
    opts: [
      {
        t: "A) Dirección",
        ok: false,
        fb: "La dirección es el ángulo o la recta sobre la que descansa el vector, no la medida de su extensión."
      },
      {
        t: "B) Magnitud o norma",
        ok: true
      },
      {
        t: "C) Componente",
        ok: false,
        fb: "Las componentes son como las \"instrucciones\" (pasos en x e y) para construir el vector, no su largo total."
      },
      {
        t: "D) Sentido",
        ok: false,
        fb: "El sentido te dice si vas de A hacia B o de B hacia A, pero no cuánta distancia hay entre ellos."
      }
    ]
  },
  {
    id: "T2F05",
    q: "El vector v = (3, 2) comienza en el origen (0, 0). ¿En qué punto termina?",
    opts: [
      {
        t: "A) (3, 2)",
        ok: true
      },
      {
        t: "B) (2, 3)",
        ok: false,
        fb: "¡Cuidado con el orden! En un par ordenado (x, y), la primera cifra siempre es el avance horizontal. ¿Seguro que no los intercambiaste?"
      },
      {
        t: "C) (3, 0)",
        ok: false,
        fb: "Observa el vector (3, 2). Al elegir esta opción, estás ignorando por completo el movimiento hacia \"arriba\" o \"abajo\"."
      },
      {
        t: "D) (0, 2)",
        ok: false,
        fb: "Aquí solo consideraste la altura, pero el vector indica que también hubo un desplazamiento hacia los lados."
      }
    ]
  },
  {
    id: "T2F06",
    q: "Un vector que comienza en (1, 1) y termina en (4, 5) tiene componentes:",
    opts: [
      {
        t: "A) (3, 4)",
        ok: true
      },
      {
        t: "B) (5, 6)",
        ok: false,
        fb: "Parece que sumaste los valores de los puntos. Recuerda que para hallar el desplazamiento (vector), debes encontrar la diferencia entre el final y el inicio."
      },
      {
        t: "C) (4, 5)",
        ok: false,
        fb: "Esta opción solo menciona dónde terminó el viaje, pero no describe el trayecto realizado desde el punto (1, 1)."
      },
      {
        t: "D) (1, 1)",
        ok: false,
        fb: "Elegiste el punto de partida. ¿Qué operación te permitiría saber cuánto avanzó realmente?"
      }
    ]
  },
  {
    id: "T2F07",
    q: "¿Qué vector es horizontal?",
    opts: [
      {
        t: "A) (0, 4)",
        ok: false,
        fb: "Si la componente x es cero, significa que no hay movimiento lateral. ¿Cómo llamamos a una línea que solo sube o baja?"
      },
      {
        t: "B) (4, 0)",
        ok: true
      },
      {
        t: "C) (3, 3)",
        ok: false,
        fb: "Al tener valores en ambos ejes, el vector se inclina. Busca aquel donde la \"altura\" (y) no cambie."
      },
      {
        t: "D) (-2, -2)",
        ok: false,
        fb: "Similar a la anterior, este vector se mueve tanto a la izquierda como hacia abajo. No es una línea plana sobre el horizonte."
      }
    ]
  },
  {
    id: "T2F08",
    q: "¿Qué vector es vertical?",
    opts: [
      {
        t: "A) (5, 0)",
        ok: false,
        fb: "Este vector tiene toda su fuerza en el eje horizontal. Para que sea vertical, la componente x debería ser nula."
      },
      {
        t: "B) (0, -5)",
        ok: true
      },
      {
        t: "C) (3, 2)",
        ok: false,
        fb: "Observa que hay desplazamiento en ambos ejes. Eso lo convierte en una diagonal."
      },
      {
        t: "D) (-4, 4)",
        ok: false,
        fb: "Aunque se mueve hacia arriba, también se desplaza hacia la izquierda. Busca uno que sea puramente \"arriba\" o \"abajo\"."
      }
    ]
  },
  {
    id: "T2F09",
    q: "¿Cuál es la magnitud del vector (3, 0)?",
    opts: [
      {
        t: "A) 0",
        ok: false,
        fb: "Una magnitud de 0 significaría que no hubo movimiento. Aquí avanzamos 3 unidades en el eje X."
      },
      {
        t: "B) 3",
        ok: true
      },
      {
        t: "C) √3",
        ok: false,
        fb: "¿Aplicaste la raíz cuadrada al valor final? Recuerda que  para (3, 0) es simplemente la raíz de ."
      },
      {
        t: "D) 9",
        ok: false,
        fb: "Olvidaste el último paso del Teorema de Pitágoras. El valor 9 es el cuadrado de la distancia, no la distancia real."
      }
    ]
  },
  {
    id: "T2F10",
    q: "¿Cuál es la magnitud del vector (1, 1)?",
    opts: [
      {
        t: "A) 1",
        ok: false,
        fb: "Elegir 1 significa que ignoraste una de las dos dimensiones. Un camino que avanza en dos direcciones siempre será más largo que sus partes individuales."
      },
      {
        t: "B) √2",
        ok: true
      },
      {
        t: "C) 2",
        ok: false,
        fb: "Sumar 1 + 1 es un error común. Visualiza el triángulo: la hipotenusa no es igual a la suma de los catetos. Usa Pitágoras."
      },
      {
        t: "D) 0",
        ok: false,
        fb: "El vector (1, 1) claramente tiene una longitud física en el plano; no puede ser nulo."
      }
    ]
  },
  {
    id: "T2F11",
    q: "Las componentes de un vector representan:",
    opts: [
      {
        t: "A) El punto donde termina",
        ok: false,
        fb: "Las componentes nos dicen cuánto nos movimos. Si el punto inicial no es (0,0), el punto final será muy distinto a las componentes."
      },
      {
        t: "B) Cuánto se desplaza en x y en y",
        ok: true
      },
      {
        t: "C) La dirección solamente",
        ok: false,
        fb: "Si solo dieran la dirección, no sabríamos si el vector mide 1 o 100 unidades."
      },
      {
        t: "D) El color del vector",
        ok: false,
        fb: "Las matemáticas de los vectores se basan en coordenadas, no en atributos estéticos."
      }
    ]
  },
  {
    id: "T2F12",
    q: "Un vector con componentes (a, b) tiene magnitud:",
    opts: [
      {
        t: "A) a + b",
        ok: false,
        fb: "La distancia más corta entre dos puntos es una línea recta, no la suma de los caminos laterales. Piensa en geometría triangular."
      },
      {
        t: "B) √(a² + b²)",
        ok: true
      },
      {
        t: "C) a × b",
        ok: false,
        fb: "Multiplicar las dimensiones no tiene sentido físico para medir una longitud."
      },
      {
        t: "D) |a| + |b|",
        ok: false,
        fb: "Sumar valores absolutos te da una distancia recorrida en \"bloques\", pero no la línea diagonal directa (magnitud euclidiana)."
      }
    ]
  },
  {
    id: "T2F13",
    q: "¿Qué vector tiene dirección diagonal (45°)?",
    opts: [
      {
        t: "A) (3, 0)",
        ok: false,
        fb: "Para que sea diagonal, el movimiento debe estar repartido. Aquí solo hay avance en el eje horizontal."
      },
      {
        t: "B) (0, 4)",
        ok: false,
        fb: "Este vector es puramente vertical. Busca uno donde el avance en \"x\" sea igual al avance en \"y\"."
      },
      {
        t: "C) (2, 2)",
        ok: true
      },
      {
        t: "D) (-3, 0)",
        ok: false,
        fb: "Aunque apunta en sentido contrario al primero, sigue siendo una línea horizontal sobre el eje."
      }
    ]
  },
  {
    id: "T2F14",
    q: "Si un vector es (0, -5), ¿hacia dónde apunta?",
    opts: [
      {
        t: "A) Arriba",
        ok: false,
        fb: "Si la componente \"y\" es negativa, ¿cómo podría estar subiendo?"
      },
      {
        t: "B) Abajo",
        ok: true
      },
      {
        t: "C) Derecha",
        ok: false,
        fb: "Para ir a la derecha, necesitarías que la primera componente (x) fuera positiva y la segunda (y) fuera cero."
      },
      {
        t: "D) Izquierda",
        ok: false,
        fb: "Izquierda implicaría un valor negativo en la primera posición del paréntesis."
      }
    ]
  },
  {
    id: "T2F15",
    q: "El vector opuesto a (2, -3) es:",
    opts: [
      {
        t: "A) (-2, 3)",
        ok: true
      },
      {
        t: "B) (2, 3)",
        ok: false,
        fb: "Solo cambiaste la dirección vertical. El opuesto debe ser como un espejo total: si uno va a la derecha y abajo, el otro debe ir a..."
      },
      {
        t: "C) (-2, -3)",
        ok: false,
        fb: "Aquí solo invertiste el eje horizontal. Recuerda que el opuesto es (-x, -y)."
      },
      {
        t: "D) (3, -2)",
        ok: false,
        fb: "Intercambiar los números cambia la inclinación del vector, no lo hace \"opuesto\"."
      }
    ]
  },
  {
    id: "T2F16",
    q: "Dos vectores son iguales si:",
    opts: [
      {
        t: "A) Tienen la misma magnitud",
        ok: false,
        fb: "Imagina un vector de 5 unidades al norte y otro de 5 al este. Tienen el mismo tamaño, pero ¿te llevan al mismo lugar?"
      },
      {
        t: "B) Tienen la misma dirección",
        ok: false,
        fb: "Si dos personas caminan hacia el norte, pero una camina 1 km y la otra 10 km, ¿sus desplazamientos son iguales?"
      },
      {
        t: "C) Tienen las mismas componentes",
        ok: true
      },
      {
        t: "D) Empiezan en el mismo punto",
        ok: false,
        fb: "El lugar donde empieza un vector no lo define. Dos flechas idénticas en diferentes partes del papel representan el mismo vector."
      }
    ]
  },
  {
    id: "T2F17",
    q: "El vector que va del punto A(2, 3) al punto B(5, 7) es:",
    opts: [
      {
        t: "A) (2, 3)",
        ok: false,
        fb: "Ese es solo el origen del movimiento. Un vector debe expresar cuánto cambió la posición."
      },
      {
        t: "B) (5, 7)",
        ok: false,
        fb: "Ese es el destino. ¿Qué operación matemática te permite saber el \"salto\" que hubo entre el inicio y el fin?"
      },
      {
        t: "C) (3, 4)",
        ok: true
      },
      {
        t: "D) (7, 10)",
        ok: false,
        fb: "Al sumar las coordenadas, obtienes un punto alejado, no el desplazamiento relativo entre A y B."
      }
    ]
  },
  {
    id: "T2F18",
    q: "¿Cuál es la magnitud del vector (-3, 4)?",
    opts: [
      {
        t: "A) 5",
        ok: true
      },
      {
        t: "B) 7",
        ok: false,
        fb: "Sumar 3 + 4 ignora que los movimientos son perpendiculares. Aplica la fórmula de la hipotenusa."
      },
      {
        t: "C) 1",
        ok: false,
        fb: "Un vector con componentes tan grandes no puede medir solo 1. Revisa tu cálculo de ."
      },
      {
        t: "D) 25",
        ok: false,
        fb: "Te detuviste antes de tiempo. El número 25 es el área del cuadrado formado, ahora falta obtener su lado (raíz)."
      }
    ]
  },
  {
    id: "T2F19",
    q: "Un vector con magnitud 5 y dirección horizontal hacia la derecha puede ser:",
    opts: [
      {
        t: "A) (5, 0)",
        ok: true
      },
      {
        t: "B) (0, 5)",
        ok: false,
        fb: "Este mide 5, pero su dirección es vertical (hacia arriba). El problema pide uno horizontal."
      },
      {
        t: "C) (3, 4)",
        ok: false,
        fb: "Aunque mide 5, su trayectoria es inclinada. Busca uno que no tenga \"altura\" (componente y = 0)."
      },
      {
        t: "D) (-5, 0)",
        ok: false,
        fb: "Este va en la dirección correcta (horizontal), pero el sentido es hacia la izquierda."
      }
    ]
  },
  {
    id: "T2F20",
    q: "¿Qué vector tiene la misma dirección que (1, 2)?",
    opts: [
      {
        t: "A) (2, 4)",
        ok: true
      },
      {
        t: "B) (2, 1)",
        ok: false,
        fb: "Intercambiar los valores cambia la pendiente. Compara: ¿es lo mismo subir 2 gradas por cada paso que dar 2 pasos por cada grada?"
      },
      {
        t: "C) (-1, -2)",
        ok: false,
        fb: "Este vector es paralelo, pero apunta exactamente al revés. El problema busca la misma dirección y sentido."
      },
      {
        t: "D) (1, -2)",
        ok: false,
        fb: "Al cambiar el signo de solo una componente, el vector ahora apunta hacia abajo, cambiando su ángulo."
      }
    ]
  },
  {
    id: "T2F21",
    q: "Un vector unitario es aquel que:",
    opts: [
      {
        t: "A) Tiene magnitud 1",
        ok: true
      },
      {
        t: "B) Tiene componentes (1,1)",
        ok: false,
        fb: "Calcula la magnitud de (1, 1). Si el resultado es √(2), ¿puede ser unitario?"
      },
      {
        t: "C) Empieza en el origen",
        ok: false,
        fb: "Estar en el origen es una cuestión de ubicación, no de tamaño."
      },
      {
        t: "D) Tiene dirección horizontal",
        ok: false,
        fb: "No hay restricciones de ángulo para los vectores unitarios; pueden apuntar hacia cualquier lado."
      }
    ]
  },
  {
    id: "T2F22",
    q: "El vector unitario en la dirección de (3, 0) es:",
    opts: [
      {
        t: "A) (1, 0)",
        ok: true
      },
      {
        t: "B) (3, 0)",
        ok: false,
        fb: "Este vector mide 3 unidades. Para hacerlo unitario, necesitas \"encogerlo\" hasta que mida 1."
      },
      {
        t: "C) (0, 1)",
        ok: false,
        fb: "Aunque mide 1, cambiaste la dirección de horizontal a vertical."
      },
      {
        t: "D) (1/3, 0)",
        ok: false,
        fb: "Si divides una componente de 3 entre 9, obtienes 1/3. ¿Seguro que dividiste por la magnitud correcta?"
      }
    ]
  },
  {
    id: "T2F23",
    q: "La magnitud de un vector siempre es:",
    opts: [
      {
        t: "A) Un número negativo",
        ok: false,
        fb: "¿Puede una distancia física ser menor que cero? La magnitud siempre mide \"cuánto\", y eso no puede ser negativo."
      },
      {
        t: "B) Un número positivo o cero",
        ok: true
      },
      {
        t: "C) Un número complejo",
        ok: false,
        fb: "En el nivel básico, trabajamos con distancias reales. Los números complejos no se usan para medir largos de vectores simples."
      },
      {
        t: "D) Un vector",
        ok: false,
        fb: "Confundiste el objeto (vector) con su medida (magnitud). La magnitud es solo el número que nos dice el tamaño."
      }
    ]
  },
  {
    id: "T2F24",
    q: "Si un vector tiene componentes (a, b) y a = 0, b ≠ 0, el vector es:",
    opts: [
      {
        t: "A) Horizontal",
        ok: false,
        fb: "Si no hay avance en el eje X, el vector no puede ser horizontal."
      },
      {
        t: "B) Vertical",
        ok: true
      },
      {
        t: "C) Diagonal",
        ok: false,
        fb: "Para ser diagonal, necesitarías moverte un poco en ambos ejes (que a y b no sean cero)."
      },
      {
        t: "D) Nulo",
        ok: false,
        fb: "Para que sea nulo, la componente b también tendría que ser cero."
      }
    ]
  },
  {
    id: "T2F25",
    q: "Si un vector tiene componentes (a, b) y b = 0, a ≠ 0, el vector es:",
    opts: [
      {
        t: "A) Horizontal",
        ok: true
      },
      {
        t: "B) Vertical",
        ok: false,
        fb: "Si no hay altura (b = 0), el vector no puede subir ni bajar."
      },
      {
        t: "C) Diagonal",
        ok: false,
        fb: "Si una de las dos \"instrucciones\" es cero, el movimiento es recto sobre un eje, nunca inclinado."
      },
      {
        t: "D) Nulo",
        ok: false,
        fb: "Como a es distinto de cero, el vector sí tiene una longitud. No es un punto vacío."
      }
    ]
  },
  {
    id: "T2F26",
    q: "¿Cuál es la magnitud del vector (0, 0)?",
    opts: [
      {
        t: "A) 0",
        ok: true
      },
      {
        t: "B) 1",
        ok: false,
        fb: "Un vector unitario mide 1. El vector (0, 0) representa la ausencia total de movimiento."
      },
      {
        t: "C) No tiene magnitud",
        ok: false,
        fb: "Sí la tiene, y es un valor numérico muy específico que representa que no hay distancia."
      },
      {
        t: "D) Infinito",
        ok: false,
        fb: "La infinitud implicaría una flecha que nunca termina, todo lo contrario al vector nulo."
      }
    ]
  },
  {
    id: "T2F27",
    q: "El vector que va de (1, 2) a (1, 2) es:",
    opts: [
      {
        t: "A) (0, 0)",
        ok: true
      },
      {
        t: "B) (1, 2)",
        ok: false,
        fb: "Este es el punto de ubicación. El vector de desplazamiento debe indicar cuánto te moviste para ir de un lugar... al mismo lugar."
      },
      {
        t: "C) (2, 4)",
        ok: false,
        fb: "Sumar las coordenadas no te da el desplazamiento. Piensa en la resta: punto final - punto inicial."
      },
      {
        t: "D) No existe",
        ok: false,
        fb: "Sí existe en matemáticas y es fundamental para representar el reposo."
      }
    ]
  },
  {
    id: "T2F28",
    q: "¿Qué vector es perpendicular a (0, 1)?",
    opts: [
      {
        t: "A) (1, 0)",
        ok: true
      },
      {
        t: "B) (0, -1)",
        ok: false,
        fb: "Este vector va hacia abajo, mientras que (0, 1) va hacia arriba. Son opuestos (paralelos), no perpendiculares."
      },
      {
        t: "C) (1, 1)",
        ok: false,
        fb: "Prueba el producto punto. Si no da cero, el ángulo entre ellos no es de 90 grados."
      },
      {
        t: "D) (0, 2)",
        ok: false,
        fb: "Este es el doble de largo, pero sigue apuntando en la misma dirección vertical."
      }
    ]
  },
  {
    id: "T2F29",
    q: "¿Qué vector es paralelo a (2, 3)?",
    opts: [
      {
        t: "A) (4, 6)",
        ok: true
      },
      {
        t: "B) (3, 2)",
        ok: false,
        fb: "Intercambiar componentes cambia la inclinación. Un vector paralelo debe mantener la misma \"proporción\" (como una fracción equivalente)."
      },
      {
        t: "C) (2, -3)",
        ok: false,
        fb: "Cambiar un signo inclina el vector hacia el otro lado del eje. Ya no viajarían en vías de tren paralelas."
      },
      {
        t: "D) (-2, 3)",
        ok: false,
        fb: "Similar a la anterior, este apunta en una dirección que cruza a la original."
      }
    ]
  },
  {
    id: "T2F30",
    q: "La dirección de un vector con componentes iguales (a, a) con a > 0 es:",
    opts: [
      {
        t: "A) 0°",
        ok: false,
        fb: "Si la dirección fuera 0°, la componente \"y\" tendría que ser cero."
      },
      {
        t: "B) 45°",
        ok: true
      },
      {
        t: "C) 90°",
        ok: false,
        fb: "90° significaría que no hay avance horizontal (a = 0)."
      },
      {
        t: "D) 135°",
        ok: false,
        fb: "Para estar en este ángulo, una de las componentes tendría que ser negativa."
      }
    ]
  },
  {
    id: "T2F31",
    q: "TecDuck vuela 3 km al este y 4 km al norte. El vector que representa su desplazamiento es:",
    opts: [
      {
        t: "A) (3, 4)",
        ok: true
      },
      {
        t: "B) (4, 3)",
        ok: false,
        fb: "Revisa el enunciado: \"3 al este\" es el eje horizontal (x) y \"4 al norte\" es el vertical (y)."
      },
      {
        t: "C) (3, 0)",
        ok: false,
        fb: "Aquí olvidaste que TecDuck también voló hacia el norte después de ir al este."
      },
      {
        t: "D) (0, 4)",
        ok: false,
        fb: "Elegiste solo el segundo movimiento, ignorando el primer tramo del viaje."
      }
    ]
  },
  {
    id: "T2F32",
    q: "Si TecDuck vuela el vector (-3, -4) desde dónde el punto (3, 4) ¿dónde termina respecto al origen?",
    opts: [
      {
        t: "A) En el origen (0, 0)",
        ok: true
      },
      {
        t: "B) En (3, 4)",
        ok: false,
        fb: "Si TecDuck estaba en (3, 4) y se movió con el vector (-3, -4), es imposible que se haya quedado quieto."
      },
      {
        t: "C) En (-3, -4)",
        ok: false,
        fb: "Ese es el vector de movimiento, no su posición final. Suma (-3, -4) a su ubicación actual (3, 4)."
      },
      {
        t: "D) En (6, 8)",
        ok: false,
        fb: "Parece que sumaste los valores absolutos. Si estás en la posición 3 y retrocedes 3, ¿llegas a 6 o a otro número?"
      }
    ]
  },
  {
    id: "T2F33",
    q: "La distancia total que recorrió TecDuck en los dos vuelos (preguntas 31 y 32) es:",
    opts: [
      {
        t: "A) 5 km",
        ok: false,
        fb: "Este valor es el desplazamiento de una sola etapa. TecDuck hizo dos viajes de la misma longitud."
      },
      {
        t: "B) 10 km",
        ok: true
      },
      {
        t: "C) 14 km",
        ok: false,
        fb: "Probablemente sumaste las componentes (3 + 4 + 3 + 4). Recuerda que la distancia de cada tramo es la hipotenusa ."
      },
      {
        t: "D) 0 km",
        ok: false,
        fb: "Aunque regresó al punto de partida (desplazamiento nulo), sus alas sí trabajaron. El total recorrido no puede ser cero."
      }
    ]
  },
  {
    id: "T2F34",
    q: "Un vector con magnitud 10 y dirección suroeste (45° entre sur y oeste) tiene componentes aproximadamente:",
    opts: [
      {
        t: "A) (7.07, -7.07)",
        ok: false,
        fb: "Si el valor en x es positivo, TecDuck se está moviendo hacia el este. El suroeste requiere ir al oeste."
      },
      {
        t: "B) (-7.07, -7.07)",
        ok: true
      },
      {
        t: "C) (-7.07, 7.07)",
        ok: false,
        fb: "Una componente y positiva indica movimiento al norte. Revisa los signos para el sur."
      },
      {
        t: "D) (7.07, 7.07)",
        ok: false,
        fb: "Aquí ambas componentes son positivas, lo que apunta al noreste."
      }
    ]
  },
  {
    id: "T2F35",
    q: "Si un vector tiene componentes (a, b) y a es negativo, b es positivo, ¿hacia qué dirección apunta aproximadamente?",
    opts: [
      {
        t: "A) Noreste",
        ok: false,
        fb: "Para ir al noreste, TecDuck necesitaría que tanto el avance horizontal como el vertical fueran positivos."
      },
      {
        t: "B) Noroeste",
        ok: true
      },
      {
        t: "C) Sureste",
        ok: false,
        fb: "El sureste implica avanzar a la derecha (positivo) y bajar (negativo)."
      },
      {
        t: "D) Suroeste",
        ok: false,
        fb: "En el suroeste, ambos valores (x e y) deben ser negativos."
      }
    ]
  },
  {
    id: "T2F36",
    q: "La suma de dos vectores perpendiculares de magnitudes 3 y 4 tiene magnitud:",
    opts: [
      {
        t: "A) 5",
        ok: true
      },
      {
        t: "B) 7",
        ok: false,
        fb: "No sumes las magnitudes como si fueran números simples. Si los vectores forman un ángulo de 90°, debes usar el Teorema de Pitágoras."
      },
      {
        t: "C) 12",
        ok: false,
        fb: "Multiplicar las magnitudes no tiene una interpretación física en la suma de vectores."
      },
      {
        t: "D) 1",
        ok: false,
        fb: "El valor 1 resultaría si los vectores fueran opuestos (4 - 3), no perpendiculares."
      }
    ]
  },
  {
    id: "T2F37",
    q: "El vector (3, 4) y el vector (6, 8) son:",
    opts: [
      {
        t: "A) Perpendiculares",
        ok: false,
        fb: "Prueba el producto punto. Si no es cero, no pueden ser perpendiculares."
      },
      {
        t: "B) Paralelos (misma dirección)",
        ok: true
      },
      {
        t: "C) Opuestos",
        ok: false,
        fb: "Los vectores opuestos tienen signos contrarios. Estos tienen exactamente el mismo signo y proporción."
      },
      {
        t: "D) No relacionados",
        ok: false,
        fb: "Observa bien: ¿qué pasa si multiplicas el primer vector por 2?"
      }
    ]
  },
  {
    id: "T2F38",
    q: "La dirección del vector (0, -1) es:",
    opts: [
      {
        t: "A) 0°",
        ok: false,
        fb: "El ángulo 0° apunta a la derecha (eje X positivo)."
      },
      {
        t: "B) 90°",
        ok: false,
        fb: "90° es la dirección hacia arriba (eje Y positivo)."
      },
      {
        t: "C) 180°",
        ok: false,
        fb: "180° apunta hacia la izquierda (eje X negativo)."
      },
      {
        t: "D) 270°",
        ok: true
      }
    ]
  },
  {
    id: "T2F39",
    q: "¿Cuál es el vector unitario en la dirección de (0, -5)?",
    opts: [
      {
        t: "A) (0, -1)",
        ok: true
      },
      {
        t: "B) (0, 1)",
        ok: false,
        fb: "Este vector mide 1, pero apunta hacia arriba. Necesitas uno que mantenga el sentido hacia abajo del original."
      },
      {
        t: "C) (-1, 0)",
        ok: false,
        fb: "Cambiaste la dirección de vertical a horizontal (izquierda)."
      },
      {
        t: "D) (1, 0)",
        ok: false,
        fb: "Similar al anterior, este apunta a la derecha."
      }
    ]
  },
  {
    id: "T2F40",
    q: "Si un vector tiene magnitud 0, entonces:",
    opts: [
      {
        t: "A) Es el vector nulo",
        ok: false,
        fb: "Es una verdad parcial. Pero piensa: si no hay longitud, ¿podemos decir realmente hacia dónde apunta?"
      },
      {
        t: "B) No existe",
        ok: false,
        fb: "El vector existe y es una herramienta matemática real, simplemente sus componentes son (0, 0)."
      },
      {
        t: "C) Tiene dirección indefinida",
        ok: false,
        fb: "Es correcto, pero no es la única propiedad que define a este vector especial."
      },
      {
        t: "D) A y C son correctas",
        ok: true
      }
    ]
  }
]);
})();
