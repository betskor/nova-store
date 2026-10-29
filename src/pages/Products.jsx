
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useProducts } from '../context/ProductsContext'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const { products } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [category, setCategory] = useState(
    searchParams.get('category') || 'All',
  )

  useEffect(() => {
    setCategory(searchParams.get('category') || 'All')
  }, [searchParams])

  const categories = [
    'All',
    ...new Set(products.map((product) => product.category)),
  ]

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesCategory =
        category === 'All' || product.category === category

      const matchesSale =
        searchParams.get('sale') !== 'true' ||
        (product.oldPrice && product.oldPrice > product.price)

      return matchesSearch && matchesCategory && matchesSale
    })

    if (sort === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sort === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [products, search, category, sort, searchParams])

  const resetFilters = () => {
    setSearch('')
    setCategory('All')
    setSort('featured')
    setSearchParams({})
  }

  return (
    <main className="mx-auto min-h-[65vh] max-w-[1600px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="border-b border-[#e8e4dc] pb-8">
        <p className="editorial-label text-[#89857d]">THE NOVA COLLECTION</p>
        <h1 className="font-editorial mt-3 text-4xl sm:text-6xl">
          Discover the collection
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#77746d]">
          Thoughtfully selected fashion, designed for your everyday wardrobe.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="flex items-center gap-3 border-b border-[#24231f] px-1 py-3 lg:w-80">
          <Search size={18} className="text-[#77746d]" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search the collection..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <SlidersHorizontal size={17} className="text-[#77746d]" />

          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value)
              const next = new URLSearchParams(searchParams)
              next.delete('sale')

              if (event.target.value === 'All') {
                next.delete('category')
              } else {
                next.set('category', event.target.value)
              }

              setSearchParams(next)
            }}
            className="border border-[#e8e4dc] bg-transparent px-3 py-3 text-xs"
            aria-label="Filter by category"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === 'All' ? 'All categories' : item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="border border-[#e8e4dc] bg-transparent px-3 py-3 text-xs"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <p className="text-xs text-[#77746d]">
          {filteredProducts.length} PRODUCTS
        </p>

        {(search ||
          category !== 'All' ||
          searchParams.has('sale') ||
          sort !== 'featured') && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs underline underline-offset-4"
          >
            CLEAR FILTERS
          </button>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <h2 className="font-editorial text-3xl">Nothing found</h2>
          <p className="mt-3 text-sm text-[#77746d]">
            Try another search or explore a different category.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="editorial-button mt-6"
          >
            VIEW ALL PRODUCTS
          </button>
        </div>
      )}
    </main>
  )
}
