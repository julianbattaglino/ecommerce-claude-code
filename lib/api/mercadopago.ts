import { Product } from '@/types'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface CreatePreferenceParams {
  items: Array<{
    product: Product
    quantity: number
  }>
  orderId: string
  payerEmail?: string
}

interface PreferenceResponse {
  id: string
  init_point: string
  sandbox_init_point: string
}

export async function createMercadoPagoPreference({
  items,
  orderId,
  payerEmail,
}: CreatePreferenceParams): Promise<PreferenceResponse> {
  const response = await fetch('/api/mercadopago/create-preference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        description: item.product.description,
        unit_price: item.product.price,
        quantity: item.quantity,
        currency_id: 'ARS',
      })),
      orderId,
      payerEmail,
      back_urls: {
        success: `${APP_URL}/checkout/success`,
        failure: `${APP_URL}/checkout/failure`,
        pending: `${APP_URL}/checkout/pending`,
      },
      auto_return: 'approved',
      external_reference: orderId,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create payment preference')
  }

  return response.json()
}

export async function verifyPayment(paymentId: string): Promise<{
  status: string
  external_reference: string
  payment_method: string
}> {
  const response = await fetch(`/api/mercadopago/verify-payment?payment_id=${paymentId}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to verify payment')
  }

  return response.json()
}