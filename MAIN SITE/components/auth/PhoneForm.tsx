"use client";

import { useState } from "react";
import { normalizePhone, isValidPhone } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface PhoneFormProps {
  onSuccess: (phone: string) => void;
}

export default function PhoneForm({ onSuccess }: PhoneFormProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isValidPhone(phone)) {
      setError("Nomor HP tidak valid. Minimal 9 digit.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const normalized = normalizePhone(phone);

    const { error: err } = await supabase.auth.signInWithOtp({
      phone: normalized,
      options: {
        channel: 'whatsapp',
      },
    });

    setLoading(false);

    if (err) {
      setError(err.message || "Gagal mengirim OTP. Coba lagi.");
      return;
    }

    onSuccess(normalized);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5 animate-screen-in">
      <div className="space-y-2">
        <label
          htmlFor="phone-input"
          className="block text-sm font-semibold text-[var(--text-secondary)]"
        >
          Nomor HP
        </label>

        {/* Phone input with +62 prefix */}
        <div
          className="flex items-center rounded-[14px] border-2 border-[var(--border)] bg-white overflow-hidden
                     focus-within:border-[var(--primary)] transition-colors"
        >
          <span className="px-4 py-4 text-[var(--text-secondary)] font-semibold text-base border-r border-[var(--border)] bg-[var(--primary-light)] whitespace-nowrap">
            +62
          </span>
          <input
            id="phone-input"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="81234567890"
            className="flex-1 px-4 py-4 text-base outline-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            autoComplete="tel-national"
            autoFocus
          />
        </div>

        {error && (
          <p className="text-sm text-[var(--error)] font-medium">{error}</p>
        )}
      </div>

      <button
        id="btn-kirim-otp"
        type="submit"
        disabled={loading || phone.length < 9}
        className="w-full py-4 rounded-[14px] bg-[var(--primary)] text-white font-bold text-base
                   font-[family-name:var(--font-plus-jakarta)] shadow-[0_4px_16px_rgba(230,126,34,0.4)]
                   hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
            </svg>
            Mengirim...
          </span>
        ) : (
          "Kirim Kode OTP →"
        )}
      </button>
    </form>
  );
}
