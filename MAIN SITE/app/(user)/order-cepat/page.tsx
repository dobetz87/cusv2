import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CepatForm from "@/components/user/CepatForm";

export default async function OrderCepatPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-[var(--border)]">
        <div className="flex items-center px-4 h-14">
          <Link href="/home" className="p-2 -ml-2 text-[var(--text-primary)] active:scale-95 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-bold text-lg ml-2 text-[var(--text-primary)]">
            Order Cepat ⚡
          </h1>
        </div>
      </div>

      <main className="px-6 py-6 animate-screen-in">
        <div className="mb-6">
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            Nggak nemu toko yang kamu cari? Tulis aja mau pesen apa, nanti driver kita yang carikan dan belikan!
          </p>
        </div>

        <CepatForm userId={user.id} />
      </main>
    </div>
  );
}
