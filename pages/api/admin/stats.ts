import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    // Obtener estadísticas para admin
    const [productsResult, ordersResult] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
    ])

    const totalProducts = productsResult.count || 0
    const totalOrders = ordersResult.count || 0

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue: 0,
      },
    })
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
