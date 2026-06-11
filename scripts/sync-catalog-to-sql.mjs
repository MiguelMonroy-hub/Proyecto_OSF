/**
 * Genera snippet SQL INSERT para item desde js/duck-catalog.js (DUCK_CATALOG).
 * Uso: node scripts/sync-catalog-to-sql.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(__dirname, "..", "js", "duck-catalog.js");
const src = fs.readFileSync(catalogPath, "utf8");

const match = src.match(/var DUCK_CATALOG = (\[[\s\S]*?\n\]);/);
if (!match) {
  console.error("No se encontró DUCK_CATALOG en duck-catalog.js");
  process.exit(1);
}

const catalog = Function("return " + match[1])();

const catToTipo = {
  base: "BASE",
  face: "FACE",
  head: "HEAD",
  neck: "NECK",
  shoes: "SHOES"
};

console.log("-- Snippet generado desde duck-catalog.js — pegar en 01_esquema_y_funciones.sql");
console.log("-- Ejecutar solo en bases nuevas o adaptar ON CONFLICT\n");
console.log("INSERT INTO public.item (codigo, tipo, nombre, precio_monedas, ruta_asset) VALUES");

const rows = catalog.map(function (entry, idx) {
  var tipo = catToTipo[entry.cat] || String(entry.cat || "").toUpperCase();
  var codigo = entry.file.replace(/'/g, "''");
  var nombre = String(entry.label || entry.file).replace(/'/g, "''");
  var ruta = (entry.sub ? entry.sub + "/" : "") + entry.file;
  ruta = ruta.replace(/'/g, "''");
  var suffix = idx === catalog.length - 1 ? ";" : ",";
  return (
    "  ('" +
    codigo +
    "', '" +
    tipo +
    "', '" +
    nombre +
    "', " +
    (entry.price || 0) +
    ", '" +
    ruta +
    "')" +
    suffix
  );
});

console.log(rows.join("\n"));
