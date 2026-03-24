import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Checkout.module.css'

export default function CheckoutPending() {
  return (
    <>
      <Head>
        <title>Pago Pendiente - Galería de Arte</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.empty}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px', color: '#ff9800' }}>⏱</div>
            <h1>Pago Pendiente</h1>

            <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
              Tu pago está siendo procesado.
            </p>

            <p style={{ fontSize: '16px', marginBottom: '30px', color: '#666' }}>
              Esto puede tomar algunos minutos. Te enviaremos una confirmación por correo electrónico cuando el pago sea completado.
            </p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/orders">
                <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Ver mis órdenes</button>
              </Link>
              <Link href="/shop">
                <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Volver a la tienda</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
