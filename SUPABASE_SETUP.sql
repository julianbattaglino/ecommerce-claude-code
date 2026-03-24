-- ============================================
-- SQL PARA CREAR LA TABLA ORDERS EN SUPABASE
-- ============================================
-- Ejecutar este SQL en el SQL Editor de Supabase Dashboard
-- 1. Ir a: https://app.supabase.com
-- 2. Selecciona tu proyecto
-- 3. Ir a SQL Editor
-- 4. Nuevo query
-- 5. Copiar y pegar TODO este contenido
-- 6. Click en "RUN"

-- CREAR TABLA ÓRDENES
CREATE TABLE IF NOT EXISTS public.orders (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- CREAR ÍNDICES PARA MEJORAR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);

-- HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- CREAR POLÍTICAS DE SEGURIDAD

-- Permitir que los usuarios vean solo sus propias órdenes
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- Permitir que los usuarios creen sus propias órdenes
CREATE POLICY "Users can insert their own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = 'anonymous');

-- PERMITIR AL ADMIN (SERVICE_ROLE) ACCEDER A TODAS LAS ÓRDENES
-- Nota: Ya está cubierto por las políticas anteriores con auth.role() = 'service_role'

-- ============================================
-- PARA ELIMINAR TODO Y EMPEZAR DE NUEVO (si es necesario)
-- ============================================
-- DROP TABLE public.orders;

-- ============================================
-- PARA VERIFICAR QUE SE CREÓ CORRECTAMENTE
-- ============================================
-- SELECT * FROM public.orders;
-- SELECT COUNT(*) FROM public.orders;
