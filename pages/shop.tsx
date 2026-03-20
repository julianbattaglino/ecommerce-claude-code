import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductFilters from '@/components/products/ProductFilters'
import ProductGrid from '@/components/products/ProductGrid'
import { Product, Filter } from '@/types'
import styles from '@/styles/Shop.module.css'

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<Filter[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({})

  useEffect(() => {
    fetchFilters()
    fetchProducts()
  }, [activeFilters])

  const fetchFilters = async () => {
    try {
      const response = await fetch('/api/filters')
      const data = await response.json()
      if (data.success) {
        setFilters(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching filters:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()

      Object.entries(activeFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v))
        } else if (value) {
          queryParams.append(key, value)
        }
      })

      const response = await fetch(`/api/products?${queryParams.toString()}`)
      const data = await response.json()
      if (data.success) {
        setProducts(data.data || [])
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
        <title>Tienda - Galería de Arte</title>
        <meta name="description" content="Compra obras de arte originales" />
      </Head>

      <div className={styles.shopContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Nuestra Colección</h1>
          <p className={styles.subtitle}>Explora nuestras obras de arte</p>
        </div>

        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <ProductFilters
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
            />
          </aside>

          <main className={styles.main}>
            {loading ? (
              <div className={styles.loading}>Cargando productos...</div>
            ) : products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className={styles.empty}>
                <p>No se encontraron productos con los filtros seleccionados</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
