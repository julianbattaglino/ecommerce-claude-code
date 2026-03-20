import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import styles from '@/styles/Checkout.module.css'

export default function Orders() {
  const { items, getTotal } = useCartStore()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    // Simulamos un pedido completado al llegar a la página
    setOrderId(`ORD-${Math.floor(Math.random() * 1000000)}`)
  }, [])

  return (
    <>
      <Head>
        <title>Mis Pedidos - Galería de Arte</title>
      </Head>

      <div className={styles.container}>
        <h1>Órdenes</h1>
        {items.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <p>Pedido registrado. Total: ${getTotal().toFixed(2)}</p>
        )}

        <p>Orden #: {orderId || 'generando...'}</p>

        <Link href="/shop">Volver a la tienda</Link>
      </div>
    </>
  )
}
