import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Product } from '@/types'
import styles from '@/styles/AdminProducts.module.css'

export default function AdminProducts() {
  const router = useRouter()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/')
    } else if (!authLoading && isAdmin) {
      fetchProducts()
    }
  }, [user, isAdmin, authLoading, router])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
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

  const handleDelete = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setProducts(products.filter(p => p.id !== productId))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar el producto')
    }
  }

  if (authLoading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  if (!isAdmin) {
    return <div className={styles.unauthorized}>No tienes permisos</div>
  }

  return (
    <>
      <Head>
        <title>Gestionar Productos - Admin</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gestionar Productos</h1>
          <Link href="/admin/products/new" className={styles.createButton}>
            ➕ Crear Producto
          </Link>
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando productos...</div>
        ) : products.length > 0 ? (
          <div className={styles.table}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td className={styles.actions}>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className={styles.deleteButton}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No hay productos. <Link href="/admin/products/new">Crear el primero</Link></p>
          </div>
        )}
      </div>
    </>
  )
}
