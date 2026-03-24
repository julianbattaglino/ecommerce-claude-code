import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'
import styles from '@/styles/Checkout.module.css'

interface OrderItem {
  title: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  delivery_city: string
  delivery_zip_code: string
  items: OrderItem[]
  total: number
  payment_method: string
  status: string
  created_at: string
}

export default function Orders() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    setIsReady(true)

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/my-orders')
        const data = await response.json()

        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data)
        } else {
          setError('No se pudieron cargar las órdenes')
        }
      } catch (err) {
        setError('Error al cargar las órdenes')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, authLoading, router])

  if (!isReady || authLoading) {
    return (
      <>
        <Head>
          <title>Mis Órdenes - Galería de Arte</title>
        </Head>
        <div className={styles.container}>
          <h1>Mis Órdenes</h1>
          <p>Cargando...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Mis Órdenes - Galería de Arte</title>
      </Head>

      <div className={styles.container}>
        <h1>Mis Órdenes</h1>

        {error && <p style={{ color: '#d32f2f' }}>{error}</p>}

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <p>No tienes órdenes aún.</p>
            <Link href="/shop">
              <button>Ir a la tienda</button>
            </Link>
          </div>
        ) : (
          <div>
            {orders.map(order => (
              <div
                key={order.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px',
                  background: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0' }}>Orden #{order.id}</h3>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      {new Date(order.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold' }}>
                      ${order.total.toFixed(2)}
                    </p>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background:
                          order.status === 'paid'
                            ? '#c8e6c9'
                            : order.status === 'pending'
                            ? '#fff3cd'
                            : '#f5f5f5',
                        color:
                          order.status === 'paid'
                            ? '#2e7d32'
                            : order.status === 'pending'
                            ? '#856404'
                            : '#333',
                      }}
                    >
                      {order.status === 'paid' ? 'Pagado' : order.status === 'pending' ? 'Pendiente' : order.status}
                    </span>
                  </div>
                </div>

                <hr />

                <h4 style={{ marginBottom: '10px' }}>Productos:</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                  {order.items.map((item, idx) => (
                    <li key={idx} style={{ padding: '5px 0', fontSize: '14px' }}>
                      {item.title} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>

                <h4 style={{ marginBottom: '10px' }}>Entrega:</h4>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  {order.delivery_address}, {order.delivery_city} - {order.delivery_zip_code}
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  Teléfono: {order.customer_phone}
                </p>

                <div style={{ marginTop: '15px' }}>
                  <Link href={`/order-created?orderId=${order.id}`}>
                    <button style={{ fontSize: '14px', padding: '8px 16px' }}>Ver Detalles</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <Link href="/shop">
            <button>← Volver a la tienda</button>
          </Link>
        </div>
      </div>
    </>
  )
}
