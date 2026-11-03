"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, TrendingDown } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "./CartProvider";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (_) {}
    finally { setAdding(false); }
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating));

  return (
    <Link href={`/products/${product.id}`} className="product-card card group flex flex-col hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="product-image object-cover transition-transform duration-300"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">📦</div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge bg-red-500 text-white flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" /> -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="badge bg-blue-500 text-white">Featured</span>
          )}
        </div>

        {/* Stock warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-2 left-2 badge bg-orange-100 text-orange-700">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex-1">
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mt-0.5 leading-snug">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex gap-0.5">
              {stars.map((filled, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${filled ? "star-filled fill-current" : "star-empty"}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {discount > 0 && (
              <span className="ml-2 text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              added
                ? "bg-green-100 text-green-700"
                : product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white"
            }`}
            title={product.stock === 0 ? "Out of stock" : "Add to cart"}
          >
            {adding ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>

        {product.stock === 0 && (
          <p className="text-xs text-red-500 font-medium text-center">Out of Stock</p>
        )}
      </div>
    </Link>
  );
}
