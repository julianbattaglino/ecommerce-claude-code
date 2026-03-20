import type { NextApiRequest, NextApiResponse } from 'next'
import MercadoPago from 'mercadopago'

// Configurar Mercado Pago
MercadoPago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { items, payer, metadata } = req.body

    // Crear preferencia de Mercado Pago
    const preference = {
      items: items.map((item: any) => ({
        id: item.id,
        title: item.title,
        unit_price: item.unit_price,
        quantity: item.quantity,
        currency_id: 'ARS',
      })),
      payer: {
        name: payer.name,
        email: payer.email,
        phone: { area_code: '54', number: payer.phone },
        address: {
          street_name: metadata.address,
          city_name: metadata.city,
          zip_code: metadata.zipCode,
        },
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout-success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout-failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout-pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      external_reference: `ORDER-${Date.now()}`,
    }

    const response = await MercadoPago.preferences.create(preference)

    return res.status(200).json({
      success: true,
      data: {
        id: response.body.id,
        init_point: response.body.init_point,
        sandbox_init_point: response.body.sandbox_init_point,
      },
    })
  } catch (error: any) {
    console.error('Error creating Mercado Pago preference:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
