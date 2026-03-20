import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const mainImage = product.images?.[0] || '/placeholder.jpg'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={mainImage}
          alt={product.title}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <p className={styles.description}>{product.description.substring(0, 100)}...</p>
        <div className={styles.actions}>
          <button onClick={handleAddToCart} className={styles.addToCartBtn}>
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}