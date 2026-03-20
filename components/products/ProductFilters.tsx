import { useState, useEffect } from 'react'
import { Filter, ProductFilters } from '@/types'
import { getFilters } from '@/lib/api'
import styles from './ProductFilters.module.css'

interface ProductFiltersProps {
  onFilterChange: (filters: ProductFilters) => void
  initialFilters?: ProductFilters
}

export default function ProductFilters({ onFilterChange, initialFilters = {} }: ProductFiltersProps) {
  const [filters, setFilters] = useState<Filter[]>([])
  const [activeFilters, setActiveFilters] = useState<ProductFilters>(initialFilters)
  const [priceRange, setPriceRange] = useState({
    min: initialFilters.price_min?.toString() || '',
    max: initialFilters.price_max?.toString() || '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFilters() {
      try {
        const data = await getFilters()
        setFilters(data)
      } catch (error) {
        console.error('Failed to fetch filters:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFilters()
  }, [])

  const handleFilterChange = (filterName: string, value: string) => {
    const newFilters = { ...activeFilters }

    if (value === '') {
      delete newFilters[filterName]
    } else {
      newFilters[filterName] = value
    }

    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const applyPriceFilter = () => {
    const newFilters = { ...activeFilters }

    if (priceRange.min) {
      newFilters.price_min = parseFloat(priceRange.min)
    } else {
      delete newFilters.price_min
    }

    if (priceRange.max) {
      newFilters.price_max = parseFloat(priceRange.max)
    } else {
      delete newFilters.price_max
    }

    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setActiveFilters({})
    setPriceRange({ min: '', max: '' })
    onFilterChange({})
  }

  const hasActiveFilters = Object.keys(activeFilters).length > 0

  if (loading) {
    return <div className={styles.loading}>Loading filters...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filters</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className={styles.clearBtn}>
            Clear All
          </button>
        )}
      </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Price Range</h4>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className={styles.priceInput}
          />
          <span className={styles.separator}>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className={styles.priceInput}
          />
        </div>
        <button onClick={applyPriceFilter} className={styles.applyBtn}>
          Apply
        </button>
      </div>

      {filters.map((filter) => (
        <div key={filter.id} className={styles.filterGroup}>
          <h4 className={styles.filterTitle}>{filter.name}</h4>
          <select
            value={(activeFilters[filter.name] as string) || ''}
            onChange={(e) => handleFilterChange(filter.name, e.target.value)}
            className={styles.select}
          >
            <option value="">All {filter.name}</option>
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}