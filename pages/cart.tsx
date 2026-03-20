import Head from 'next/head'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import styles from '@/styles/Cart.module.css'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore()
  const { user } = useAuth()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>Carrito - Galería de Arte</title>
        </Head>

        <div className={styles.container}>
          <h1 className={styles.title}>Mi Carrito</h1>
          <div className={styles.empty}>
            <p>Tu carrito está vacío</p>
            <Link href="/shop" className={styles.continueShoppingButton}>
              Continuar comprando
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Carrito - Galería de Arte</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Mi Carrito</h1>

        <div className={styles.content}>
          <div className={styles.itemsSection}>
            {items.map((item) => (
              <div key={item.product.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  {item.product.images && item.product.images[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                    />
                  )}
                </div>

                <div className={styles.itemDetails}>
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className={styles.itemTitle}>{item.product.title}</h3>
                  </Link>
                  <p className={styles.itemPrice}>${item.product.price}</p>
                </div>

                <div className={styles.itemQuantity}>
                  <label>Cantidad:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.product.id, parseInt(e.target.value) || 1)
                    }
                    className={styles.quantityInput}
                  />
                </div>

                <div className={styles.itemSubtotal}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => removeItem(item.product.id)}
                  className={styles.removeButton}
                  title="Eliminar del carrito"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryContent}>
              <h2>Resumen</h2>

              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Envío:</span>
                <span className={styles.shippingNote}>
                  Se coordinará con el vendedor
                </span>
              </div>

              <div className={styles.summaryTotal}>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <p className={styles.summaryNote}>
                El envío se coordinará directamente con el vendedor después de confirmar el pago.
              </p>

              {user ? (
                <Link href="/checkout" className={styles.checkoutButton}>
                  Proceder al Pago
                </Link>
              ) : (
                <div className={styles.authMessage}>
                  <p>Inicia sesión para continuar con la compra</p>
                  <Link href="/auth/login" className={styles.loginButton}>
                    Iniciar Sesión
                  </Link>
                </div>
              )}

              <button
                onClick={clearCart}
                className={styles.clearCartButton}
              >
                Vaciar Carrito
              </button>

              <Link href="/shop" className={styles.continueShopping}>
                ← Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
