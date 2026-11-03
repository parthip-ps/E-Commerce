"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { useCart } from "../../components/CartProvider";
import type { Product } from "@/types";
import Link from "next/link";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    if (product.stock === 0) return;
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (_) {}
    finally { setAdding(false); }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="p-2.5 hover:bg-gray-100 transition-colors text-gray-700"
            disabled={qty <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold text-gray-900">{qty}</span>
          <button
            onClick={() => setQty(Math.min(product.stock, qty + 1))}
            className="p-2.5 hover:bg-gray-100 transition-colors text-gray-700"
            disabled={qty >= product.stock}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-gray-500">{product.stock} available</span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAdd}
        disabled={adding || product.stock === 0}
        className={`flex items-center justify-center gap-3 py-3.5 px-8 rounded-xl font-bold text-base transition-all duration-300 ${
          added
            ? "bg-green-600 text-white"
            : product.stock === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-blue-200"
        }`}
      >
        {adding ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding...
          </>
        ) : added ? (
          <>
            <Check className="w-5 h-5" />
            Added to Cart!
          </>
        ) : product.stock === 0 ? (
          "Out of Stock"
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart — ${(product.price * qty).toFixed(2)}
          </>
        )}
      </button>

      {added && (
        <Link
          href="/cart"
          className="text-center text-sm text-blue-600 hover:underline font-medium"
        >
          View Cart →
        </Link>
      )}
    </div>
  );
}
