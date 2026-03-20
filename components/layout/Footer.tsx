import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3 className={styles.title}>Art Gallery</h3>
            <p className={styles.description}>
              Discover unique artwork and paintings from talented artists around the world.
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.subtitle}>Quick Links</h4>
            <nav className={styles.links}>
              <Link href="/">Home</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>

          <div className={styles.section}>
            <h4 className={styles.subtitle}>Customer Service</h4>
            <nav className={styles.links}>
              <Link href="/shipping">Shipping Info</Link>
              <Link href="/returns">Returns</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </nav>
          </div>

          <div className={styles.section}>
            <h4 className={styles.subtitle}>Contact</h4>
            <div className={styles.contactInfo}>
              <p>Email: info@artgallery.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Art Street, Gallery City</p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {currentYear} Art Gallery. All rights reserved.</p>
          <p className={styles.note}>Shipping to be coordinated with the seller.</p>
        </div>
      </div>
    </footer>
  )
}