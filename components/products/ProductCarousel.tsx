import { useState } from 'react'
import Image from 'next/image'
import styles from './ProductCarousel.module.css'

interface ProductCarouselProps {
  images: string[]
  productTitle: string
}

export default function ProductCarousel({ images, productTitle }: ProductCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.mainImage}>
          <Image src="/placeholder.jpg" alt={productTitle} fill className={styles.image} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainImage}>
        <Image
          src={images[selectedIndex]}
          alt={`${productTitle} - Image ${selectedIndex + 1}`}
          fill
          className={styles.image}
          priority
        />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`${styles.thumbnail} ${index === selectedIndex ? styles.active : ''}`}
            >
              <Image
                src={image}
                alt={`${productTitle} - Thumbnail ${index + 1}`}
                fill
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}