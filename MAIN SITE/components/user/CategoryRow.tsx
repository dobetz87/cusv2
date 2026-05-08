"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryRow() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 hide-scrollbar">
      {CATEGORIES.map((category) => (
        <Link
          href={`/search?category=${category.id}`}
          key={category.id}
          className="flex flex-col items-center gap-2 min-w-[72px]"
        >
          <div className="w-14 h-14 rounded-[18px] bg-white flex items-center justify-center text-2xl shadow-sm border border-[var(--border)]">
            {category.emoji}
          </div>
          <span className="text-xs font-semibold text-[var(--text-secondary)]">{category.label}</span>
        </Link>
      ))}
    </div>
  );
}
