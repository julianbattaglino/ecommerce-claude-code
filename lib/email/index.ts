import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  items: {
    title: string
    quantity: number
    price: number
  }[]
  total: number
  deliveryInfo: {
    address: string
    city: string
    zipCode: string
    phone: string
  }
  paymentMethod: 'mercadopago' | 'transfer'
  bankData?: {
    accountHolder: string
    accountNumber: string
    bankCode: string
    cbu: string
  }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const {
    orderId,
    customerName,
    customerEmail,
    items,
    total,
    deliveryInfo,
    paymentMethod,
    bankData,
  } = data

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('')

  const bankDataSection =
    paymentMethod === 'transfer' && bankData
      ? `
    <h3 style="color: #333; margin-top: 30px;">Datos para Transferencia Bancaria</h3>
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 15px;">
      <p><strong>Titular de Cuenta:</strong> ${bankData.accountHolder}</p>
      <p><strong>Número de Cuenta:</strong> ${bankData.accountNumber}</p>
      <p><strong>CBU:</strong> ${bankData.cbu}</p>
      <p><strong>Código Banco:</strong> ${bankData.bankCode}</p>
      <p style="color: #666; font-size: 14px; margin-top: 15px;">
        Por favor, incluya el número de orden <strong>${orderId}</strong> en el concepto de la transferencia.
      </p>
    </div>
  `
      : ''

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f8f8; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .header h1 { margin: 0; color: #333; }
          .content { background-color: #fff; padding: 20px; border: 1px solid #eee; }
          .order-number { background-color: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .order-number strong { font-size: 18px; color: #0066cc; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #f5f5f5; padding: 12px; text-align: left; font-weight: bold; }
          .total-row { background-color: #f0f0f0; font-weight: bold; }
          .delivery-info { background-color: #fafafa; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Orden Confirmada</h1>
          </div>
          <div class="content">
            <p>¡Hola <strong>${customerName}</strong>!</p>
            <p>Tu orden ha sido registrada exitosamente. A continuación encontrarás los detalles:</p>
            
            <div class="order-number">
              Número de Orden: <strong>${orderId}</strong>
            </div>

            <h3 style="color: #333;">Resumen de Compra</h3>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td colspan="3" style="padding: 12px; text-align: right;">TOTAL:</td>
                  <td style="padding: 12px; text-align: right;">$${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <h3 style="color: #333;">Información de Entrega</h3>
            <div class="delivery-info">
              <p><strong>Dirección:</strong> ${deliveryInfo.address}</p>
              <p><strong>Ciudad:</strong> ${deliveryInfo.city} - ${deliveryInfo.zipCode}</p>
              <p><strong>Teléfono:</strong> ${deliveryInfo.phone}</p>
            </div>

            ${bankDataSection}

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Si tienes alguna pregunta sobre tu orden, no dudes en contactarnos.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Galería de Arte. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@galeriadearte.com',
      to: customerEmail,
      subject: `Orden Confirmada #${orderId}`,
      html: htmlContent,
    })

    if (result.error) {
      console.error('Email error:', result.error)
      return { success: false, error: result.error.message }
    }

    return { success: true, messageId: result.data?.id || 'sent' }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
