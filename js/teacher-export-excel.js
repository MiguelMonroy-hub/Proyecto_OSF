// Genera y descarga un .xls con el historial de calificaciones del maestro.
(function () {
  "use strict";

  var CSV_SEP = ";";

  // Escapa un valor para CSV si trae ;, comillas o saltos de línea.
  function csvCelda(val) {
    var s = val == null ? "" : String(val);
    if (/[;"\n\r]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  // Nombre del grupo para la cabecera del reporte.
  function csvNombreGrupo(grupoId) {
    if (!grupoId || grupoId === "grupo-todos") {
      return "Todos los alumnos";
    }
    var grupos = teacherLeerGrupos();
    for (var i = 0; i < grupos.length; i++) {
      if (grupos[i].id === grupoId) {
        return grupos[i].nombre || grupoId;
      }
    }
    return grupoId;
  }

  // Formato "7/10" que se ve en el Excel.
  function exportPuntajeHistorial(pts) {
    return (pts || 0) + "/10";
  }

  // Bloque de filas de un alumno: nombre, temas y tiempo promedio.
  function exportFilasAlumno(alumno, exportInfo) {
    var key = String(alumno.dbId || alumno.id);
    var datos =
      exportInfo && exportInfo.porAlumno ? exportInfo.porAlumno[key] : null;
    var maximos =
      datos && datos.maximos
        ? datos.maximos
        : typeof teacherMaximosHistorialVacios === "function"
          ? teacherMaximosHistorialVacios()
          : {};
    var filas = [];
    filas.push({
      a: ":",
      aClass: "export-nombre-label",
      b: alumno.nombre || "—"
    });
    for (var j = 0; j < TEACHER_TEMAS.length; j++) {
      var tema = TEACHER_TEMAS[j];
      var modoPts = maximos[tema.id] || { FACIL: 0, DIFICIL: 0 };
      filas.push({
        a: tema.corto + " · Básico:",
        b: exportPuntajeHistorial(modoPts.FACIL)
      });
      filas.push({
        a: tema.corto + " · Avanzado:",
        b: exportPuntajeHistorial(modoPts.DIFICIL)
      });
    }
    var tiempo =
      datos && datos.tiempoPromedio != null
        ? datos.tiempoPromedio
        : alumno.tiempoPromedio || 0;
    filas.push({
      a: "Tiempo promedio en realizar:",
      b: tiempo ? tiempo + " s" : "0 s"
    });
    return filas;
  }

  // Un <td> con clase y texto ya escapado.
  function exportHtmlCelda(texto, className, escHtml) {
    return (
      '<td class="' +
      (className || "export-col-b") +
      '">' +
      escHtml(texto == null ? "" : texto) +
      "</td>"
    );
  }

  // Fila de metadatos del reporte (etiqueta | valor).
  function exportHtmlFilaMeta(etiqueta, valor, escHtml) {
    return (
      "<tr>" +
      exportHtmlCelda(etiqueta, "export-meta-a", escHtml) +
      exportHtmlCelda(valor, "export-meta-b", escHtml) +
      "</tr>"
    );
  }

  // Fila de dos columnas del bloque de cada alumno.
  function exportHtmlFilaAlumno(fila, escHtml) {
    return (
      "<tr>" +
      exportHtmlCelda(fila.a, fila.aClass || "export-col-a", escHtml) +
      exportHtmlCelda(fila.b, "export-col-b", escHtml) +
      "</tr>"
    );
  }

  // Arma el HTML, dispara la descarga .xls y muestra el toast de éxito.
  window.teacherExportarExcelAlumnosConDatos = function (lista, exportInfo, ctx) {
    ctx = ctx || {};
    var estado = ctx.estado || {};
    var escHtml = ctx.escHtml || function (s) {
      return String(s);
    };

    var ahora = new Date();
    var fechaGen = ahora.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    var filasMeta = [
      ["Generado", fechaGen],
      ["Calificaciones", "Máximo histórico (todo el tiempo)"],
      ["Grupo", csvNombreGrupo(estado.grupoId)]
    ];
    if (estado.busqueda && String(estado.busqueda).trim()) {
      filasMeta.push(["Búsqueda", String(estado.busqueda).trim()]);
    }
    filasMeta.push(["Total alumnos", String(lista.length)]);

    var html = [
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">',
      '<head><meta charset="UTF-8">',
      "<style>",
      "table{border-collapse:collapse;width:100%;max-width:640px;font-family:'Segoe UI',Tahoma,sans-serif;font-size:11pt;}",
      "td{padding:7px 12px;border:1px solid #cbd5e1;vertical-align:middle;}",
      ".export-meta-a{font-weight:700;color:#475569;background:#f8fafc;width:42%;}",
      ".export-meta-b{color:#0f172a;background:#fff;}",
      ".export-col-a{font-weight:700;color:#334155;background:#f8fafc;width:42%;}",
      ".export-col-b{color:#0f172a;background:#fff;}",
      ".export-nombre-label{background:#DBEAFE;color:#1e3a8a;font-weight:800;text-align:center;width:56px;}",
      ".export-gap td{border:none;height:10px;padding:0;}",
      "</style></head><body><table>"
    ];

    html.push(exportHtmlFilaMeta("TecDuck — Panel del maestro", "", escHtml));
    for (var m = 0; m < filasMeta.length; m++) {
      html.push(exportHtmlFilaMeta(filasMeta[m][0], filasMeta[m][1], escHtml));
    }
    html.push('<tr class="export-gap"><td colspan="2"></td></tr>');

    for (var i = 0; i < lista.length; i++) {
      if (i > 0) {
        html.push('<tr class="export-gap"><td colspan="2"></td></tr>');
      }
      var bloque = exportFilasAlumno(lista[i], exportInfo);
      for (var b = 0; b < bloque.length; b++) {
        html.push(exportHtmlFilaAlumno(bloque[b], escHtml));
      }
    }

    html.push("</table></body></html>");

    var stamp = ahora.toISOString().slice(0, 10);
    var blob = new Blob(["\uFEFF" + html.join("")], {
      type: "application/vnd.ms-excel;charset=utf-8"
    });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "tecduck-alumnos-historial-" + stamp + ".xls";
    link.click();
    URL.revokeObjectURL(url);
    if (typeof uiToastSuccess === "function") {
      uiToastSuccess("Reporte descargado (" + lista.length + " alumnos).");
    }
  };
})();
