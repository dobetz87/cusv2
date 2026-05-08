import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MerchantList from "@/components/user/MerchantList";
import { CATEGORIES } from "@/lib/constants";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const supabase = await createClient();
  const { q, category } = await searchParams;

  let query = supabase.from("merchants").select("*");

  if (category && category !== "semua") {
    query = query.eq("category", category);
  }

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  // Order by is_open first, then by rating
  const { data: merchants } = await query
    .order("is_open", { ascending: false })
    .order("rating", { ascending: false });

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-10">
      {/* Header & Search Bar */}
      <div className="sticky top-0 bg-white shadow-sm z-10 px-4 pt-10 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center mb-4">
          <Link href="/home" className="p-2 -ml-2 text-[var(--text-primary)]">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-bold text-lg ml-2">Eksplor Merchant</h1>
        </div>

        <form action="/search" method="GET" className="relative">
          {category && <input type="hidden" name="category" value={category} />}
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari nasi goreng, ayam geprek..."
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[14px] py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
          />
        </form>
      </div>

      <main className="px-6 py-6 animate-screen-in">
        {/* Horizontal Category Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6 mb-2">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.id || (!category && cat.id === "semua");
            return (
              <Link
                key={cat.id}
                href={`/search?category=${cat.id}${q ? `&q=${q}` : ""}`}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                  isActive
                    ? "bg-[var(--text-primary)] text-white border-[var(--text-primary)]"
                    : "bg-white text-[var(--text-secondary)] border-[var(--border)]"
                }`}
              >
                <span className="mr-1.5">{cat.emoji}</span>
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Results */}
        <div className="mt-4">
          <MerchantList merchants={merchants || []} />
        </div>
      </main>
    </div>
  );
}
