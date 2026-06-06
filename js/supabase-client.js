// Singleton del cliente Supabase. Carga desde CDN; necesita supabase-config.js antes.
var supabaseClient = null;
var supabaseInitPromise = null;

// ¿Tenemos URL, key y la librería de Supabase en window?
function supabaseDisponible() {
  return !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase);
}

// Crea el cliente la primera vez. Si ya se llamó, devuelve la misma promesa.
function initSupabase() {
  if (supabaseInitPromise) {
    return supabaseInitPromise;
  }
  supabaseInitPromise = Promise.resolve().then(function () {
    if (!supabaseDisponible()) {
      return null;
    }
    if (!supabaseClient) {
      supabaseClient = window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );
    }
    return supabaseClient;
  });
  return supabaseInitPromise;
}

// Devuelve la instancia ya creada, o null si aún no se inicializó.
function getSupabase() {
  return supabaseClient;
}

// Igual que getSupabase, pero crea el cliente al vuelo si hace falta (código síncrono).
function getSupabaseSync() {
  if (!supabaseClient && supabaseDisponible()) {
    supabaseClient = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
  }
  return supabaseClient;
}
