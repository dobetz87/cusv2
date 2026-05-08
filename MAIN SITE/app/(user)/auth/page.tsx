"use client";

import { useState } from "react";
import PhoneForm from "@/components/auth/PhoneForm";
import OtpForm from "@/components/auth/OtpForm";

type Step = "phone" | "otp";

export default function AuthPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
          style={{ background: "var(--bg)" }}>

      {/* Logo + Brand */}
      <div className="mb-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[18px] mb-4
                        shadow-[0_8px_32px_rgba(230,126,34,0.35)]"
             style={{ background: "var(--gateway-gradient)" }}>
          <span className="text-white text-3xl font-black font-[family-name:var(--font-plus-jakarta)]">
            C
          </span>
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]
                       font-[family-name:var(--font-plus-jakarta)]">
          cus
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {step === "phone" ? "Masuk atau daftar dengan nomor HP" : "Masukkan kode OTP"}
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-[24px] p-6
                      shadow-[0_8px_32px_rgba(44,62,80,0.12)]">
        {step === "phone" ? (
          <PhoneForm
            onSuccess={(p) => {
              setPhone(p);
              setStep("otp");
            }}
          />
        ) : (
          <OtpForm
            phone={phone}
            onBack={() => setStep("phone")}
          />
        )}
      </div>

      {/* Footer note */}
      <p className="mt-8 text-xs text-center text-[var(--text-muted)] max-w-xs animate-fade-in">
        Dengan masuk, kamu menyetujui syarat & ketentuan penggunaan Cus.
      </p>
    </main>
  );
}
