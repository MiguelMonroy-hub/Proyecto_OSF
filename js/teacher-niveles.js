/**
 * Niveles personalizados del maestro (localStorage).
 */
var CLAVE_NIVELES_MAESTRO = "tec_duck_teacher_niveles";

function nivelMaestroLeerTodos() {
  try {
    var raw = localStorage.getItem(CLAVE_NIVELES_MAESTRO);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function nivelMaestroGuardarTodos(lista) {
  localStorage.setItem(CLAVE_NIVELES_MAESTRO, JSON.stringify(lista));
}

function nivelMaestroGenerarId() {
  return "tn-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

function nivelMaestroGruposVacios() {
  var mapa = {};
  var grupos = typeof gruposLeer === "function" ? gruposLeer() : [];
  for (var i = 0; i < grupos.length; i++) {
    if (!grupos[i].sistema) {
      mapa[grupos[i].id] = { visible: false, fechaLimite: "" };
    }
  }
  return mapa;
}

function nivelMaestroFusionarGrupos(existentes) {
  var base = nivelMaestroGruposVacios();
  if (!existentes || typeof existentes !== "object") {
    return base;
  }
  var keys = Object.keys(existentes);
  for (var i = 0; i < keys.length; i++) {
    if (base[keys[i]]) {
      base[keys[i]] = {
        visible: !!existentes[keys[i]].visible,
        fechaLimite: String(existentes[keys[i]].fechaLimite || "")
      };
    }
  }
  return base;
}

var NIVEL_MAESTRO_LETRAS_OPCION = ["A", "B", "C", "D"];

function nivelMaestroPrefijoOpcion(letra, texto) {
  texto = String(texto || "").trim();
  if (!texto) {
    return "";
  }
  var pref = letra + ") ";
  if (texto.toUpperCase().indexOf(letra + ")") === 0) {
    return texto;
  }
  return pref + texto;
}

function nivelMaestroNormalizarPregunta(raw, idx, nivelId) {
  if (!raw) {
    return null;
  }
  var q = String(raw.q || "").trim();
  if (!q) {
    return null;
  }
  var correcta = parseInt(raw.correcta, 10);
  if (isNaN(correcta) || correcta < 0 || correcta > 3) {
    correcta = 0;
  }
  var textos = raw.opciones;
  if (!Array.isArray(textos)) {
    textos = [
      raw.opt0 || raw.optA,
      raw.opt1 || raw.optB,
      raw.opt2 || raw.optC,
      raw.opt3 || raw.optD
    ];
  }
  var feedback = raw.feedback || raw.fbs || [];
  var opts = [];
  for (var i = 0; i < 4; i++) {
    var t = nivelMaestroPrefijoOpcion(
      NIVEL_MAESTRO_LETRAS_OPCION[i],
      textos[i]
    );
    if (!t) {
      return null;
    }
    var op = { t: t, ok: i === correcta };
    if (!op.ok && feedback[i]) {
      var fb = String(feedback[i]).trim();
      if (fb) {
        op.fb = fb;
      }
    }
    opts.push(op);
  }
  return {
    id: raw.id || String(nivelId || "tn") + "-q" + idx,
    q: q,
    opts: opts
  };
}

function nivelMaestroNormalizarListaPreguntas(arr, nivelId) {
  if (!Array.isArray(arr)) {
    return [];
  }
  var out = [];
  for (var i = 0; i < arr.length; i++) {
    var p = nivelMaestroNormalizarPregunta(arr[i], i, nivelId);
    if (p) {
      out.push(p);
    }
  }
  return out;
}

function nivelMaestroBarajar(arr) {
  var copia = arr.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = copia[i];
    copia[i] = copia[j];
    copia[j] = tmp;
  }
  return copia;
}

/** Preguntas que verá el alumno en una partida (todas, en orden aleatorio). */
function nivelMaestroObtenerPreguntasPartida(nivel) {
  var banco = nivel && nivel.preguntas ? nivel.preguntas : [];
  if (!banco.length) {
    return [];
  }
  return nivelMaestroBarajar(banco);
}

function nivelMaestroContarPreguntas(nivel) {
  return nivel && nivel.preguntas ? nivel.preguntas.length : 0;
}

function nivelMaestroPreguntaVacia() {
  return {
    q: "",
    opciones: ["", "", "", ""],
    correcta: 0,
    feedback: ["", "", "", ""]
  };
}

function nivelMaestroDesdePreguntaGuardada(p) {
  if (!p || !p.opts) {
    return nivelMaestroPreguntaVacia();
  }
  var letras = NIVEL_MAESTRO_LETRAS_OPCION;
  var opciones = ["", "", "", ""];
  var feedback = ["", "", "", ""];
  var correcta = 0;
  for (var i = 0; i < p.opts.length && i < 4; i++) {
    var t = String(p.opts[i].t || "");
    var pref = letras[i] + ") ";
    opciones[i] =
      t.toUpperCase().indexOf(pref) === 0 ? t.slice(pref.length).trim() : t;
    if (p.opts[i].ok) {
      correcta = i;
    }
    if (p.opts[i].fb) {
      feedback[i] = p.opts[i].fb;
    }
  }
  return {
    id: p.id,
    q: p.q || "",
    opciones: opciones,
    correcta: correcta,
    feedback: feedback
  };
}

function nivelMaestroNormalizar(datos) {
  var id = datos.id || nivelMaestroGenerarId();
  var preguntas = nivelMaestroNormalizarListaPreguntas(datos.preguntas, id);
  return {
    id: id,
    titulo: String(datos.titulo || "Nivel sin nombre").trim() || "Nivel sin nombre",
    preguntas: preguntas,
    grupos: nivelMaestroFusionarGrupos(datos.grupos),
    creadoEn: datos.creadoEn || Date.now(),
    actualizadoEn: Date.now()
  };
}

function nivelMaestroGuardar(datos) {
  var lista = nivelMaestroLeerTodos();
  var item = nivelMaestroNormalizar(datos);
  var idx = -1;
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id === item.id) {
      idx = i;
      item.creadoEn = lista[i].creadoEn;
      break;
    }
  }
  if (idx >= 0) {
    lista[idx] = item;
  } else {
    lista.push(item);
  }
  nivelMaestroGuardarTodos(lista);
  return item;
}

function nivelMaestroEliminar(id) {
  var lista = nivelMaestroLeerTodos().filter(function (n) {
    return n.id !== id;
  });
  nivelMaestroGuardarTodos(lista);
}

function nivelMaestroPorId(id) {
  var lista = nivelMaestroLeerTodos();
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id === id) {
      return lista[i];
    }
  }
  return null;
}

function nivelMaestroParseFechaLimite(str) {
  if (!str) {
    return null;
  }
  var d = new Date(str + "T23:59:59");
  return isNaN(d.getTime()) ? null : d;
}

function nivelMaestroAsignacionGrupo(nivel, grupoId) {
  if (!nivel || !nivel.grupos) {
    return null;
  }
  return nivel.grupos[grupoId] || { visible: false, fechaLimite: "" };
}

/** ¿El nivel está visible y vigente para un grupo? */
function nivelMaestroVisibleParaGrupo(nivel, grupoId) {
  var a = nivelMaestroAsignacionGrupo(nivel, grupoId);
  if (!a || !a.visible) {
    return false;
  }
  var fin = nivelMaestroParseFechaLimite(a.fechaLimite);
  if (fin && Date.now() > fin.getTime()) {
    return false;
  }
  return true;
}

function nivelMaestroParaGrupo(grupoId) {
  if (!grupoId) {
    return [];
  }
  return nivelMaestroLeerTodos()
    .filter(function (n) {
      return (
        nivelMaestroVisibleParaGrupo(n, grupoId) &&
        nivelMaestroContarPreguntas(n) > 0
      );
    })
    .sort(function (a, b) {
      return (b.actualizadoEn || 0) - (a.actualizadoEn || 0);
    });
}

function nivelMaestroNombreTema(temaId) {
  var mapa = {
    "1": "Tema 1 · Coordenadas",
    "2": "Tema 2 · Vectores",
    "3": "Tema 3 · Suma y resta",
    "4": "Tema 4 · Escalar"
  };
  return mapa[String(temaId)] || "Tema " + temaId;
}

function nivelMaestroEtiquetaResumen(nivel) {
  var total = nivelMaestroContarPreguntas(nivel);
  if (!total) {
    return "Sin preguntas";
  }
  return total + " pregunta" + (total === 1 ? "" : "s");
}

function nivelMaestroEtiquetaFecha(str) {
  if (!str) {
    return "Sin fecha límite";
  }
  var partes = str.split("-");
  if (partes.length !== 3) {
    return str;
  }
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}
