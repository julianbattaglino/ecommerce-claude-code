import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'
import styles from '@/styles/AdminProducts.module.css'

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  delivery_city: string
  delivery_zip_code: string
  items: Array<{ title: string; quantity: number; price: number }>
  total: number
  payment_method: string
  status: string
  created_at: string
}

export default function AdminOrders() {
  const router = useRouter()
  const { isAdmin, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!isAdmin) {
      router.push('/')
      return
    }

    setIsReady(true)
    fetchOrders()
  }, [isAdmin, authLoading, router])

  const fetchOrders = async () => {
    try {
      // Obtener todas las órdenes (datos públicos para admin)
      const response = await fetch('/api/admin/orders')
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

  if (!isReady || authLoading) {
    return (
      <>
        <Head>
          <title>Órdenes - Admin</title>
        </Head>
        <div className={styles.container}>
          <h1>Cargando...</h1>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Órdenes - Admin</title>
      </Head>

      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Órdenes</h1>
          <Link href="/admin">
            <button style={{ padding: '10px 20px' }}>← Volver al panel</button>
          </Link>
        </div>

        {error && <p style={{ color: '#d32f2f' }}>{error}</p>}

        {orders.length === 0 ? (
          <p>No hay órdenes registradas aún.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Orden ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Cliente</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Total</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Método</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Estado</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>
                      <Link href={`/order-created?orderId=${order.id}`} style={{ color: '#0066cc', textDecoration: 'none' }}>
                        {order.id.substring(0, 8)}...
                      </Link>
                    </td>
                    <td style={{ padding: '12px' }}>{order.customer_name}</td>
                    <td style={{ padding: '12px', fontSize: '12px' }}>{order.customer_email}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                      ${order.total.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>
                      {order.payment_method === 'mercadopago' ? 'MP' : 'Transferencia'}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color:
                          order.status === 'paid'
                            ? '#2e7d32'
                            : order.status === 'pending'
                            ? '#856404'
                            : '#333',
                      }}
                    >
                      {order.status === 'paid' ? 'Pagado' : order.status === 'pending' ? 'Pendiente' : order.status}
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px' }}>
                      {new Date(order.created_at).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
