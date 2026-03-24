import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '@/styles/Checkout.module.css'

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  delivery_city: string
  delivery_zip_code: string
  items: Array<{
    title: string
    quantity: number
    price: number
  }>
  total: number
  payment_method: string
  status: string
  created_at: string
}

export default function OrderCreated() {
  const router = useRouter()
  const { orderId } = router.query
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    setIsReady(true)

    if (!orderId) {
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        const data = await response.json()

        if (data.success && data.data) {
          setOrder(data.data)
        } else {
          setError('No se pudo cargar la información de la orden')
        }
      } catch (err) {
        setError('Error al cargar la orden')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [router.isReady, orderId])

  return (
    <>
      <Head>
        <title>Orden Creada - Galería de Arte</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.empty}>
          <div style={{ textAlign: 'center' }}>
            {!isReady ? (
              <>
                <h1>Cargando...</h1>
              </>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
                <h1>¡Orden Creada con Éxito!</h1>

                {loading && <p>Cargando información de la orden...</p>}

                {error && <p style={{ color: '#d32f2f' }}>{error}</p>}

                {order && (
                  <>
                    <div
                      style={{
                        background: '#f5f5f5',
                        padding: '20px',
                        borderRadius: '8px',
                        margin: '20px 0',
                        textAlign: 'left',
                      }}
                    >
                      <h2 style={{ marginTop: 0 }}>Detalles de la Orden</h2>

                      <p>
                        <strong>Número de Orden:</strong>{' '}
                        <span style={{ fontSize: '18px', color: '#0066cc' }}>{order.id}</span>
                      </p>

                      <p>
                        <strong>Cliente:</strong> {order.customer_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {order.customer_email}
                      </p>
                      <p>
                        <strong>Teléfono:</strong> {order.customer_phone}
                      </p>

                      <hr />

                      <h3>Dirección de Entrega</h3>
                      <p>{order.delivery_address}</p>
                      <p>
                        {order.delivery_city} - {order.delivery_zip_code}
                      </p>

                      <hr />

                      <h3>Productos</h3>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                        }}
                      >
                        <thead>
                          <tr style={{ background: '#e8e8e8' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Producto</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Cantidad</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Precio</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: '10px' }}>{item.title}</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
                              <td style={{ padding: '10px', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                              <td style={{ padding: '10px', textAlign: 'right' }}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
                            <td colSpan={3} style={{ padding: '10px', textAlign: 'right' }}>
                              TOTAL:
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                              ${order.total.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {order.payment_method === 'transfer' && (
                        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
                          <h3 style={{ marginTop: 0, color: '#856404' }}>Informacion de Transferencia</h3>
                          <p style={{ margin: '10px 0' }}>
                            <strong>Los datos para realizar la transferencia fueron enviados a tu email.</strong>
                          </p>
                          <p style={{ margin: '10px 0', fontSize: '14px', color: '#666' }}>
                            Por favor, incluye el número de orden <strong>{order.id}</strong> en el concepto de la transferencia.
                          </p>
                          <p style={{ margin: '10px 0', fontSize: '14px', color: '#666' }}>
                            Los datos también están disponibles en el email de confirmación que recibiste en{' '}
                            <strong>{order.customer_email}</strong>.
                          </p>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '30px' }}>
                      <p style={{ color: '#666', marginBottom: '20px' }}>
                        Has recibido un correo de confirmación en <strong>{order.customer_email}</strong> con todos los detalles de tu orden.
                      </p>
                    </div>
                  </>
                )}

                <div style={{ marginTop: '30px' }}>
                  <Link href="/shop" style={{ marginRight: '20px' }}>
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Volver a la tienda</button>
                  </Link>
                  <Link href="/orders">
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Ver mis órdenes</button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
