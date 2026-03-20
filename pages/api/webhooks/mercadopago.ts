import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { data } = req.body

    // Aquí se procesaría la notificación de Mercado Pago
    // Por ahora, solo registramos el evento
    console.log('Webhook de Mercado Pago recibido:', data)

    // TODO: Guardar orden en la BD según el estado del pago

    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
