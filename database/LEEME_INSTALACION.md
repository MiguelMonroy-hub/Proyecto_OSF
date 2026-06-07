# Base de datos Tec-Duck en Supabase

Guía para desplegar la base de datos en **un proyecto Supabase nuevo** (cuenta del cliente).

## Qué necesitas

1. Cuenta en [supabase.com](https://supabase.com) y un **proyecto nuevo** (vacío).
2. En el proyecto: menú **SQL** → **SQL Editor** → **New query**.

## Scripts SQL (solo estos 4)

| Archivo | Cuándo usarlo |
|---------|----------------|
| **`01_esquema_y_funciones.sql`** | **Instalación** — tablas, catálogo, funciones (grupos, avatar, quiz, asignación exclusiva de alumnos) |
| **`02_seguridad_rls.sql`** | **Instalación** — permisos por rol (alumno / maestro) |
| **`03_borrar_alumnos.sql`** | **Opcional / pruebas** — borra solo alumnos y sus datos. **Irreversible.** No toca maestros ni catálogo |
| **`04_crear_maestro.sql`** | **Opcional** — **PARTE A**: funciones del registro (lista de maestros). **PARTE B**: alta de maestro por SQL |

### Instalación nueva (orden)

1. Abre `01_esquema_y_funciones.sql`, copia **todo**, pégalo en el SQL Editor y pulsa **Run**.
2. Si termina sin errores, repite con `02_seguridad_rls.sql`.

> Si el paso 1 falla a mitad, no ejecutes el paso 2. Borra el proyecto y créalo de nuevo, o pide ayuda técnica.

## Conectar la app web

En Supabase → **Project Settings** → **API**:

- **Project URL** → `js/supabase-config.js` → `SUPABASE_URL`
- **anon public** → `SUPABASE_ANON_KEY`

No uses la clave `service_role` en el frontend.

Para probar la app en local: `npx serve .` desde la raíz del proyecto.

El catálogo de la tienda en SQL se puede regenerar con `node scripts/sync-catalog-to-sql.mjs` (pegar el resultado en `01_esquema_y_funciones.sql` si cambiaste precios en `duck-catalog.js`).

## Actualizar una base que ya existía

Si **ya ejecutaste** `01_esquema_y_funciones.sql` antes:

| Error | Causa | Qué hacer |
|-------|--------|-----------|
| `type "rol_usuario" already exists` | Volviste a ejecutar el **01** entero | **No repitas el 01** |
| `relation "public.pregunta" does not exist` | Ejecutaste el **02** entero, una migración antigua o un script viejo | **No ejecutes el 02 entero** por actualizar registro |

Para la **lista de maestros en Crear cuenta** y que el **panel del maestro** muestre a los alumnos que eligieron su nombre al registrarse:

1. Abre `04_crear_maestro.sql`.
2. Copia y ejecuta **solo la PARTE A** (desde el inicio hasta justo antes de `PARTE B — Crear cuenta MAESTRO`).
3. Debe terminar en los `GRANT EXECUTE ON FUNCTION ...` y la línea `NOTIFY pgrst, 'reload schema';` — **no** incluyas el `CREATE EXTENSION` ni el bloque `DO $$` de la PARTE B.

4. Comprueba en el mismo SQL Editor:
   ```sql
   SELECT * FROM public.listar_maestros_registro();
   ```
   Si devuelve filas (o vacío sin error), recarga **Crear cuenta** en el navegador.

Si la app sigue sin ver la función: Supabase → **Project Settings** → **API** → **Reload schema** (o espera 1 minuto y recarga).

## Crear el primer maestro

Ejecutar **PARTE B** de `04_crear_maestro.sql` (edita correo, contraseña, nombre y apellido en el bloque `DO $$`).

## Autenticación (registro e inicio de sesión)

En **Authentication** → **Providers** → **Email**:

- **Desactiva «Confirm email»** (confirmación de correo). Tec-Duck entra al registrarse sin mandar enlace de verificación.

En **Authentication** → **URL Configuration** (opcional):

- **Site URL**: URL de la app (ej. `https://tu-app.netlify.app` o la URL de `npx serve`).

La app valida en registro: nombre obligatorio, correo con formato válido y contraseña de **mínimo 8 caracteres** con mayúscula, minúscula, número y carácter especial.

## Seguridad: unirse a un grupo

- Los alumnos **no** deben poder hacer `SELECT` masivo sobre la tabla `grupo` para adivinar códigos.
- El flujo correcto es la función `unirse_a_grupo(código)` (incluida en el paso 1).
- Las monedas del quiz solo se acreditan vía `registrar_resultado_quiz`.

## Errores frecuentes

| Mensaje | Causa | Qué hacer |
|---------|--------|-----------|
| `type "rol_usuario" already exists` | Volviste a ejecutar el **01** en una base que ya existe | Ejecuta solo **PARTE A** de `04_crear_maestro.sql` |
| `relation "public.pregunta" does not exist` | Ejecutaste el **02** entero o un script/migración antigua | Ejecuta solo **PARTE A** de `04_crear_maestro.sql`; no repitas 02 |
| `policy "usuario_select_own" already exists` | Ya ejecutaste el paso 2 | Normal si repites el paso 2; en instalación nueva solo ejecútalo una vez. |
| Problemas de permisos al iniciar sesión como maestro | Paso 2 incompleto o base antigua | Vuelve a ejecutar solo `02_seguridad_rls.sql` en SQL Editor. |
