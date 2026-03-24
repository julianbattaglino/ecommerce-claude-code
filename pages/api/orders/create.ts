import type { NextApiRequest, NextApiResponse } from 'next'
import { createOrder } from '@/lib/api/orders'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { items, total, paymentMethod, customerName, customerEmail, customerPhone, deliveryAddress, deliveryCity, deliveryZipCode } = req.body

  console.log('[ORDERS] Recibido request:', {
    itemsCount: items?.length,
    paymentMethod,
    customerName,
    customerEmail,
  })

  // Validar datos requeridos
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.error('[ORDERS] Error: Items no válidos')
    return res.status(400).json({ success: false, error: 'Items son requeridos' })
  }

  if (!customerName || !customerEmail || !deliveryAddress) {
    console.error('[ORDERS] Error: Faltan datos del cliente')
    return res.status(400).json({ success: false, error: 'Faltan datos del cliente' })
  }

  if (!['mercadopago', 'transfer'].includes(paymentMethod)) {
    console.error('[ORDERS] Error: Método de pago inválido:', paymentMethod)
    return res.status(400).json({ success: false, error: 'Método de pago inválido' })
  }

  try {
    // Obtener userId si está autenticado
    console.log('[ORDERS] Obteniendo sesión...')
    const supabase = createSupabaseServerClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || 'anonymous'

    console.log('[ORDERS] UserId:', userId)

    // Crear la orden
    console.log('[ORDERS] Creando orden en BD...')
    const orderResult = await createOrder({
      userId,
      items,
      total,
      paymentMethod,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryZipCode,
      status: 'pending',
    })

    if (!orderResult.success) {
      console.error('[ORDERS] Error al crear orden:', orderResult.error)
      return res.status(400).json(orderResult)
    }

    const orderId = orderResult.data?.id
    console.log('[ORDERS] Orden creada exitosamente:', orderId)

    // Enviar email de confirmación
    console.log('[ORDERS] Enviando email...')
    const bankData = paymentMethod === 'transfer' ? {
      accountHolder: 'Galería de Arte',
      accountNumber: '****',
      bankCode: 'n/a',
      cbu: process.env.NEXT_PUBLIC_BANK_CBU || '****',
    } : undefined

    const emailResult = await sendOrderConfirmationEmail({
      orderId,
      customerName,
      customerEmail,
      items,
      total,
      deliveryInfo: {
        address: deliveryAddress,
        city: deliveryCity,
        zipCode: deliveryZipCode,
        phone: customerPhone,
      },
      paymentMethod,
      bankData,
    })

    if (!emailResult.success) {
      console.warn(`[ORDERS] Email no enviado para orden ${orderId}:`, emailResult.error)
    } else {
      console.log(`[ORDERS] Email enviado para orden ${orderId}`)
    }

    console.log('[ORDERS] Respondiendo exitosamente')
    return res.status(200).json({
      success: true,
      data: {
        orderId,
        email: emailResult.success,
      },
    })
  } catch (error) {
    console.error('[ORDERS] Error no capturado:', error)
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    return res.status(500).json({
      success: false,
      error: errorMessage,
    })
  }
}
