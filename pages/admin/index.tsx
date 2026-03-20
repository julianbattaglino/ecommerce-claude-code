import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import styles from '@/styles/AdminDashboard.module.css'

interface AdminStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAdmin, loading } = useAuth()
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
    } else if (!loading && isAdmin) {
      fetchStats()
    }
  }, [user, isAdmin, loading, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  if (!isAdmin) {
    return <div className={styles.unauthorized}>No tienes permisos de administrador</div>
  }

  return (
    <>
      <Head>
        <title>Panel Admin - Galería de Arte</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Panel de Administración</h1>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Productos</h3>
            <p className={styles.statNumber}>{stats.totalProducts}</p>
            <Link href="/admin/products">Gestionar Productos</Link>
          </div>

          <div className={styles.statCard}>
            <h3>Órdenes</h3>
            <p className={styles.statNumber}>{stats.totalOrders}</p>
            <Link href="/admin/orders">Ver Órdenes</Link>
          </div>

          <div className={styles.statCard}>
            <h3>Ingresos Totales</h3>
            <p className={styles.statNumber}>${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className={styles.menu}>
          <h2>Acciones Rápidas</h2>
          <ul>
            <li><Link href="/admin/products/new">➕ Crear Nuevo Producto</Link></li>
            <li><Link href="/admin/filters">⚙️ Configurar Filtros</Link></li>
            <li><Link href="/admin/orders">📦 Ver Órdenes</Link></li>
          </ul>
        </div>
      </div>
    </>
  )
}
