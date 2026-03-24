import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserOrders } from '@/lib/api/orders'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const supabase = createSupabaseServerClient({ req, res })

    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return res.status(401).json({ success: false, error: 'No autenticado' })
    }

    const result = await getUserOrders(session.user.id)

    if (!result.success) {
      return res.status(500).json(result)
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
