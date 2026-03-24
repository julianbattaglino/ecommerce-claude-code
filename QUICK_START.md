# 🚀 SETUP RÁPIDO - SIGUE ESTOS 4 PASOS

## Paso 1️⃣: Instalar Dependencias ✅ (YA HECHO)
```bash
npm install resend
```

## Paso 2️⃣: Crear la Tabla en Supabase

### Opción A: Copiar-Pegar el SQL (Recomendado)

1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **SQL Editor** en el panel izquierdo
3. Haz click en **"New Query"**
4. Abre el archivo `SUPABASE_SETUP.sql` en el repositorio
5. Copia TODO su contenido
6. Pega en el SQL Editor de Supabase
7. Click en **"RUN"** (esquina superior derecha)
8. Espera a que complete ✓

### Opción B: Crear manualmente en Supabase UI (Si prefieres)

1. Ve a **Database** → **Tables**
2. Click **"Create a new table"**
3. Nombre: `orders`
4. Activar RLS
5. Add columns (ver detalle más abajo)

**Columnas necesarias:**
| Nombre | Tipo | Características |
|--------|------|-----------------|
| id | uuid | Primary Key, Default: gen_random_uuid() |
| user_id | text | nullable |
| items | jsonb | required |
| total | numeric(10,2) | required |
| payment_method | varchar(50) | required |
| customer_name | varchar(255) | required |
| customer_email | varchar(255) | required |
| customer_phone | varchar(20) | nullable |
| delivery_address | text | required |
| delivery_city | varchar(100) | nullable |
| delivery_zip_code | varchar(20) | nullable |
| status | varchar(50) | Default: 'pending' |
| payment_id | text | nullable |
| created_at | timestamp | Default: now(), required |
| updated_at | timestamp | Default: now(), required |

## Paso 3️⃣: Configurar Variables de Entorno

Abre o crea `.env.local` en la raíz del proyecto y agrega:

```env
# EMAIL SERVICE (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx_OBTENER_DE_RESEND
RESEND_FROM_EMAIL=noreply@galeriadearte.com

# DATOS BANCARIOS (opcional pero recomendado)
NEXT_PUBLIC_BANK_CBU=0070123456789012345679

# SUPABASE (debería haber ya)
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_aqui

# MERCADO PAGO (debería haber ya)
MERCADOPAGO_ACCESS_TOKEN=tu_token_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Cómo obtener RESEND_API_KEY:

1. Ve a [resend.com](https://resend.com)
2. Sign up (gratis)
3. Ve a **API Keys**
4. Copia tu API key
5. Pega en `RESEND_API_KEY`

## Paso 4️⃣: Reiniciar Servidor

```bash
# Presiona CTRL+C para detener el servidor actual
# Luego:
npm run dev
```

---

## ✅ Verificación

Una vez hayas completado los pasos:

1. **En navegador:**
   - Ve a http://localhost:3000/shop
   - Agrega un producto al carrito
   - Ve a http://localhost:3000/checkout
   - Selecciona "Transferencia Bancaria"
   - Completa formulario
   - Click "Pagar"

2. **Verifica que:**
   - ✓ No hay error 500
   - ✓ Te redirige a `/order-created` 
   - ✓ Muestra detalles de la orden
   - ✓ En Supabase → orders table aparece la nueva orden

3. **Para verificar email:**
   - En Resend dashboard → ve el email enviado
   - O revisa tu bandeja de entrada

---

## 🆘 Si Aún Hay Error 500

1. Abre **Network tab** en DevTools (F12)
2. Busca el request a `/api/orders/create`
3. Ve a **Response** 
4. Copia el mensaje de error
5. Verifica que:
   - [ ] Tabla `orders` existe en Supabase
   - [ ] RESEND_API_KEY está configurado
   - [ ] `.env.local` está guardado
   - [ ] Reiniciaste el servidor (`npm run dev`)

---

## 📝 Archivos Útiles

- **SUPABASE_SETUP.sql** - SQL para crear tabla
- **IMPLEMENTATION_SUMMARY.md** - Resumen de todos los cambios
- **SETUP_GUIDE.md** - Guía detallada completa

---

¡Eso es todo! Con estos 4 pasos ya deberías tener todo funcionando. 🎉
