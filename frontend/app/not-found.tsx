import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container py-24 text-center page-transition">
      <p className="text-8xl mb-6">🔍</p>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404 — Page Not Found</h1>
      <p className="text-gray-500 text-lg mb-8">The page you're looking for doesn't exist.</p>
      <div className="flex gap-4 justify-center">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/products" className="btn-secondary">Browse Products</Link>
      </div>
    </div>
  );
}
