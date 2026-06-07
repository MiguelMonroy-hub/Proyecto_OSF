-- Fix: al mover alumno A→B el INSERT fallaba porque ya se había borrado del grupo anterior
-- y maestro_puede_ver_alumno_id dejaba de ser verdadero.

CREATE OR REPLACE FUNCTION public.sincronizar_alumnos_grupo(
  p_grupo_id BIGINT,
  p_alumno_ids BIGINT[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_codigo VARCHAR;
  v_profesor_id BIGINT;
BEGIN
  IF NOT public.is_maestro() THEN
    RAISE EXCEPTION 'Solo maestros pueden asignar grupos';
  END IF;

  IF NOT public.grupo_es_de_mi_profesor(p_grupo_id) THEN
    RAISE EXCEPTION 'Grupo no autorizado';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.grupo g
    WHERE g.id = p_grupo_id AND g.es_sistema = TRUE
  ) THEN
    RAISE EXCEPTION 'No se puede editar el grupo del sistema';
  END IF;

  SELECT g.codigo, g.profesor_id
  INTO v_codigo, v_profesor_id
  FROM public.grupo g
  WHERE g.id = p_grupo_id;

  IF EXISTS (
    SELECT 1
    FROM public.alumno_grupo ag
    WHERE ag.grupo_id = p_grupo_id
      AND (
        p_alumno_ids IS NULL
        OR NOT (ag.alumno_id = ANY (p_alumno_ids))
      )
      AND NOT EXISTS (
        SELECT 1
        FROM public.alumno_grupo ag2
        JOIN public.grupo g2 ON g2.id = ag2.grupo_id
        WHERE ag2.alumno_id = ag.alumno_id
          AND g2.es_sistema = FALSE
          AND g2.id <> p_grupo_id
          AND g2.profesor_id = v_profesor_id
      )
  ) THEN
    RAISE EXCEPTION
      'Un alumno no puede quedar sin grupo. Asígnalo a otro grupo antes de quitarlo de este.';
  END IF;

  DELETE FROM public.alumno_grupo ag WHERE ag.grupo_id = p_grupo_id;

  IF p_alumno_ids IS NOT NULL AND array_length(p_alumno_ids, 1) > 0 THEN
    INSERT INTO public.alumno_grupo (alumno_id, grupo_id, codigo_usado)
    SELECT DISTINCT unnest(p_alumno_ids), p_grupo_id, v_codigo
    FROM public.alumno a
    WHERE a.id = ANY (p_alumno_ids)
      AND public.maestro_puede_ver_alumno_id(a.id)
    ON CONFLICT ON CONSTRAINT alumno_grupo_alumno_id_grupo_id_key DO UPDATE
      SET codigo_usado = EXCLUDED.codigo_usado,
          vinculado_en = NOW();

    DELETE FROM public.alumno_grupo ag
    USING public.grupo g_other
    WHERE ag.alumno_id = ANY (p_alumno_ids)
      AND g_other.id = ag.grupo_id
      AND g_other.id <> p_grupo_id
      AND g_other.es_sistema = FALSE
      AND g_other.profesor_id = v_profesor_id;
  END IF;
END;
$$;
