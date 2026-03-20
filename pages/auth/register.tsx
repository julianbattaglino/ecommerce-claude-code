import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import RegisterForm from '@/components/auth/RegisterForm'
import styles from '@/styles/Auth.module.css'

export default function Register() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  return (
    <>
      <Head>
        <title>Registrarse - Galería de Arte</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Crear Cuenta</h1>
          <RegisterForm />
        </div>
      </div>
    </>
  )
}
