import type { NextApiRequest, NextApiResponse } from 'next'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configurar Mercado Pago
const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})
const mercadoPagoPreference = new Preference(mercadoPagoConfig)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return res.status(500).json({ success: false, error: 'MERCADOPAGO_ACCESS_TOKEN no configurado en .env' })
  }

  try {
    const { items, payer, metadata } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'items debe ser un array con al menos un producto' })
    }

    if (!payer || !payer.email || !payer.name) {
      return res.status(400).json({ success: false, error: 'payer.name y payer.email son requeridos' })
    }

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

    const response = await mercadoPagoPreference.create({ body: preference })

    return res.status(200).json({
      success: true,
      data: {
        id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
      },
    })
  } catch (error: any) {
    const mpError =
      error?.response?.body ||
      error?.response?._response ||
      error?.message ||
      JSON.stringify(error)

    console.error('Error creating Mercado Pago preference:', mpError)

    res.status(500).json({
      success: false,
      error: mpError,
    })
  }
}
