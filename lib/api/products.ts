import { createSupabaseBrowserClient } from '@/lib/supabase'
import { Product, ProductInput, ProductFilters } from '@/types'

const supabase = createSupabaseBrowserClient()

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.price_min !== undefined) {
    query = query.gte('price', filters.price_min)
  }

  if (filters?.price_max !== undefined) {
    query = query.lte('price', filters.price_max)
  }

  // Apply dynamic filters
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (!['category', 'price_min', 'price_max'].includes(key) && value !== undefined) {
      query = query.contains(`filters->${key}`, [value as string])
    }
  })

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data
}

export async function createProduct(product: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert([{ ...product, created_at: new Date().toISOString() }])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateProduct(id: string, product: Partial<ProductInput>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}