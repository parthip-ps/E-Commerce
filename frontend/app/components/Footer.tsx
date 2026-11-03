import Link from "next/link";
import { Package } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Package className="w-6 h-6 text-blue-400" />
              ShopNext
            </Link>
            <p className="text-sm">Modern e-commerce built with Next.js 14 and Node.js.</p>
          </div>
          {[
            { title: "Shop", links: [["Products", "/products"], ["Electronics", "/products?category=electronics"], ["Sports", "/products?category=sports"], ["Home & Garden", "/products?category=home"]] },
            { title: "Account", links: [["Sign In", "/auth/login"], ["Register", "/auth/register"], ["Dashboard", "/dashboard"], ["Cart", "/cart"]] },
            { title: "Info", links: [["About", "#"], ["Contact", "#"], ["Privacy Policy", "#"], ["Terms", "#"]] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-3">{title}</h3>
              <ul className="space-y-2 text-sm">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center">
          © {new Date().getFullYear()} ShopNext. Built with Next.js 14 + Node.js + JWT Auth.
        </div>
      </div>
    </footer>
  );
}
