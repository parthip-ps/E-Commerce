"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface Props {
  categories: string[];
  currentFilters: Record<string, string | undefined>;
  mobile?: boolean;
}

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rating" },
  { value: "newest", label: "Newest" },
];

export default function ProductFiltersClient({ categories, currentFilters, mobile }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentFilters.search || "");
  const [showMobile, setShowMobile] = useState(false);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const clearAll = () => {
    setSearch("");
    router.push("/products");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", search);
  };

  const hasFilters = Object.values(currentFilters).some(Boolean);

  const FiltersContent = () => (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Search</label>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field text-sm py-2"
          />
          <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-shrink-0">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Category</label>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter("category", "")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !currentFilters.category ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter("category", cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                currentFilters.category === cat ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Sort By</label>
        <select
          value={currentFilters.sort || ""}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="input-field text-sm py-2"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentFilters.minPrice}
            onBlur={(e) => updateFilter("minPrice", e.target.value)}
            className="input-field text-sm py-2 w-1/2"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentFilters.maxPrice}
            onBlur={(e) => updateFilter("maxPrice", e.target.value)}
            className="input-field text-sm py-2 w-1/2"
          />
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button onClick={clearAll} className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
          <X className="w-4 h-4" /> Clear All Filters
        </button>
      )}
    </div>
  );

  if (mobile) {
    return (
      <>
        <button
          onClick={() => setShowMobile(!showMobile)}
          className="flex items-center gap-2 btn-secondary text-sm w-full justify-center"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters & Sort {hasFilters && <span className="badge bg-blue-100 text-blue-700">Active</span>}
        </button>
        {showMobile && (
          <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <FiltersContent />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="card p-4 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-red-600 hover:underline">Clear all</button>
        )}
      </div>
      <FiltersContent />
    </div>
  );
}
