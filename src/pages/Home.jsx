
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '../context/ProductsContext'
import ProductCard from '../components/ProductCard'

const categories = [
  {
    name: 'NEW ARRIVALS',
    value: 'Clothing',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'CLOTHING',
    value: 'Clothing',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'SHOES',
    value: 'Shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'BAGS',
    value: 'Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=85',
  },
  {
    name: 'SALE',
    value: 'All',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=85',
  },
]

export default function Home() {
  const { products } = useProducts()
  const featuredProducts = products.slice(0, 4)
  const newArrivals = products.slice(4, 8)

  return (
    <main>
      <section
        id="editorial"
        className="relative mx-4 mt-4 min-h-[440px] overflow-hidden bg-[#dedbd3] sm:mx-6 sm:min-h-[530px] lg:mx-8 lg:min-h-[590px]"
      >
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=90"
          alt="Fashion editorial collection"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#f3f0e9]/90 via-[#f3f0e9]/55 to-transparent sm:via-[#f3f0e9]/25" />

        <div className="relative z-10 flex min-h-[440px] max-w-7xl items-center px-7 py-14 sm:min-h-[530px] sm:px-12 lg:min-h-[590px] lg:px-20">
          <div className="max-w-xl">
            <p className="editorial-label mb-5 text-[#45423c]">
              THE AUTUMN / WINTER COLLECTION
            </p>

            <h1 className="font-editorial max-w-lg text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Refined style.
              <span className="block italic">Timeless elegance.</span>
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#504d47]">
              Discover thoughtfully selected pieces designed to become part
              of your everyday wardrobe.
            </p>

            <Link to="/products" className="editorial-button mt-7">
              SHOP THE COLLECTION <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <span className="editorial-label absolute bottom-5 right-6 z-10 hidden text-white drop-shadow sm:block">
          NOVA — THE NEW EDITION
        </span>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <p className="editorial-label text-[#89857d]">DISCOVER YOUR STYLE</p>
        <h2 className="font-editorial mt-2 mb-6 text-3xl sm:text-4xl">
          Explore the collections
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={
                category.value === 'All'
                  ? category.name === 'SALE'
                    ? '/products?sale=true'
                    : '/products'
                  : `/products?category=${encodeURIComponent(category.value)}`
              }
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#f0ede7]">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="product-image h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2 py-3">
                <span className="text-[9px] font-semibold tracking-[.13em] sm:text-[10px]">
                  {category.name}
                </span>
                <ArrowRight
                  size={14}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e8e4dc] bg-[#f8f6f1]">
        <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="editorial-label text-[#89857d]">JUST LANDED</p>
              <h2 className="font-editorial mt-2 text-3xl sm:text-4xl">
                New arrivals
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden items-center gap-2 text-[10px] font-semibold tracking-[.1em] sm:flex"
            >
              VIEW ALL <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="editorial-label text-[#89857d]">THE NOVA SELECTION</p>
            <h2 className="font-editorial mt-2 text-3xl sm:text-4xl">
              Selected for you
            </h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-[10px] font-semibold tracking-[.1em]"
          >
            SHOP ALL <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-4 mb-12 bg-[#eae6de] px-6 py-14 text-center sm:mx-8 sm:py-20">
        <p className="editorial-label text-[#77746d]">THE NOVA PHILOSOPHY</p>
        <h2 className="font-editorial mx-auto mt-4 max-w-2xl text-3xl leading-tight sm:text-5xl">
          Less, but better. Pieces to keep, style, and love.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#77746d]">
          A considered approach to everyday fashion, where simplicity meets
          individuality.
        </p>
        <Link to="/products" className="editorial-outline-button mt-7">
          DISCOVER NOVA
        </Link>
      </section>
    </main>
  )
}
