import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import OrderTracker from "@/components/user/OrderTracker";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  // Fetch Order with Driver Info
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      drivers (
        id,
        vehicle_type,
        vehicle_plat,
        rating,
        profiles (
          name,
          phone,
          avatar_url
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }

  // Verify ownership
  // Wait, RLS should block it, but just in case:
  if (order.user_id !== user.id) {
    // Note: Admin could view, but we'll stick to user logic here
    // Redirect to home if they don't own it
    redirect("/home");
  }

  // Fetch Stops
  const { data: stops } = await supabase
    .from("order_stops")
    .select("*")
    .eq("order_id", id)
    .order("position");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-[var(--border)]">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center">
            <Link href="/orders" className="p-2 -ml-2 text-[var(--text-primary)] active:scale-95 transition-transform">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-bold text-lg ml-2 text-[var(--text-primary)]">
              Pesanan #{order.id.slice(-6).toUpperCase()}
            </h1>
          </div>
        </div>
      </div>

      <main className="px-4 py-6 animate-screen-in">
        <OrderTracker initialOrder={order} orderStops={stops || []} />
      </main>
    </div>
  );
}
