// Estado compartido del panel del maestro: filtros, paginación y qué fila está expandida.
// Lo leen teacher-dashboard.js y los módulos de detalle/export.
var teacherDashSesionLista = false; // true cuando ya pasó auth de maestro
var TEACHER_POR_PAGINA = 25; // filas por página en la tabla de alumnos
var teacherDashEstado = {
  grupoId: "grupo-todos",
  busqueda: "",
  periodo: "today",
  expandidoId: null,
  detalleTemaId: null,
  detalleModoId: null,
  detalleIntentoId: null,
  grupoAsignarId: null,
  paginaActual: 1
};
