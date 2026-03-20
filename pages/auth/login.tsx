import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import LoginForm from '@/components/auth/LoginForm'
import styles from '@/styles/Auth.module.css'

export default function Login() {
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
        <title>Iniciar Sesión - Galería de Arte</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Iniciar Sesión</h1>
          <LoginForm />
        </div>
      </div>
    </>
  )
}
