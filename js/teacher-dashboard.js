(function () {
  "use strict";

  var sesionLista = false;

  var estado = {
    grupoId: "grupo-todos",
    busqueda: "",
    periodo: "today",
    expandidoId: null,
    detalleTemaId: null,
    detalleModoId: null,
    detalleIntentoId: null,
    grupoAsignarId: null
  };

  var elHead = document.getElementById("teacher-table-head");
  var elBody = document.getElementById("teacher-table-body");
  var elEmpty = document.getElementById("teacher-empty");
  var elSearch = document.getElementById("teacher-search");
  var elGrupoFilter = document.getElementById("teacher-grupo-filter");
  var modalGrupos = document.getElementById("teacher-modal-grupos");

  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function barraHtml(puntos, max, etiqueta) {
    max = max || 10;
    var pct = Math.round((puntos / max) * 100);
    var cls = teacherColorBarra(puntos, max);
    var label =
      etiqueta != null
        ? etiqueta
        : max === 100
          ? pct + "%"
          : puntos + "/" + max;
    return (
      '<div class="teacher-bar-wrap ' +
      cls +
      '">' +
      '<div class="teacher-bar-track"><div class="teacher-bar-fill" style="width:' +
      pct +
      '%"></div></div>' +
      '<span class="teacher-bar-score">' +
      label +
      "</span></div>"
    );
  }

  function barraPorcentajeAciertosHtml(pct) {
    return barraHtml(pct, 100, pct + "%");
  }

  function barraNivelCompletoHtml(ok, total) {
    ok = ok || 0;
    total = total || 10;
    return barraHtml(ok, total, ok + "/" + total);
  }

  function htmlBarrasIntento(intento) {
    if (!intento) {
      return (
        '<div class="teacher-intento-bars">' +
        '<div class="teacher-intento-bar">' +
        "<span class=\"teacher-intento-bar-label\">Nivel completado</span>" +
        barraNivelCompletoHtml(0, 10) +
        "</div></div>"
      );
    }
    return (
      '<div class="teacher-intento-bars">' +
      '<div class="teacher-intento-bar">' +
      "<span class=\"teacher-intento-bar-label\">Nivel completado</span>" +
      barraNivelCompletoHtml(
        intento.nivelCompletoOk,
        intento.nivelCompletoTotal || intento.total
      ) +
      "</div></div>"
    );
  }

  function formatearFechaPartida(iso) {
    if (!iso) {
      return "—";
    }
    try {
      var d = new Date(iso);
      return d.toLocaleString("es-MX", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return String(iso);
    }
  }

  function claseEstadoIntento(estado) {
    var e = String(estado || "").toUpperCase();
    if (e === "COMPLETADA") {
      return "teacher-intento--ok";
    }
    if (e === "GAME_OVER") {
      return "teacher-intento--fail";
    }
    if (e === "ABANDONADA") {
      return "teacher-intento--warn";
    }
    if (e === "EN_CURSO") {
      return "teacher-intento--curso";
    }
    return "";
  }

  function filtrarAlumnos(lista) {
    var q = estado.busqueda.trim().toLowerCase();
    if (!q) {
      return lista;
    }
    return lista.filter(function (a) {
      return (
        a.nombre.toLowerCase().indexOf(q) >= 0 ||
        a.email.toLowerCase().indexOf(q) >= 0
      );
    });
  }

  function pintarSelectGrupos() {
    if (!elGrupoFilter) {
      return;
    }
    var grupos = teacherLeerGrupos();
    if (!grupos.length) {
      grupos = [{ id: "grupo-todos", nombre: "Todos los alumnos", sistema: true }];
    }
    elGrupoFilter.innerHTML = "";
    for (var i = 0; i < grupos.length; i++) {
      var g = grupos[i];
      var opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent =
        g.nombre || (g.sistema ? "Todos los alumnos" : "Grupo sin nombre");
      if (g.id === estado.grupoId) {
        opt.selected = true;
      }
      elGrupoFilter.appendChild(opt);
    }
  }

  function pintarCabeceraTabla() {
    var html =
      '<th>Alumno</th>';
    for (var i = 0; i < TEACHER_TEMAS.length; i++) {
      html += "<th>" + escHtml(TEACHER_TEMAS[i].corto) + "</th>";
    }
    html += "<th>Tiempo prom.</th>";
    elHead.innerHTML = html;
  }

  function resetSeleccionDetalle(detalle) {
    if (typeof teacherPrimerTemaConIntentos === "function" && detalle) {
      estado.detalleTemaId = teacherPrimerTemaConIntentos(detalle);
    } else {
      estado.detalleTemaId = "t1";
    }
    if (typeof teacherPrimerModoConIntentos === "function" && detalle) {
      estado.detalleModoId = teacherPrimerModoConIntentos(
        detalle,
        estado.detalleTemaId
      );
    } else {
      estado.detalleModoId = "FACIL";
    }
    var it =
      typeof teacherIntentoSeleccionado === "function"
        ? teacherIntentoSeleccionado(
            detalle,
            estado.detalleTemaId,
            null,
            estado.detalleModoId
          )
        : null;
    estado.detalleIntentoId = it ? it.id : null;
  }

  function modoLabelUi(modoId) {
    return String(modoId || "").toUpperCase() === "DIFICIL" ? "Avanzado" : "Básico";
  }

  function vistaDetalleAlumno(alumno) {
    var d = alumno.detalle || teacherDetalleVacio();
    var temaId = estado.detalleTemaId || d.temaActivo || "t1";
    var modoId = estado.detalleModoId;
    if (!modoId) {
      if (typeof teacherPrimerModoConIntentos === "function") {
        modoId = teacherPrimerModoConIntentos(d, temaId);
      } else {
        modoId = "FACIL";
      }
      estado.detalleModoId = modoId;
    }
    var intentosTema =
      typeof teacherIntentosPorTema === "function"
        ? teacherIntentosPorTema(d.intentos, temaId, modoId)
        : [];
    var intento =
      typeof teacherIntentoSeleccionado === "function"
        ? teacherIntentoSeleccionado(
            d,
            temaId,
            estado.detalleIntentoId,
            modoId
          )
        : null;
    if (intento && String(intento.id) !== String(estado.detalleIntentoId)) {
      estado.detalleIntentoId = intento.id;
    }
    if (!intentosTema.length) {
      estado.detalleIntentoId = null;
    }
    return {
      detalle: d,
      temaId: temaId,
      modoId: modoId,
      tema: teacherNombreTema(temaId),
      intentosTema: intentosTema,
      intento: intento
    };
  }

  function esPartidaSinVidas(estadoPartida) {
    return String(estadoPartida || "").toUpperCase() === "GAME_OVER";
  }

  function htmlResultadoTarea(t, estadoPartida) {
    var est = String(estadoPartida || "").toUpperCase();
    var sinVidas = est === "GAME_OVER";
    if (sinVidas && t.omitida) {
      return '<span class="task-omitida">No contestada</span>';
    }
    if (t.contestada === false && !t.ok) {
      if (est === "EN_CURSO") {
        return '<span class="task-partial">En curso</span>';
      }
      return '<span class="task-fail">✗</span>';
    }
    return (
      "<span class='" +
      (t.ok ? "task-ok" : "task-fail") +
      "'>" +
      (t.ok ? "✓" : "✗") +
      "</span>"
    );
  }

  function htmlDetalle(alumno) {
    var vista = vistaDetalleAlumno(alumno);
    var d = vista.detalle;
    var tema = vista.tema;
    var intento = vista.intento;
    var intentosTema = vista.intentosTema;
    var tareas = intento ? intento.tareas || [] : [];
    var estadoIntento = intento ? intento.estado : "";
    var modoLabel = modoLabelUi(vista.modoId);
    var sinIntentosModo = !intentosTema.length;
    var tareasHtml = "";
    if (!tareas.length) {
      tareasHtml =
        '<tr><td colspan="4">' +
        escHtml(
          sinIntentosModo
            ? "El alumno aún no ha intentado el nivel " +
                modoLabel.toLowerCase() +
                " de " +
                tema.corto +
                " en este periodo."
            : "Selecciona un intento para ver el detalle."
        ) +
        "</td></tr>";
    }
    for (var i = 0; i < tareas.length; i++) {
      var t = tareas[i];
      var noContestada = esPartidaSinVidas(estadoIntento) && t.omitida;
      var resultado = htmlResultadoTarea(t, estadoIntento);
      tareasHtml +=
        "<tr><td>" +
        escHtml(t.texto || "Pregunta " + (i + 1)) +
        "</td><td>" +
        resultado +
        "</td><td>" +
        (noContestada ? "—" : t.errores) +
        "</td><td>" +
        (noContestada || t.contestada === false ? "—" : t.tiempo + "s") +
        "</td></tr>";
    }

    var intentosHtml = "";
    if (!intentosTema.length) {
      intentosHtml =
        '<li class="teacher-intento-empty">' +
        escHtml(
          "Aún no hay intentos de nivel " +
            modoLabel.toLowerCase() +
            " en este periodo."
        ) +
        "</li>";
    }
    for (var k = 0; k < intentosTema.length; k++) {
      var it = intentosTema[k];
      var selIntento =
        intento && String(it.id) === String(intento.id) ? " is-selected" : "";
      intentosHtml +=
        '<li class="teacher-intento ' +
        claseEstadoIntento(it.estado) +
        selIntento +
        '" role="button" tabindex="0" data-detalle-intento="' +
        escHtml(String(it.id)) +
        '">' +
        '<div class="teacher-intento-head">' +
        "<strong>" +
        escHtml(formatearFechaPartida(it.fecha)) +
        "</strong>" +
        '<span class="teacher-intento-estado">' +
        escHtml(it.estadoLabel || it.estado || "—") +
        "</span>" +
        "</div>" +
        '<div class="teacher-intento-meta">' +
        escHtml(it.nivel || "—") +
        " · " +
        (it.aciertos != null ? it.aciertos : 0) +
        "/" +
        (it.total || 0) +
        " · Vidas: " +
        (it.vidasRestantes != null ? it.vidasRestantes : "—") +
        "</div>" +
        htmlBarrasIntento(it) +
        "</li>";
    }

    var nivelesHtml = "";
    for (var j = 0; j < TEACHER_TEMAS.length; j++) {
      var tid = TEACHER_TEMAS[j].id;
      var pts = alumno.temas[tid] || 0;
      var selTema = tid === vista.temaId ? " is-selected" : "";
      nivelesHtml +=
        '<li><button type="button" class="teacher-tema-btn' +
        selTema +
        '" data-detalle-tema="' +
        escHtml(tid) +
        '">' +
        escHtml(TEACHER_TEMAS[j].corto) +
        ": " +
        pts +
        "/10</button></li>";
    }

    var modosHtml = "";
    var modos = [
      { id: "FACIL", label: "Básico" },
      { id: "DIFICIL", label: "Avanzado" }
    ];
    for (var m = 0; m < modos.length; m++) {
      var mid = modos[m].id;
      var selModo = mid === vista.modoId ? " is-selected" : "";
      modosHtml +=
        '<li><button type="button" class="teacher-tema-btn teacher-modo-btn' +
        selModo +
        '" data-detalle-modo="' +
        escHtml(mid) +
        '">' +
        escHtml(modos[m].label) +
        "</button></li>";
    }

    var tituloNivel = intento
      ? intento.nivel
      : tema.nombre + " · Nivel " + modoLabel.toLowerCase();
    var porcentajeAciertos = intento ? intento.porcentajeAciertos || 0 : 0;
    var tituloIntento = intento
      ? formatearFechaPartida(intento.fecha) +
        " · " +
        (intento.estadoLabel || intento.estado || "—")
      : sinIntentosModo
        ? "Sin intentos de nivel " + modoLabel.toLowerCase()
        : "Elige un intento";

    return (
      '<div class="teacher-detail">' +
      '<div class="teacher-detail-header">' +
      "<h3 class=\"teacher-detail-title\">" +
      escHtml(alumno.nombre) +
      " — " +
      escHtml(tema.nombre) +
      " · " +
      escHtml(tituloNivel) +
      "</h3>" +
      '<div class="teacher-detail-progress">' +
      "<label>Porcentaje de aciertos</label>" +
      barraPorcentajeAciertosHtml(porcentajeAciertos) +
      "</div></div>" +
      '<div class="teacher-detail-body">' +
      '<div class="teacher-detail-side">' +
      '<p class="teacher-detail-side-title">Elegir tema</p>' +
      '<ul class="teacher-levels-mini teacher-temas-select">' +
      nivelesHtml +
      "</ul>" +
      '<p class="teacher-detail-side-title">Modo</p>' +
      '<ul class="teacher-levels-mini teacher-modos-select">' +
      modosHtml +
      "</ul>" +
      '<p class="teacher-detail-side-title">Intentos · ' +
      escHtml(tema.corto) +
      " · " +
      escHtml(modoLabel) +
      " (" +
      intentosTema.length +
      ")</p>" +
      '<ul class="teacher-intentos">' +
      intentosHtml +
      "</ul></div>" +
      '<div class="teacher-detail-main">' +
      '<p class="teacher-detail-side-title">Detalle · ' +
      escHtml(tituloIntento) +
      "</p>" +
      '<table class="teacher-tasks"><thead><tr><th>Actividad</th><th>Resultado</th><th>Errores</th><th>Tiempo</th></tr></thead><tbody>' +
      tareasHtml +
      "</tbody></table></div></div>" +
      '<div class="teacher-detail-footer">' +
      '<span class="teacher-avg-time">⏱ Tiempo promedio: ' +
      alumno.tiempoPromedio +
      "s</span>" +
      '<button type="button" class="teacher-btn-collapse" data-collapse>Contraer</button>' +
      "</div></div>"
    );
  }

  function pintarTabla() {
    var lista = filtrarAlumnos(teacherAlumnosEnGrupo(estado.grupoId));
    elBody.innerHTML = "";

    if (!lista.length) {
      elEmpty.hidden = false;
      elEmpty.textContent =
        !estado.grupoId || estado.grupoId === "grupo-todos"
          ? "Aún no hay alumnos registrados."
          : "No hay alumnos en este grupo.";
      return;
    }
    elEmpty.hidden = true;

    for (var i = 0; i < lista.length; i++) {
      var a = lista[i];
      var tr = document.createElement("tr");
      tr.setAttribute("data-student-id", a.id);
      if (estado.expandidoId === a.id) {
        tr.classList.add("is-expanded");
      }

      var celdas =
        '<td><div class="teacher-student">' +
        (typeof duckHtmlAvatarMini === "function"
          ? duckHtmlAvatarMini(a.outfit, a.avatarVersion)
          : '<div class="teacher-avatar teacher-avatar--emoji" aria-hidden="true">🦆</div>') +
        "<div><p class=\"teacher-student-name\">" +
        escHtml(a.nombre) +
        '</p><p class="teacher-student-email">' +
        escHtml(a.email) +
        "</p></div></div></td>";

      for (var j = 0; j < TEACHER_TEMAS.length; j++) {
        var tid = TEACHER_TEMAS[j].id;
        var pts = a.temas[tid] || 0;
        celdas +=
          '<td class="teacher-cell-bar">' + barraHtml(pts, 10) + "</td>";
      }

      celdas +=
        '<td class="teacher-time">' + (a.tiempoPromedio || 0) + "s</td>";

      tr.innerHTML = celdas;
      elBody.appendChild(tr);

      if (estado.expandidoId === a.id) {
        var trExp = document.createElement("tr");
        trExp.className = "teacher-expand-row";
        var td = document.createElement("td");
        td.colSpan = TEACHER_TEMAS.length + 2;
        td.innerHTML = htmlDetalle(a);
        trExp.appendChild(td);
        elBody.appendChild(trExp);
      }
    }
  }

  function recargarDatosMaestro() {
    if (typeof teacherCargarAlumnos !== "function") {
      pintarTabla();
      return Promise.resolve();
    }
    return teacherCargarAlumnos({ periodo: estado.periodo }).then(function () {
      pintarTabla();
    });
  }

  function toggleExpand(id) {
    if (estado.expandidoId === id) {
      estado.expandidoId = null;
      estado.detalleTemaId = null;
      estado.detalleModoId = null;
      estado.detalleIntentoId = null;
      pintarTabla();
      return;
    }
    estado.expandidoId = id;
    estado.detalleTemaId = null;
    estado.detalleModoId = null;
    estado.detalleIntentoId = null;
    pintarTabla();

    var alumno = null;
    var lista = teacherAlumnosEnGrupo(estado.grupoId);
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id) {
        alumno = lista[i];
        break;
      }
    }
    if (!alumno || typeof teacherCargarDetalleAlumno !== "function") {
      return;
    }

    teacherCargarDetalleAlumno(alumno.dbId || alumno.id, estado.periodo)
      .then(function (det) {
        alumno.detalle = det;
        resetSeleccionDetalle(det);
        if (estado.expandidoId === id) {
          pintarTabla();
        }
      })
      .catch(function (e) {
        console.warn("[teacher] detalle:", e);
      });
  }

  function pintarListaGrupos() {
    var ul = document.getElementById("lista-grupos");
    if (!ul) {
      return;
    }
    var grupos = teacherLeerGrupos();
    ul.innerHTML = "";

    for (var i = 0; i < grupos.length; i++) {
      var g = grupos[i];
      var li = document.createElement("li");
      var acciones = "";
      if (!g.sistema) {
        acciones =
          '<div class="teacher-grupo-actions">' +
          '<button type="button" class="teacher-btn-asignar" data-asignar="' +
          escHtml(g.id) +
          '">Asignar</button>' +
          '<button type="button" class="teacher-btn-borrar" data-borrar="' +
          escHtml(g.id) +
          '">Eliminar</button>' +
          "</div>";
      } else {
        acciones =
          '<span style="font-size:0.78rem;color:#64748b">Vista general</span>';
      }
      var codigoHtml = "";
      if (!g.sistema && g.codigo) {
        codigoHtml =
          '<span class="teacher-grupo-codigo" title="Código para alumnos">' +
          escHtml(g.codigo) +
          "</span>";
      }
      li.innerHTML =
        "<div class=\"teacher-grupo-info\"><strong>" +
        escHtml(g.nombre) +
        "</strong>" +
        codigoHtml +
        "</div>" +
        acciones;
      ul.appendChild(li);
    }
  }

  function abrirAsignacion(grupoId) {
    var grupos = teacherLeerGrupos();
    var nombre = grupoId;
    for (var i = 0; i < grupos.length; i++) {
      if (grupos[i].id === grupoId) {
        nombre = grupos[i].nombre;
        break;
      }
    }
    estado.grupoAsignarId = grupoId;
    document.getElementById("asignar-grupo-nombre").textContent = nombre;
    document.getElementById("seccion-asignar").hidden = false;

    var ul = document.getElementById("lista-asignar-alumnos");
    ul.innerHTML = "";
    var alumnos = teacherListarAlumnos();

    if (!alumnos.length) {
      ul.innerHTML =
        '<li class="teacher-asignar-empty">Aún no hay alumnos registrados.</li>';
      return;
    }

    for (var j = 0; j < alumnos.length; j++) {
      var a = alumnos[j];
      var checked = (a.grupos || []).indexOf(grupoId) >= 0;
      var li = document.createElement("li");
      li.innerHTML =
        '<label><input type="checkbox" data-alumno="' +
        escHtml(a.id) +
        '"' +
        (checked ? " checked" : "") +
        "> " +
        escHtml(a.nombre) +
        "</label>";
      ul.appendChild(li);
    }
  }

  function guardarAsignacion() {
    if (!estado.grupoAsignarId) {
      return;
    }
    var gid = estado.grupoAsignarId;
    var checks = document.querySelectorAll(
      "#lista-asignar-alumnos input[type=checkbox]"
    );
    var marcados = [];
    for (var c = 0; c < checks.length; c++) {
      if (checks[c].checked) {
        marcados.push(checks[c].getAttribute("data-alumno"));
      }
    }

    var prom =
      typeof teacherGuardarAsignacionGrupo === "function"
        ? teacherGuardarAsignacionGrupo(gid, marcados)
        : Promise.resolve();

    prom
      .then(function () {
        document.getElementById("seccion-asignar").hidden = true;
        estado.grupoAsignarId = null;
        pintarSelectGrupos();
        pintarTabla();
      })
      .catch(function (e) {
        window.alert(e.message || "No se pudo guardar la asignación.");
      });
  }

  function crearGrupo(nombre) {
    nombre = String(nombre || "").trim();
    if (!nombre) {
      return Promise.resolve(null);
    }
    return Promise.resolve(
      typeof gruposCrear === "function" ? gruposCrear(nombre) : null
    ).then(function (nuevo) {
      if (!nuevo) {
        return null;
      }
      pintarListaGrupos();
      pintarSelectGrupos();
      return nuevo;
    });
  }

  function borrarGrupo(id) {
    var prom =
      typeof gruposEliminar === "function"
        ? gruposEliminar(id)
        : Promise.resolve(true);
    return prom
      .then(function () {
        if (estado.grupoId === id) {
          estado.grupoId = "grupo-todos";
        }
        pintarListaGrupos();
        pintarSelectGrupos();
        pintarTabla();
      })
      .catch(function (e) {
        window.alert(e.message || "No se pudo eliminar el grupo.");
      });
  }

  function abrirModalGrupos(enfocarNombre) {
    if (!modalGrupos) {
      window.alert("No se pudo abrir la ventana de grupos. Recarga la página.");
      return;
    }
    modalGrupos.hidden = false;
    modalGrupos.removeAttribute("hidden");
    document.body.classList.add("teacher-modal-open");
    var seccionAsignar = document.getElementById("seccion-asignar");
    if (seccionAsignar) {
      seccionAsignar.hidden = true;
    }
    pintarListaGrupos();
    if (enfocarNombre) {
      var inp = document.getElementById("input-nombre-grupo");
      if (inp) {
        window.setTimeout(function () {
          inp.focus();
        }, 50);
      }
    }
  }

  function cerrarModalGrupos() {
    if (!modalGrupos) {
      return;
    }
    modalGrupos.hidden = true;
    modalGrupos.setAttribute("hidden", "");
    document.body.classList.remove("teacher-modal-open");
  }

  function registrarEventos() {
    if (!elSearch || !elGrupoFilter || !elBody) {
      return;
    }

    elSearch.addEventListener("input", function () {
      estado.busqueda = elSearch.value;
      pintarTabla();
    });

    elGrupoFilter.addEventListener("change", function () {
      estado.grupoId = elGrupoFilter.value;
      estado.expandidoId = null;
      estado.detalleTemaId = null;
      estado.detalleModoId = null;
      estado.detalleIntentoId = null;
      pintarTabla();
    });

    var periodBtns = document.querySelectorAll(".teacher-period-btn");
    for (var i = 0; i < periodBtns.length; i++) {
      periodBtns[i].addEventListener("click", function () {
        for (var j = 0; j < periodBtns.length; j++) {
          periodBtns[j].classList.remove("is-active");
        }
        this.classList.add("is-active");
        estado.periodo = this.getAttribute("data-period");
        estado.expandidoId = null;
        estado.detalleTemaId = null;
        estado.detalleModoId = null;
        estado.detalleIntentoId = null;
        recargarDatosMaestro();
      });
    }

    elBody.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-collapse]")) {
        estado.expandidoId = null;
        estado.detalleTemaId = null;
        estado.detalleModoId = null;
        estado.detalleIntentoId = null;
        pintarTabla();
        return;
      }
      var temaBtn = ev.target.closest("[data-detalle-tema]");
      if (temaBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        estado.detalleTemaId = temaBtn.getAttribute("data-detalle-tema");
        estado.detalleModoId = null;
        estado.detalleIntentoId = null;
        pintarTabla();
        return;
      }
      var modoBtn = ev.target.closest("[data-detalle-modo]");
      if (modoBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        estado.detalleModoId = modoBtn.getAttribute("data-detalle-modo");
        estado.detalleIntentoId = null;
        pintarTabla();
        return;
      }
      var intentoBtn = ev.target.closest("[data-detalle-intento]");
      if (intentoBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        estado.detalleIntentoId = intentoBtn.getAttribute("data-detalle-intento");
        pintarTabla();
        return;
      }
      var tr = ev.target.closest("tr[data-student-id]");
      if (!tr || ev.target.closest(".teacher-expand-row")) {
        return;
      }
      toggleExpand(tr.getAttribute("data-student-id"));
    });

    elBody.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter" && ev.key !== " ") {
        return;
      }
      var intentoBtn = ev.target.closest("[data-detalle-intento]");
      if (!intentoBtn) {
        return;
      }
      ev.preventDefault();
      estado.detalleIntentoId = intentoBtn.getAttribute("data-detalle-intento");
      pintarTabla();
    });

    var btnGrupos = document.getElementById("btn-grupos");
    if (btnGrupos) {
      btnGrupos.addEventListener("click", function () {
        abrirModalGrupos(true);
      });
    }

    if (modalGrupos) {
      modalGrupos.querySelectorAll("[data-close-modal]").forEach(function (el) {
        el.addEventListener("click", cerrarModalGrupos);
      });
    }

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && modalGrupos && !modalGrupos.hidden) {
        cerrarModalGrupos();
      }
    });

    var formNuevoGrupo = document.getElementById("form-nuevo-grupo");
    if (!formNuevoGrupo) {
      return;
    }

    formNuevoGrupo.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var inp = document.getElementById("input-nombre-grupo");
      crearGrupo(inp.value).then(function (g) {
        inp.value = "";
        inp.focus();
        if (g) {
          var aviso = document.getElementById("grupo-codigo-aviso");
          if (aviso) {
            aviso.hidden = true;
            aviso.textContent = "";
          }
        }
      }).catch(function (e) {
        window.alert(e.message || "No se pudo crear el grupo.");
      });
    });

    document.getElementById("lista-grupos").addEventListener("click", function (ev) {
      var asignar = ev.target.closest("[data-asignar]");
      if (asignar) {
        abrirAsignacion(asignar.getAttribute("data-asignar"));
        return;
      }
      var borrar = ev.target.closest("[data-borrar]");
      if (borrar) {
        if (confirm("¿Eliminar este grupo? Los alumnos no se borran.")) {
          borrarGrupo(borrar.getAttribute("data-borrar"));
        }
      }
    });

    document.getElementById("btn-guardar-asignacion").addEventListener("click", guardarAsignacion);
  }

  function pintarDashboard() {
    pintarCabeceraTabla();
    pintarSelectGrupos();
    pintarTabla();
    if (modalGrupos && !modalGrupos.hidden) {
      pintarListaGrupos();
    }
  }

  function init() {
    registrarEventos();
    pintarCabeceraTabla();
    pintarSelectGrupos();

    var arranque = Promise.resolve(true);
    if (typeof teacherExigirSesionAsync === "function") {
      arranque = teacherExigirSesionAsync().then(function (ok) {
        if (!ok) {
          sesionLista = false;
          return false;
        }
        sesionLista = true;
        return true;
      });
    } else {
      sesionLista = true;
    }

    arranque
      .then(function (ok) {
        if (ok === false) {
          return;
        }
        var cargarGrupos =
          typeof gruposInicializar === "function"
            ? gruposInicializar()
            : Promise.resolve([]);
        var cargarAlumnos =
          typeof teacherCargarAlumnos === "function"
            ? teacherCargarAlumnos({ periodo: estado.periodo })
            : Promise.resolve([]);
        return Promise.all([cargarGrupos, cargarAlumnos]).then(function () {
          pintarDashboard();
        });
      })
      .catch(function (err) {
        console.error("Error cargando panel del maestro:", err);
        pintarDashboard();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("pageshow", function () {
    if (!sesionLista || typeof teacherCargarAlumnos !== "function") {
      return;
    }
    teacherCargarAlumnos({ periodo: estado.periodo })
      .then(function () {
        pintarTabla();
      })
      .catch(function (err) {
        console.warn("No se pudieron refrescar avatares:", err);
      });
  });
})();
