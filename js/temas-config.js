// Catálogo de los 4 temas del currículo. Una sola fuente para UI de alumno,
// panel del maestro y exportaciones. TEACHER_TEMAS apunta aquí si no existe ya.
var TEC_DUCK_TEMAS = [
  {
    id: "t1",
    dbId: 1,
    codigo: "1",
    nombre: "Coordenadas",
    corto: "Tema 1",
    descripcion: "Plano cartesiano, cuadrantes y coordenadas de puntos.",
    titulo: "Ubicación de puntos en el plano cartesiano",
    tagline: "Coordenadas, ejes y cuadrantes",
    backgroundImg:
      "../MAIN DUCK/BACKGROUND/Ubicación de puntos en el plano cartesiano.png",
    cssClass: "c-tema1",
    img: "../MAIN DUCK/DUCK/Duck_tema1.png"
  },
  {
    id: "t2",
    dbId: 2,
    codigo: "2",
    nombre: "Vectores",
    corto: "Tema 2",
    descripcion: "Magnitud, dirección, sentido y representación.",
    titulo: "Dibujo y representación de vectores",
    tagline: "Módulo, dirección y sentido",
    backgroundImg:
      "../MAIN DUCK/BACKGROUND/Dibujo y Representación de Vectores.png",
    cssClass: "c-tema2",
    img: "../MAIN DUCK/DUCK/Duck_tema2.png"
  },
  {
    id: "t3",
    dbId: 3,
    codigo: "3",
    nombre: "Suma y resta",
    corto: "Tema 3",
    descripcion: "Operaciones con vectores en el plano.",
    titulo: "Suma y resta de vectores",
    tagline: "Método del paralelogramo y del triángulo",
    backgroundImg: "../MAIN DUCK/BACKGROUND/Suma y Resta de Vectores.png",
    cssClass: "c-tema3",
    img: "../MAIN DUCK/DUCK/Duck_tema3.png"
  },
  {
    id: "t4",
    dbId: 4,
    codigo: "4",
    nombre: "Escalar",
    corto: "Tema 4",
    descripcion: "Producto de un escalar por un vector.",
    titulo: "Multiplicación por escalar",
    tagline: "Amplía o invierte un vector",
    backgroundImg: "../MAIN DUCK/BACKGROUND/Multiplicación por escalar.png",
    cssClass: "c-tema4",
    img: "../MAIN DUCK/DUCK/Duck_tema4.png"
  }
];

// Mapeo id numérico de la BD → id de UI (t1, t2, …).
var TEC_DUCK_TEMA_DB_A_UI = {
  1: "t1",
  2: "t2",
  3: "t3",
  4: "t4"
};

if (typeof TEACHER_TEMAS === "undefined") {
  var TEACHER_TEMAS = TEC_DUCK_TEMAS;
}
if (typeof TEACHER_TEMA_DB_A_UI === "undefined") {
  var TEACHER_TEMA_DB_A_UI = TEC_DUCK_TEMA_DB_A_UI;
}
