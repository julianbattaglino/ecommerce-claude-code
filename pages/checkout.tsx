import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'
import { useCartStore } from '@/store/cartStore'
import styles from '@/styles/Checkout.module.css'

export default function Checkout() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, getTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'transfer'>('mercadopago')
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  })

  const total = getTotal()

  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>Pago - Galería de Arte</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.empty}>
            <p>Tu carrito está vacío</p>
            <button onClick={() => router.push('/shop')}>
              Volver a la tienda
            </button>
          </div>
        </div>
      </>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMercadoPagoPayment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.product.id,
            title: item.product.title,
            unit_price: item.product.price,
            quantity: item.quantity,
          })),
          payer: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
          metadata: {
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
          }
        }),
      })

      const data = await response.json()
      if (data.success && data.data?.init_point) {
        window.location.href = data.data.init_point
      } else {
        console.error('Mercado Pago API error:', data)
        alert(
          `Error al crear la preferencia de pago: ${
            data.error || data?.message || 'respuesta inválida'
          }`
        )
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  const handleBankTransfer = async () => {
    alert('Pago por transferencia bancaria - Se te contactará con los datos para realizar la transferencia.')
    // Aquí se podría guardar el pedido en la BD y enviar email
    clearCart()
    router.push('/orders')
  }

  return (
    <>
      <Head>
        <title>Pago - Galería de Arte</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Confirmar Compra</h1>

        <div className={styles.content}>
          <div className={styles.form}>
            <section className={styles.formSection}>
              <h2>Información de Entrega</h2>

              <input
                type="text"
                name="fullName"
                placeholder="Nombre completo"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className={styles.input}
              />

              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={styles.input}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className={styles.input}
              />

              <textarea
                name="address"
                placeholder="Dirección"
                value={formData.address}
                onChange={handleInputChange}
                required
                className={styles.textarea}
              />

              <input
                type="text"
                name="city"
                placeholder="Ciudad"
                value={formData.city}
                onChange={handleInputChange}
                required
                className={styles.input}
              />

              <input
                type="text"
                name="zipCode"
                placeholder="Código postal"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </section>

            <section className={styles.formSection}>
              <h2>Método de Pago</h2>

              <div className={styles.paymentMethods}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    value="mercadopago"
                    checked={paymentMethod === 'mercadopago'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'mercadopago' | 'transfer')}
                  />
                  <span>Mercado Pago</span>
                </label>

                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'mercadopago' | 'transfer')}
                  />
                  <span>Transferencia Bancaria</span>
                </label>
              </div>
            </section>
          </div>

          <aside className={styles.summary}>
            <h2>Resumen del Pedido</h2>

            <div className={styles.items}>
              {items.map(item => (
                <div key={item.product.id} className={styles.summaryItem}>
                  <div>
                    <p className={styles.itemName}>{item.product.title}</p>
                    <p className={styles.itemQuantity}>Cantidad: {item.quantity}</p>
                  </div>
                  <p className={styles.itemPrice}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Envío:</span>
                <span>A coordinarse</span>
              </div>
              <div className={styles.totalRow + ' ' + styles.total}>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => paymentMethod === 'mercadopago' ? handleMercadoPagoPayment() : handleBankTransfer()}
              disabled={loading || !formData.fullName || !formData.email || !formData.address}
              className={styles.payButton}
            >
              {loading ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
            </button>

            <button
              onClick={() => window.history.back()}
              className={styles.backButton}
            >
              ← Volver al carrito
            </button>
          </aside>
        </div>
      </div>
    </>
  )
}
