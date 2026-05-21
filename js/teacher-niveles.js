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
var NIVEL_MAESTRO_LOGO_DEFAULT = "MAIN DUCK/BACKGROUND/Quiz_default.png";

/** URL del logo en pantallas dentro de /pages/ */
function nivelMaestroUrlLogo(nivel) {
  if (nivelMaestroEsLogoValido(nivel && nivel.logo)) {
    return nivel.logo;
  }
  return "../" + NIVEL_MAESTRO_LOGO_DEFAULT;
}
var NIVEL_LOGO_MAX_LADO = 200;
var NIVEL_LOGO_MAX_BYTES_ARCHIVO = 3 * 1024 * 1024;
var NIVEL_LOGO_MAX_DATA_URL = 150000;

function nivelMaestroEsLogoValido(str) {
  return (
    typeof str === "string" &&
    str.length > 0 &&
    str.length <= NIVEL_LOGO_MAX_DATA_URL &&
    str.indexOf("data:image/") === 0
  );
}

/**
 * Redimensiona una imagen y devuelve data URL JPEG para guardar en el nivel.
 */
function nivelMaestroProcesarArchivoLogo(archivo, callback) {
  callback = typeof callback === "function" ? callback : function () {};
  if (!archivo || !archivo.type || archivo.type.indexOf("image/") !== 0) {
    callback({ ok: false, error: "Elige un archivo de imagen (PNG, JPG o WebP)." });
    return;
  }
  if (archivo.size > NIVEL_LOGO_MAX_BYTES_ARCHIVO) {
    callback({ ok: false, error: "La imagen es muy pesada. Usa una menor a 3 MB." });
    return;
  }
  var reader = new FileReader();
  reader.onload = function () {
    var img = new Image();
    img.onload = function () {
      var w = img.width;
      var h = img.height;
      var max = NIVEL_LOGO_MAX_LADO;
      if (w > max || h > max) {
        if (w >= h) {
          h = Math.round((h * max) / w);
          w = max;
        } else {
          w = Math.round((w * max) / h);
          h = max;
        }
      }
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");
      if (!ctx) {
        callback({ ok: false, error: "No se pudo procesar la imagen." });
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      var dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      if (dataUrl.length > NIVEL_LOGO_MAX_DATA_URL) {
        dataUrl = canvas.toDataURL("image/jpeg", 0.65);
      }
      if (!nivelMaestroEsLogoValido(dataUrl)) {
        callback({
          ok: false,
          error: "La imagen sigue siendo muy grande. Prueba con otra más pequeña."
        });
        return;
      }
      callback({ ok: true, logo: dataUrl });
    };
    img.onerror = function () {
      callback({ ok: false, error: "No se pudo leer la imagen." });
    };
    img.src = reader.result;
  };
  reader.onerror = function () {
    callback({ ok: false, error: "No se pudo cargar el archivo." });
  };
  reader.readAsDataURL(archivo);
}

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
  var item = {
    id: id,
    titulo: String(datos.titulo || "Nivel sin nombre").trim() || "Nivel sin nombre",
    preguntas: preguntas,
    grupos: nivelMaestroFusionarGrupos(datos.grupos),
    creadoEn: datos.creadoEn || Date.now(),
    actualizadoEn: Date.now()
  };
  if (nivelMaestroEsLogoValido(datos.logo)) {
    item.logo = datos.logo;
  }
  return item;
}

function nivelMaestroGuardar(datos) {
  var lista = nivelMaestroLeerTodos();
  var item = nivelMaestroNormalizar(datos);
  var idx = -1;
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id === item.id) {
      idx = i;
      item.creadoEn = lista[i].creadoEn;
      if (datos.logo === "" || datos.logo === null) {
        delete item.logo;
      } else if (
        datos.logo === undefined &&
        !item.logo &&
        nivelMaestroEsLogoValido(lista[i].logo)
      ) {
        item.logo = lista[i].logo;
      }
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

/** ¿El maestro activó este nivel para el grupo? (sigue en Temas aunque venza) */
function nivelMaestroVisibleParaGrupo(nivel, grupoId) {
  var a = nivelMaestroAsignacionGrupo(nivel, grupoId);
  return !!(a && a.visible);
}

/** ¿Ya pasó la fecha límite del grupo? */
function nivelMaestroFechaVencida(nivel, grupoId) {
  if (!nivelMaestroVisibleParaGrupo(nivel, grupoId)) {
    return false;
  }
  var a = nivelMaestroAsignacionGrupo(nivel, grupoId);
  var fin = nivelMaestroParseFechaLimite(a.fechaLimite);
  return !!(fin && Date.now() > fin.getTime());
}

/** ¿El alumno puede jugarlo ahora? */
function nivelMaestroJugableParaGrupo(nivel, grupoId) {
  return (
    nivelMaestroVisibleParaGrupo(nivel, grupoId) &&
    !nivelMaestroFechaVencida(nivel, grupoId) &&
    nivelMaestroContarPreguntas(nivel) > 0
  );
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
