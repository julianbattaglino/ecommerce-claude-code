import { createSupabaseBrowserClient } from '@/lib/supabase'
import { Filter, FilterInput } from '@/types'

const supabase = createSupabaseBrowserClient()

export async function getFilters(): Promise<Filter[]> {
  const { data, error } = await supabase
    .from('filters')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getFilterById(id: string): Promise<Filter | null> {
  const { data, error } = await supabase.from('filters').select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data
}

export async function createFilter(filter: FilterInput): Promise<Filter> {
  const { data, error } = await supabase
    .from('filters')
    .insert([{ ...filter, created_at: new Date().toISOString() }])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateFilter(id: string, filter: Partial<FilterInput>): Promise<Filter> {
  const { data, error } = await supabase
    .from('filters')
    .update({ ...filter })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteFilter(id: string): Promise<void> {
  const { error } = await supabase.from('filters').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}