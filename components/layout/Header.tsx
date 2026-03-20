import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState } from 'react'
import styles from './Header.module.css'

export default function Header() {
  const { user, isAdmin, signOut } = useAuth()
  const itemCount = useCartStore((state) => state.getItemCount())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Art Gallery</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/shop" className={styles.navLink}>
            Shop
          </Link>
          {mounted && isAdmin && (
            <Link href="/admin" className={styles.navLink}>
              Admin
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          <Link href="/cart" className={styles.cartLink}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </Link>

          {mounted ? (
            user ? (
              <div className={styles.userMenu}>
                <span className={styles.userEmail}>{user.email}</span>
                <button onClick={() => signOut()} className={styles.signOutBtn}>
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className={styles.signInBtn}>
                Sign In
              </Link>
            )
          ) : (
            <Link href="/auth/login" className={styles.signInBtn}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}