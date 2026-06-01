# Base de datos Tec-Duck en Supabase

Guía para desplegar la base de datos en **un proyecto Supabase nuevo** (cuenta del cliente).

## Qué necesitas

1. Cuenta en [supabase.com](https://supabase.com) y un **proyecto nuevo** (vacío).
2. En el proyecto: menú **SQL** → **SQL Editor** → **New query**.

## Instalación (solo 2 archivos, en orden)

| Paso | Archivo | Qué hace |
|------|---------|----------|
| **1** | `01_esquema_y_funciones.sql` | Tablas, datos del catálogo (temas, tienda), funciones (grupos, avatar, monedas, quiz) |
| **2** | `02_seguridad_rls.sql` | Permisos por rol (alumno / maestro) |

1. Abre `01_esquema_y_funciones.sql`, copia **todo** el contenido, pégalo en el SQL Editor y pulsa **Run**.
2. Si termina sin errores, repite con `02_seguridad_rls.sql`.

> Si el paso 1 falla a mitad, no ejecutes el paso 2. Borra el proyecto y créalo de nuevo, o pide ayuda técnica.

## Conectar la app web

En Supabase → **Project Settings** → **API**:

- **Project URL** → `js/supabase-config.js` → `SUPABASE_URL`
- **anon public** → `SUPABASE_ANON_KEY`

No uses la clave `service_role` en el frontend.

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

## Errores frecuentes

| Mensaje | Causa | Qué hacer |
|---------|--------|-----------|
| `type "rol_usuario" already exists` | Ya ejecutaste el paso 1 antes | No repitas el paso 1 en la misma base. Usa proyecto nuevo o soporte técnico. |
| `policy "usuario_select_own" already exists` | Ya ejecutaste el paso 2 | Normal si repites el paso 2; en instalación nueva solo ejecútalo una vez. |
| Problemas de permisos al iniciar sesión como maestro | Paso 2 incompleto o base antigua | Vuelve a ejecutar solo `02_seguridad_rls.sql` en SQL Editor. |
