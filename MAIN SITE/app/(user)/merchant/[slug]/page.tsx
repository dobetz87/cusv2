import { notFound } from "next/navigation";
import { ArrowLeft, Star, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MenuItem from "@/components/user/MenuItem";
import CartFloating from "@/components/user/CartFloating";

export default async function MerchantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();
  const { slug } = await params;

  // Fetch merchant
  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!merchant) {
    notFound();
  }

  // Fetch menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("merchant_id", merchant.id)
    .order("category")
    .order("name");

  // Group items by category
  const categorizedMenu: Record<string, any[]> = {};
  menuItems?.forEach((item) => {
    const cat = item.category || "Lainnya";
    if (!categorizedMenu[cat]) categorizedMenu[cat] = [];
    categorizedMenu[cat].push(item);
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      {/* Header & Cover Image */}
      <div className="relative h-48 bg-gray-200">
        {merchant.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={merchant.image_url}
            alt={merchant.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
        
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <Link href="/search" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Merchant Info Card */}
      <div className="relative -mt-6 px-4 z-10 animate-slide-up">
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-[var(--border)]">
          <h1 className="font-bold text-xl text-[var(--text-primary)] mb-1">
            {merchant.name}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            {merchant.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[var(--text-secondary)]">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-[var(--warning)] mr-1 fill-current" />
              <span className="text-[var(--text-primary)]">{merchant.rating}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-[var(--primary)]" />
              {merchant.open_hours}
            </div>
            {merchant.address && (
              <div className="flex items-center w-full mt-1 text-[var(--text-muted)] font-normal line-clamp-1">
                <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                {merchant.address}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-4 mt-6">
        {Object.entries(categorizedMenu).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h3 className="font-bold text-lg text-[var(--text-primary)] mb-3 capitalize">
              {category}
            </h3>
            <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden px-4">
              {items.map((item) => (
                <MenuItem key={item.id} item={item} merchant={merchant} />
              ))}
            </div>
          </div>
        ))}

        {menuItems?.length === 0 && (
          <div className="text-center py-10 text-[var(--text-muted)]">
            Menu belum tersedia.
          </div>
        )}
      </div>

      <CartFloating />
    </div>
  );
}
