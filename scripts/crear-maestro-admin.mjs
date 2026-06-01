/**
 * Crear maestro con Supabase Admin API (método fiable para login).
 *
 * Uso (PowerShell):
 *   $env:SUPABASE_SERVICE_ROLE_KEY = "tu_service_role_key"
 *   node scripts/crear-maestro-admin.mjs
 *
 * La service_role key está en: Supabase → Project Settings → API → service_role
 * (NO la subas al repo ni la pongas en el frontend)
 */

var SUPABASE_URL = process.env.SUPABASE_URL || "https://clgefhrzbryexqnsuais.supabase.co";
var SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

var EMAIL = process.env.MAESTRO_EMAIL || "maestro.tecduck@gmail.com";
var PASSWORD = process.env.MAESTRO_PASSWORD || "123456";
var NOMBRE = process.env.MAESTRO_NOMBRE || "Maestro";
var APELLIDO = process.env.MAESTRO_APELLIDO || "TecDuck";

if (!SERVICE_KEY) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Supabase → Settings → API → service_role (secret)");
  process.exit(1);
}

var headers = {
  Authorization: "Bearer " + SERVICE_KEY,
  apikey: SERVICE_KEY,
  "Content-Type": "application/json"
};

async function buscarUsuarioPorEmail(email) {
  var url =
    SUPABASE_URL +
    "/auth/v1/admin/users?page=1&per_page=200";
  var res = await fetch(url, { headers: headers });
  if (!res.ok) {
    throw new Error("No se pudo listar usuarios: " + (await res.text()));
  }
  var data = await res.json();
  var users = data.users || data || [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].email && users[i].email.toLowerCase() === email.toLowerCase()) {
      return users[i];
    }
  }
  return null;
}

async function eliminarUsuario(id) {
  var res = await fetch(SUPABASE_URL + "/auth/v1/admin/users/" + id, {
    method: "DELETE",
    headers: headers
  });
  if (!res.ok && res.status !== 404) {
    throw new Error("No se pudo borrar usuario previo: " + (await res.text()));
  }
}

async function crearMaestro() {
  var existente = await buscarUsuarioPorEmail(EMAIL);
  if (existente && existente.id) {
    console.log("Borrando usuario Auth previo:", EMAIL);
    await eliminarUsuario(existente.id);
  }

  var res = await fetch(SUPABASE_URL + "/auth/v1/admin/users", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: {
        rol: "MAESTRO",
        nombre: NOMBRE,
        apellido: APELLIDO
      }
    })
  });

  var body = await res.text();
  if (!res.ok) {
    throw new Error(body);
  }

  console.log("Maestro creado correctamente.");
  console.log("  Correo:", EMAIL);
  console.log("  Contraseña:", PASSWORD);
  console.log("  Login: http://localhost:3000/pages/login.html");
  console.log(body);
}

crearMaestro().catch(function (err) {
  console.error("Error:", err.message || err);
  process.exit(1);
});
