import type { NextApiRequest, NextApiResponse } from 'next'
import { createSupabaseAdminClient } from '@/lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'ID de filtro requerido' })
  }

  const supabase = createSupabaseAdminClient()

  if (req.method === 'PUT') {
    const { name, type, options } = req.body

    if (!name || !type || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ success: false, error: 'Datos inválidos' })
    }

    try {
      const { data, error } = await supabase
        .from('filters')
        .update({ name, type, options })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return res.status(400).json({ success: false, error: error.message })
      }

      return res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('filters')
        .delete()
        .eq('id', id)

      if (error) {
        return res.status(400).json({ success: false, error: error.message })
      }

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}
