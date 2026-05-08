import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CheckoutForm from "@/components/user/CheckoutForm";

export default async function CheckoutPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  // Get user profile for default address
  const { data: profile } = await supabase
    .from("profiles")
    .select("address")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-[var(--border)]">
        <div className="flex items-center px-4 h-14">
          <Link href="/search" className="p-2 -ml-2 text-[var(--text-primary)] active:scale-95 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-bold text-lg ml-2 text-[var(--text-primary)]">
            Checkout
          </h1>
        </div>
      </div>

      <main className="px-4 py-6 animate-screen-in">
        <CheckoutForm userId={user.id} defaultAddress={profile?.address || ""} />
      </main>
    </div>
  );
}
