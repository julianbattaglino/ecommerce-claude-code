import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { ProductInput } from '@/types'
import styles from '@/styles/AdminProductForm.module.css'

const defaultFormData: ProductInput = {
  title: '',
  price: 0,
  description: '',
  images: [],
  details: '',
  technical_specifications: {},
  category: '',
  filters: {},
}

export default function CreateProduct() {
  const router = useRouter()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState<ProductInput>(defaultFormData)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/')
    }
  }, [user, isAdmin, authLoading, router])

  if (authLoading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }))
  }

  const handleAddImage = () => {
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }))
      setImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        router.push('/admin/products')
      } else {
        alert('Error al crear el producto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Crear Producto - Admin</title>
      </Head>

      <div className={styles.container}>
        <Link href="/admin/products" className={styles.backLink}>
          ← Volver
        </Link>

        <h1 className={styles.title}>Crear Nuevo Producto</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Precio *</label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Categoría *</label>
            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="details">Detalles</label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Imágenes</label>
            <div className={styles.imageSection}>
              <input
                type="url"
                placeholder="URL de la imagen"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={styles.input}
              />
              <button
                type="button"
                onClick={handleAddImage}
                className={styles.addButton}
              >
                Agregar Imagen
              </button>
            </div>

            {formData.images.length > 0 && (
              <div className={styles.imageList}>
                {formData.images.map((img, idx) => (
                  <div key={idx} className={styles.imageItem}>
                    <img src={img} alt={`Preview ${idx}`} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className={styles.removeButton}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Creando...' : 'Crear Producto'}
          </button>
        </form>
      </div>
    </>
  )
}
