"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAuth } from "../components/AuthProvider";
import { useCart } from "../components/CartProvider";

export default function CartPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart, fetchCart, isLoading: cartLoading } = useCart();
  const router = useRouter();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login?callbackUrl=/cart");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && !fetched) {
      fetchCart();
      setFetched(true);
    }
  }, [isAuthenticated, fetched, fetchCart]);

  if (isLoading || !isAuthenticated) return (
    <div className="page-container py-12">
      <div className="h-96 skeleton rounded-xl" />
    </div>
  );

  if (cart.items.length === 0) {
    return (
      <div className="page-container py-20 text-center page-transition">
        <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to your cart and they'll appear here.</p>
        <Link href="/products" className="btn-primary inline-block">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8 page-transition">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/products" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <span className="badge bg-blue-100 text-blue-700">{cart.items.reduce((a, i) => a + i.quantity, 0)} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <div key={item.productId} className="card p-4 flex gap-4 items-center">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productId}`} className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 text-sm">
                  {item.name}
                </Link>
                <p className="text-blue-600 font-bold mt-0.5">${item.price.toFixed(2)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1 || cartLoading}
                  className="p-2 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  disabled={cartLoading}
                  className="p-2 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  disabled={cartLoading}
                  className="mt-1 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={clearCart}
              disabled={cartLoading}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5 font-medium"
            >
              <Trash2 className="w-4 h-4" /> Clear Cart
            </button>
            <Link href="/products" className="text-sm text-blue-600 hover:underline">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={cart.total >= 50 ? "text-green-600 font-medium" : "text-gray-900"}>
                  {cart.total >= 50 ? "FREE" : "$9.99"}
                </span>
              </div>
              {cart.total < 50 && (
                <p className="text-xs text-blue-600 bg-blue-50 rounded-lg p-2">
                  Add ${(50 - cart.total).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${(cart.total * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-5">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-bold text-blue-600 text-xl">
                  ${(cart.total + (cart.total < 50 ? 9.99 : 0) + cart.total * 0.1).toFixed(2)}
                </span>
              </div>
            </div>

            <button className="btn-primary w-full py-3.5 text-base">
              Proceed to Checkout
            </button>
            <p className="text-xs text-center text-gray-400 mt-3">
              🔒 Secured with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
