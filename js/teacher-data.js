/**
 * Datos de demostración para el panel del maestro (localStorage).
 */
var CLAVE_ASIGNACIONES = "tec_duck_teacher_asignaciones";

function teacherLeerGrupos() {
  return typeof gruposLeer === "function" ? gruposLeer() : [];
}

function teacherGuardarGrupos(lista) {
  if (typeof gruposGuardar === "function") {
    gruposGuardar(lista);
  }
}

var TEACHER_TEMAS = [
  { id: "t1", nombre: "Coordenadas", corto: "Tema 1" },
  { id: "t2", nombre: "Vectores", corto: "Tema 2" },
  { id: "t3", nombre: "Suma y resta", corto: "Tema 3" },
  { id: "t4", nombre: "Escalar", corto: "Tema 4" }
];

var TEACHER_ALUMNOS_DEMO = [
  {
    id: "stu-ana",
    nombre: "Ana García",
    email: "ana@alumno.com",
    avatar: "🦆",
    temas: { t1: 7, t2: 6, t3: 4, t4: 3 },
    tiempoPromedio: 35,
    detalle: {
      temaActivo: "t2",
      nivel: "Básico",
      progresoNivel: 5,
      maxNivel: 10,
      tareas: [
        { ok: true, tiempo: 22 },
        { ok: true, tiempo: 18 },
        { ok: false, tiempo: 55 },
        { ok: true, tiempo: 30 },
        { ok: false, tiempo: 48 },
        { ok: true, tiempo: 25 }
      ]
    }
  },
  {
    id: "stu-juan",
    nombre: "Juan Pérez",
    email: "juan@alumno.com",
    avatar: "🦆",
    temas: { t1: 9, t2: 5, t3: 7, t4: 6 },
    tiempoPromedio: 42,
    detalle: {
      temaActivo: "t2",
      nivel: "Básico",
      progresoNivel: 5,
      maxNivel: 10,
      tareas: [
        { ok: true, tiempo: 20 },
        { ok: true, tiempo: 25 },
        { ok: true, tiempo: 28 },
        { ok: false, tiempo: 60 },
        { ok: true, tiempo: 32 },
        { ok: false, tiempo: 45 }
      ]
    }
  },
  {
    id: "stu-maria",
    nombre: "María López",
    email: "maria@alumno.com",
    avatar: "🦆",
    temas: { t1: 10, t2: 8, t3: 9, t4: 7 },
    tiempoPromedio: 28,
    detalle: {
      temaActivo: "t3",
      nivel: "Avanzado",
      progresoNivel: 6,
      maxNivel: 7,
      tareas: [
        { ok: true, tiempo: 15 },
        { ok: true, tiempo: 18 },
        { ok: true, tiempo: 22 },
        { ok: true, tiempo: 20 },
        { ok: true, tiempo: 19 },
        { ok: true, tiempo: 24 }
      ]
    }
  },
  {
    id: "stu-carlos",
    nombre: "Carlos Ruiz",
    email: "carlos@alumno.com",
    avatar: "🦆",
    temas: { t1: 4, t2: 3, t3: 2, t4: 5 },
    tiempoPromedio: 58,
    detalle: {
      temaActivo: "t1",
      nivel: "Básico",
      progresoNivel: 3,
      maxNivel: 10,
      tareas: [
        { ok: false, tiempo: 70 },
        { ok: true, tiempo: 45 },
        { ok: false, tiempo: 80 },
        { ok: false, tiempo: 65 },
        { ok: true, tiempo: 50 },
        { ok: false, tiempo: 72 }
      ]
    }
  },
  {
    id: "stu-laura",
    nombre: "Laura Martín",
    email: "laura@alumno.com",
    avatar: "🦆",
    temas: { t1: 6, t2: 7, t3: 5, t4: 8 },
    tiempoPromedio: 38,
    detalle: {
      temaActivo: "t4",
      nivel: "Básico",
      progresoNivel: 4,
      maxNivel: 10,
      tareas: [
        { ok: true, tiempo: 30 },
        { ok: false, tiempo: 52 },
        { ok: true, tiempo: 28 },
        { ok: true, tiempo: 35 },
        { ok: false, tiempo: 48 },
        { ok: true, tiempo: 33 }
      ]
    }
  },
  {
    id: "stu-diego",
    nombre: "Diego Soto",
    email: "diego@alumno.com",
    avatar: "🦆",
    temas: { t1: 8, t2: 9, t3: 6, t4: 5 },
    tiempoPromedio: 31,
    detalle: {
      temaActivo: "t2",
      nivel: "Avanzado",
      progresoNivel: 4,
      maxNivel: 7,
      tareas: [
        { ok: true, tiempo: 25 },
        { ok: true, tiempo: 22 },
        { ok: true, tiempo: 28 },
        { ok: false, tiempo: 40 },
        { ok: true, tiempo: 26 },
        { ok: true, tiempo: 24 }
      ]
    }
  }
];

function teacherLeerAsignaciones() {
  try {
    var raw = localStorage.getItem(CLAVE_ASIGNACIONES);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function teacherGuardarAsignaciones(mapa) {
  localStorage.setItem(CLAVE_ASIGNACIONES, JSON.stringify(mapa));
}

function teacherAsignacionPorDefecto() {
  return {
    "stu-ana": ["grupo-a"],
    "stu-juan": ["grupo-a"],
    "stu-maria": ["grupo-b"],
    "stu-carlos": ["grupo-b"],
    "stu-laura": ["grupo-a", "grupo-b"],
    "stu-diego": ["grupo-b"]
  };
}

function teacherObtenerAsignaciones() {
  var guardado = teacherLeerAsignaciones();
  var keys = Object.keys(guardado);
  if (!keys.length) {
    var d = teacherAsignacionPorDefecto();
    teacherGuardarAsignaciones(d);
    return d;
  }
  return guardado;
}

function teacherAlumnosEnGrupo(grupoId) {
  if (!grupoId || grupoId === "grupo-todos") {
    return TEACHER_ALUMNOS_DEMO.slice();
  }
  var asig = teacherObtenerAsignaciones();
  return TEACHER_ALUMNOS_DEMO.filter(function (a) {
    var gs = asig[a.id] || [];
    return gs.indexOf(grupoId) >= 0;
  });
}

function teacherColorBarra(puntos, max) {
  max = max || 10;
  var r = puntos / max;
  if (r >= 0.7) return "bar-green";
  if (r >= 0.4) return "bar-orange";
  return "bar-red";
}

function teacherNombreTema(id) {
  for (var i = 0; i < TEACHER_TEMAS.length; i++) {
    if (TEACHER_TEMAS[i].id === id) {
      return TEACHER_TEMAS[i];
    }
  }
  return { nombre: id, corto: id };
}
