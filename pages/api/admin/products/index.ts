import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { title, price, description, images, details, technical_specifications, category, filters } = req.body

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            title,
            price,
            description,
            images,
            details,
            technical_specifications,
            category,
            filters,
          },
        ])
        .select()

      if (error) throw error

      return res.status(201).json({ success: true, data: data?.[0] })
    }

    // DELETE - eliminar producto
    if (req.method === 'DELETE') {
      const { id } = req.query

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      return res.status(200).json({ success: true })
    }

    res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
