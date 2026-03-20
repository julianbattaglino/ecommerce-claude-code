// Product Types
export interface Product {
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

export interface ProductInput {
  title: string;
  price: number;
  description: string;
  images: string[];
  details: string;
  technical_specifications: Record<string, string>;
  category: string;
  filters: Record<string, string>;
}

// Filter Types
export interface Filter {
  id: string;
  name: string;
  type: 'select' | 'multiselect' | 'range';
  options: string[];
  created_at: string;
}

export interface FilterInput {
  name: string;
  type: 'select' | 'multiselect' | 'range';
  options: string[];
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface CategoryInput {
  name: string;
  slug: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
}

// Mercado Pago Types
export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface PaymentResult {
  status: 'approved' | 'pending' | 'rejected';
  payment_id: string;
  external_reference: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter Query Types
export interface ProductFilters {
  category?: string;
  price_min?: number;
  price_max?: number;
  [key: string]: string | number | undefined;
}