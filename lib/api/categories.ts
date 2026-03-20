import { createSupabaseBrowserClient } from '@/lib/supabase'
import { Category, CategoryInput } from '@/types'

const supabase = createSupabaseBrowserClient()

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data
}

export async function createCategory(category: CategoryInput): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ ...category, created_at: new Date().toISOString() }])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateCategory(
  id: string,
  category: Partial<CategoryInput>
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update({ ...category })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}