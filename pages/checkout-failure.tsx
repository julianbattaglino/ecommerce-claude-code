import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Checkout.module.css'

export default function CheckoutFailure() {
  return (
    <>
      <Head>
        <title>Pago Rechazado - Galería de Arte</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.empty}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px', color: '#d32f2f' }}>✕</div>
            <h1>Pago Rechazado</h1>

            <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
              Lamentablemente, tu pago no pudo ser procesado.
            </p>

            <p style={{ fontSize: '16px', marginBottom: '30px', color: '#666' }}>
              Por favor, verifica tu información de pago e intenta nuevamente. Si el problema persiste, contacta a tu banco.
            </p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/checkout">
                <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Intentar de nuevo</button>
              </Link>
              <Link href="/cart">
                <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Volver al carrito</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
