"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface OtpFormProps {
  phone: string;
  onBack: () => void;
}

export default function OtpForm({ phone, onBack }: OtpFormProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleDigitChange(idx: number, val: string) {
    const char = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = char;
    setDigits(next);

    if (char && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }

    // Auto-submit when all filled
    if (char && idx === 5 && next.every(Boolean)) {
      verifyOtp(next.join(""));
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const next = pasted.split("");
      setDigits(next);
      inputRefs.current[5]?.focus();
      verifyOtp(pasted);
    }
  }

  async function verifyOtp(token: string) {
    setError("");
    setLoading(true);
    const supabase = createClient();

    const { error: err } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (err) {
      setLoading(false);
      setError("Kode OTP salah atau sudah kadaluarsa.");
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }

    // Upsert profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        phone,
        role: "user",
      }, { onConflict: "id" });
    }

    router.push("/home");
  }

  async function handleResend() {
    if (!canResend) return;
    setError("");
    setCanResend(false);
    setCountdown(30);

    const supabase = createClient();
    await supabase.auth.signInWithOtp({ phone });
  }

  const displayPhone = phone.replace("+62", "0");

  return (
    <div className="w-full space-y-6 animate-screen-in">
      <div className="text-center space-y-1">
        <p className="text-[var(--text-secondary)] text-sm">
          Kode OTP dikirim ke
        </p>
        <p className="font-bold text-[var(--text-primary)]">{displayPhone}</p>
      </div>

      {/* 6-digit OTP boxes */}
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-2xl font-bold rounded-[14px] border-2
                       border-[var(--border)] bg-white outline-none
                       focus:border-[var(--primary)] transition-colors
                       text-[var(--text-primary)]"
            autoFocus={i === 0}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-[var(--error)] font-medium">{error}</p>
      )}

      <button
        id="btn-verify-otp"
        type="button"
        onClick={() => verifyOtp(digits.join(""))}
        disabled={loading || digits.some((d) => !d)}
        className="w-full py-4 rounded-[14px] bg-[var(--primary)] text-white font-bold text-base
                   font-[family-name:var(--font-plus-jakarta)] shadow-[0_4px_16px_rgba(230,126,34,0.4)]
                   hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {loading ? "Memverifikasi..." : "Verifikasi OTP"}
      </button>

      {/* Resend + back */}
      <div className="flex items-center justify-between text-sm">
        <button
          id="btn-back-phone"
          type="button"
          onClick={onBack}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          ← Ganti nomor
        </button>

        {canResend ? (
          <button
            id="btn-resend-otp"
            type="button"
            onClick={handleResend}
            className="text-[var(--primary)] font-semibold hover:underline"
          >
            Kirim ulang OTP
          </button>
        ) : (
          <span className="text-[var(--text-muted)]">
            Kirim ulang ({countdown}s)
          </span>
        )}
      </div>
    </div>
  );
}
