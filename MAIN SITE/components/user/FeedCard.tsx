import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { fmtRp } from "@/lib/constants";

interface FeedCardProps {
  post: {
    id: string;
    title: string;
    image_url: string;
    badge: string;
    merchants: {
      name: string;
      slug: string;
      rating: number;
    };
    menu_items?: {
      price: number;
    } | null;
  };
}

export default function FeedCard({ post }: FeedCardProps) {
  return (
    <Link href={`/merchant/${post.merchants.slug}`} className="block relative bg-white rounded-[18px] overflow-hidden shadow-sm border border-[var(--border)] group">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={post.image_url} 
          alt={post.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {post.badge && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--primary)] shadow-sm">
            {post.badge}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-[var(--text-primary)] text-sm mb-1 leading-snug line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          {post.merchants.name}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg)] px-2 py-1 rounded-md">
            <Star className="w-3 h-3 text-[var(--warning)] mr-1 fill-current" />
            {post.merchants.rating}
          </div>
          
          {post.menu_items && (
            <span className="font-bold text-[var(--primary)] text-sm">
              {fmtRp(post.menu_items.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
