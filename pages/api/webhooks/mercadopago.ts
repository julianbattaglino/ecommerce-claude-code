import type { NextApiRequest, NextApiResponse } from 'next'
import { updateOrderStatus } from '@/lib/api/orders'
import { createSupabaseAdminClient } from '@/lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { type, data, id } = req.body

    console.log('Webhook de Mercado Pago recibido:', { type, id })

    // Mercado Pago envía notificaciones sobre pagos
    if (type === 'payment' && data?.id) {
      const paymentId = data.id

      // Obtener información del pago
      const supabase = createSupabaseAdminClient()
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_id', paymentId)
        .single()

      if (!ordersError && orders) {
        // El pago ya está procesado
        // La actualización se hará desde el cliente luego del callback
        console.log('Order with payment_id already exists:', paymentId)
        return res.status(200).json({ success: true })
      }

      console.log('Pago procesado - ID:', paymentId)
      // Nota: El flujo principal es:
      // 1. Cliente crea orden via /api/orders/create
      // 2. Cliente va a Mercado Pago
      // 3. Mercado Pago redirige a callback URLs
      // 4. El webhook aquí solo es de respaldo
    }

    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
