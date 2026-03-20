import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabaseUrl, supabaseAnonKey } from '@/lib/supabase'
import styles from '@/styles/Home.module.css'
import { Product } from '@/types'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=6')
      const data = await response.json()
      if (data.success) {
        setFeaturedProducts(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Galería de Arte - Inicio</title>
        <meta name="description" content="Descubre hermosas obras de arte y pinturas" />
      </Head>

      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Galería de Arte Contemporáneo</h1>
          <p className={styles.subtitle}>
            Descubre obras únicas de artistas talentosos
          </p>
          <Link href="/shop" className={styles.ctaButton}>
            Explorar Tienda
          </Link>
        </div>
      </div>

      <section className={styles.featured}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Obras Destacadas</h2>

          {loading ? (
            <div className={styles.loading}>Cargando...</div>
          ) : featuredProducts.length > 0 ? (
            <div className={styles.grid}>
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className={styles.productCard}
                >
                  <div className={styles.imageWrapper}>
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className={styles.productImage}
                      />
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.title}</h3>
                    <p className={styles.productPrice}>${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>No hay obras disponibles en este momento</p>
              <Link href="/shop">Ver todas las obras</Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.about}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Sobre Nosotros</h2>
          <p className={styles.aboutText}>
            Somos una galería online dedicada a promover artistas contemporáneos
            y ofrecer obras de arte accesibles. Cada pieza cuenta una historia única.
          </p>
          <p className={styles.aboutText}>
            Los envíos se coordinan directamente con el artista para asegurar
            la mejor experiencia de entrega.
          </p>
        </div>
      </section>
    </>
  )
}
