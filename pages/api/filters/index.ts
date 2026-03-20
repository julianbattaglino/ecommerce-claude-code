import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('filters')
        .select('*')
        .order('name')

      if (error) throw error

      return res.status(200).json({ success: true, data })
    }

    // POST - crear filtro (solo admin)
    if (req.method === 'POST') {
      const { name, type, options } = req.body

      const { data, error } = await supabase
        .from('filters')
        .insert([{ name, type, options }])
        .select()

      if (error) throw error

      return res.status(201).json({ success: true, data: data?.[0] })
    }

    res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
