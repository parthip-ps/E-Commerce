// Server Component — fetches data at request time (SSR)
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Shield, Truck, RefreshCw, Headphones } from "lucide-react";
import ProductCard from "./components/ProductCard";
import { getFeaturedProductsSSR, getCategoriesSSR } from "@/lib/api";
import type { Product } from "@/types";

// Force SSR for fresh data
export const revalidate = 120;

async function FeaturedProducts() {
  let products: Product[] = [];
  try {
    const res = await getFeaturedProductsSSR() as { data: Product[] };
    products = res.data || [];
  } catch (_) {}

  return (
    <section className="py-12">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="text-gray-500 mt-1">Hand-picked products just for you</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 text-sm">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.slice(0, 5).map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}

async function CategorySection() {
  let categories: string[] = [];
  try {
    const res = await getCategoriesSSR() as { data: string[] };
    categories = res.data || [];
  } catch (_) {}

  const categoryMeta: Record<string, { emoji: string; color: string }> = {
    electronics: { emoji: "💻", color: "bg-blue-50 border-blue-200 text-blue-700" },
    sports: { emoji: "🏃", color: "bg-green-50 border-green-200 text-green-700" },
    furniture: { emoji: "🪑", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    accessories: { emoji: "🎒", color: "bg-purple-50 border-purple-200 text-purple-700" },
    home: { emoji: "🏠", color: "bg-pink-50 border-pink-200 text-pink-700" },
  };

  return (
    <section className="py-8 bg-white">
      <div className="page-container">
        <h2 className="section-title mb-6">Shop by Category</h2>
        <div className="flex gap-3 flex-wrap">
          {categories.map((cat) => {
            const meta = categoryMeta[cat] || { emoji: "📦", color: "bg-gray-50 border-gray-200 text-gray-700" };
            return (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-medium capitalize hover:shadow-md transition-all duration-200 ${meta.color}`}
              >
                <span className="text-xl">{meta.emoji}</span>
                {cat}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Shield, title: "Secure Payment", desc: "256-bit SSL encryption" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

export default function HomePage() {
  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="page-container py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="badge bg-blue-500 text-white mb-4 text-sm px-3 py-1">
              🎉 New Arrivals Every Week
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Shop Smarter,<br />
              <span className="text-blue-200">Live Better</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-xl">
              Discover thousands of premium products across electronics, sports, home & more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="bg-white text-blue-700 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                Shop Now
              </Link>
              <Link href="/auth/register" className="border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white hover:text-blue-700 transition-all">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-gray-100">
        <div className="page-container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — SSR */}
      <Suspense fallback={<div className="py-8 bg-white"><div className="page-container"><div className="h-16 skeleton rounded-xl" /></div></div>}>
        <CategorySection />
      </Suspense>

      {/* Featured Products — SSR */}
      <Suspense fallback={
        <section className="py-12"><div className="page-container">
          <div className="h-8 w-48 skeleton rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(5).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] skeleton rounded-xl" />)}
          </div>
        </div></section>
      }>
        <FeaturedProducts />
      </Suspense>

      {/* CTA Banner */}
      <section className="bg-gray-900 text-white py-16">
        <div className="page-container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start shopping?</h2>
          <p className="text-gray-400 mb-8">Create your free account and get access to exclusive deals.</p>
          <Link href="/auth/register" className="btn-primary text-base px-10 py-3.5 inline-block">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
