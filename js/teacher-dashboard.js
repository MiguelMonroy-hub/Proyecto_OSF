(function () {
  "use strict";

  if (!teacherExigirSesion()) {
    return;
  }

  var estado = {
    grupoId: "grupo-todos",
    busqueda: "",
    periodo: "today",
    expandidoId: null,
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

  function barraHtml(puntos, max) {
    max = max || 10;
    var pct = Math.round((puntos / max) * 100);
    var cls = teacherColorBarra(puntos, max);
    return (
      '<div class="teacher-bar-wrap ' +
      cls +
      '">' +
      '<div class="teacher-bar-track"><div class="teacher-bar-fill" style="width:' +
      pct +
      '%"></div></div>' +
      '<span class="teacher-bar-score">' +
      puntos +
      "/" +
      max +
      "</span></div>"
    );
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

  function factorPeriodo(puntos) {
    if (estado.periodo === "week") {
      return Math.min(10, Math.round(puntos * 1.05));
    }
    if (estado.periodo === "month") {
      return Math.min(10, Math.round(puntos * 1.12));
    }
    return puntos;
  }

  function pintarSelectGrupos() {
    var grupos = teacherLeerGrupos();
    elGrupoFilter.innerHTML = "";
    for (var i = 0; i < grupos.length; i++) {
      var g = grupos[i];
      var opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.nombre;
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

  function htmlDetalle(alumno) {
    var d = alumno.detalle;
    var tema = teacherNombreTema(d.temaActivo);
    var tareasHtml = "";
    for (var i = 0; i < d.tareas.length; i++) {
      var t = d.tareas[i];
      tareasHtml +=
        "<tr><td>Pregunta " +
        (i + 1) +
        "</td><td class='" +
        (t.ok ? "task-ok" : "task-fail") +
        "'>" +
        (t.ok ? "✓" : "✗") +
        "</td><td>" +
        t.tiempo +
        "s</td></tr>";
    }

    var nivelesHtml = "";
    for (var j = 0; j < TEACHER_TEMAS.length; j++) {
      var tid = TEACHER_TEMAS[j].id;
      var pts = factorPeriodo(alumno.temas[tid] || 0);
      nivelesHtml +=
        "<li>" +
        escHtml(TEACHER_TEMAS[j].corto) +
        ": " +
        pts +
        "/10</li>";
    }

    return (
      '<div class="teacher-detail">' +
      '<div class="teacher-detail-header">' +
      "<h3 class=\"teacher-detail-title\">" +
      escHtml(alumno.nombre) +
      " — " +
      escHtml(tema.nombre) +
      " · " +
      escHtml(d.nivel) +
      "</h3>" +
      '<div class="teacher-detail-progress">' +
      "<label>" +
      escHtml(tema.nombre) +
      " — " +
      escHtml(d.nivel) +
      "</label>" +
      barraHtml(d.progresoNivel, d.maxNivel) +
      "</div></div>" +
      '<div class="teacher-detail-body">' +
      '<ul class="teacher-levels-mini">' +
      nivelesHtml +
      "</ul>" +
      '<table class="teacher-tasks"><thead><tr><th>Actividad</th><th>Resultado</th><th>Tiempo</th></tr></thead><tbody>' +
      tareasHtml +
      "</tbody></table></div>" +
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
        '<div class="teacher-avatar" aria-hidden="true">' +
        a.avatar +
        "</div><div><p class=\"teacher-student-name\">" +
        escHtml(a.nombre) +
        '</p><p class="teacher-student-email">' +
        escHtml(a.email) +
        "</p></div></div></td>";

      for (var j = 0; j < TEACHER_TEMAS.length; j++) {
        var tid = TEACHER_TEMAS[j].id;
        var pts = factorPeriodo(a.temas[tid] || 0);
        celdas +=
          '<td class="teacher-cell-bar">' + barraHtml(pts, 10) + "</td>";
      }

      var tiempo =
        estado.periodo === "today"
          ? a.tiempoPromedio
          : Math.round(a.tiempoPromedio * (estado.periodo === "week" ? 1.1 : 1.2));
      celdas += '<td class="teacher-time">' + tiempo + "s</td>";

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

  function toggleExpand(id) {
    estado.expandidoId = estado.expandidoId === id ? null : id;
    pintarTabla();
  }

  function pintarListaGrupos() {
    var ul = document.getElementById("lista-grupos");
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

    var asig = teacherObtenerAsignaciones();
    var ul = document.getElementById("lista-asignar-alumnos");
    ul.innerHTML = "";

    for (var j = 0; j < TEACHER_ALUMNOS_DEMO.length; j++) {
      var a = TEACHER_ALUMNOS_DEMO[j];
      var checked = (asig[a.id] || []).indexOf(grupoId) >= 0;
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
    var asig = teacherObtenerAsignaciones();
    var checks = document.querySelectorAll(
      "#lista-asignar-alumnos input[type=checkbox]"
    );

    for (var i = 0; i < TEACHER_ALUMNOS_DEMO.length; i++) {
      var aid = TEACHER_ALUMNOS_DEMO[i].id;
      if (!asig[aid]) {
        asig[aid] = [];
      }
      var idx = asig[aid].indexOf(gid);
      var marcado = false;
      for (var c = 0; c < checks.length; c++) {
        if (checks[c].getAttribute("data-alumno") === aid && checks[c].checked) {
          marcado = true;
          break;
        }
      }
      if (marcado && idx < 0) {
        asig[aid].push(gid);
      }
      if (!marcado && idx >= 0) {
        asig[aid].splice(idx, 1);
      }
    }

    teacherGuardarAsignaciones(asig);
    document.getElementById("seccion-asignar").hidden = true;
    estado.grupoAsignarId = null;
    pintarSelectGrupos();
    pintarTabla();
  }

  function crearGrupo(nombre) {
    nombre = String(nombre || "").trim();
    if (!nombre) {
      return null;
    }
    var nuevo =
      typeof gruposCrear === "function"
        ? gruposCrear(nombre)
        : null;
    if (!nuevo) {
      return null;
    }
    pintarListaGrupos();
    pintarSelectGrupos();
    return nuevo;
  }

  function borrarGrupo(id) {
    var grupos = teacherLeerGrupos().filter(function (g) {
      return g.id !== id || g.sistema;
    });
    teacherGuardarGrupos(grupos);

    var asig = teacherObtenerAsignaciones();
    var keys = Object.keys(asig);
    for (var i = 0; i < keys.length; i++) {
      asig[keys[i]] = (asig[keys[i]] || []).filter(function (g) {
        return g !== id;
      });
    }
    teacherGuardarAsignaciones(asig);

    if (estado.grupoId === id) {
      estado.grupoId = "grupo-todos";
    }
    pintarListaGrupos();
    pintarSelectGrupos();
    pintarTabla();
  }

  function abrirModalGrupos() {
    modalGrupos.hidden = false;
    document.getElementById("seccion-asignar").hidden = true;
    pintarListaGrupos();
  }

  function cerrarModalGrupos() {
    modalGrupos.hidden = true;
  }

  function registrarEventos() {
    elSearch.addEventListener("input", function () {
      estado.busqueda = elSearch.value;
      pintarTabla();
    });

    elGrupoFilter.addEventListener("change", function () {
      estado.grupoId = elGrupoFilter.value;
      estado.expandidoId = null;
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
        pintarTabla();
      });
    }

    elBody.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-collapse]")) {
        estado.expandidoId = null;
        pintarTabla();
        return;
      }
      var tr = ev.target.closest("tr[data-student-id]");
      if (!tr || ev.target.closest(".teacher-expand-row")) {
        return;
      }
      toggleExpand(tr.getAttribute("data-student-id"));
    });

    document.getElementById("btn-grupos").addEventListener("click", abrirModalGrupos);
    document.getElementById("btn-logout").addEventListener("click", function () {
      teacherCerrarSesion();
      window.location.href = "login.html";
    });

    modalGrupos.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", cerrarModalGrupos);
    });

    document.getElementById("form-nuevo-grupo").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var inp = document.getElementById("input-nombre-grupo");
      var g = crearGrupo(inp.value);
      inp.value = "";
      if (g && g.codigo) {
        var aviso = document.getElementById("grupo-codigo-aviso");
        if (aviso) {
          aviso.hidden = false;
          aviso.innerHTML =
            "Grupo <strong>" +
            escHtml(g.nombre) +
            "</strong> creado. Código para tus alumnos: " +
            '<span class="teacher-grupo-codigo teacher-grupo-codigo--large">' +
            escHtml(g.codigo) +
            "</span>";
        }
      }
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

  function init() {
    if (typeof gruposLeer === "function") {
      gruposLeer();
    }
    pintarCabeceraTabla();
    pintarSelectGrupos();
    pintarTabla();
    registrarEventos();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
