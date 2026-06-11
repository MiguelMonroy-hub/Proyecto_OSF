-- =============================================================================
-- Tec-Duck — PASO 1 de 2: Esquema + funciones (Supabase SQL Editor)
-- =============================================================================
-- Proyecto NUEVO: ejecuta 01 → 02 → 04_crear_maestro.sql (un 04 por cada maestro)
-- =============================================================================

-- Tipos enumerados
CREATE TYPE rol_usuario AS ENUM ('ALUMNO', 'MAESTRO');
CREATE TYPE codigo_nivel AS ENUM ('FACIL', 'DIFICIL');
CREATE TYPE letra_respuesta AS ENUM ('A', 'B', 'C', 'D');
CREATE TYPE categoria_item AS ENUM ('BASE', 'FACE', 'HEAD', 'NECK', 'SHOES');
CREATE TYPE origen_item AS ENUM ('COMPRA', 'GRATIS', 'SISTEMA');
CREATE TYPE estado_partida AS ENUM ('EN_CURSO', 'COMPLETADA', 'GAME_OVER', 'ABANDONADA');

-- Trigger genérico para actualizado_en
CREATE OR REPLACE FUNCTION public.set_actualizado_en()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- USUARIOS Y ROLES (vinculados a Supabase Auth)
-- -----------------------------------------------------------------------------

CREATE TABLE public.usuario (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  auth_id         UUID NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  email           VARCHAR(255) NOT NULL,
  rol             rol_usuario NOT NULL,
  nombre          VARCHAR(80) NOT NULL,
  apellido        VARCHAR(80),
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uk_usuario_email ON public.usuario (email);
CREATE INDEX idx_usuario_rol ON public.usuario (rol);

CREATE TRIGGER trg_usuario_actualizado
  BEFORE UPDATE ON public.usuario
  FOR EACH ROW EXECUTE FUNCTION public.set_actualizado_en();

CREATE TABLE public.profesor (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id      BIGINT NOT NULL UNIQUE REFERENCES public.usuario (id) ON DELETE CASCADE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- profesor_id: maestro que el alumno eligió al registrarse (aparece en «Todos los alumnos»).
CREATE TABLE public.alumno (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id      BIGINT NOT NULL UNIQUE REFERENCES public.usuario (id) ON DELETE CASCADE,
  profesor_id     BIGINT REFERENCES public.profesor (id) ON DELETE SET NULL,
  cambios_maestro SMALLINT NOT NULL DEFAULT 0 CHECK (cambios_maestro >= 0 AND cambios_maestro <= 1),
  saldo_monedas   INTEGER NOT NULL DEFAULT 0 CHECK (saldo_monedas >= 0),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alumno_profesor ON public.alumno (profesor_id);

-- Helpers para RLS (solo tablas usuario / profesor / alumno; el resto va tras crear todas las tablas)
CREATE OR REPLACE FUNCTION public.get_my_usuario_id()
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.usuario WHERE auth_id = auth.uid() AND activo = TRUE;
$$;

CREATE OR REPLACE FUNCTION public.get_my_profesor_id()
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id
  FROM public.profesor p
  JOIN public.usuario u ON u.id = p.usuario_id
  WHERE u.auth_id = auth.uid() AND u.activo = TRUE;
$$;

CREATE OR REPLACE FUNCTION public.get_my_alumno_id()
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.id
  FROM public.alumno a
  JOIN public.usuario u ON u.id = a.usuario_id
  WHERE u.auth_id = auth.uid() AND u.activo = TRUE;
$$;

CREATE OR REPLACE FUNCTION public.is_maestro()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuario
    WHERE auth_id = auth.uid() AND rol = 'MAESTRO' AND activo = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION public.is_alumno()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuario
    WHERE auth_id = auth.uid() AND rol = 'ALUMNO' AND activo = TRUE
  );
$$;

-- -----------------------------------------------------------------------------
-- GRUPOS DE CLASE
-- -----------------------------------------------------------------------------

CREATE TABLE public.grupo (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profesor_id     BIGINT NOT NULL REFERENCES public.profesor (id) ON DELETE CASCADE,
  nombre          VARCHAR(80) NOT NULL,
  codigo          CHAR(6) NOT NULL,
  es_sistema      BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uk_grupo_codigo ON public.grupo (codigo) WHERE es_sistema = FALSE;
CREATE UNIQUE INDEX uk_grupo_sistema_profesor ON public.grupo (profesor_id) WHERE es_sistema = TRUE;
CREATE INDEX idx_grupo_profesor ON public.grupo (profesor_id);

CREATE TABLE public.alumno_grupo (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  alumno_id       BIGINT NOT NULL REFERENCES public.alumno (id) ON DELETE CASCADE,
  grupo_id        BIGINT NOT NULL REFERENCES public.grupo (id) ON DELETE CASCADE,
  codigo_usado    CHAR(6),
  vinculado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (alumno_id, grupo_id)
);

CREATE INDEX idx_ag_grupo ON public.alumno_grupo (grupo_id);

-- -----------------------------------------------------------------------------
-- TEMAS Y NIVELES DEL SISTEMA
-- -----------------------------------------------------------------------------

CREATE TABLE public.tema (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo          VARCHAR(20) NOT NULL,
  nombre          VARCHAR(120) NOT NULL,
  nombre_corto    VARCHAR(40) NOT NULL,
  descripcion     TEXT,
  orden           SMALLINT NOT NULL DEFAULT 0,
  activo          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE UNIQUE INDEX uk_tema_codigo ON public.tema (codigo);

CREATE TABLE public.nivel (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tema_id         BIGINT NOT NULL REFERENCES public.tema (id) ON DELETE CASCADE,
  codigo          codigo_nivel NOT NULL,
  nombre          VARCHAR(80) NOT NULL,
  orden           SMALLINT NOT NULL DEFAULT 0,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (tema_id, codigo)
);

CREATE TABLE public.nivel_maestro (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profesor_id     BIGINT NOT NULL REFERENCES public.profesor (id) ON DELETE CASCADE,
  titulo          VARCHAR(120) NOT NULL,
  logo            TEXT,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  activo          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_nivel_maestro_profesor ON public.nivel_maestro (profesor_id);

CREATE TRIGGER trg_nivel_maestro_actualizado
  BEFORE UPDATE ON public.nivel_maestro
  FOR EACH ROW EXECUTE FUNCTION public.set_actualizado_en();

CREATE TABLE public.pregunta_maestro (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nivel_maestro_id BIGINT NOT NULL REFERENCES public.nivel_maestro (id) ON DELETE CASCADE,
  enunciado        TEXT NOT NULL,
  orden            SMALLINT NOT NULL DEFAULT 0,
  activa           BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pregunta_maestro_nivel ON public.pregunta_maestro (nivel_maestro_id);

CREATE TABLE public.respuesta_maestro (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pregunta_maestro_id BIGINT NOT NULL REFERENCES public.pregunta_maestro (id) ON DELETE CASCADE,
  letra               letra_respuesta NOT NULL,
  texto               VARCHAR(500) NOT NULL,
  es_correcta         BOOLEAN NOT NULL DEFAULT FALSE,
  retroalimentacion   TEXT,
  orden               SMALLINT NOT NULL DEFAULT 0,
  UNIQUE (pregunta_maestro_id, letra)
);

CREATE TABLE public.nivel_maestro_grupo (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nivel_maestro_id BIGINT NOT NULL REFERENCES public.nivel_maestro (id) ON DELETE CASCADE,
  grupo_id        BIGINT NOT NULL REFERENCES public.grupo (id) ON DELETE CASCADE,
  visible         BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_limite    DATE,
  UNIQUE (nivel_maestro_id, grupo_id)
);

-- -----------------------------------------------------------------------------
-- PARTIDAS Y PROGRESO
-- -----------------------------------------------------------------------------

CREATE TABLE public.partida (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  alumno_id       BIGINT NOT NULL REFERENCES public.alumno (id) ON DELETE CASCADE,
  nivel_id        BIGINT REFERENCES public.nivel (id) ON DELETE SET NULL,
  nivel_maestro_id BIGINT REFERENCES public.nivel_maestro (id) ON DELETE SET NULL,
  modo            codigo_nivel NOT NULL DEFAULT 'FACIL',
  vidas_iniciales SMALLINT NOT NULL DEFAULT 3,
  vidas_restantes SMALLINT NOT NULL DEFAULT 3,
  indice_pregunta SMALLINT NOT NULL DEFAULT 0,
  estado          estado_partida NOT NULL DEFAULT 'EN_CURSO',
  monedas_ganadas INTEGER NOT NULL DEFAULT 0,
  preguntas_total SMALLINT NOT NULL DEFAULT 0,
  actividad       JSONB NOT NULL DEFAULT '[]'::jsonb,
  iniciado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  terminado_en    TIMESTAMPTZ,
  CONSTRAINT chk_partida_origen CHECK (
    (nivel_id IS NOT NULL AND nivel_maestro_id IS NULL)
    OR (nivel_id IS NULL AND nivel_maestro_id IS NOT NULL)
  )
);

CREATE INDEX idx_partida_alumno ON public.partida (alumno_id);

CREATE TABLE public.progreso (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  alumno_id       BIGINT NOT NULL REFERENCES public.alumno (id) ON DELETE CASCADE,
  tema_id         BIGINT REFERENCES public.tema (id) ON DELETE CASCADE,
  nivel_maestro_id BIGINT REFERENCES public.nivel_maestro (id) ON DELETE CASCADE,
  facil_completado BOOLEAN NOT NULL DEFAULT FALSE,
  dificil_completado BOOLEAN NOT NULL DEFAULT FALSE,
  puntaje         SMALLINT,
  preguntas_ok    SMALLINT NOT NULL DEFAULT 0,
  preguntas_total SMALLINT NOT NULL DEFAULT 0,
  tiempo_promedio_seg SMALLINT,
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_progreso_origen CHECK (
    (tema_id IS NOT NULL AND nivel_maestro_id IS NULL)
    OR (tema_id IS NULL AND nivel_maestro_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX uk_progreso_alumno_tema
  ON public.progreso (alumno_id, tema_id)
  WHERE tema_id IS NOT NULL;

CREATE UNIQUE INDEX uk_progreso_alumno_nm
  ON public.progreso (alumno_id, nivel_maestro_id)
  WHERE nivel_maestro_id IS NOT NULL;

CREATE TRIGGER trg_progreso_actualizado
  BEFORE UPDATE ON public.progreso
  FOR EACH ROW EXECUTE FUNCTION public.set_actualizado_en();

-- -----------------------------------------------------------------------------
-- TIENDA
-- -----------------------------------------------------------------------------

CREATE TABLE public.item (
  id              VARCHAR(64) PRIMARY KEY,
  categoria       categoria_item NOT NULL,
  subcarpeta      VARCHAR(40) NOT NULL,
  archivo         VARCHAR(120) NOT NULL,
  etiqueta        VARCHAR(80) NOT NULL,
  precio_monedas  INTEGER NOT NULL DEFAULT 0 CHECK (precio_monedas >= 0),
  activo          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE public.inventario (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  alumno_id       BIGINT NOT NULL REFERENCES public.alumno (id) ON DELETE CASCADE,
  item_id         VARCHAR(64) NOT NULL REFERENCES public.item (id) ON DELETE RESTRICT,
  origen          origen_item NOT NULL DEFAULT 'COMPRA',
  obtenido_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (alumno_id, item_id)
);

CREATE TABLE public.compra (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  alumno_id       BIGINT NOT NULL REFERENCES public.alumno (id) ON DELETE CASCADE,
  item_id         VARCHAR(64) NOT NULL REFERENCES public.item (id) ON DELETE RESTRICT,
  precio_pagado   INTEGER NOT NULL,
  saldo_antes     INTEGER NOT NULL,
  saldo_despues   INTEGER NOT NULL,
  comprado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compra_alumno ON public.compra (alumno_id);

-- -----------------------------------------------------------------------------
-- AVATAR
-- -----------------------------------------------------------------------------

CREATE TABLE public.avatar (
  alumno_id       BIGINT PRIMARY KEY REFERENCES public.alumno (id) ON DELETE CASCADE,
  item_base_id    VARCHAR(64) NOT NULL DEFAULT 'BASE:MAIN DUCK.png' REFERENCES public.item (id) ON DELETE RESTRICT,
  item_face_id    VARCHAR(64) REFERENCES public.item (id) ON DELETE SET NULL,
  item_head_id    VARCHAR(64) REFERENCES public.item (id) ON DELETE SET NULL,
  item_neck_id    VARCHAR(64) REFERENCES public.item (id) ON DELETE SET NULL,
  item_shoes_id   VARCHAR(64) REFERENCES public.item (id) ON DELETE SET NULL,
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_avatar_actualizado
  BEFORE UPDATE ON public.avatar
  FOR EACH ROW EXECUTE FUNCTION public.set_actualizado_en();

-- -----------------------------------------------------------------------------
-- Triggers y helpers RLS (después de todas las tablas)
-- -----------------------------------------------------------------------------

-- Perfil automático al registrarse en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rol       rol_usuario;
  v_nombre    TEXT;
  v_apellido  TEXT;
  v_usuario_id BIGINT;
  v_alumno_id BIGINT;
BEGIN
  v_rol := COALESCE((NEW.raw_user_meta_data ->> 'rol')::rol_usuario, 'ALUMNO');
  v_nombre := COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data ->> 'nombre'), ''), split_part(NEW.email, '@', 1));
  v_apellido := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'apellido'), '');

  INSERT INTO public.usuario (auth_id, email, rol, nombre, apellido)
  VALUES (NEW.id, NEW.email, v_rol, v_nombre, v_apellido)
  RETURNING id INTO v_usuario_id;

  IF v_rol = 'MAESTRO' THEN
    INSERT INTO public.profesor (usuario_id) VALUES (v_usuario_id);
    INSERT INTO public.grupo (profesor_id, nombre, codigo, es_sistema)
    SELECT p.id, 'Todos los alumnos', 'SYST00', TRUE
    FROM public.profesor p
    WHERE p.usuario_id = v_usuario_id;
  ELSE
    INSERT INTO public.alumno (usuario_id) VALUES (v_usuario_id)
    RETURNING id INTO v_alumno_id;
    INSERT INTO public.avatar (alumno_id) VALUES (v_alumno_id);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helpers RLS sin recursión (SECURITY DEFINER evita ciclos grupo ↔ alumno_grupo)
CREATE OR REPLACE FUNCTION public.grupo_es_de_mi_profesor(p_grupo_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.grupo g
    JOIN public.profesor p ON p.id = g.profesor_id
    JOIN public.usuario u ON u.id = p.usuario_id
    WHERE g.id = p_grupo_id
      AND u.auth_id = auth.uid()
      AND u.activo = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION public.soy_miembro_grupo(p_grupo_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.alumno_grupo ag
    JOIN public.alumno a ON a.id = ag.alumno_id
    JOIN public.usuario u ON u.id = a.usuario_id
    WHERE ag.grupo_id = p_grupo_id
      AND u.auth_id = auth.uid()
      AND u.activo = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION public.maestro_puede_ver_alumno_id(p_alumno_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.alumno a
    JOIN public.profesor p ON p.id = a.profesor_id
    JOIN public.usuario u ON u.id = p.usuario_id
    WHERE a.id = p_alumno_id
      AND u.auth_id = auth.uid()
      AND u.activo = TRUE
  )
  OR EXISTS (
    SELECT 1
    FROM public.alumno_grupo ag
    JOIN public.grupo g ON g.id = ag.grupo_id
    JOIN public.profesor p ON p.id = g.profesor_id
    JOIN public.usuario u ON u.id = p.usuario_id
    WHERE ag.alumno_id = p_alumno_id
      AND u.auth_id = auth.uid()
      AND u.activo = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION public.maestro_puede_ver_usuario_alumno(p_usuario_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.alumno a
    JOIN public.profesor p ON p.id = a.profesor_id
    JOIN public.usuario u ON u.id = p.usuario_id
    WHERE a.usuario_id = p_usuario_id
      AND u.auth_id = auth.uid()
      AND u.activo = TRUE
  )
  OR EXISTS (
    SELECT 1
    FROM public.alumno a
    JOIN public.alumno_grupo ag ON ag.alumno_id = a.id
    JOIN public.grupo g ON g.id = ag.grupo_id
    JOIN public.profesor p ON p.id = g.profesor_id
    JOIN public.usuario u ON u.id = p.usuario_id
    WHERE a.usuario_id = p_usuario_id
      AND u.auth_id = auth.uid()
      AND u.activo = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION public.alumno_puede_ver_nivel_maestro(p_nivel_maestro_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.nivel_maestro_grupo nmg
    JOIN public.alumno_grupo ag ON ag.grupo_id = nmg.grupo_id
    JOIN public.alumno a ON a.id = ag.alumno_id
    JOIN public.usuario u ON u.id = a.usuario_id
    WHERE nmg.nivel_maestro_id = p_nivel_maestro_id
      AND nmg.visible = TRUE
      AND u.auth_id = auth.uid()
      AND u.activo = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION public.alumno_en_grupo_nmg(p_grupo_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.alumno_grupo ag
    JOIN public.alumno a ON a.id = ag.alumno_id
    JOIN public.usuario u ON u.id = a.usuario_id
    WHERE ag.grupo_id = p_grupo_id
      AND u.auth_id = auth.uid()
      AND u.activo = TRUE
  );
$$;

-- Unirse a grupo por código (evita exponer INSERT directo)
CREATE OR REPLACE FUNCTION public.unirse_a_grupo(p_codigo CHAR(6))
RETURNS TABLE (
  grupo_id BIGINT,
  nombre VARCHAR(80),
  codigo CHAR(6)
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alumno_id BIGINT;
  v_grupo public.grupo%ROWTYPE;
BEGIN
  v_alumno_id := public.get_my_alumno_id();
  IF v_alumno_id IS NULL THEN
    RAISE EXCEPTION 'Solo alumnos autenticados pueden unirse a un grupo';
  END IF;

  SELECT * INTO v_grupo
  FROM public.grupo g
  WHERE g.codigo = UPPER(TRIM(p_codigo))
    AND g.es_sistema = FALSE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Código no válido. Revisa con tu maestro.';
  END IF;

  DELETE FROM public.alumno_grupo ag
  USING public.grupo g_old
  WHERE ag.alumno_id = v_alumno_id
    AND g_old.id = ag.grupo_id
    AND g_old.es_sistema = FALSE
    AND g_old.id <> v_grupo.id
    AND g_old.profesor_id = v_grupo.profesor_id;

  UPDATE public.alumno
  SET profesor_id = v_grupo.profesor_id
  WHERE id = v_alumno_id;

  INSERT INTO public.alumno_grupo (alumno_id, grupo_id, codigo_usado)
  VALUES (v_alumno_id, v_grupo.id, v_grupo.codigo)
  ON CONFLICT ON CONSTRAINT alumno_grupo_alumno_id_grupo_id_key DO UPDATE
    SET codigo_usado = EXCLUDED.codigo_usado,
        vinculado_en = NOW();

  INSERT INTO public.alumno_grupo (alumno_id, grupo_id, codigo_usado)
  SELECT v_alumno_id, g_sys.id, g_sys.codigo
  FROM public.grupo g_sys
  WHERE g_sys.profesor_id = v_grupo.profesor_id
    AND g_sys.es_sistema = TRUE
  ON CONFLICT ON CONSTRAINT alumno_grupo_alumno_id_grupo_id_key DO UPDATE
    SET codigo_usado = EXCLUDED.codigo_usado,
        vinculado_en = NOW();

  RETURN QUERY
  SELECT v_grupo.id, v_grupo.nombre, v_grupo.codigo;
END;
$$;

GRANT EXECUTE ON FUNCTION public.unirse_a_grupo(CHAR(6)) TO authenticated;

CREATE OR REPLACE FUNCTION public.guardar_avatar_alumno(
  p_item_base_id VARCHAR DEFAULT 'BASE:MAIN DUCK.png',
  p_item_face_id VARCHAR DEFAULT NULL,
  p_item_head_id VARCHAR DEFAULT NULL,
  p_item_neck_id VARCHAR DEFAULT NULL,
  p_item_shoes_id VARCHAR DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alumno_id BIGINT;
BEGIN
  v_alumno_id := public.get_my_alumno_id();
  IF v_alumno_id IS NULL THEN
    RAISE EXCEPTION 'Solo alumnos autenticados pueden guardar su avatar';
  END IF;

  INSERT INTO public.avatar (
    alumno_id,
    item_base_id,
    item_face_id,
    item_head_id,
    item_neck_id,
    item_shoes_id
  )
  VALUES (
    v_alumno_id,
    COALESCE(NULLIF(TRIM(p_item_base_id), ''), 'BASE:MAIN DUCK.png'),
    NULLIF(TRIM(p_item_face_id), ''),
    NULLIF(TRIM(p_item_head_id), ''),
    NULLIF(TRIM(p_item_neck_id), ''),
    NULLIF(TRIM(p_item_shoes_id), '')
  )
  ON CONFLICT (alumno_id) DO UPDATE SET
    item_base_id = EXCLUDED.item_base_id,
    item_face_id = EXCLUDED.item_face_id,
    item_head_id = EXCLUDED.item_head_id,
    item_neck_id = EXCLUDED.item_neck_id,
    item_shoes_id = EXCLUDED.item_shoes_id,
    actualizado_en = NOW();
END;
$$;

GRANT EXECUTE ON FUNCTION public.guardar_avatar_alumno(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR) TO authenticated;

-- -----------------------------------------------------------------------------
-- ECONOMÍA (monedas, tienda) Y RESULTADOS DE QUIZ
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.agregar_monedas_alumno(p_cantidad INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alumno_id BIGINT;
  v_saldo INTEGER;
BEGIN
  v_alumno_id := public.get_my_alumno_id();
  IF v_alumno_id IS NULL THEN
    RAISE EXCEPTION 'Solo alumnos autenticados pueden recibir monedas';
  END IF;

  IF COALESCE(p_cantidad, 0) <= 0 THEN
    SELECT saldo_monedas INTO v_saldo FROM public.alumno WHERE id = v_alumno_id;
    RETURN COALESCE(v_saldo, 0);
  END IF;

  UPDATE public.alumno
  SET saldo_monedas = saldo_monedas + p_cantidad
  WHERE id = v_alumno_id
  RETURNING saldo_monedas INTO v_saldo;

  RETURN COALESCE(v_saldo, 0);
END;
$$;

-- Solo uso interno; el cliente ya no puede llamarla (monedas vía registrar_resultado_quiz).
REVOKE EXECUTE ON FUNCTION public.agregar_monedas_alumno(INTEGER) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.agregar_monedas_alumno(INTEGER) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.comprar_item_tienda(p_item_id VARCHAR)
RETURNS TABLE (saldo_restante INTEGER, ya_tenia BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alumno_id BIGINT;
  v_item public.item%ROWTYPE;
  v_saldo INTEGER;
  v_antes INTEGER;
BEGIN
  v_alumno_id := public.get_my_alumno_id();
  IF v_alumno_id IS NULL THEN
    RAISE EXCEPTION 'Solo alumnos autenticados pueden comprar';
  END IF;

  SELECT * INTO v_item
  FROM public.item i
  WHERE i.id = p_item_id AND i.activo = TRUE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Artículo no válido';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.inventario inv
    WHERE inv.alumno_id = v_alumno_id AND inv.item_id = p_item_id
  ) THEN
    SELECT a.saldo_monedas INTO v_saldo FROM public.alumno a WHERE a.id = v_alumno_id;
    RETURN QUERY SELECT COALESCE(v_saldo, 0), TRUE;
    RETURN;
  END IF;

  SELECT a.saldo_monedas INTO v_saldo
  FROM public.alumno a
  WHERE a.id = v_alumno_id
  FOR UPDATE;

  IF v_saldo IS NULL THEN
    RAISE EXCEPTION 'Alumno no encontrado';
  END IF;

  IF v_saldo < v_item.precio_monedas THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;

  v_antes := v_saldo;
  v_saldo := v_saldo - v_item.precio_monedas;

  UPDATE public.alumno SET saldo_monedas = v_saldo WHERE id = v_alumno_id;

  INSERT INTO public.inventario (alumno_id, item_id, origen)
  VALUES (v_alumno_id, p_item_id, 'COMPRA');

  INSERT INTO public.compra (
    alumno_id, item_id, precio_pagado, saldo_antes, saldo_despues
  )
  VALUES (
    v_alumno_id, p_item_id, v_item.precio_monedas, v_antes, v_saldo
  );

  RETURN QUERY SELECT v_saldo, FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.comprar_item_tienda(VARCHAR) TO authenticated;

CREATE OR REPLACE FUNCTION public.otorgar_item_inventario(
  p_item_id VARCHAR,
  p_origen origen_item DEFAULT 'GRATIS'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alumno_id BIGINT;
BEGIN
  v_alumno_id := public.get_my_alumno_id();
  IF v_alumno_id IS NULL THEN
    RAISE EXCEPTION 'Solo alumnos autenticados';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.item i WHERE i.id = p_item_id AND i.activo = TRUE) THEN
    RETURN;
  END IF;

  INSERT INTO public.inventario (alumno_id, item_id, origen)
  VALUES (v_alumno_id, p_item_id, COALESCE(p_origen, 'GRATIS'::origen_item))
  ON CONFLICT (alumno_id, item_id) DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.otorgar_item_inventario(VARCHAR, origen_item) TO authenticated;

-- Helpers: actividad JSONB → métricas ponderadas y monedas 10/5/2
CREATE OR REPLACE FUNCTION public._partida_actividad_items(p_actividad JSONB)
RETURNS JSONB
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN jsonb_typeof(COALESCE(p_actividad, '[]'::jsonb)) = 'array'
      THEN COALESCE(p_actividad, '[]'::jsonb)
    WHEN jsonb_typeof(COALESCE(p_actividad, '{}'::jsonb)) = 'object'
      AND jsonb_typeof(COALESCE(p_actividad -> 'items', '[]'::jsonb)) = 'array'
      THEN COALESCE(p_actividad -> 'items', '[]'::jsonb)
    ELSE '[]'::jsonb
  END;
$$;

CREATE OR REPLACE FUNCTION public._partida_peso_pregunta(p_item JSONB)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_ok BOOLEAN;
  v_omitida BOOLEAN;
  v_errores INTEGER;
BEGIN
  IF p_item IS NULL OR p_item = 'null'::jsonb THEN
    RETURN 0;
  END IF;
  v_ok := COALESCE((p_item ->> 'ok')::boolean, FALSE);
  v_omitida := COALESCE((p_item ->> 'omitida')::boolean, FALSE);
  IF v_omitida OR NOT v_ok THEN
    RETURN 0;
  END IF;
  v_errores := GREATEST(COALESCE((p_item ->> 'errores')::integer, 0), 0);
  IF v_errores <= 0 THEN
    RETURN 1;
  ELSIF v_errores = 1 THEN
    RETURN 0.5;
  END IF;
  RETURN 0.2;
END;
$$;

CREATE OR REPLACE FUNCTION public._partida_monedas_pregunta(p_item JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_ok BOOLEAN;
  v_errores INTEGER;
BEGIN
  IF p_item IS NULL OR p_item = 'null'::jsonb THEN
    RETURN 0;
  END IF;
  v_ok := COALESCE((p_item ->> 'ok')::boolean, FALSE);
  IF NOT v_ok THEN
    RETURN 0;
  END IF;
  v_errores := GREATEST(COALESCE((p_item ->> 'errores')::integer, 0), 0);
  IF v_errores <= 0 THEN
    RETURN 10;
  ELSIF v_errores = 1 THEN
    RETURN 5;
  END IF;
  RETURN 2;
END;
$$;

CREATE OR REPLACE FUNCTION public._partida_metricas_desde_actividad(
  p_actividad JSONB,
  p_total SMALLINT
)
RETURNS TABLE (
  preguntas_ok SMALLINT,
  suma_peso NUMERIC,
  monedas_validas INTEGER,
  puntaje SMALLINT
)
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_items JSONB;
  v_elem JSONB;
  v_ok_count SMALLINT := 0;
  v_suma NUMERIC := 0;
  v_monedas INTEGER := 0;
  v_total SMALLINT;
  v_puntaje SMALLINT;
BEGIN
  v_items := public._partida_actividad_items(p_actividad);
  v_total := GREATEST(COALESCE(p_total, 0), 0);

  IF jsonb_typeof(v_items) = 'array' THEN
    FOR v_elem IN SELECT value FROM jsonb_array_elements(v_items)
    LOOP
      IF COALESCE((v_elem ->> 'ok')::boolean, FALSE) THEN
        v_ok_count := v_ok_count + 1;
      END IF;
      v_suma := v_suma + public._partida_peso_pregunta(v_elem);
      v_monedas := v_monedas + public._partida_monedas_pregunta(v_elem);
    END LOOP;
  END IF;

  IF v_total > 0 THEN
    v_puntaje := LEAST(
      10,
      GREATEST(0, ROUND((v_suma / v_total::numeric) * 10)::integer)
    )::smallint;
  ELSE
    v_puntaje := 0;
  END IF;

  RETURN QUERY SELECT v_ok_count, v_suma, v_monedas, v_puntaje;
END;
$$;

DROP FUNCTION IF EXISTS public.registrar_resultado_quiz(
  BIGINT, BIGINT, VARCHAR, VARCHAR, SMALLINT, SMALLINT, SMALLINT, INTEGER, SMALLINT, SMALLINT, JSONB
);

CREATE OR REPLACE FUNCTION public.registrar_resultado_quiz(
  p_tema_id BIGINT DEFAULT NULL,
  p_nivel_maestro_id BIGINT DEFAULT NULL,
  p_modo VARCHAR DEFAULT 'FACIL',
  p_estado VARCHAR DEFAULT 'COMPLETADA',
  p_preguntas_ok SMALLINT DEFAULT 0,
  p_preguntas_total SMALLINT DEFAULT 0,
  p_tiempo_promedio_seg SMALLINT DEFAULT NULL,
  p_monedas_ganadas INTEGER DEFAULT 0,
  p_vidas_restantes SMALLINT DEFAULT 0,
  p_indice_pregunta SMALLINT DEFAULT 0,
  p_actividad JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alumno_id BIGINT;
  v_nivel_id BIGINT;
  v_partida_id BIGINT;
  v_prog_id BIGINT;
  v_puntaje SMALLINT;
  v_modo codigo_nivel;
  v_estado estado_partida;
  v_estado_previo estado_partida;
  v_total SMALLINT;
  v_ok SMALLINT;
  v_ok_calc SMALLINT;
  v_monedas_validas INTEGER;
  v_monedas_prev INTEGER;
  v_monedas_delta INTEGER;
  v_saldo INTEGER;
  v_items JSONB;
  v_item_count INTEGER;
BEGIN
  v_alumno_id := public.get_my_alumno_id();
  IF v_alumno_id IS NULL THEN
    RAISE EXCEPTION 'Solo alumnos autenticados pueden registrar partidas';
  END IF;

  IF p_tema_id IS NULL AND p_nivel_maestro_id IS NULL THEN
    RAISE EXCEPTION 'Indica tema_id o nivel_maestro_id';
  END IF;

  v_modo := CASE
    WHEN UPPER(TRIM(COALESCE(p_modo, ''))) = 'DIFICIL' THEN 'DIFICIL'::codigo_nivel
    ELSE 'FACIL'::codigo_nivel
  END;

  v_estado := CASE UPPER(TRIM(COALESCE(p_estado, '')))
    WHEN 'GAME_OVER' THEN 'GAME_OVER'::estado_partida
    WHEN 'ABANDONADA' THEN 'ABANDONADA'::estado_partida
    WHEN 'EN_CURSO' THEN 'EN_CURSO'::estado_partida
    ELSE 'COMPLETADA'::estado_partida
  END;

  IF p_tema_id IS NOT NULL THEN
    SELECT n.id INTO v_nivel_id
    FROM public.nivel n
    WHERE n.tema_id = p_tema_id
      AND n.codigo = v_modo
    LIMIT 1;
  END IF;

  v_total := GREATEST(COALESCE(p_preguntas_total, 0), 0);
  v_ok := LEAST(GREATEST(COALESCE(p_preguntas_ok, 0), 0), v_total);

  IF GREATEST(COALESCE(p_indice_pregunta, 0), 0) > v_total AND v_total > 0 THEN
    RAISE EXCEPTION 'indice_pregunta fuera de rango';
  END IF;

  v_items := public._partida_actividad_items(p_actividad);
  v_item_count := CASE
    WHEN jsonb_typeof(v_items) = 'array' THEN jsonb_array_length(v_items)
    ELSE 0
  END;

  IF v_total > 0 AND v_item_count > v_total + 1 THEN
    RAISE EXCEPTION 'Demasiados items de actividad';
  END IF;

  SELECT m.preguntas_ok, m.monedas_validas, m.puntaje
  INTO v_ok_calc, v_monedas_validas, v_puntaje
  FROM public._partida_metricas_desde_actividad(p_actividad, v_total) AS m;

  v_ok := LEAST(GREATEST(v_ok_calc, v_ok), v_total);
  v_monedas_validas := GREATEST(COALESCE(v_monedas_validas, 0), 0);

  SELECT p.id, p.estado, COALESCE(p.monedas_ganadas, 0)
  INTO v_partida_id, v_estado_previo, v_monedas_prev
  FROM public.partida p
  WHERE p.alumno_id = v_alumno_id
    AND p.estado = 'EN_CURSO'
    AND p.modo = v_modo
    AND (
      (
        p_tema_id IS NOT NULL
        AND p.nivel_id IS NOT DISTINCT FROM v_nivel_id
        AND p.nivel_maestro_id IS NULL
      )
      OR (
        p_nivel_maestro_id IS NOT NULL
        AND p.nivel_maestro_id = p_nivel_maestro_id
        AND p.nivel_id IS NULL
      )
    )
  ORDER BY p.iniciado_en DESC
  LIMIT 1;

  IF v_partida_id IS NOT NULL THEN
    IF v_estado_previo IN ('COMPLETADA', 'GAME_OVER', 'ABANDONADA')
       AND v_estado = 'EN_CURSO' THEN
      RAISE EXCEPTION 'No se puede reabrir una partida cerrada';
    END IF;

    UPDATE public.partida SET
      vidas_restantes = COALESCE(p_vidas_restantes, 0),
      indice_pregunta = LEAST(GREATEST(COALESCE(p_indice_pregunta, 0), 0), v_total),
      preguntas_total = v_total,
      estado = v_estado,
      monedas_ganadas = v_monedas_validas,
      actividad = COALESCE(p_actividad, '[]'::jsonb),
      terminado_en = CASE
        WHEN v_estado IN ('COMPLETADA', 'GAME_OVER', 'ABANDONADA') THEN NOW()
        ELSE NULL
      END
    WHERE id = v_partida_id;
  ELSE
    INSERT INTO public.partida (
      alumno_id,
      nivel_id,
      nivel_maestro_id,
      modo,
      vidas_iniciales,
      vidas_restantes,
      indice_pregunta,
      preguntas_total,
      estado,
      monedas_ganadas,
      terminado_en,
      actividad
    )
    VALUES (
      v_alumno_id,
      v_nivel_id,
      p_nivel_maestro_id,
      v_modo,
      3,
      COALESCE(p_vidas_restantes, 0),
      LEAST(GREATEST(COALESCE(p_indice_pregunta, 0), 0), v_total),
      v_total,
      v_estado,
      v_monedas_validas,
      CASE
        WHEN v_estado IN ('COMPLETADA', 'GAME_OVER', 'ABANDONADA') THEN NOW()
        ELSE NULL
      END,
      COALESCE(p_actividad, '[]'::jsonb)
    )
    RETURNING id INTO v_partida_id;
    v_monedas_prev := 0;
  END IF;

  v_monedas_delta := GREATEST(v_monedas_validas - COALESCE(v_monedas_prev, 0), 0);

  IF v_monedas_delta > 0 THEN
    UPDATE public.alumno
    SET saldo_monedas = saldo_monedas + v_monedas_delta
    WHERE id = v_alumno_id
    RETURNING saldo_monedas INTO v_saldo;
  ELSE
    SELECT a.saldo_monedas INTO v_saldo FROM public.alumno a WHERE a.id = v_alumno_id;
  END IF;

  IF v_estado IN ('COMPLETADA', 'GAME_OVER') THEN
    IF p_tema_id IS NOT NULL THEN
      SELECT p.id INTO v_prog_id FROM public.progreso p
      WHERE p.alumno_id = v_alumno_id AND p.tema_id = p_tema_id
      LIMIT 1;

      IF v_prog_id IS NOT NULL THEN
        UPDATE public.progreso SET
          facil_completado = progreso.facil_completado OR (v_modo = 'FACIL' AND v_estado = 'COMPLETADA'),
          dificil_completado = progreso.dificil_completado OR (v_modo = 'DIFICIL' AND v_estado = 'COMPLETADA'),
          puntaje = GREATEST(COALESCE(progreso.puntaje, 0), COALESCE(v_puntaje, 0)),
          preguntas_ok = GREATEST(progreso.preguntas_ok, v_ok),
          preguntas_total = GREATEST(progreso.preguntas_total, v_total),
          tiempo_promedio_seg = p_tiempo_promedio_seg,
          actualizado_en = NOW()
        WHERE alumno_id = v_alumno_id AND tema_id = p_tema_id;
      ELSE
        INSERT INTO public.progreso (
          alumno_id, tema_id, facil_completado, dificil_completado,
          puntaje, preguntas_ok, preguntas_total, tiempo_promedio_seg
        )
        VALUES (
          v_alumno_id, p_tema_id,
          v_modo = 'FACIL' AND v_estado = 'COMPLETADA',
          v_modo = 'DIFICIL' AND v_estado = 'COMPLETADA',
          v_puntaje, v_ok, v_total, p_tiempo_promedio_seg
        );
      END IF;
    ELSIF p_nivel_maestro_id IS NOT NULL THEN
      IF EXISTS (
        SELECT 1 FROM public.progreso p
        WHERE p.alumno_id = v_alumno_id AND p.nivel_maestro_id = p_nivel_maestro_id
      ) THEN
        UPDATE public.progreso SET
          facil_completado = progreso.facil_completado OR (v_estado = 'COMPLETADA'),
          puntaje = GREATEST(COALESCE(progreso.puntaje, 0), COALESCE(v_puntaje, 0)),
          preguntas_ok = GREATEST(progreso.preguntas_ok, v_ok),
          preguntas_total = GREATEST(progreso.preguntas_total, v_total),
          tiempo_promedio_seg = p_tiempo_promedio_seg,
          actualizado_en = NOW()
        WHERE alumno_id = v_alumno_id AND nivel_maestro_id = p_nivel_maestro_id;
      ELSE
        INSERT INTO public.progreso (
          alumno_id, nivel_maestro_id, facil_completado,
          puntaje, preguntas_ok, preguntas_total, tiempo_promedio_seg
        )
        VALUES (
          v_alumno_id, p_nivel_maestro_id, v_estado = 'COMPLETADA',
          v_puntaje, v_ok, v_total, p_tiempo_promedio_seg
        );
      END IF;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'partida_id', v_partida_id,
    'saldo_monedas', COALESCE(v_saldo, 0),
    'monedas_partida', v_monedas_validas
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.registrar_resultado_quiz(
  BIGINT, BIGINT, VARCHAR, VARCHAR, SMALLINT, SMALLINT, SMALLINT, INTEGER, SMALLINT, SMALLINT, JSONB
) TO authenticated;

-- -----------------------------------------------------------------------------
-- Asignación de alumnos a grupo (maestro, transacción única)
-- -----------------------------------------------------------------------------

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
    WHERE a.id = ANY(p_alumno_ids)
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

GRANT EXECUTE ON FUNCTION public.sincronizar_alumnos_grupo(BIGINT, BIGINT[]) TO authenticated;

-- -----------------------------------------------------------------------------
-- Eliminar alumno (maestro, borra cuenta Auth y todo su historial)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.eliminar_alumno_maestro(p_alumno_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_auth_id UUID;
  v_rol     VARCHAR;
BEGIN
  IF NOT public.is_maestro() THEN
    RAISE EXCEPTION 'Solo maestros pueden eliminar alumnos';
  END IF;

  IF p_alumno_id IS NULL OR p_alumno_id <= 0 THEN
    RAISE EXCEPTION 'Alumno no válido';
  END IF;

  IF NOT public.maestro_puede_ver_alumno_id(p_alumno_id) THEN
    RAISE EXCEPTION 'No tienes permiso para eliminar a este alumno';
  END IF;

  SELECT u.auth_id, u.rol
  INTO v_auth_id, v_rol
  FROM public.alumno a
  JOIN public.usuario u ON u.id = a.usuario_id
  WHERE a.id = p_alumno_id;

  IF v_auth_id IS NULL THEN
    RAISE EXCEPTION 'Alumno no encontrado';
  END IF;

  IF v_rol IS DISTINCT FROM 'ALUMNO' THEN
    RAISE EXCEPTION 'Solo se pueden eliminar cuentas de alumno';
  END IF;

  DELETE FROM auth.sessions WHERE user_id = v_auth_id;
  DELETE FROM auth.refresh_tokens WHERE user_id = v_auth_id::text;
  DELETE FROM auth.identities WHERE user_id = v_auth_id;
  DELETE FROM auth.users WHERE id = v_auth_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.eliminar_alumno_maestro(BIGINT) TO authenticated;

-- -----------------------------------------------------------------------------
-- Registro de alumnos: listar maestros y vincular al elegido
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.listar_maestros_registro()
RETURNS TABLE (
  profesor_id BIGINT,
  nombre TEXT,
  apellido TEXT,
  etiqueta TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    u.nombre::TEXT,
    COALESCE(u.apellido, '')::TEXT,
    trim(
      u.nombre || CASE
        WHEN u.apellido IS NOT NULL AND trim(u.apellido) <> '' THEN ' ' || u.apellido
        ELSE ''
      END
    )
  FROM public.profesor p
  JOIN public.usuario u ON u.id = p.usuario_id
  WHERE u.rol = 'MAESTRO'
    AND u.activo = TRUE
  ORDER BY u.nombre, u.apellido;
$$;

CREATE OR REPLACE FUNCTION public.vincular_alumno_a_maestro(p_profesor_id BIGINT)
RETURNS TABLE (
  grupo_id BIGINT,
  nombre VARCHAR(80)
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alumno_id BIGINT;
  v_grupo public.grupo%ROWTYPE;
BEGIN
  v_alumno_id := public.get_my_alumno_id();
  IF v_alumno_id IS NULL THEN
    RAISE EXCEPTION 'Solo alumnos autenticados pueden vincularse a un maestro';
  END IF;

  IF p_profesor_id IS NULL THEN
    RAISE EXCEPTION 'Selecciona un maestro';
  END IF;

  SELECT * INTO v_grupo
  FROM public.grupo g
  WHERE g.profesor_id = p_profesor_id
    AND g.es_sistema = TRUE
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Maestro no encontrado';
  END IF;

  DELETE FROM public.alumno_grupo ag
  USING public.grupo g_old
  WHERE ag.alumno_id = v_alumno_id
    AND g_old.id = ag.grupo_id
    AND g_old.es_sistema = TRUE
    AND g_old.profesor_id <> p_profesor_id;

  DELETE FROM public.alumno_grupo ag
  USING public.grupo g_old
  WHERE ag.alumno_id = v_alumno_id
    AND g_old.id = ag.grupo_id
    AND g_old.profesor_id = p_profesor_id
    AND g_old.es_sistema = FALSE;

  UPDATE public.alumno
  SET profesor_id = p_profesor_id
  WHERE id = v_alumno_id;

  INSERT INTO public.alumno_grupo (alumno_id, grupo_id, codigo_usado)
  VALUES (v_alumno_id, v_grupo.id, v_grupo.codigo)
  ON CONFLICT ON CONSTRAINT alumno_grupo_alumno_id_grupo_id_key DO UPDATE
    SET codigo_usado = EXCLUDED.codigo_usado,
        vinculado_en = NOW();

  RETURN QUERY
  SELECT v_grupo.id, v_grupo.nombre;
END;
$$;

-- Estado del vínculo maestro (para el modal «Cambiar maestro» en Temas).
CREATE OR REPLACE FUNCTION public.estado_cambio_maestro_alumno()
RETURNS TABLE (
  puede_cambiar BOOLEAN,
  cambios_maestro SMALLINT,
  profesor_id BIGINT,
  nombre_maestro TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH mi AS (
    SELECT a.id, a.cambios_maestro, a.profesor_id
    FROM public.alumno a
    WHERE a.id = public.get_my_alumno_id()
  ),
  resuelto AS (
    SELECT
      mi.id,
      mi.cambios_maestro,
      COALESCE(
        mi.profesor_id,
        (
          SELECT g.profesor_id
          FROM public.alumno_grupo ag
          JOIN public.grupo g ON g.id = ag.grupo_id AND g.es_sistema = TRUE
          WHERE ag.alumno_id = mi.id
          ORDER BY ag.vinculado_en DESC
          LIMIT 1
        ),
        (
          SELECT g.profesor_id
          FROM public.alumno_grupo ag
          JOIN public.grupo g ON g.id = ag.grupo_id AND g.es_sistema = FALSE
          WHERE ag.alumno_id = mi.id
          ORDER BY ag.vinculado_en DESC
          LIMIT 1
        )
      ) AS profesor_id_efectivo
    FROM mi
  )
  SELECT
    (r.cambios_maestro < 1) AS puede_cambiar,
    r.cambios_maestro,
    r.profesor_id_efectivo AS profesor_id,
    NULLIF(
      trim(
        u.nombre || CASE
          WHEN u.apellido IS NOT NULL AND trim(u.apellido) <> '' THEN ' ' || u.apellido
          ELSE ''
        END
      ),
      ''
    )::TEXT AS nombre_maestro
  FROM resuelto r
  LEFT JOIN public.profesor p ON p.id = r.profesor_id_efectivo
  LEFT JOIN public.usuario u ON u.id = p.usuario_id;
$$;

-- Un solo cambio de maestro por alumno (no cuenta el alta en registro).
CREATE OR REPLACE FUNCTION public.cambiar_mi_maestro(p_profesor_id BIGINT)
RETURNS TABLE (
  grupo_id BIGINT,
  nombre VARCHAR(80)
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alumno_id BIGINT;
  v_cambios SMALLINT;
  v_actual BIGINT;
  v_grupo public.grupo%ROWTYPE;
BEGIN
  v_alumno_id := public.get_my_alumno_id();
  IF v_alumno_id IS NULL THEN
    RAISE EXCEPTION 'Solo alumnos autenticados pueden cambiar de maestro';
  END IF;

  SELECT a.cambios_maestro,
    COALESCE(
      a.profesor_id,
      (
        SELECT g.profesor_id
        FROM public.alumno_grupo ag
        JOIN public.grupo g ON g.id = ag.grupo_id AND g.es_sistema = TRUE
        WHERE ag.alumno_id = v_alumno_id
        ORDER BY ag.vinculado_en DESC
        LIMIT 1
      ),
      (
        SELECT g.profesor_id
        FROM public.alumno_grupo ag
        JOIN public.grupo g ON g.id = ag.grupo_id AND g.es_sistema = FALSE
        WHERE ag.alumno_id = v_alumno_id
        ORDER BY ag.vinculado_en DESC
        LIMIT 1
      )
    )
  INTO v_cambios, v_actual
  FROM public.alumno a
  WHERE a.id = v_alumno_id;

  IF v_cambios >= 1 THEN
    RAISE EXCEPTION 'Ya usaste tu único cambio de maestro';
  END IF;

  IF p_profesor_id IS NULL THEN
    RAISE EXCEPTION 'Selecciona un maestro';
  END IF;

  IF v_actual IS NOT NULL AND v_actual = p_profesor_id THEN
    RAISE EXCEPTION 'Selecciona un maestro distinto al actual';
  END IF;

  SELECT * INTO v_grupo
  FROM public.grupo g
  WHERE g.profesor_id = p_profesor_id
    AND g.es_sistema = TRUE
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Maestro no encontrado';
  END IF;

  DELETE FROM public.alumno_grupo ag
  USING public.grupo g_old
  WHERE ag.alumno_id = v_alumno_id
    AND g_old.id = ag.grupo_id
    AND g_old.es_sistema = TRUE
    AND g_old.profesor_id <> p_profesor_id;

  DELETE FROM public.alumno_grupo ag
  USING public.grupo g_old
  WHERE ag.alumno_id = v_alumno_id
    AND g_old.id = ag.grupo_id
    AND g_old.es_sistema = FALSE
    AND g_old.profesor_id <> p_profesor_id;

  DELETE FROM public.alumno_grupo ag
  USING public.grupo g_old
  WHERE ag.alumno_id = v_alumno_id
    AND g_old.id = ag.grupo_id
    AND g_old.profesor_id = p_profesor_id
    AND g_old.es_sistema = FALSE;

  UPDATE public.alumno
  SET profesor_id = p_profesor_id,
      cambios_maestro = cambios_maestro + 1
  WHERE id = v_alumno_id;

  INSERT INTO public.alumno_grupo (alumno_id, grupo_id, codigo_usado)
  VALUES (v_alumno_id, v_grupo.id, v_grupo.codigo)
  ON CONFLICT ON CONSTRAINT alumno_grupo_alumno_id_grupo_id_key DO UPDATE
    SET codigo_usado = EXCLUDED.codigo_usado,
        vinculado_en = NOW();

  RETURN QUERY
  SELECT v_grupo.id, v_grupo.nombre;
END;
$$;

GRANT EXECUTE ON FUNCTION public.listar_maestros_registro() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.vincular_alumno_a_maestro(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.estado_cambio_maestro_alumno() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cambiar_mi_maestro(BIGINT) TO authenticated;

-- -----------------------------------------------------------------------------
-- DATOS INICIALES
-- -----------------------------------------------------------------------------

INSERT INTO public.tema (codigo, nombre, nombre_corto, orden) VALUES
  ('1', 'Coordenadas', 'Tema 1', 1),
  ('2', 'Vectores', 'Tema 2', 2),
  ('3', 'Suma y resta', 'Tema 3', 3),
  ('4', 'Escalar', 'Tema 4', 4);

INSERT INTO public.nivel (tema_id, codigo, nombre, orden) VALUES
  (1, 'FACIL', 'Nivel básico', 1),
  (1, 'DIFICIL', 'Nivel avanzado', 2),
  (2, 'FACIL', 'Nivel básico', 1),
  (2, 'DIFICIL', 'Nivel avanzado', 2),
  (3, 'FACIL', 'Nivel básico', 1),
  (3, 'DIFICIL', 'Nivel avanzado', 2),
  (4, 'FACIL', 'Nivel básico', 1),
  (4, 'DIFICIL', 'Nivel avanzado', 2);

INSERT INTO public.item (id, categoria, subcarpeta, archivo, etiqueta, precio_monedas) VALUES
  ('BASE:MAIN DUCK.png', 'BASE', 'DUCK', 'MAIN DUCK.png', 'Normal', 0),
  ('FACE:F_black.png', 'FACE', 'FACE', 'F_black.png', 'Lentes de sol', 95),
  ('FACE:F_glasses.png', 'FACE', 'FACE', 'F_glasses.png', 'Gafas', 100),
  ('FACE:F_purple.png', 'FACE', 'FACE', 'F_purple.png', 'Gafas Estrella', 140),
  ('FACE:F_star.png', 'FACE', 'FACE', 'F_star.png', 'Estrellas', 180),
  ('HEAD:H_bow.png', 'HEAD', 'HEAD', 'H_bow.png', 'Moño', 150),
  ('HEAD:H_ear.png', 'HEAD', 'HEAD', 'H_ear.png', 'Orejeras', 135),
  ('HEAD:H_pin.png', 'HEAD', 'HEAD', 'H_pin.png', 'Lazo', 130),
  ('NECK:N_bag.png', 'NECK', 'NECK', 'N_bag.png', 'Mochila', 200),
  ('NECK:N_camera.png', 'NECK', 'NECK', 'N_camera.png', 'Cámara', 160),
  ('NECK:N_flower.png', 'NECK', 'NECK', 'N_flower.png', 'Collar de flores', 90),
  ('NECK:N_punk.png', 'NECK', 'NECK', 'N_punk.png', 'Punk', 125),
  ('SHOES:S_black.png', 'SHOES', 'SHOES', 'S_black.png', 'Tenis Negros', 105),
  ('SHOES:S_mc.png', 'SHOES', 'SHOES', 'S_mc.png', 'Zapatos MC', 115),
  ('SHOES:S_pink.png', 'SHOES', 'SHOES', 'S_pink.png', 'Sandalias', 110),
  ('SHOES:S_silver.png', 'SHOES', 'SHOES', 'S_silver.png', 'Botas vaqueras', 120);
