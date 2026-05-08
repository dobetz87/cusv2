import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/shared/BottomNav";
import { User, LogOut, MapPin, Phone } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-nav">
      <div className="bg-[var(--primary)] px-6 pt-12 pb-8 text-white relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <h1 className="text-2xl font-black mb-6 relative z-10">Profil Saya</h1>
        
        <div className="flex items-center relative z-10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[var(--primary)] font-black text-2xl shadow-sm mr-4 border-2 border-white/50">
            {profile?.name?.charAt(0).toUpperCase() || profile?.phone?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="font-bold text-lg">{profile?.name || "Pelanggan Cus"}</h2>
            <p className="text-white/80 text-sm font-medium">{profile?.phone}</p>
          </div>
        </div>
      </div>

      <main className="px-4 py-6 animate-screen-in space-y-4">
        {/* Info Box */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--border)]">
          <div className="flex items-start mb-4">
            <MapPin className="w-5 h-5 text-[var(--primary)] mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium mb-0.5">Alamat Pengiriman Default</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {profile?.address || "Belum diatur"}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <User className="w-5 h-5 text-[var(--primary)] mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium mb-0.5">Peran</p>
              <p className="text-sm font-bold text-[var(--text-primary)] capitalize">
                {profile?.role || "User"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Form (Logout via Action/Client) */}
        <form action="/auth/signout" method="POST">
          <button 
            type="submit"
            className="w-full bg-red-50 text-red-600 font-bold rounded-2xl py-4 flex items-center justify-center border border-red-100 active:scale-[0.98] transition-transform"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Keluar (Logout)
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}
