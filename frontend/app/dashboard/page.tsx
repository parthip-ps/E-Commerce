"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Package, User, LogOut, TrendingUp, Star, Shield } from "lucide-react";
import { useAuth } from "../components/AuthProvider";
import { useCart } from "../components/CartProvider";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { cart, fetchCart, itemCount } = useCart();
  const router = useRouter();
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login?callbackUrl=/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && !cartLoaded) {
      fetchCart();
      setCartLoaded(true);
    }
  }, [isAuthenticated, cartLoaded, fetchCart]);

  if (isLoading) {
    return (
      <div className="page-container py-12">
        <div className="space-y-4">
          <div className="h-10 w-64 skeleton rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 skeleton rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { label: "Cart Items", value: itemCount, icon: ShoppingCart, color: "bg-blue-50 text-blue-700", link: "/cart" },
    { label: "Cart Total", value: `$${cart.total.toFixed(2)}`, icon: TrendingUp, color: "bg-green-50 text-green-700", link: "/cart" },
    { label: "Account Type", value: user.role === "admin" ? "Admin" : "Member", icon: user.role === "admin" ? Shield : User, color: user.role === "admin" ? "bg-purple-50 text-purple-700" : "bg-gray-50 text-gray-700", link: "#" },
  ];

  return (
    <div className="page-container py-8 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} href={link} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { href: "/products", icon: Package, label: "Browse Products", desc: "Explore our catalog" },
              { href: "/cart", icon: ShoppingCart, label: `View Cart (${itemCount} items)`, desc: `Total: $${cart.total.toFixed(2)}` },
              { href: "/products?featured=true", icon: Star, label: "Featured Products", desc: "Handpicked deals" },
              ...(user.role === "admin" ? [{ href: "/dashboard/admin", icon: Shield, label: "Admin Panel", desc: "Manage products & users" }] : []),
            ].map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Profile */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Your Profile</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl flex-shrink-0">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className={`badge mt-1 ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                {user.role === "admin" ? "🛡️ Admin" : "👤 Member"}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            <p><span className="font-medium">Account ID:</span> <span className="font-mono text-xs">{user.id}</span></p>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      {cart.items.length > 0 && (
        <div className="card p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Cart Summary</h2>
            <Link href="/cart" className="text-sm text-blue-600 hover:underline">View full cart</Link>
          </div>
          <div className="space-y-2">
            {cart.items.slice(0, 3).map((item) => (
              <div key={item.productId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700 line-clamp-1 flex-1">{item.name}</span>
                <span className="text-sm text-gray-500 mx-4">×{item.quantity}</span>
                <span className="text-sm font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {cart.items.length > 3 && (
              <p className="text-xs text-gray-500 text-center pt-1">+{cart.items.length - 3} more items</p>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-blue-600 text-lg">${cart.total.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/cart" className="btn-primary w-full text-center mt-4 block">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
