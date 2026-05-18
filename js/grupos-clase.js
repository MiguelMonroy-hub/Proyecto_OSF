/**
 * Grupos de clase: códigos de 6 caracteres y vínculo alumno ↔ grupo (localStorage).
 */
var CLAVE_GRUPOS = "tec_duck_teacher_grupos";
var CLAVE_ASIGNACIONES = "tec_duck_teacher_asignaciones";
var CLAVE_ALUMNO_SESION = "tec_duck_alumno_sesion";
var CLAVE_ALUMNO_GRUPO = "tec_duck_alumno_grupo_vinculo";

var GRUPO_CODIGO_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function normalizarEmailAlumno(correo) {
  return String(correo || "")
    .trim()
    .toLowerCase();
}

function normalizarCodigoGrupo(codigo) {
  return String(codigo || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function gruposPorDefecto() {
  return [
    { id: "grupo-todos", nombre: "Todos los alumnos", sistema: true },
    {
      id: "grupo-a",
      nombre: "Grupo matutino",
      sistema: false,
      codigo: "MATUT1"
    },
    {
      id: "grupo-b",
      nombre: "Grupo vespertino",
      sistema: false,
      codigo: "VESPT2"
    }
  ];
}

function gruposGenerarCodigo() {
  var s = "";
  for (var i = 0; i < 6; i++) {
    s += GRUPO_CODIGO_CHARS.charAt(
      Math.floor(Math.random() * GRUPO_CODIGO_CHARS.length)
    );
  }
  return s;
}

function gruposCodigosEnUso(lista) {
  var usados = {};
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].codigo) {
      usados[normalizarCodigoGrupo(lista[i].codigo)] = true;
    }
  }
  return usados;
}

function gruposGenerarCodigoUnico(lista) {
  lista = lista || gruposLeer();
  var usados = gruposCodigosEnUso(lista);
  var intentos = 0;
  var codigo;
  do {
    codigo = gruposGenerarCodigo();
    intentos += 1;
  } while (usados[codigo] && intentos < 80);
  return codigo;
}

function gruposAsegurarCodigos(lista) {
  var cambio = false;
  var usados = gruposCodigosEnUso(lista);
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].sistema) {
      continue;
    }
    var c = normalizarCodigoGrupo(lista[i].codigo);
    if (c.length !== 6) {
      c = gruposGenerarCodigo();
      while (usados[c]) {
        c = gruposGenerarCodigo();
      }
      lista[i].codigo = c;
      usados[c] = true;
      cambio = true;
    } else {
      lista[i].codigo = c;
      if (!usados[c]) {
        usados[c] = true;
      }
    }
  }
  return cambio;
}

function gruposLeer() {
  try {
    var raw = localStorage.getItem(CLAVE_GRUPOS);
    if (raw) {
      var lista = JSON.parse(raw);
      if (gruposAsegurarCodigos(lista)) {
        gruposGuardar(lista);
      }
      return lista;
    }
  } catch (e) {
    /* noop */
  }
  var def = gruposPorDefecto();
  gruposAsegurarCodigos(def);
  gruposGuardar(def);
  return def;
}

function gruposGuardar(lista) {
  localStorage.setItem(CLAVE_GRUPOS, JSON.stringify(lista));
}

function gruposBuscarPorCodigo(codigo) {
  var c = normalizarCodigoGrupo(codigo);
  if (c.length !== 6) {
    return null;
  }
  var lista = gruposLeer();
  for (var i = 0; i < lista.length; i++) {
    var g = lista[i];
    if (g.sistema) {
      continue;
    }
    if (normalizarCodigoGrupo(g.codigo) === c) {
      return g;
    }
  }
  return null;
}

function alumnoSesionGuardar(correo) {
  localStorage.setItem(
    CLAVE_ALUMNO_SESION,
    JSON.stringify({
      email: normalizarEmailAlumno(correo),
      desde: Date.now()
    })
  );
}

function alumnoSesionEmail() {
  try {
    var raw = localStorage.getItem(CLAVE_ALUMNO_SESION);
    if (!raw) {
      return "";
    }
    var s = JSON.parse(raw);
    return s && s.email ? s.email : "";
  } catch (e) {
    return "";
  }
}

function alumnoLeerVinculos() {
  try {
    var raw = localStorage.getItem(CLAVE_ALUMNO_GRUPO);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function alumnoGuardarVinculos(mapa) {
  localStorage.setItem(CLAVE_ALUMNO_GRUPO, JSON.stringify(mapa));
}

function alumnoTieneGrupoVinculado(correo) {
  correo = normalizarEmailAlumno(correo || alumnoSesionEmail());
  if (!correo) {
    return false;
  }
  var mapa = alumnoLeerVinculos();
  return !!(mapa[correo] && mapa[correo].grupoId);
}

function alumnoObtenerGrupoVinculado(correo) {
  correo = normalizarEmailAlumno(correo || alumnoSesionEmail());
  var mapa = alumnoLeerVinculos();
  return mapa[correo] || null;
}

function alumnoVincularGrupo(correo, grupo) {
  correo = normalizarEmailAlumno(correo);
  if (!correo || !grupo || grupo.sistema) {
    return false;
  }
  var mapa = alumnoLeerVinculos();
  mapa[correo] = {
    grupoId: grupo.id,
    codigo: normalizarCodigoGrupo(grupo.codigo),
    nombreGrupo: grupo.nombre,
    vinculadoEn: Date.now()
  };
  alumnoGuardarVinculos(mapa);
  return true;
}

function alumnoVincularPorCodigo(correo, codigo) {
  var grupo = gruposBuscarPorCodigo(codigo);
  if (!grupo) {
    return { ok: false, error: "Código no válido. Revisa con tu maestro." };
  }
  alumnoVincularGrupo(correo, grupo);
  return {
    ok: true,
    grupo: grupo,
    vinculo: alumnoObtenerGrupoVinculado(correo)
  };
}

function redirigirAlumnoTrasLogin(correo) {
  alumnoSesionGuardar(correo);
  if (alumnoTieneGrupoVinculado(correo)) {
    window.location.href = "topics.html";
  } else {
    window.location.href = "join-group.html";
  }
}

function gruposCrear(nombre) {
  nombre = String(nombre || "").trim();
  if (!nombre) {
    return null;
  }
  var lista = gruposLeer();
  var codigo = gruposGenerarCodigoUnico(lista);
  var nuevo = {
    id: "grupo-" + Date.now(),
    nombre: nombre,
    sistema: false,
    codigo: codigo
  };
  lista.push(nuevo);
  gruposGuardar(lista);
  return nuevo;
}
