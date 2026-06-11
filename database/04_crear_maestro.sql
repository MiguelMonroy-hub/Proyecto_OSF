-- =============================================================================
-- Tec-Duck — PASO 4 (opcional): Crear cuenta MAESTRO por SQL
-- =============================================================================
-- Requisitos previos: 01_esquema_y_funciones.sql y 02_seguridad_rls.sql sin errores.
-- Requisito previo: 01_esquema_y_funciones.sql y 02_seguridad_rls.sql ejecutados sin errores.
--
-- 1. Edita las 4 líneas v_email, v_password, v_nombre, v_apellido (abajo).
-- 2. Supabase → SQL Editor → + New query → pegar TODO este archivo → Run.
-- 3. Comprueba: Authentication → Users (correo del maestro).
-- 4. Repite con otro correo por cada maestro adicional.
-- No uses Table Editor para crear maestros a mano.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  -- ▼▼▼ EDITA ESTOS VALORES ▼▼▼
  v_email    TEXT := 'maestro@ejemplo.com';
  v_password TEXT := 'Maestro123!';
  v_nombre   TEXT := 'Nombre';
  v_apellido TEXT := 'Apellido';
  -- ▲▲▲ EDITA ESTOS VALORES ▲▲▲

  v_user_id     UUID;
  v_nombre_ok   TEXT;
  v_apellido_ok TEXT;
  v_usuario_id  BIGINT;
  v_profesor_id BIGINT;
  v_grupo_id    BIGINT;
BEGIN
  v_email := lower(trim(v_email));
  v_nombre_ok := COALESCE(NULLIF(trim(v_nombre), ''), split_part(v_email, '@', 1));
  v_apellido_ok := NULLIF(trim(v_apellido), '');

  IF v_email IS NULL OR v_email = '' OR position('@' IN v_email) = 0 THEN
    RAISE EXCEPTION 'Correo inválido: %', v_email;
  END IF;

  IF v_password IS NULL OR length(v_password) < 8 THEN
    RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres.';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users au WHERE lower(au.email) = v_email) THEN
    RAISE EXCEPTION 'Ya existe una cuenta Auth con el correo %.', v_email;
  END IF;

  IF EXISTS (SELECT 1 FROM public.usuario u WHERE lower(u.email) = v_email) THEN
    RAISE EXCEPTION 'Ya existe un usuario public.usuario con el correo %.', v_email;
  END IF;

  v_user_id := gen_random_uuid();

  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    v_email,
    crypt(v_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'nombre', v_nombre_ok,
      'apellido', COALESCE(v_apellido_ok, ''),
      'rol', 'MAESTRO'
    ),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_user_id,
    v_user_id::text,
    jsonb_build_object('sub', v_user_id::text, 'email', v_email),
    'email',
    NOW(),
    NOW(),
    NOW()
  );

  SELECT u.id, p.id
  INTO v_usuario_id, v_profesor_id
  FROM public.usuario u
  JOIN public.profesor p ON p.usuario_id = u.id
  WHERE u.auth_id = v_user_id;

  IF v_usuario_id IS NULL OR v_profesor_id IS NULL THEN
    RAISE EXCEPTION
      'Auth creado pero falta usuario/profesor. ¿Ejecutaste database/01_esquema_y_funciones.sql?';
  END IF;

  SELECT g.id
  INTO v_grupo_id
  FROM public.grupo g
  WHERE g.profesor_id = v_profesor_id
    AND g.es_sistema = TRUE
  LIMIT 1;

  RAISE NOTICE '--- Maestro creado ---';
  RAISE NOTICE 'Correo:     %', v_email;
  RAISE NOTICE 'Auth UUID:  %', v_user_id;
  RAISE NOTICE 'usuario_id: %', v_usuario_id;
  RAISE NOTICE 'profesor_id:%', v_profesor_id;
  RAISE NOTICE 'grupo_id:   % (Todos los alumnos)', COALESCE(v_grupo_id::text, '—');
  RAISE NOTICE 'Ya puede iniciar sesión en la app como maestro.';
END $$;
