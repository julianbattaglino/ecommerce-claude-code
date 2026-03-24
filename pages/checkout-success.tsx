import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '@/styles/Checkout.module.css'

export default function CheckoutSuccess() {
  const router = useRouter()
  const [orderInfo, setOrderInfo] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    setIsReady(true)

    const { payment_id, external_reference, preference_id } = router.query

    if (payment_id) {
      console.log('Payment success:', {
        payment_id,
        external_reference,
        preference_id,
      })
      
      // Buscar la orden por external_reference o payment_id
      // y actualizar su estado a "paid"
      setOrderInfo({
        payment_id,
        external_reference,
        preference_id,
      })
    }
  }, [router.isReady, router.query])

  return (
    <>
      <Head>
        <title>Pago Completado - Galería de Arte</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.empty}>
          <div style={{ textAlign: 'center' }}>
            {!isReady ? (
              <h1>Cargando...</h1>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
                <h1>¡Pago Completado!</h1>

                <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
                  Tu pago ha sido procesado correctamente.
                </p>

                {orderInfo && (
                  <div
                    style={{
                      background: '#f5f5f5',
                      padding: '20px',
                      borderRadius: '8px',
                      margin: '20px 0',
                      textAlign: 'left',
                    }}
                  >
                    <p>
                      <strong>ID de Pago:</strong> {orderInfo.payment_id}
                    </p>
                    <p>
                      <strong>Referencia:</strong> {orderInfo.external_reference}
                    </p>
                  </div>
                )}

                <p style={{ fontSize: '16px', marginBottom: '30px', color: '#666' }}>
                  Pronto recibirás un correo de confirmación con los detalles de tu compra y seguimiento de entrega.
                </p>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/orders">
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Ver mis órdenes</button>
                  </Link>
                  <Link href="/shop">
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Volver a la tienda</button>
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
