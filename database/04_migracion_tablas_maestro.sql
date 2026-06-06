-- =============================================================================
-- Tec-Duck — Migración: quitar intento_* y renombrar banco del maestro
-- =============================================================================
-- Ejecutar en SQL Editor si ya tienes una base creada con 01+02 antiguos.
-- Proyecto NUEVO: no hace falta; usa 01 y 02 actualizados.
--
-- Cambios:
--   • Elimina intento_pregunta e intento_respuesta (no las usa la app)
--   • Renombra pregunta  → pregunta_maestro
--   • Renombra respuesta → respuesta_maestro
--   • Quita nivel_id de pregunta_maestro (solo niveles del profe)
--   • Renombra columna pregunta_id → pregunta_maestro_id
--   • Recrea políticas RLS acordes
-- =============================================================================

BEGIN;

-- 1) Quitar tablas de intentos (vacías en la práctica)
DROP POLICY IF EXISTS intento_respuesta_alumno ON public.intento_respuesta;
DROP POLICY IF EXISTS intento_pregunta_alumno ON public.intento_pregunta;
DROP TABLE IF EXISTS public.intento_respuesta;
DROP TABLE IF EXISTS public.intento_pregunta;

-- 2) Políticas antiguas sobre pregunta / respuesta
DROP POLICY IF EXISTS pregunta_select_sistema ON public.pregunta;
DROP POLICY IF EXISTS respuesta_select_sistema ON public.respuesta;
DROP POLICY IF EXISTS pregunta_maestro_select ON public.pregunta;
DROP POLICY IF EXISTS pregunta_maestro_write ON public.pregunta;
DROP POLICY IF EXISTS respuesta_maestro_select ON public.respuesta;
DROP POLICY IF EXISTS respuesta_maestro_write ON public.respuesta;

-- 3) Renombrar tablas (conserva datos de niveles del maestro)
ALTER TABLE IF EXISTS public.pregunta RENAME TO pregunta_maestro;
ALTER TABLE IF EXISTS public.respuesta RENAME TO respuesta_maestro;

-- 4) Simplificar pregunta_maestro: solo nivel_maestro_id
ALTER TABLE public.pregunta_maestro DROP CONSTRAINT IF EXISTS chk_pregunta_origen;
DELETE FROM public.pregunta_maestro WHERE nivel_maestro_id IS NULL;
ALTER TABLE public.pregunta_maestro DROP COLUMN IF EXISTS nivel_id;
ALTER TABLE public.pregunta_maestro ALTER COLUMN nivel_maestro_id SET NOT NULL;

DROP INDEX IF EXISTS idx_pregunta_nivel;
ALTER INDEX IF EXISTS idx_pregunta_nivel_maestro RENAME TO idx_pregunta_maestro_nivel;

-- 5) Columna FK en respuesta_maestro
ALTER TABLE public.respuesta_maestro
  RENAME COLUMN pregunta_id TO pregunta_maestro_id;

-- 6) RLS en tablas renombradas
ALTER TABLE public.pregunta_maestro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respuesta_maestro ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pregunta_maestro_select ON public.pregunta_maestro;
DROP POLICY IF EXISTS pregunta_maestro_write ON public.pregunta_maestro;
DROP POLICY IF EXISTS respuesta_maestro_select ON public.respuesta_maestro;
DROP POLICY IF EXISTS respuesta_maestro_write ON public.respuesta_maestro;

CREATE POLICY pregunta_maestro_select ON public.pregunta_maestro
  FOR SELECT TO authenticated
  USING (
    activa = TRUE
    AND EXISTS (
      SELECT 1 FROM public.nivel_maestro nm
      WHERE nm.id = pregunta_maestro.nivel_maestro_id
        AND (
          nm.profesor_id = public.get_my_profesor_id()
          OR (
            public.is_alumno()
            AND public.alumno_puede_ver_nivel_maestro(nm.id)
          )
        )
    )
  );

CREATE POLICY pregunta_maestro_write ON public.pregunta_maestro
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.nivel_maestro nm
      WHERE nm.id = pregunta_maestro.nivel_maestro_id
        AND nm.profesor_id = public.get_my_profesor_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.nivel_maestro nm
      WHERE nm.id = pregunta_maestro.nivel_maestro_id
        AND nm.profesor_id = public.get_my_profesor_id()
    )
  );

CREATE POLICY respuesta_maestro_select ON public.respuesta_maestro
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pregunta_maestro pm
      JOIN public.nivel_maestro nm ON nm.id = pm.nivel_maestro_id
      WHERE pm.id = respuesta_maestro.pregunta_maestro_id
        AND (
          nm.profesor_id = public.get_my_profesor_id()
          OR (
            public.is_alumno()
            AND public.alumno_puede_ver_nivel_maestro(nm.id)
          )
        )
    )
  );

CREATE POLICY respuesta_maestro_write ON public.respuesta_maestro
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.pregunta_maestro pm
      JOIN public.nivel_maestro nm ON nm.id = pm.nivel_maestro_id
      WHERE pm.id = respuesta_maestro.pregunta_maestro_id
        AND nm.profesor_id = public.get_my_profesor_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.pregunta_maestro pm
      JOIN public.nivel_maestro nm ON nm.id = pm.nivel_maestro_id
      WHERE pm.id = respuesta_maestro.pregunta_maestro_id
        AND nm.profesor_id = public.get_my_profesor_id()
    )
  );

COMMIT;

-- Verificación rápida
SELECT 'intento_pregunta' AS tabla,
  CASE WHEN to_regclass('public.intento_pregunta') IS NULL THEN 'eliminada' ELSE 'aún existe' END AS estado
UNION ALL
SELECT 'pregunta_maestro',
  CASE WHEN to_regclass('public.pregunta_maestro') IS NOT NULL THEN 'ok' ELSE 'falta' END
UNION ALL
SELECT 'respuesta_maestro',
  CASE WHEN to_regclass('public.respuesta_maestro') IS NOT NULL THEN 'ok' ELSE 'falta' END;
