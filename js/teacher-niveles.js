/**
 * Lógica de dominio para los niveles personalizados del maestro.
 * Normaliza preguntas, gestiona logos, valida borradores y decide qué niveles
 * ve o puede jugar cada grupo. La persistencia real va en teacher-niveles-db.js.
 */
/** Devuelve una copia de todos los niveles que hay en caché en memoria. */
function nivelMaestroLeerTodos() {
  return _nivelMaestroDbCache ? _nivelMaestroDbCache.slice() : [];
}

/** Sustituye la caché en memoria por la lista de niveles indicada. */
function nivelMaestroGuardarTodos(lista) {
  _nivelMaestroDbCache = Array.isArray(lista) ? lista.slice() : [];
}

/** Reservado para IDs locales; en Supabase el id lo asigna la base de datos. */
function nivelMaestroGenerarId() {
  return null;
}

/** Arma un mapa de grupos del maestro, todos ocultos y sin fecha límite. */
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

/** Combina asignaciones guardadas con los grupos actuales del maestro. */
function nivelMaestroFusionarGrupos(existentes) {
  var base = nivelMaestroGruposVacios();
  if (!existentes || typeof existentes !== "object") {
    return base;
  }
  var keys = Object.keys(existentes);
  for (var i = 0; i < keys.length; i++) {
    base[keys[i]] = {
      visible: !!existentes[keys[i]].visible,
      fechaLimite: String(existentes[keys[i]].fechaLimite || "")
    };
  }
  return base;
}

var NIVEL_MAESTRO_LETRAS_OPCION = ["A", "B", "C", "D"];
var NIVEL_MAESTRO_LOGO_DEFAULT = "MAIN DUCK/BACKGROUND/Quiz_default.png";

/** Devuelve la URL del logo del nivel o la imagen por defecto del quiz. */
function nivelMaestroUrlLogo(nivel) {
  if (nivelMaestroEsLogoValido(nivel && nivel.logo)) {
    return nivel.logo;
  }
  return "../" + NIVEL_MAESTRO_LOGO_DEFAULT;
}
var NIVEL_LOGO_MAX_LADO = 200;
var NIVEL_LOGO_MAX_BYTES_ARCHIVO = 3 * 1024 * 1024;
var NIVEL_LOGO_MAX_DATA_URL = 150000;

/** Comprueba si el logo es un data URL de imagen dentro del tamaño permitido. */
function nivelMaestroEsLogoValido(str) {
  return (
    typeof str === "string" &&
    str.length > 0 &&
    str.length <= NIVEL_LOGO_MAX_DATA_URL &&
    str.indexOf("data:image/") === 0
  );
}

/** Lee una imagen del disco, la redimensiona y la convierte a JPEG en data URL. */
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

/** Añade el prefijo «A)», «B)», etc. al texto de una opción si aún no lo tiene. */
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

/** Convierte una pregunta en bruto al formato interno con enunciado y cuatro opciones. */
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

/** Normaliza un array de preguntas y descarta las que no estén completas. */
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

/** Mezcla un array al azar y devuelve una copia sin alterar el original. */
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

/** Devuelve todas las preguntas del nivel en un orden aleatorio para la partida. */
function nivelMaestroObtenerPreguntasPartida(nivel) {
  var banco = nivel && nivel.preguntas ? nivel.preguntas : [];
  if (!banco.length) {
    return [];
  }
  return nivelMaestroBarajar(banco);
}

/** Cuenta cuántas preguntas tiene un nivel. */
function nivelMaestroContarPreguntas(nivel) {
  return nivel && nivel.preguntas ? nivel.preguntas.length : 0;
}

/** Plantilla de pregunta vacía para el editor del maestro. */
function nivelMaestroPreguntaVacia() {
  return {
    q: "",
    opciones: ["", "", "", ""],
    correcta: 0,
    feedback: ["", "", "", ""]
  };
}

/** Pasa una pregunta guardada al formato editable del formulario. */
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

/** Arma un objeto de nivel completo y coherente a partir de datos sueltos. */
function nivelMaestroNormalizar(datos) {
  var id = datos.id != null ? String(datos.id) : null;
  var preguntas = nivelMaestroNormalizarListaPreguntas(datos.preguntas, id || "nuevo");
  var item = {
    id: id,
    dbId: id && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : datos.dbId || null,
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

/** Carga los niveles desde Supabase y actualiza la caché si hace falta. */
async function nivelMaestroCargarDesdeDb(force) {
  if (typeof nivelMaestroDbCargarTodos !== "function") {
    return [];
  }
  return nivelMaestroDbCargarTodos(!!force);
}

/** Revisa título, grupos y preguntas antes de guardar; devuelve { ok, errores }. */
function nivelMaestroValidarBorrador(datos) {
  var errores = [];
  datos = datos || {};
  var titulo = String(datos.titulo || "").trim();
  if (!titulo) {
    errores.push("Escribe un nombre para el nivel.");
  }
  var grupos = datos.grupos || {};
  var keysGrupo = Object.keys(grupos);
  var algunoVisible = false;
  for (var g = 0; g < keysGrupo.length; g++) {
    if (grupos[keysGrupo[g]] && grupos[keysGrupo[g]].visible) {
      algunoVisible = true;
      break;
    }
  }
  if (!keysGrupo.length) {
    errores.push("Primero crea un grupo en el panel del maestro.");
  } else if (!algunoVisible) {
    errores.push("Activa al menos un grupo para mostrar este nivel.");
  }
  var preguntas = datos.preguntas || [];
  if (!preguntas.length) {
    errores.push("Añade al menos una pregunta.");
  } else {
    var normalizadas = nivelMaestroNormalizarListaPreguntas(
      preguntas,
      datos.id || "tn-nuevo"
    );
    if (!normalizadas.length) {
      errores.push(
        "Cada pregunta necesita enunciado y las 4 opciones con texto."
      );
    }
  }
  return { ok: errores.length === 0, errores: errores };
}

/** Persiste un nivel en la base de datos a través de la capa db. */
async function nivelMaestroGuardarAsync(datos) {
  if (typeof nivelMaestroDbGuardar !== "function") {
    throw new Error("No está disponible el guardado en base de datos.");
  }
  return nivelMaestroDbGuardar(datos);
}

/** Borra un nivel de la base de datos por su identificador. */
async function nivelMaestroEliminarAsync(id) {
  if (typeof nivelMaestroDbEliminar !== "function") {
    throw new Error("No está disponible el borrado en base de datos.");
  }
  await nivelMaestroDbEliminar(id);
}

/** Busca un nivel en caché por id o dbId; devuelve null si no existe. */
function nivelMaestroPorId(id) {
  if (id == null || id === "") {
    return null;
  }
  var lista = nivelMaestroLeerTodos();
  var buscado = String(id);
  for (var i = 0; i < lista.length; i++) {
    if (String(lista[i].id) === buscado) {
      return lista[i];
    }
    if (lista[i].dbId != null && String(lista[i].dbId) === buscado) {
      return lista[i];
    }
  }
  return null;
}

/** Busca un nivel en caché y, si no está, lo pide a Supabase. */
async function nivelMaestroPorIdAsync(id) {
  if (id == null || id === "") {
    return null;
  }
  var cached = nivelMaestroPorId(id);
  if (cached) {
    return cached;
  }
  if (typeof nivelMaestroDbCargarUno === "function") {
    return nivelMaestroDbCargarUno(id);
  }
  return null;
}

/** Recarga desde la base de datos y devuelve los niveles visibles para un grupo. */
async function nivelMaestroParaGrupoAsync(grupoId) {
  if (typeof nivelMaestroCargarDesdeDb === "function") {
    await nivelMaestroCargarDesdeDb(true);
  }
  return nivelMaestroParaGrupo(grupoId);
}

/** Interpreta una fecha «YYYY-MM-DD» como fin de día o devuelve null si no es válida. */
function nivelMaestroParseFechaLimite(str) {
  if (!str) {
    return null;
  }
  var d = new Date(str + "T23:59:59");
  return isNaN(d.getTime()) ? null : d;
}

/** Obtiene la configuración de visibilidad y fecha límite de un nivel para un grupo. */
function nivelMaestroAsignacionGrupo(nivel, grupoId) {
  if (!nivel || !nivel.grupos || grupoId == null || grupoId === "") {
    return null;
  }
  var gid = String(grupoId);
  if (nivel.grupos[gid]) {
    return nivel.grupos[gid];
  }
  var keys = Object.keys(nivel.grupos);
  for (var i = 0; i < keys.length; i++) {
    if (String(keys[i]) === gid) {
      return nivel.grupos[keys[i]];
    }
  }
  return { visible: false, fechaLimite: "" };
}

/** Indica si el maestro dejó activo este nivel para el grupo (aunque ya haya vencido). */
function nivelMaestroVisibleParaGrupo(nivel, grupoId) {
  var a = nivelMaestroAsignacionGrupo(nivel, grupoId);
  return !!(a && a.visible);
}

/** Indica si la fecha límite del grupo ya pasó para este nivel. */
function nivelMaestroFechaVencida(nivel, grupoId) {
  if (!nivelMaestroVisibleParaGrupo(nivel, grupoId)) {
    return false;
  }
  var a = nivelMaestroAsignacionGrupo(nivel, grupoId);
  var fin = nivelMaestroParseFechaLimite(a.fechaLimite);
  return !!(fin && Date.now() > fin.getTime());
}

/** Indica si el alumno puede jugar el nivel ahora: visible, no vencido y con preguntas. */
function nivelMaestroJugableParaGrupo(nivel, grupoId) {
  return (
    nivelMaestroVisibleParaGrupo(nivel, grupoId) &&
    !nivelMaestroFechaVencida(nivel, grupoId) &&
    nivelMaestroContarPreguntas(nivel) > 0
  );
}

/** Lista los niveles visibles para un grupo, sin duplicados y del más reciente al más antiguo. */
function nivelMaestroParaGrupo(grupoId) {
  if (!grupoId) {
    return [];
  }
  var vistos = {};
  return nivelMaestroLeerTodos()
    .filter(function (n) {
      var id = String(n.id);
      if (vistos[id]) {
        return false;
      }
      if (
        !nivelMaestroVisibleParaGrupo(n, grupoId) ||
        nivelMaestroContarPreguntas(n) <= 0
      ) {
        return false;
      }
      vistos[id] = true;
      return true;
    })
    .sort(function (a, b) {
      return (b.actualizadoEn || 0) - (a.actualizadoEn || 0);
    });
}

/** Devuelve el nombre legible de un tema del currículo por su id. */
function nivelMaestroNombreTema(temaId) {
  var mapa = {
    "1": "Tema 1 · Coordenadas",
    "2": "Tema 2 · Vectores",
    "3": "Tema 3 · Suma y resta",
    "4": "Tema 4 · Escalar"
  };
  return mapa[String(temaId)] || "Tema " + temaId;
}

/** Texto corto con el número de preguntas del nivel para mostrar en listas. */
function nivelMaestroEtiquetaResumen(nivel) {
  var total = nivelMaestroContarPreguntas(nivel);
  if (!total) {
    return "Sin preguntas";
  }
  return total + " pregunta" + (total === 1 ? "" : "s");
}

/** Formatea una fecha ISO «YYYY-MM-DD» a «DD/MM/YYYY» para la interfaz. */
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
