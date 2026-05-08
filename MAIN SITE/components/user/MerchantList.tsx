import Link from "next/link";
import { Star, Clock } from "lucide-react";

interface MerchantListProps {
  merchants: any[];
}

export default function MerchantList({ merchants }: MerchantListProps) {
  if (!merchants || merchants.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-[var(--text-muted)]">Yah, toko tidak ditemukan 😢</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {merchants.map((merchant) => (
        <Link
          href={`/merchant/${merchant.slug}`}
          key={merchant.id}
          className="flex bg-white rounded-[18px] p-3 shadow-sm border border-[var(--border)] active:scale-[0.98] transition-transform"
        >
          {/* Image */}
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={merchant.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"}
              alt={merchant.name}
              className="w-full h-full object-cover"
            />
            {!merchant.is_open && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Tutup</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="ml-4 flex-1 flex flex-col justify-center">
            <h3 className="font-bold text-[var(--text-primary)] leading-tight mb-1">
              {merchant.name}
            </h3>
            
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mb-2">
              {merchant.description || merchant.category}
            </p>

            <div className="flex items-center text-[11px] font-medium text-[var(--text-secondary)]">
              <span className="flex items-center text-[var(--warning)] mr-3 bg-[var(--bg)] px-1.5 py-0.5 rounded-md">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {merchant.rating}
              </span>
              <span className="flex items-center text-[var(--text-muted)]">
                <Clock className="w-3 h-3 mr-1" />
                {merchant.open_hours}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
