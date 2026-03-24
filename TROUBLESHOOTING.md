# 🔍 Diagnóstico del Error 500

He agregado mejor logging. Ahora podrás ver exactamente qué está fallando.

## 📋 Checklist Pre-Requisitos

Antes de probar, verifica que tengas **TODO** esto configurado:

### 1. ✅ Variables de Entorno en `.env.local`

Abre `.env.local` en la raíz del proyecto y verifica que tenga:

```env
# ===== RESEND (Email) =====
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@galeriadearte.com

# ===== SUPABASE (Debe tener TODOS estos) =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# ===== MERCADO PAGO (Debe tener) =====
MERCADOPAGO_ACCESS_TOKEN=APP_xxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===== OPCIONAL pero Recomendado =====
NEXT_PUBLIC_BANK_CBU=0070123456789012345679
```

**⚠️ IMPORTANTE:** 
- `SUPABASE_SERVICE_ROLE_KEY` es **obligatorio** (sin esto no puede crear órdenes)
- Está en Supabase → Settings → API → Service Role Key
- ❌ **NO** uses la Anon Key para esto

### 2. ✅ Tabla en Supabase

Verifica que la tabla `orders` exista:

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Database** → **Tables**
4. Busca la tabla `orders`
5. Si NO existe, **ejecuta el SQL** de `SUPABASE_SETUP.sql`

Columnas que debe tener:
- ✓ id (UUID, Primary Key)
- ✓ user_id (text)
- ✓ items (jsonb)
- ✓ total (numeric)
- ✓ payment_method (varchar)
- ✓ customer_name (varchar)
- ✓ customer_email (varchar)
- ✓ customer_phone (varchar, nullable)
- ✓ delivery_address (text)
- ✓ delivery_city (varchar, nullable)
- ✓ delivery_zip_code (varchar, nullable)
- ✓ status (varchar)
- ✓ payment_id (text, nullable)
- ✓ created_at (timestamp)
- ✓ updated_at (timestamp, nullable)

Si te faltan columnas, ejecuta `FIX_ORDERS_TABLE.sql`

### 3. ✅ Resend Configurado

Verifica que tengas una API key válida en Resend:

1. Ve a [resend.com](https://resend.com)
2. Login
3. Ve a **API Keys**
4. Copia tu API key
5. Pega en `.env.local` como `RESEND_API_KEY=re_xxxx`

---

## 🔧 Pasos para Diagnosticar

### Paso 1: Reinicia servidor

```bash
# Presiona CTRL+C en la terminal donde corre `npm run dev`
# Luego ejecuta:
npm run dev
```

### Paso 2: Abre dos terminales

**Terminal 1 - Servidor:**
```bash
npm run dev
```
Verás los logs aquí 👆

**Terminal 2 - Cliente:**
```bash
# Abre navegador en dev
open http://localhost:3000/checkout
```

### Paso 3: Intenta crear una orden

1. Ve a http://localhost:3000/checkout
2. Agrega un producto al carrito PRIMERO si es necesario
3. Completa el formulario:
   - ✓ Nombre completo
   - ✓ Email
   - ✓ Teléfono
   - ✓ Dirección
   - ✓ Ciudad
   - ✓ Código postal
4. Selecciona "**Transferencia Bancaria**"
5. Click en "**Pagar**"
6. **IMPORTANTE:** Mira los LOGS en Terminal 1

### Paso 4: Lee los Logs

En la **Terminal 1** (npm run dev) verás mensajes como:

```
[ORDERS] Recibido request: { itemsCount: 1, paymentMethod: 'transfer', customerName: 'Juan', customerEmail: 'juan@test.com' }
[ORDERS] Obteniendo sesión...
[ORDERS] UserId: anonymous
[ORDERS] Creando orden en BD...
[LIB/ORDERS] Iniciando createOrder con datos: { userId: 'anonymous', itemsCount: 1, total: 999 }
[LIB/ORDERS] Insertando en tabla orders: { user_id: 'anonymous', items: [...], ... }
```

**Si ves estas líneas = ✅ Funcionando**

**Si se detiene antes, el error está en ese punto**

---

## 🐛 Errores Comunes y Soluciones

### Error: "SUPABASE_SERVICE_ROLE_KEY no configurado"

**Causa:** Falta la variable en `.env.local`

**Solución:**
1. Ve a Supabase → tu proyecto → Settings → API
2. Copia el **Service Role** (no Anon Key)
3. En `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```
4. Reinicia: `npm run dev`

### Error: "column 'X' does not exist"

**Causa:** Falta una columna en la tabla

**Solución:**
1. Ejecuta `FIX_ORDERS_TABLE.sql` en Supabase SQL Editor
2. O ejecuta `SUPABASE_SETUP.sql` para crear tabla nueva

### Error: "RESEND_API_KEY"

**Causa:** Falta API key de Resend

**Solución:**
1. Ve a https://resend.com → Sign up
2. Obtén API key
3. En `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=noreply@galeriadearte.com
```

### Error: "relation 'orders' does not exist"

**Causa:** Tabla `orders` no existe en Supabase

**Solución:**
Ejecuta en Supabase SQL Editor:
```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  items JSONB NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  delivery_address TEXT NOT NULL,
  delivery_city VARCHAR(100),
  delivery_zip_code VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending',
  payment_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✅ Verificación Final

Cuando TODO esté configurado correctamente:

1. Ir a http://localhost:3000/checkout
2. Llenar formulario
3. Click "Pagar"
4. **Debería:**
   - ✅ Ver logs en terminal sin errores
   - ✅ Redirigir a `/order-created`
   - ✅ Mostrar detalles de la orden
   - ✅ Orden aparece en Supabase → orders table

---

## 📱 Copy-Paste: Plantilla `.env.local` Completa

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@galeriadearte.com

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=your-token
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Banco (opcional)
NEXT_PUBLIC_BANK_CBU=0070123456789012345679
```

Reemplaza `your-...` con valores reales de tu Supabase, Resend, etc.

---

¿Qué error ves en los logs? Cuéntame y debugueamos juntos 🚀
