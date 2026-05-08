// All screens for Cus prototype
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;
const { categories, merchants, foodFeed, user, driver, fmtRp, stripe } = window.CUS_DATA;

// ─────────────────────────────────────────────────────────────
// App context — state + actions
// ─────────────────────────────────────────────────────────────
const CusCtx = createContext(null);
const useCus = () => useContext(CusCtx);

// ─────────────────────────────────────────────────────────────
// Reusable bits
// ─────────────────────────────────────────────────────────────
const SAFE_TOP = 56;
const NAV_H = 78;

const Btn = ({ children, onClick, variant = 'primary', size = 'lg', disabled, full, style, icon }) => {
  const heights = { sm: 36, md: 44, lg: 52 };
  const styles = {
    primary: { bg: 'var(--primary)', color: '#fff', border: 'none', shadow: '0 8px 20px rgba(230, 126, 34, 0.28)' },
    secondary: { bg: 'transparent', color: 'var(--secondary)', border: '1.5px solid var(--secondary)', shadow: 'none' },
    ghost: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-primary)', border: 'none', shadow: 'none' },
    dark: { bg: 'var(--secondary)', color: '#fff', border: 'none', shadow: '0 6px 16px rgba(44,62,80,0.25)' },
  };
  const s = styles[variant];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        height: heights[size],
        background: disabled ? 'rgba(0,0,0,0.06)' : s.bg,
        color: disabled ? 'rgba(0,0,0,0.3)' : s.color,
        border: s.border, borderRadius: 14,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: size === 'lg' ? 16 : 14, fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: disabled ? 'none' : s.shadow,
        width: full ? '100%' : undefined,
        padding: '0 20px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'transform 150ms var(--ease-out), box-shadow 150ms var(--ease-out)',
        ...style,
      }}
      onPointerDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onPointerUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {icon}
      {children}
    </button>
  );
};

const Pill = ({ children, color = 'var(--primary)', bg, style }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 9px', borderRadius: 999,
    background: bg || `color-mix(in oklab, ${color} 12%, white)`,
    color, fontSize: 11, fontWeight: 700,
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    letterSpacing: 0.2, whiteSpace: 'nowrap',
    ...style,
  }}>{children}</span>
);

const Ripple = ({ children, onClick, style, as = 'button' }) => {
  const Tag = as;
  return (
    <Tag onClick={onClick} style={{
      cursor: 'pointer', border: 'none', background: 'none', padding: 0,
      textAlign: 'left', font: 'inherit', color: 'inherit', display: 'block',
      transition: 'transform 120ms var(--ease-out)',
      ...style,
    }}
    onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
    onPointerUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    onPointerLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {children}
    </Tag>
  );
};

// Header used in many screens
const ScreenHeader = ({ title, onBack, right, transparent, dark }) => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 8,
    background: transparent ? 'transparent' : 'var(--surface)',
    paddingTop: SAFE_TOP, paddingBottom: 12,
    paddingLeft: 16, paddingRight: 16,
    display: 'flex', alignItems: 'center', gap: 12,
    borderBottom: transparent ? 'none' : '1px solid var(--border)',
  }}>
    {onBack && (
      <button onClick={onBack} style={{
        width: 40, height: 40, borderRadius: 999,
        background: transparent ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.05)',
        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        backdropFilter: transparent ? 'blur(10px)' : undefined,
        boxShadow: transparent ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
      }}>
        <Icon.ArrowLeft size={20} color={dark ? '#fff' : 'var(--text-primary)'} />
      </button>
    )}
    {title && (
      <div style={{
        flex: 1,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: 18, fontWeight: 700,
        color: dark ? '#fff' : 'var(--text-primary)',
      }}>{title}</div>
    )}
    {right}
  </div>
);

// ─────────────────────────────────────────────────────────────
// GATEWAY
// ─────────────────────────────────────────────────────────────
function Gateway() {
  const { nav } = useCus();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'var(--gateway-gradient)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Decorative motion lines / dots */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.18), transparent 40%),
                          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12), transparent 35%)`,
      }} />

      {/* Top: Logo */}
      <div style={{
        flex: '0 0 38%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 28,
        paddingTop: SAFE_TOP, position: 'relative',
      }}>
        {/* Logo mark */}
        <div style={{
          width: 96, height: 96, borderRadius: 28,
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18,
          transform: mounted ? 'scale(1)' : 'scale(0.8)',
          opacity: mounted ? 1 : 0,
          transition: 'all 600ms var(--ease-out)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
        }}>
          {/* Cus mark — a stylized motion dot */}
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="#fff"/>
            <path d="M18 28 Q24 18, 32 24 T44 28" stroke="var(--primary)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <circle cx="44" cy="28" r="3.5" fill="var(--primary)"/>
          </svg>
        </div>
        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 44, fontWeight: 800, color: '#fff',
          letterSpacing: -1.5, lineHeight: 1,
          opacity: mounted ? 1 : 0, transition: 'opacity 700ms 200ms var(--ease-out)',
        }}>cus</div>
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 500,
          color: 'rgba(255,255,255,0.92)', marginTop: 4, letterSpacing: 0.3,
          opacity: mounted ? 1 : 0, transition: 'opacity 700ms 350ms var(--ease-out)',
        }}>Cus, otw! ⚡</div>
      </div>

      {/* Bottom: cards */}
      <div style={{
        flex: 1, background: 'var(--surface)',
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        padding: '28px 20px 40px',
        display: 'flex', flexDirection: 'column', gap: 14,
        boxShadow: '0 -10px 30px rgba(0,0,0,0.08)',
      }}>
        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 22, fontWeight: 700, textAlign: 'center',
          color: 'var(--text-primary)', marginBottom: 6,
        }}>Mau ngapain hari ini?</div>

        {/* Card 1 — User */}
        <Ripple
          as="div"
          onClick={() => nav('auth', { role: 'user' })}
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--primary)',
            borderRadius: 22,
            padding: '20px 18px',
            boxShadow: '0 12px 28px rgba(230,126,34,0.18)',
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            opacity: mounted ? 1 : 0,
            transition: 'all 500ms 200ms var(--ease-out)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* corner accent */}
          <div style={{
            position: 'absolute', top: -28, right: -28, width: 90, height: 90,
            borderRadius: '50%', background: 'var(--primary-light)',
          }} />
          <div style={{ position: 'relative', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 14px rgba(230,126,34,0.35)',
            }}>
              <Icon.ShoppingBag size={26} color="#fff" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: 4,
              }}>Mau Pesan</div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 13, lineHeight: 1.45,
                color: 'var(--text-secondary)',
              }}>Pesan makanan, titip belanja, antar apa aja — cus!</div>
            </div>
          </div>
          <div style={{ marginTop: 14, position: 'relative' }}>
            <Btn variant="primary" full>
              Masuk sebagai Pemesan
              <Icon.ChevronRight size={18} color="#fff" />
            </Btn>
          </div>
        </Ripple>

        {/* Card 2 — Driver */}
        <Ripple
          as="div"
          onClick={() => nav('auth', { role: 'driver' })}
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--secondary)',
            borderRadius: 22,
            padding: '20px 18px',
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            opacity: mounted ? 1 : 0,
            transition: 'all 500ms 380ms var(--ease-out)',
          }}
        >
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: 'var(--secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon.Bike size={26} color="#fff" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: 4,
              }}>Mau Jadi Driver Kami?</div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 13, lineHeight: 1.45,
                color: 'var(--text-secondary)',
              }}>Gabung jadi mitra Cus. Waktu fleksibel, cuan tiap hari.</div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <Btn variant="secondary" full>
              Daftar Jadi Driver
            </Btn>
          </div>
        </Ripple>

        <div style={{
          marginTop: 'auto', paddingTop: 16, textAlign: 'center',
          fontFamily: 'DM Sans, sans-serif', fontSize: 12,
          color: 'var(--text-muted)',
        }}>Cus — Asisten Lokal Kamu</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AUTH (login + OTP combined screen, two phases)
// ─────────────────────────────────────────────────────────────
function Auth({ params }) {
  const { nav, back, setSignedIn } = useCus();
  const role = params?.role || 'user';
  const [phase, setPhase] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('81234567890');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resend, setResend] = useState(30);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (phase === 'otp' && resend > 0) {
      const t = setTimeout(() => setResend(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [phase, resend]);

  const isPhoneValid = phone.length >= 9 && /^\d+$/.test(phone);
  const isOtpComplete = otp.every(d => d !== '');

  const sendOtp = () => {
    if (isPhoneValid) {
      setPhase('otp');
      setResend(30);
      // auto-fill demo OTP after a moment so user can see flow
      setTimeout(() => {
        ['1', '2', '3', '4'].forEach((d, i) => {
          setTimeout(() => {
            setOtp(prev => prev.map((v, idx) => idx === i ? d : v));
          }, 400 + i * 250);
        });
      }, 600);
    }
  };

  useEffect(() => {
    if (isOtpComplete) {
      setTimeout(() => {
        setSignedIn(true);
        if (role === 'driver') nav('driver-pending');
        else nav('home');
      }, 600);
    }
  }, [isOtpComplete]);

  const setOtpDigit = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1);
    setOtp(prev => prev.map((d, idx) => idx === i ? v : d));
    if (v && otpRefs.current[i + 1]) otpRefs.current[i + 1].focus();
  };

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader onBack={() => phase === 'otp' ? setPhase('phone') : back()} />

      <div style={{ padding: '0 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* mini logo */}
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <Icon.Zap size={22} color="#fff" strokeWidth={2.5} />
        </div>

        {/* role tag */}
        <div style={{ marginBottom: 8 }}>
          <Pill color={role === 'driver' ? 'var(--secondary)' : 'var(--primary)'}>
            {role === 'driver' ? 'Daftar sebagai Driver' : 'Masuk sebagai Pemesan'}
          </Pill>
        </div>

        {phase === 'phone' ? (
          <>
            <h1 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 28, fontWeight: 800, color: 'var(--text-primary)',
              margin: '0 0 8px', letterSpacing: -0.5,
            }}>Masuk ke Cus</h1>
            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 15,
              color: 'var(--text-secondary)', margin: '0 0 28px', lineHeight: 1.5,
            }}>Masukkan nomor WhatsApp kamu. Kami akan kirim kode OTP.</p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: `1.5px solid ${isPhoneValid ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 14, padding: '0 14px', height: 56,
              background: 'var(--bg)', transition: 'border 150ms',
            }}>
              <span style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 17, fontWeight: 600,
                color: 'var(--text-primary)',
              }}>+62</span>
              <div style={{ width: 1, height: 22, background: 'var(--border)' }} />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                placeholder="812 3456 7890"
                style={{
                  flex: 1, border: 'none', background: 'transparent', outline: 'none',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 17,
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <Btn full disabled={!isPhoneValid} onClick={sendOtp}>Kirim Kode OTP</Btn>
            </div>

            <p style={{
              marginTop: 'auto', paddingTop: 16,
              fontFamily: 'DM Sans, sans-serif', fontSize: 12,
              color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5,
            }}>Dengan masuk, kamu setuju dengan <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Syarat & Ketentuan</span></p>
          </>
        ) : (
          <>
            <h1 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 28, fontWeight: 800, color: 'var(--text-primary)',
              margin: '0 0 8px', letterSpacing: -0.5,
            }}>Masukkan Kode OTP</h1>
            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 15,
              color: 'var(--text-secondary)', margin: '0 0 28px', lineHeight: 1.5,
            }}>Kode dikirim ke WhatsApp <strong>+62 {phone.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')}</strong></p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
              {[0, 1, 2, 3].map(i => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  value={otp[i]}
                  onChange={e => setOtpDigit(i, e.target.value)}
                  inputMode="numeric" maxLength={1}
                  style={{
                    flex: 1, height: 64, textAlign: 'center',
                    border: `1.5px solid ${otp[i] ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 14, background: 'var(--bg)', outline: 'none',
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 28, fontWeight: 700,
                    color: 'var(--text-primary)', transition: 'border 150ms',
                  }}
                />
              ))}
            </div>

            <div style={{
              marginTop: 22, textAlign: 'center',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14,
              color: 'var(--text-secondary)',
            }}>
              {resend > 0 ? (
                <span>Kirim ulang dalam <strong>00:{resend.toString().padStart(2, '0')}</strong></span>
              ) : (
                <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setResend(30); setOtp(['','','','']); }}>
                  Kirim Ulang Kode
                </span>
              )}
            </div>

            {isOtpComplete && (
              <div style={{
                marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                color: 'var(--success)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
              }}>
                <Icon.CheckCircle size={18} color="var(--success)" />
                <span>Kode benar — masuk...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Gateway, Auth, ScreenHeader, Btn, Pill, Ripple, useCus, CusCtx, SAFE_TOP, NAV_H });
