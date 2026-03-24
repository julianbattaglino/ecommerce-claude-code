# Guía de Instalación y Configuración

## 🚀 Instalación Inicial

### 1. Instalar Dependencias
```bash
npm install resend
```

### 2. Configurar Variables de Entorno

Crea o actualiza el archivo `.env.local` con:

```env
# Supabase (debe haber ya)
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@galeriadearte.com

# Mercado Pago (debe haber ya)
MERCADOPAGO_ACCESS_TOKEN=tu_token_mercadopago
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Datos Bancarios (opcional pero recomendado)
NEXT_PUBLIC_BANK_CBU=0070123456789012345679
```

### 3. Configurar Resend

1. Ir a [resend.com](https://resend.com)
2. Crear cuenta gratis
3. Obtener API key
4. En desarrollo, no necesitas verificar dominio (prueba con cualquier email)
5. En producción, necesitarás verificar tu dominio

### 4. Verificar Tablas en Supabase

Asegúrate que exista la tabla `orders`:

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
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

-- Índices para mejorar performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_payment_id ON orders(payment_id);

-- RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios vean solo sus órdenes
CREATE POLICY orders_users_select ON orders
FOR SELECT USING (user_id = auth.uid()::text OR auth.role() = 'authenticated');

-- Política para que los usuarios creen sus propias órdenes
CREATE POLICY orders_users_insert ON orders
FOR INSERT WITH CHECK (user_id = auth.uid()::text);
```

---

## 🧪 Pruebas Locales

### Test 1: Transferencia Bancaria Completa

1. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

2. **Ir a la tienda y agregar productos al carrito:**
   - http://localhost:3000/shop
   - Agregar al menos un producto

3. **Ir a checkout:**
   - http://localhost:3000/checkout
   - Seleccionar "Transferencia Bancaria"
   - Completar formulario:
     - Nombre: Test User
     - Email: tuemailprueba@example.com
     - Teléfono: 1234567890
     - Dirección: Calle Test 123
     - Ciudad: Buenos Aires
     - Código Postal: 1425

4. **Clicks "Pagar":**
   - Debe redirigir a `/order-created?orderId={id}`
   - Mostrar detalles de la orden
   - Mostrar dato de transferencia

5. **Verificar email:**
   - En Resend dashboard, ver email enviado
   - O si tienes email configurado, revisar inbox

6. **Verificar orden en BD:**
   - Ir a Supabase dashboard
   - Table `orders` 
   - Debe haber nueva fila con status "pending"

### Test 2: Mercado Pago (Sandbox)

1. **Asegurarse que esté en modo sandbox:**
   - MERCADOPAGO_ACCESS_TOKEN debe ser token de TEST

2. **Similar al test anterior pero:**
   - Seleccionar "Mercado Pago"
   - Debe redirigir a sitio de prueba de Mercado Pago
   - En sandbox, usar tarjeta: 4111 1111 1111 1111

3. **Después de "pagar":**
   - Mercado Pago redirige a /checkout-success o /checkout-failure
   - Orden debe estar en BD con status "pending"

### Test 3: Verificar Contadores

1. **Admin Dashboard:**
   - http://localhost:3000/admin (requiere estar logueado como admin)
   - Debe mostrar contador de productos (actualizado dinámicamente)
   - Debe mostrar contador de órdenes (actualizado)

2. **Crear nuevo producto:**
   - Admin → Crear Nuevo Producto
   - Llenar formulario
   - Hacer click "Crear"
   - Volver a admin
   - Contador debe incrementar

### Test 4: Gestión de Filtros

1. **Admin Filtros:**
   - http://localhost:3000/admin/filters
   - Debe mostrar formulario para crear filtros

2. **Crear filtro:**
   - Nombre: "Estilo"
   - Tipo: Selección Única
   - Opciones: "Abstracto, Realista, Impresionista"
   - Click "Crear Filtro"

3. **Ver filtros:**
   - Debe aparecer en lista de filtros existentes

4. **Editar filtro:**
   - Click en "Editar" del filtro creado
   - Cambiar opciones
   - Click "Actualizar Filtro"

5. **Eliminar filtro:**
   - Click en "Eliminar"
   - Confirmar
   - Debe desaparecer de la lista

### Test 5: Ver Órdenes

1. **Usuario - Ver mis órdenes:**
   - Logueado como usuario
   - http://localhost:3000/orders
   - Debe mostrar todas las órdenes de ese usuario

2. **Admin - Ver todas las órdenes:**
   - Logueado como admin
   - http://localhost:3000/admin/orders
   - Debe mostrar tabla con TODAS las órdenes del sistema

---

## 🐛 Troubleshooting

### Error: "RESEND_API_KEY no configurado"
- Verificar que `.env.local` tenga `RESEND_API_KEY`
- Reiniciar servidor de desarrollo

### Error: "Table 'orders' doesn't exist"
- Crear tabla en Supabase usando SQL del paso 4

### Email no se envía
- Verificar RESEND_API_KEY es válido
- Revisar console del servidor para errores
- En desarrollo con Resend, el email se muestra en dashboard de Resend

### Orden no se guarda
- Verificar que createOrder() en lib/api/orders.ts se ejecute
- Revisar console del servidor
- Verificar tabla orders existe en Supabase

### Contador de órdenes no actualiza
- Ir a /admin/orders primero (para asegurar que se crean órdenes)
- Luego ir a /admin
- Refrescar página
- Contador debe actualizar

---

## 📊 Verificar Datos en BD

### SQL Queries útiles

```sql
-- Ver todas las órdenes
SELECT id, customer_name, customer_email, total, payment_method, status, created_at 
FROM orders 
ORDER BY created_at DESC;

-- Ver órdenes de un usuario
SELECT * FROM orders 
WHERE user_id = 'uuid-del-usuario'
ORDER BY created_at DESC;

-- Contar órdenes por estado
SELECT status, COUNT(*) as cantidad 
FROM orders 
GROUP BY status;

-- Ver filtros
SELECT * FROM filters ORDER BY name;
```

---

## 🚀 Deploy a Producción

Antes de deployar a producción:

1. **Variables de Entorno:**
   - Actualizar NEXT_PUBLIC_APP_URL a tu dominio
   - Usar token REAL de Mercado Pago
   - Usar API key REAL de Resend
   - Actualizar RESEND_FROM_EMAIL con tu dominio

2. **Resend:**
   - Verificar dominio en Resend dashboard
   - Si usas otro servicio de email, cambiar lib/email/index.ts

3. **Mercado Pago:**
   - Cambiar a credenciales de producción
   - Probar con pagos reales

4. **Email:**
   - Cambiar direcciones de "from" a información real de la empresa
   - Personalizar template HTML

5. **Banco:**
   - Actualizar NEXT_PUBLIC_BANK_CBU con número real
   - Cambiar accountHolder a nombre real de la empresa

---

## 📝 Logs y Debugging

### Habilitar logs adicionales

En desarrollo, los logs se verán en:
- **Terminal (servidor):** `npm run dev`
- **Browser console:** F12 → Console

Para debugging adicional, agregar en lib/api/orders.ts:

```typescript
console.log('Creating order:', data)
// ... código ...
console.log('Order created:', orderResult)
```

---

## 🤝 Soporte

Si encuentras problemas:

1. Revisar los logs en terminal
2. Revisar console del navegador (F12)
3. Verificar que todas las variables de entorno estén configuradas
4. Verificar que las tablas existan en Supabase
5. Revisar que esté logueado correctamente (admin vs usuario regular)

---

Ahora está todo listo para comenzar a probar. ¡Buena suerte! 🎉
