# Base de datos Tec-Duck en Supabase

Guía para desplegar la base de datos en **un proyecto Supabase nuevo** (cuenta del cliente).

## Qué necesitas

1. Cuenta en [supabase.com](https://supabase.com) y un **proyecto nuevo** (vacío).
2. En el proyecto: menú **SQL** → **SQL Editor** → **New query**.

## Instalación (2 archivos, en orden)

| Paso | Archivo | Qué hace |
|------|---------|----------|
| **1** | `01_esquema_y_funciones.sql` | Tablas, catálogo, funciones (grupos, avatar, quiz con puntaje ponderado y monedas validadas, `sincronizar_alumnos_grupo`) |
| **2** | `02_seguridad_rls.sql` | Permisos por rol (alumno / maestro); partida y progreso solo lectura para alumno |

1. Abre `01_esquema_y_funciones.sql`, copia **todo** el contenido, pégalo en el SQL Editor y pulsa **Run**.
2. Si termina sin errores, repite con `02_seguridad_rls.sql`.

> Si el paso 1 falla a mitad, no ejecutes el paso 2. Borra el proyecto y créalo de nuevo, o pide ayuda técnica.

## Conectar la app web

En Supabase → **Project Settings** → **API**:

- **Project URL** → `js/supabase-config.js` → `SUPABASE_URL`
- **anon public** → `SUPABASE_ANON_KEY`

No uses la clave `service_role` en el frontend.

Para probar la app en local: `npx serve .` desde la raíz del proyecto.

El catálogo de la tienda en SQL se puede regenerar con `node scripts/sync-catalog-to-sql.mjs` (pegar el resultado en `01_esquema_y_funciones.sql` si cambiaste precios en `duck-catalog.js`).

## Crear el primer maestro (opcional)

Registro normal en la app con rol **Maestro**, o desde tu PC (requiere `service_role`):

```powershell
$env:SUPABASE_URL = "https://TU_PROYECTO.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "tu_service_role"
node scripts/crear-maestro-admin.mjs
```

## Archivo opcional (no es instalación)

| Archivo | Cuándo usarlo |
|---------|----------------|
| `03_opcional_reiniciar_usuarios.sql` | **Solo pruebas**: borra todas las cuentas y datos de usuarios. **Irreversible.** No borra temas ni ítems de la tienda. |
| `04_migracion_tablas_maestro.sql` | **Solo si ya instalaste 01+02 antes de este cambio**: elimina `intento_pregunta`/`intento_respuesta` y renombra `pregunta`→`pregunta_maestro`, `respuesta`→`respuesta_maestro`. Proyecto nuevo: no lo ejecutes. |

### Tablas del quiz (referencia)

| Tabla | Uso real en la app |
|-------|---------------------|
| `partida` + `actividad` (JSONB) | Partida en curso e historial pregunta a pregunta |
| `progreso` | Desbloqueos y métricas por tema o nivel maestro |
| `pregunta_maestro` / `respuesta_maestro` | Banco de preguntas **solo** para niveles del profe |
| Temas 1–4 | Preguntas en `banco-preguntas/*.js`, no en la BD |

## Autenticación (registro e inicio de sesión)

En **Authentication** → **Providers** → **Email**:

- **Desactiva «Confirm email»** (confirmación de correo). Tec-Duck entra al registrarse sin mandar enlace de verificación.

En **Authentication** → **URL Configuration** (opcional):

- **Site URL**: URL de la app (ej. `https://tu-app.netlify.app` o la URL de `npx serve`).

La app valida en registro: nombre obligatorio, correo con formato válido y contraseña de **mínimo 8 caracteres** con mayúscula, minúscula, número y carácter especial. Tras registrarse, el alumno entra directo (unirse a grupo) o el maestro al panel.

## Seguridad: unirse a un grupo

- Los alumnos **no** deben poder hacer `SELECT` masivo sobre la tabla `grupo` para adivinar códigos.
- El flujo correcto es la función `unirse_a_grupo(código)` (incluida en el paso 1).
- Las monedas del quiz solo se acreditan vía `registrar_resultado_quiz` (no hay RPC público `agregar_monedas_alumno`).

## Errores frecuentes

| Mensaje | Causa | Qué hacer |
|---------|--------|-----------|
| `type "rol_usuario" already exists` | Ya ejecutaste el paso 1 antes | No repitas el paso 1 en la misma base. Usa proyecto nuevo o soporte técnico. |
| `policy "usuario_select_own" already exists` | Ya ejecutaste el paso 2 | Normal si repites el paso 2; en instalación nueva solo ejecútalo una vez. |
| Problemas de permisos al iniciar sesión como maestro | Paso 2 incompleto o base antigua | Vuelve a ejecutar solo `02_seguridad_rls.sql` en SQL Editor. |
