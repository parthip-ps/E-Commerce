// Server Component — SSR with dynamic search params
import { Suspense } from "react";
import type { Metadata } from "next";
import { getProductsSSR, getCategoriesSSR } from "@/lib/api";
import type { Product, PaginatedResponse } from "@/types";
import ProductCard from "../components/ProductCard";
import ProductFiltersClient from "./ProductFiltersClient";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our full product catalog",
};

interface PageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = 12;

  const params: Record<string, string> = {
    page: String(page),
    limit: String(limit),
    ...(searchParams.category && { category: searchParams.category }),
    ...(searchParams.search && { search: searchParams.search }),
    ...(searchParams.sort && { sort: searchParams.sort }),
    ...(searchParams.minPrice && { minPrice: searchParams.minPrice }),
    ...(searchParams.maxPrice && { maxPrice: searchParams.maxPrice }),
  };

  let productsData: PaginatedResponse<Product> | null = null;
  let categories: string[] = [];

  try {
    [productsData, categories] = await Promise.all([
      getProductsSSR(params) as Promise<PaginatedResponse<Product>>,
      getCategoriesSSR().then((r: any) => r.data || []),
    ]);
  } catch (err) {
    return (
      <div className="page-container py-20 text-center">
        <p className="text-red-600 text-lg font-medium">Failed to load products. Make sure the backend is running.</p>
        <p className="text-gray-500 mt-2 text-sm">Backend: http://localhost:5000</p>
      </div>
    );
  }

  const products = productsData?.data || [];
  const pagination = productsData?.pagination;

  const buildPageUrl = (p: number) => {
    const sp = new URLSearchParams({ ...params, page: String(p) });
    return `/products?${sp.toString()}`;
  };

  return (
    <div className="page-container py-8 page-transition">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {searchParams.category ? `${searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)}` : "All Products"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {pagination?.total ?? 0} products found
            {searchParams.search && ` for "${searchParams.search}"`}
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters — Client Component */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <ProductFiltersClient
            categories={categories}
            currentFilters={searchParams}
          />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Mobile Filters */}
          <div className="lg:hidden mb-4">
            <ProductFiltersClient categories={categories} currentFilters={searchParams} mobile />
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-xl font-semibold text-gray-900">No products found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              <Link href="/products" className="btn-primary mt-6 inline-block">Clear Filters</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 4} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {pagination.hasPrev && (
                    <Link href={buildPageUrl(page - 1)} className="flex items-center gap-1 btn-secondary py-2 px-4 text-sm">
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </Link>
                  )}

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <Link
                          key={p}
                          href={buildPageUrl(p)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </Link>
                      );
                    })}
                  </div>

                  {pagination.hasNext && (
                    <Link href={buildPageUrl(page + 1)} className="flex items-center gap-1 btn-secondary py-2 px-4 text-sm">
                      Next <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
