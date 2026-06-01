/**
 * Cliente Supabase (CDN). Requiere supabase-config.js y @supabase/supabase-js.
 */
var supabaseClient = null;
var supabaseInitPromise = null;

function supabaseDisponible() {
  return !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase);
}

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

function getSupabase() {
  return supabaseClient;
}

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
