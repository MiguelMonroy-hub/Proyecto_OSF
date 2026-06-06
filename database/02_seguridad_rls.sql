-- =============================================================================
-- Tec-Duck — PASO 2 de 2: Seguridad RLS (Supabase SQL Editor)
-- =============================================================================
-- Ejecutar DESPUÉS de database/01_esquema_y_funciones.sql (proyecto nuevo).
-- Instrucciones: database/LEEME_INSTALACION.md
-- =============================================================================

ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profesor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumno ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumno_grupo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nivel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nivel_maestro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregunta_maestro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respuesta_maestro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nivel_maestro_grupo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partida ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progreso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar ENABLE ROW LEVEL SECURITY;

-- usuario
CREATE POLICY usuario_select_own ON public.usuario
  FOR SELECT TO authenticated
  USING (auth_id = auth.uid());

CREATE POLICY usuario_select_maestro_alumnos ON public.usuario
  FOR SELECT TO authenticated
  USING (
    public.is_maestro()
    AND rol = 'ALUMNO'
    AND public.maestro_puede_ver_usuario_alumno(usuario.id)
  );

CREATE POLICY usuario_update_own ON public.usuario
  FOR UPDATE TO authenticated
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- profesor
CREATE POLICY profesor_select_own ON public.profesor
  FOR SELECT TO authenticated
  USING (usuario_id = public.get_my_usuario_id());

CREATE POLICY profesor_insert_own ON public.profesor
  FOR INSERT TO authenticated
  WITH CHECK (usuario_id = public.get_my_usuario_id());

-- alumno
CREATE POLICY alumno_select_own ON public.alumno
  FOR SELECT TO authenticated
  USING (usuario_id = public.get_my_usuario_id());

CREATE POLICY alumno_select_maestro ON public.alumno
  FOR SELECT TO authenticated
  USING (
    public.is_maestro()
    AND public.maestro_puede_ver_alumno_id(alumno.id)
  );

CREATE POLICY alumno_update_own ON public.alumno
  FOR UPDATE TO authenticated
  USING (usuario_id = public.get_my_usuario_id())
  WITH CHECK (usuario_id = public.get_my_usuario_id());

-- grupo (sin grupo_select_por_codigo: el alumno entra solo vía RPC unirse_a_grupo)
DROP POLICY IF EXISTS grupo_select_por_codigo ON public.grupo;

CREATE POLICY grupo_select_maestro ON public.grupo
  FOR SELECT TO authenticated
  USING (profesor_id = public.get_my_profesor_id());

CREATE POLICY grupo_select_alumno_miembro ON public.grupo
  FOR SELECT TO authenticated
  USING (
    public.is_alumno()
    AND public.soy_miembro_grupo(grupo.id)
  );

CREATE POLICY grupo_insert_maestro ON public.grupo
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_maestro()
    AND profesor_id = public.get_my_profesor_id()
    AND es_sistema = FALSE
  );

CREATE POLICY grupo_update_maestro ON public.grupo
  FOR UPDATE TO authenticated
  USING (profesor_id = public.get_my_profesor_id() AND es_sistema = FALSE)
  WITH CHECK (profesor_id = public.get_my_profesor_id() AND es_sistema = FALSE);

CREATE POLICY grupo_delete_maestro ON public.grupo
  FOR DELETE TO authenticated
  USING (profesor_id = public.get_my_profesor_id() AND es_sistema = FALSE);

-- alumno_grupo
CREATE POLICY alumno_grupo_select_own ON public.alumno_grupo
  FOR SELECT TO authenticated
  USING (alumno_id = public.get_my_alumno_id());

CREATE POLICY alumno_grupo_select_maestro ON public.alumno_grupo
  FOR SELECT TO authenticated
  USING (
    public.is_maestro()
    AND public.grupo_es_de_mi_profesor(alumno_grupo.grupo_id)
  );

CREATE POLICY alumno_grupo_insert_own ON public.alumno_grupo
  FOR INSERT TO authenticated
  WITH CHECK (alumno_id = public.get_my_alumno_id());

CREATE POLICY alumno_grupo_insert_maestro ON public.alumno_grupo
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_maestro()
    AND public.grupo_es_de_mi_profesor(alumno_grupo.grupo_id)
    AND EXISTS (
      SELECT 1 FROM public.grupo g
      WHERE g.id = alumno_grupo.grupo_id AND g.es_sistema = FALSE
    )
  );

CREATE POLICY alumno_grupo_delete_maestro ON public.alumno_grupo
  FOR DELETE TO authenticated
  USING (
    public.is_maestro()
    AND public.grupo_es_de_mi_profesor(alumno_grupo.grupo_id)
  );

-- catálogo del sistema (lectura pública autenticada)
CREATE POLICY tema_select_all ON public.tema
  FOR SELECT TO authenticated USING (activo = TRUE);

CREATE POLICY nivel_select_all ON public.nivel
  FOR SELECT TO authenticated USING (activo = TRUE);

CREATE POLICY item_select_all ON public.item
  FOR SELECT TO authenticated USING (activo = TRUE);

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

-- niveles del maestro
CREATE POLICY nivel_maestro_select_own ON public.nivel_maestro
  FOR SELECT TO authenticated
  USING (profesor_id = public.get_my_profesor_id());

CREATE POLICY nivel_maestro_select_alumno ON public.nivel_maestro
  FOR SELECT TO authenticated
  USING (
    public.is_alumno()
    AND public.alumno_puede_ver_nivel_maestro(nivel_maestro.id)
  );

CREATE POLICY nivel_maestro_insert ON public.nivel_maestro
  FOR INSERT TO authenticated
  WITH CHECK (profesor_id = public.get_my_profesor_id());

CREATE POLICY nivel_maestro_update ON public.nivel_maestro
  FOR UPDATE TO authenticated
  USING (profesor_id = public.get_my_profesor_id())
  WITH CHECK (profesor_id = public.get_my_profesor_id());

CREATE POLICY nivel_maestro_delete ON public.nivel_maestro
  FOR DELETE TO authenticated
  USING (profesor_id = public.get_my_profesor_id());

CREATE POLICY nmg_maestro_all ON public.nivel_maestro_grupo
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.nivel_maestro nm
      WHERE nm.id = nivel_maestro_grupo.nivel_maestro_id
        AND nm.profesor_id = public.get_my_profesor_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.nivel_maestro nm
      WHERE nm.id = nivel_maestro_grupo.nivel_maestro_id
        AND nm.profesor_id = public.get_my_profesor_id()
    )
  );

CREATE POLICY nmg_alumno_select ON public.nivel_maestro_grupo
  FOR SELECT TO authenticated
  USING (
    public.is_alumno()
    AND public.alumno_en_grupo_nmg(nivel_maestro_grupo.grupo_id)
  );

-- partidas y progreso: alumno solo SELECT; escritura vía registrar_resultado_quiz (RPC)
CREATE POLICY partida_alumno_select ON public.partida
  FOR SELECT TO authenticated
  USING (alumno_id = public.get_my_alumno_id());

CREATE POLICY partida_maestro_select ON public.partida
  FOR SELECT TO authenticated
  USING (
    public.is_maestro()
    AND public.maestro_puede_ver_alumno_id(partida.alumno_id)
  );

CREATE POLICY progreso_alumno_select ON public.progreso
  FOR SELECT TO authenticated
  USING (alumno_id = public.get_my_alumno_id());

CREATE POLICY progreso_maestro_select ON public.progreso
  FOR SELECT TO authenticated
  USING (
    public.is_maestro()
    AND public.maestro_puede_ver_alumno_id(progreso.alumno_id)
  );

-- tienda y avatar
CREATE POLICY inventario_alumno ON public.inventario
  FOR ALL TO authenticated
  USING (alumno_id = public.get_my_alumno_id())
  WITH CHECK (alumno_id = public.get_my_alumno_id());

CREATE POLICY compra_alumno ON public.compra
  FOR ALL TO authenticated
  USING (alumno_id = public.get_my_alumno_id())
  WITH CHECK (alumno_id = public.get_my_alumno_id());

CREATE POLICY avatar_alumno ON public.avatar
  FOR ALL TO authenticated
  USING (alumno_id = public.get_my_alumno_id())
  WITH CHECK (alumno_id = public.get_my_alumno_id());

CREATE POLICY avatar_maestro_select ON public.avatar
  FOR SELECT TO authenticated
  USING (
    public.is_maestro()
    AND public.maestro_puede_ver_alumno_id(avatar.alumno_id)
  );

-- Permisos para roles de Supabase
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
