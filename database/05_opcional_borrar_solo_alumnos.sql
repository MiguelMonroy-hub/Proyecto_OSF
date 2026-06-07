-- =============================================================================
-- Tec-Duck — OPCIONAL: Borrar SOLO alumnos y todos sus datos
--
-- ⚠️  IRREVERSIBLE. Ejecutar solo en entorno de pruebas o con respaldo.
-- No forma parte de la instalación inicial (usa 01 y 02).
-- Ejecutar en Supabase → SQL Editor (como postgres / service role).
--
-- Elimina por cada alumno (en cascada):
--   • Cuenta de login (auth.users)
--   • usuario (rol ALUMNO), alumno
--   • alumno_grupo, partida, progreso
--   • avatar, inventario, compra
--
-- NO elimina:
--   • Maestros (profesor, usuario rol MAESTRO)
--   • Grupos del maestro (quedan vacíos de alumnos)
--   • Niveles del maestro (nivel_maestro, pregunta_maestro, …)
--   • Catálogo: tema, nivel, item (tienda)
-- =============================================================================

BEGIN;

-- Tabla temporal con los auth_id de alumnos (refresh_tokens.user_id es varchar en Supabase)
CREATE TEMP TABLE tmp_alumnos_auth ON COMMIT DROP AS
SELECT u.auth_id
FROM public.usuario u
WHERE u.rol = 'ALUMNO';

-- 1) Cerrar sesiones Auth de alumnos
DELETE FROM auth.sessions s
USING tmp_alumnos_auth a
WHERE s.user_id = a.auth_id;

DELETE FROM auth.refresh_tokens rt
USING tmp_alumnos_auth a
WHERE rt.user_id = a.auth_id::text;

DELETE FROM auth.identities i
USING tmp_alumnos_auth a
WHERE i.user_id = a.auth_id;

-- 2) Cuentas Auth → cascade borra usuario → alumno → partidas, progreso, tienda, etc.
DELETE FROM auth.users u
USING tmp_alumnos_auth a
WHERE u.id = a.auth_id;

-- 3) Por si quedó algún usuario ALUMNO sin fila en auth (no debería ocurrir)
DELETE FROM public.usuario
WHERE rol = 'ALUMNO';

COMMIT;

-- Verificación rápida
SELECT 'alumno' AS tabla, COUNT(*) AS filas FROM public.alumno
UNION ALL SELECT 'usuario ALUMNO', COUNT(*) FROM public.usuario WHERE rol = 'ALUMNO'
UNION ALL SELECT 'usuario MAESTRO', COUNT(*) FROM public.usuario WHERE rol = 'MAESTRO'
UNION ALL SELECT 'profesor', COUNT(*) FROM public.profesor
UNION ALL SELECT 'partida', COUNT(*) FROM public.partida
UNION ALL SELECT 'progreso', COUNT(*) FROM public.progreso
UNION ALL SELECT 'alumno_grupo', COUNT(*) FROM public.alumno_grupo
UNION ALL SELECT 'auth.users (alumnos restantes)', COUNT(*)
  FROM auth.users au
  JOIN public.usuario u ON u.auth_id = au.id
  WHERE u.rol = 'ALUMNO';
