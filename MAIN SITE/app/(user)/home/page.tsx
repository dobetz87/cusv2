import Link from "next/link";
import { Search } from "lucide-react";
import CategoryRow from "@/components/user/CategoryRow";
import FeedCard from "@/components/user/FeedCard";
import OrderCepatBanner from "@/components/user/OrderCepatBanner";
import BottomNav from "@/components/shared/BottomNav";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, phone")
    .eq("id", user?.id)
    .single();

  const { data: posts } = await supabase
    .from("feed_posts")
    .select(`
      id,
      title,
      image_url,
      badge,
      merchants ( name, slug, rating ),
      menu_items ( price )
    `)
    .order("created_at", { ascending: false });

  const displayName = profile?.name || profile?.phone || "Pelanggan";

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-nav">
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-4 shadow-sm z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[var(--text-secondary)] text-sm mb-1">Cus Antar Ke,</p>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Lokasi Saat Ini 📍
            </h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] font-bold text-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Search */}
        <Link href="/search" className="flex items-center px-4 py-3 bg-[var(--bg)] rounded-[14px] text-[var(--text-muted)] border border-[var(--border)] active:scale-[0.98] transition-transform">
          <Search className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">Mau makan atau pesan apa hari ini?</span>
        </Link>
      </div>

      <main className="px-6 py-6 space-y-8 animate-screen-in">
        {/* Categories */}
        <CategoryRow />

        {/* Order Cepat Banner */}
        <OrderCepatBanner />

        {/* Feed: Lagi Rame */}
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            Lagi Rame 🔥
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {posts?.map((post: any) => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
