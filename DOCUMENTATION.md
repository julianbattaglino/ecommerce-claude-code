# Documentación - Galería de Arte E-Commerce

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Flujo de Autenticación](#flujo-de-autenticación)
5. [Sistema de Administrador](#sistema-de-administrador)
6. [Gestión de Productos](#gestión-de-productos)
7. [Sistema de Carrito](#sistema-de-carrito)
8. [Checkout y Pagos](#checkout-y-pagos)
9. [Integración Mercado Pago](#integración-mercado-pago)
10. [Variables de Entorno](#variables-de-entorno)
11. [Ejecución Local](#ejecución-local)
12. [Despliegue](#despliegue)

---

## 📱 Descripción General

Esta es una aplicación de e-commerce minimalista para la venta de arte y pinturas. Permite que usuarios autenticados compren obras de arte y que un administrador gestione el inventario de productos.

### Características Principales

- ✅ **Autenticación**: Google OAuth + Email/Contraseña
- ✅ **Rol de Administrador**: Crear, editar y eliminar productos
- ✅ **Catálogo Dinámico**: Filtrado configurable de productos
- ✅ **Carrito de Compras**: Con persistencia en localStorage
- ✅ **Checkout**: Formulario con datos de envío
- ✅ **Pagos Integrados**: Mercado Pago Checkout Pro
- ✅ **Diseño Minimalista**: Colores neutros (#000, #333, tonos beige)

---

## 📁 Estructura del Proyecto

```
demo/
├── pages/
│   ├── _app.tsx                    # Configuración global de Next.js
│   ├── _document.tsx               # HTML document estructura
│   ├── index.tsx                   # Página de inicio
│   ├── shop.tsx                    # Página de tienda
│   ├── cart.tsx                    # Página de carrito
│   ├── checkout.tsx                # Página de checkout
│   ├── auth/
│   │   ├── login.tsx               # Login
│   │   ├── register.tsx            # Registro
│   │   └── callback.tsx            # Callback de OAuth
│   ├── products/
│   │   └── [id].tsx                # Detalle de producto
│   ├── admin/
│   │   ├── index.tsx               # Dashboard admin
│   │   └── products/
│   │       ├── index.tsx           # Gestión de productos
│   │       ├── new.tsx             # Crear producto
│   │       └── [id]/edit.tsx       # Editar producto (para implementar)
│   └── api/
│       ├── products/
│       │   ├── index.ts            # GET productos, POST crear
│       │   └── [id].ts             # GET/PUT/DELETE producto
│       ├── filters/
│       │   └── index.ts            # GET/POST filtros
│       ├── mercadopago/
│       │   └── create-preference.ts # Crear preferencia MP
│       ├── webhooks/
│       │   └── mercadopago.ts      # Webhook de MP
│       └── admin/
│           ├── products/
│           │   ├── index.ts        # POST productos admin
│           │   └── [id].ts         # DELETE productos
│           ├── filters/
│           │   └── index.ts        # POST filtros
│           └── stats.ts            # GET estadísticas
├── components/
│   ├── auth/
│   │   ├── AuthGuard.tsx           # HOC para rutas protegidas
│   │   ├── LoginForm.tsx           # Formulario login
│   │   ├── RegisterForm.tsx        # Formulario registro
│   │   └── index.ts
│   ├── layout/
│   │   ├── Header.tsx              # Encabezado
│   │   ├── Footer.tsx              # Pie de página
│   │   ├── Layout.tsx              # Layout principal
│   │   └── index.ts
│   ├── products/
│   │   ├── ProductCard.tsx         # Tarjeta de producto
│   │   ├── ProductCarousel.tsx     # Carrusel de imágenes
│   │   ├── ProductFilters.tsx      # Filtros de producto
│   │   ├── ProductGrid.tsx         # Grid de productos
│   │   └── index.ts
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Loading.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       ├── Textarea.tsx
│       └── index.ts
├── context/
│   └── AuthContext.tsx             # Contexto de autenticación
├── store/
│   └── cartStore.ts                # Store del carrito (Zustand)
├── lib/
│   ├── api/
│   │   ├── index.ts
│   │   ├── products.ts
│   │   ├── filters.ts
│   │   ├── categories.ts
│   │   └── mercadopago.ts
│   └── supabase/
│       ├── client.ts               # Cliente para browser
│       ├── server.ts               # Cliente para servidor
│       └── index.ts
├── styles/
│   ├── globals.css                 # Estilos globales
│   ├── Layout.module.css
│   ├── Home.module.css
│   ├── Shop.module.css
│   ├── ProductDetail.module.css
│   ├── Cart.module.css
│   ├── Checkout.module.css
│   ├── Auth.module.css
│   ├── AdminDashboard.module.css
│   ├── AdminProducts.module.css
│   └── AdminProductForm.module.css
├── types/
│   └── index.ts                    # Tipos TypeScript
├── package.json
├── tsconfig.json
├── next.config.js
├── .env.example
└── .env.local
```

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd demo
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar Variables de Entorno

Copiar `.env.example` a `.env.local` y llenar con tus datos:

```bash
cp .env.example .env.local
```

Editar `.env.local` con:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Mercado Pago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=your-mp-public-key
MERCADOPAGO_ACCESS_TOKEN=your-mp-access-token

# Admin
ADMIN_EMAIL=admin@example.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Crear Base de Datos en Supabase

Ejecutar las siguientes migraciones SQL en Supabase:

```sql
-- Tabla de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  details TEXT,
  technical_specifications JSONB DEFAULT '{}',
  category VARCHAR(100),
  filters JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de filtros
CREATE TABLE filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50), -- 'select', 'multiselect', 'range'
  options TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de órdenes (para implementar)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50), -- 'pending', 'paid', 'shipped'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Flujo de Autenticación

### Configurar Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto
3. Habilitar API: Google+ API
4. Crear "OAuth 2.0 Client IDs"
5. Añadir URLs autorizadas:
   - `http://localhost:3000`
   - `https://your-domain.com`
6. Copiar ID del cliente y secreto a Supabase

### Incluir Usuario Admin

El email del administrador se define en `ADMIN_EMAIL`. Este usuario:
- Tiene todos los permisos de CRUD sobre productos
- Puede configurar filtros
- Accede a `/admin`

**Nota**: El usuario debe registrarse primero, luego se marcará como admin según su email.

### Componentes de Auth

- **AuthContext.tsx**: Mantiene estado de usuario y sesión
- **useAuth()**: Hook para acceder a datos de autenticación
- **LoginForm.tsx**: Formulario de login
- **RegisterForm.tsx**: Formulario de registro

---

## 👨‍💼 Sistema de Administrador

### Acceso al Panel

Solo usuarios con email `ADMIN_EMAIL` pueden acceder a `/admin`.

### Dashboard Admin (`/admin`)

Muestra:
- Total de productos
- Total de órdenes
- Ingresos totales
- Accesos rápidos a funciones

### Gestión de Productos (`/admin/products`)

- **Listar**: Tabla de todos los productos
- **Crear**: Ir a `/admin/products/new`
- **Editar**: Implementar en `/admin/products/[id]/edit`
- **Eliminar**: Botón en lista de productos

### Crear/Editar Producto

Campos:
- Título (requerido)
- Precio (requerido)
- Categoría (requerido)
- Descripción (requerido)
- Detalles (opcional)
- Imágenes (múltiples URLs)
- Especificaciones técnicas (JSONB)

---

## 📦 Gestión de Productos

### Estructura de Producto

```typescript
interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  details: string;
  technical_specifications: Record<string, string>;
  category: string;
  filters: Record<string, string>;
  created_at: string;
  updated_at: string;
}
```

### API de Productos

#### GET `/api/products`
Obtener lista de productos con paginación y filtros.

Query params:
- `limit`: Número de productos (default: 20)
- `offset`: Desplazamiento (default: 0)
- `category`: Filtrar por categoría
- Otros filtros dinámicos

#### GET `/api/products/[id]`
Obtener un producto específico.

#### POST `/api/admin/products`
Crear un nuevo producto (solo admin).

Body:
```json
{
  "title": "Obra Moderna",
  "price": 5000,
  "description": "Descripción...",
  "images": ["url1", "url2"],
  "details": "Detalles...",
  "technical_specifications": { "tamaño": "50x50cm" },
  "category": "Pintura",
  "filters": { "estilo": "Moderno" }
}
```

#### DELETE `/api/admin/products/[id]`
Eliminar un producto.

---

## 🛒 Sistema de Carrito

### Store del Carrito (Zustand)

Ubicado en `store/cartStore.ts`. Características:

- Persistencia en localStorage
- Métodos:
  - `addItem(product, quantity)`: Añadir producto
  - `removeItem(productId)`: Eliminar producto
  - `updateQuantity(productId, quantity)`: Actualizar cantidad
  - `clearCart()`: Vaciar carrito
  - `getTotal()`: Obtener total
  - `getItemCount()`: Contar items

### Uso en Componentes

```typescript
import { useCartStore } from '@/store/cartStore'

const MyComponent = () => {
  const { items, addItem, removeItem, getTotal } = useCartStore()
  // ...
}
```

### Página del Carrito (`/cart`)

Muestra:
- Lista de items
- Cantidad editable
- Precio unitario y subtotal
- Total general
- Botón "Proceder al Pago"
- Opción "Vaciar Carrito"

---

## 💳 Checkout y Pagos

### Página de Checkout (`/checkout`)

Pasos:
1. **Información de Entrega**:
   - Nombre completo
   - Email
   - Teléfono
   - Dirección
   - Ciudad
   - Código postal

2. **Seleccionar Método de Pago**:
   - Mercado Pago
   - Transferencia Bancaria

3. **Resumen del Pedido**:
   - Items comprados
   - Total
   - Nota sobre shipping

### Validación de Checkout

- Usuario debe estar autenticado
- Carrito no puede estar vacío
- Todos los campos son requeridos

---

## 💰 Integración Mercado Pago

### Setup en Mercado Pago

1. Crear cuenta en [Mercado Pago Desarrolladores](https://www.mercadopago.com.ar/developers)
2. Ir a "Credenciales" y copiar:
   - Public Key
   - Access Token
3. Añadir a `.env.local`

### Flujo de Pago

```
Usuario selecciona "Pagar con Mercado Pago"
↓
POST /api/mercadopago/create-preference
↓
Mercado Pago retorna init_point
↓
Redirigir a Mercado Pago Checkout
↓
Usuario completa pago
↓
Redirección a /checkout-success o /checkout-failure
```

### Endpoints

#### POST `/api/mercadopago/create-preference`

Crear una preferencia de pago.

Body:
```json
{
  "items": [
    {
      "id": "prod-1",
      "title": "Obra de Arte",
      "unit_price": 5000,
      "quantity": 1
    }
  ],
  "payer": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "1234567890"
  },
  "metadata": {
    "address": "Calle 123",
    "city": "Buenos Aires",
    "zipCode": "1425"
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "preference-id",
    "init_point": "https://www.mercadopago.com/...",
    "sandbox_init_point": "https://sandbox.mercadopago.com/..."
  }
}
```

#### POST `/api/webhooks/mercadopago`

Webhook para notificaciones de pago. Mercado Pago envía aquí las actualizaciones.

**TODO**: Implementar lógica para guardar órdenes según el estado del pago.

### Estados de Pago

- `approved`: Pago aprobado
- `pending`: Pago pendiente
- `rejected`: Pago rechazado

---

## ⚙️ Filtros de Productos

### API de Filtros

#### GET `/api/filters`
Obtener lista de filtros configurados.

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "filter-1",
      "name": "Estilo",
      "type": "multiselect",
      "options": ["Moderno", "Clásico", "Abstracto"]
    }
  ]
}
```

#### POST `/api/admin/filters`
Crear nuevo filtro (solo admin).

Body:
```json
{
  "name": "Tamaño",
  "type": "multiselect",
  "options": ["Pequeño", "Mediano", "Grande"]
}
```

### Tipos de Filtros

- `select`: Una sola opción
- `multiselect`: Múltiples opciones
- `range`: Rango de valores (min-max)

---

## 🔧 Variables de Entorno

### Requeridas

```env
# Supabase (necesario para DB y auth)
NEXT_PUBLIC_SUPABASE_URL=https://[proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Mercado Pago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR_[...]
MERCADOPAGO_ACCESS_TOKEN=APP_USR_[...]

# Email del administrador
ADMIN_EMAIL=admin@example.com

# URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Cómo Obtener...

**Supabase Keys**:
1. Ir a Dashboard → Settings → API
2. Copiar `project URL` y `anon key`
3. Service Role Key: Settings → API → Service Role Key

**Mercado Pago Keys**:
1. Ir a [Credenciales](https://www.mercadopago.com/developers/es/docs/)
2. Copiar "Public Key" y "Access Token" del modo sandbox/producción

---

## 📌 Ejecución Local

### Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`

### Build para Producción

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## 🌐 Despliegue

### Opción 1: Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Settings → Environment Variables
3. Deploy automático en cada push a main

### Opción 2: Heroku

```bash
heroku create app-name
heroku config:set NEXT_PUBLIC_SUPABASE_URL=...
heroku config:set NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# ... otras variables
git push heroku main
```

### Opción 3: VPS/Servidor Propio

```bash
# Clonar repo
git clone <repo>
cd demo

# Instalar dependencias
npm install

# Build
npm run build

# Iniciar con PM2
npm install -g pm2
pm2 start "npm start" --name "artwork-shop"
```

### Checklist de Despliegue

- ✅ Variables de entorno configuradas
- ✅ Base de datos Supabase creada y migrada
- ✅ Keys de Mercado Pago en modo producción
- ✅ URL de callback de OAuth actualizada
- ✅ Email admin configurado
- ✅ SSL/HTTPS habilitado

---

## 🐛 Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL not defined"

Verificar que `.env.local` existe y tiene la variable correcta.

### Error: "Google OAuth callback failed"

1. Verificar URL de callback en Google Cloud Console
2. Asegurarse que la URL coincida exactamente
3. Revisar que SUPABASE_URL es correcta

### Mercado Pago no funciona

1. Verificar que estás usando URLs correctas (sandbox vs producción)
2. Revisar keys en Dashboard de Mercado Pago
3. Probar en modo sandbox primero

### Carrito vacío después de recargar

localStorage puede estar bloqueado. Verificar:
1. Cookies permitidas
2. No estés en modo privado
3. Revisar console por errores de storage

---

## 📚 Recursos Adicionales

- [Documentación Next.js](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Mercado Pago SDK](https://github.com/mercadopago/sdk-nodejs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

## 📝 Tareas Pendientes

- [ ] Implementar página de editar producto (`/admin/products/[id]/edit`)
- [ ] Implementar página de órdenes (`/admin/orders`)
- [ ] Webhook completo de Mercado Pago
- [ ] Notificaciones por email de órdenes
- [ ] Sistema de comentarios/reviews de productos
- [ ] Tests automatizados
- [ ] Optimización de imágenes
- [ ] PWA (Progressive Web App)
- [ ] Búsqueda de productos
- [ ] Favoritos/Wishlist

---

**Última actualización**: Marzo 2026
**Versión**: 1.0.0
