import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useCartStore } from '@/store/cartStore'
import ProductCarousel from '@/components/products/ProductCarousel'
import { Product } from '@/types'
import styles from '@/styles/ProductDetail.module.css'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const { user } = useAuth()
  const { addItem } = useCartStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct(id as string)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      const data = await response.json()
      if (data.success) {
        setProduct(data.data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Cargando producto...</div>
  }

  if (!product) {
    return <div className={styles.notFound}>Producto no encontrado</div>
  }

  return (
    <>
      <Head>
        <title>{product.title} - Galería de Arte</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.imageSection}>
            {product.images && product.images.length > 0 && (
              <ProductCarousel images={product.images} productTitle={product.title} />
            )}
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.title}>{product.title}</h1>

            <p className={styles.price}>${product.price}</p>

            <div className={styles.description}>
              <p>{product.description}</p>
            </div>

            {product.details && (
              <div className={styles.details}>
                <h3>Detalles</h3>
                <p>{product.details}</p>
              </div>
            )}

            {product.technical_specifications && Object.keys(product.technical_specifications).length > 0 && (
              <div className={styles.specs}>
                <h3>Especificaciones Técnicas</h3>
                <ul>
                  {Object.entries(product.technical_specifications).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.shipping}>
              <p className={styles.shippingMessage}>
                📦 <strong>Envío:</strong> Se coordinará directamente con el vendedor
              </p>
            </div>

            {user ? (
              <div className={styles.purchase}>
                <div className={styles.quantity}>
                  <label htmlFor="quantity">Cantidad:</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className={styles.quantityInput}
                  />
                </div>

                <button
                  onClick={handleAddToCart}
                  className={styles.addToCartButton}
                >
                  {addedToCart ? '✓ Añadido al carrito' : 'Añadir al carrito'}
                </button>
              </div>
            ) : (
              <div className={styles.authRequired}>
                <p>Inicia sesión para comprar</p>
                <a href="/auth/login" className={styles.loginLink}>
                  Ir a Login
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
