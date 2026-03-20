import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { title, price, type, options } = req.body

    const { data, error } = await supabase
      .from('filters')
      .insert([{ name: title, type, options }])
      .select()

    if (error) throw error

    return res.status(201).json({ success: true, data: data?.[0] })
  } catch (error: any) {
    console.error('Error creating filter:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
