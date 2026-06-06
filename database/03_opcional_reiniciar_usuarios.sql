-- =============================================================================
-- Tec-Duck — OPCIONAL: Borrar TODOS los usuarios (reinicio de pruebas)
--
-- ⚠️  IRREVERSIBLE. Solo si necesitas vaciar cuentas sin tocar el catálogo.
-- No forma parte de la instalación inicial (usa 01 y 02).
-- Instrucciones: database/LEEME_INSTALACION.md
--
-- Elimina:
--   • Cuentas de login (auth.users, identities, sesiones)
--   • usuario, profesor, alumno, grupos, partidas, progreso, tienda, avatares
--   • Niveles y preguntas creadas por maestros (pregunta_maestro, respuesta_maestro)
--
-- NO elimina (catálogo del sistema):
--   • tema, nivel (temas del juego), item (tienda)
-- =============================================================================

BEGIN;

-- 1) Supabase Auth (login)
DELETE FROM auth.sessions;
DELETE FROM auth.refresh_tokens;
DELETE FROM auth.identities;
DELETE FROM auth.users;

-- 2) Datos de app (por si quedaron huérfanos sin Auth)
TRUNCATE TABLE
  public.usuario
RESTART IDENTITY CASCADE;

COMMIT;

-- Verificación: todo en cero (catálogo distinto de cero)
SELECT 'auth.users' AS tabla, COUNT(*) AS filas FROM auth.users
UNION ALL SELECT 'auth.identities', COUNT(*) FROM auth.identities
UNION ALL SELECT 'usuario', COUNT(*) FROM public.usuario
UNION ALL SELECT 'profesor', COUNT(*) FROM public.profesor
UNION ALL SELECT 'alumno', COUNT(*) FROM public.alumno
UNION ALL SELECT 'grupo', COUNT(*) FROM public.grupo
UNION ALL SELECT 'partida', COUNT(*) FROM public.partida
UNION ALL SELECT 'tema (se conserva)', COUNT(*) FROM public.tema
UNION ALL SELECT 'item (se conserva)', COUNT(*) FROM public.item;
