import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { supabaseBrowserClient } from '@/lib/supabase'
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

export default function EditProduct() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState<ProductInput>(defaultFormData)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/')
      return
    }

    if (id) {
      fetchProduct()
    }
  }, [id, user, isAdmin, authLoading, router])

  const fetchProduct = async () => {
    if (!id || typeof id !== 'string') return

    try {
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()
      if (data.success && data.data) {
        setFormData({
          title: data.data.title || '',
          price: data.data.price || 0,
          description: data.data.description || '',
          images: data.data.images || [],
          details: data.data.details || '',
          technical_specifications: data.data.technical_specifications || {},
          category: data.data.category || '',
          filters: data.data.filters || {},
        })
      } else {
        alert(data.error || 'No se pudo cargar el producto')
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Error cargando producto:', error)
      alert('Error cargando producto')
      router.push('/admin/products')
    } finally {
      setLoadingData(false)
    }
  }

  const uploadImageFile = async (file: File) => {
    setUploadError(null)
    setUploading(true)

    try {
      const filePath = `product-images/${Date.now()}-${file.name}`
      const { data, error } = await supabaseBrowserClient
        .storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (error) throw error
      if (!data?.path) throw new Error('Error subiendo la imagen')

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${data.path}`

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, publicUrl],
      }))
    } catch (error: any) {
      console.error('Error uploading image:', error)
      setUploadError(error.message || 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
    }
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
    if (!id || typeof id !== 'string') return

    setLoading(true)

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        router.push('/admin/products')
      } else {
        alert(data.error || 'Error al actualizar el producto')
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      alert('Error al actualizar el producto')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loadingData) {
    return <div className={styles.loading}>Cargando...</div>
  }

  return (
    <>
      <Head>
        <title>Editar Producto - Admin</title>
      </Head>

      <div className={styles.container}>
        <Link href="/admin/products" className={styles.backLink}>
          ← Volver
        </Link>

        <h1 className={styles.title}>Editar Producto</h1>

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
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadImageFile(file)
                }}
                className={styles.input}
              />
              <small>O pega la URL aquí</small>
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

            {uploading && <p className={styles.hint}>Subiendo imagen...</p>}
            {uploadError && <p className={styles.error}>{uploadError}</p>}

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
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </>
  )
}
