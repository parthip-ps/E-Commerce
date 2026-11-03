// Static Site Generation with ISR for product pages
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, ArrowLeft, Shield, Truck, Package } from "lucide-react";
import { getProductSSR, getProductsSSR } from "@/lib/api";
import type { Product, PaginatedResponse } from "@/types";
import AddToCartButton from "./AddToCartButton";

interface PageProps {
  params: { id: string };
}

// ISR: revalidate every 5 minutes
export const revalidate = 300;

// Generate static paths for top products (SSG)
export async function generateStaticParams() {
  try {
    const data = await getProductsSSR({ limit: "12" }) as PaginatedResponse<Product>;
    return (data.data || []).map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

// Dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const res = await getProductSSR(params.id) as { data: Product };
    const p = res.data;
    return {
      title: p.name,
      description: p.description.slice(0, 160),
      openGraph: { title: p.name, description: p.description, images: p.images },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  let product: Product;
  try {
    const res = await getProductSSR(params.id) as { data: Product };
    product = res.data;
  } catch {
    notFound();
  }

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating));

  return (
    <div className="page-container py-8 page-transition">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-blue-600 capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
            )}
            {discount > 0 && (
              <div className="absolute top-4 left-4 badge bg-red-500 text-white text-sm px-3 py-1">
                -{discount}% OFF
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-blue-400 transition-colors">
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <Link
              href={`/products?category=${product.category}`}
              className="text-blue-600 text-sm font-medium uppercase tracking-wide hover:underline capitalize"
            >
              {product.brand} · {product.category}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 leading-tight">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {stars.map((filled, i) => (
                <Star key={i} className={`w-5 h-5 ${filled ? "star-filled fill-current" : "star-empty"}`} />
              ))}
            </div>
            <span className="font-semibold text-gray-900">{product.rating}</span>
            <span className="text-gray-500 text-sm">({product.reviewCount.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
            {discount > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="badge bg-green-100 text-green-700 text-sm">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-orange-500" : "bg-red-500"}`} />
            <span className={`text-sm font-medium ${product.stock > 10 ? "text-green-700" : product.stock > 0 ? "text-orange-700" : "text-red-700"}`}>
              {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left!` : "Out of Stock"}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="badge bg-gray-100 text-gray-600 text-xs px-3 py-1">#{tag}</span>
            ))}
          </div>

          {/* Add to Cart — Client Component */}
          <AddToCartButton product={product} />

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            {[
              { icon: Shield, text: "Secure Checkout" },
              { icon: Truck, text: "Free Shipping $50+" },
              { icon: Package, text: "Easy Returns" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-lg text-center">
                <Icon className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-gray-600 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="mt-10">
        <Link href="/products" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    </div>
  );
}
