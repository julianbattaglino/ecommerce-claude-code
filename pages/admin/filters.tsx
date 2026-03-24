import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'
import styles from '@/styles/AdminProducts.module.css'

interface Filter {
  id: string
  name: string
  type: 'select' | 'multiselect' | 'range'
  options: string[]
  created_at: string
}

export default function FiltersAdmin() {
  const router = useRouter()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [filters, setFilters] = useState<Filter[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'select' as 'select' | 'multiselect' | 'range',
    options: '',
  })

  useEffect(() => {
    if (authLoading) return
    if (!isAdmin) {
      router.push('/')
      return
    }

    setIsReady(true)
    fetchFilters()
  }, [isAdmin, authLoading, router])

  const fetchFilters = async () => {
    try {
      const response = await fetch('/api/filters')
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setFilters(data.data)
      }
    } catch (error) {
      console.error('Error fetching filters:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddFilter = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.options) {
      alert('Por favor completa todos los campos')
      return
    }

    try {
      const optionsArray = formData.options
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt.length > 0)

      if (optionsArray.length === 0) {
        alert('Las opciones no pueden estar vacías')
        return
      }

      const response = await fetch('/api/filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          options: optionsArray,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setFormData({ name: '', type: 'select', options: '' })
        fetchFilters()
        alert('Filtro creado correctamente')
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el filtro')
    }
  }

  const handleEditFilter = (filter: Filter) => {
    setEditingId(filter.id)
    setFormData({
      name: filter.name,
      type: filter.type,
      options: filter.options.join(', '),
    })
  }

  const handleUpdateFilter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    try {
      const optionsArray = formData.options
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt.length > 0)

      if (optionsArray.length === 0) {
        alert('Las opciones no pueden estar vacías')
        return
      }

      const response = await fetch(`/api/filters/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          options: optionsArray,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setEditingId(null)
        setFormData({ name: '', type: 'select', options: '' })
        fetchFilters()
        alert('Filtro actualizado correctamente')
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el filtro')
    }
  }

  const handleDeleteFilter = async (filterId: string) => {
    if (!confirm('¿Estás seguro que deseas eliminar este filtro?')) return

    try {
      const response = await fetch(`/api/filters/${filterId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        fetchFilters()
        alert('Filtro eliminado correctamente')
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el filtro')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', type: 'select', options: '' })
  }

  if (!isReady || authLoading) {
    return (
      <>
        <Head>
          <title>Gestión de Filtros - Admin</title>
        </Head>
        <div className={styles.container}>
          <h1>Cargando...</h1>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Gestión de Filtros - Admin</title>
      </Head>

      <div className={styles.container}>
        <h1>Gestión de Filtros</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          <div>
            <h2>{editingId ? 'Editar Filtro' : 'Agregar Nuevo Filtro'}</h2>

            <form onSubmit={editingId ? handleUpdateFilter : handleAddFilter}>
              <div style={{ marginBottom: '15px' }}>
                <label>Nombre del Filtro</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Color, Tamaño, Material"
                  required
                  className={styles.input}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Tipo de Filtro</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="select">Selección Única</option>
                  <option value="multiselect">Selección Múltiple</option>
                  <option value="range">Rango</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Opciones (separadas por coma)</label>
                <textarea
                  name="options"
                  value={formData.options}
                  onChange={handleInputChange}
                  placeholder="Ej: Rojo, Azul, Verde"
                  rows={4}
                  required
                  className={styles.input}
                />
                <small style={{ color: '#666' }}>
                  Ingresa varias opciones separadas por comas
                </small>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? 'Actualizar Filtro' : 'Crear Filtro'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      padding: '10px 20px',
                      background: '#ccc',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div>
            <h2>Filtros Existentes</h2>

            {filters.length === 0 ? (
              <p>No hay filtros creados aún.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {filters.map(filter => (
                  <div
                    key={filter.id}
                    style={{
                      border: '1px solid #ddd',
                      padding: '15px',
                      borderRadius: '8px',
                      background: '#f9f9f9',
                    }}
                  >
                    <h4 style={{ marginTop: 0, marginBottom: '10px' }}>{filter.name}</h4>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Tipo:</strong> {
                        filter.type === 'select'
                          ? 'Selección única'
                          : filter.type === 'multiselect'
                          ? 'Selección múltiple'
                          : 'Rango'
                      }
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Opciones:</strong> {filter.options.join(', ')}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        onClick={() => handleEditFilter(filter)}
                        style={{
                          padding: '8px 12px',
                          background: '#0066cc',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteFilter(filter.id)}
                        style={{
                          padding: '8px 12px',
                          background: '#d32f2f',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
