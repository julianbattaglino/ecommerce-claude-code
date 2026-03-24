import type { NextApiRequest, NextApiResponse } from 'next'
import { getOrderById } from '@/lib/api/orders'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'ID de orden requerido' })
  }

  try {
    const result = await getOrderById(id)

    if (!result.success) {
      return res.status(404).json(result)
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
