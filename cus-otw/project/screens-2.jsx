// Home screen + Bottom Nav for Cus
const { categories: cats2, merchants: ms2, foodFeed: ff2, user: u2, fmtRp: rp2 } = window.CUS_DATA;

// ─────────────────────────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────────────────────────
function BottomNav() {
  const { screen, nav, cartCount } = useCus();
  const tabs = [
    { id: 'home', label: 'Beranda', icon: Icon.Home },
    { id: 'search', label: 'Cari', icon: Icon.Search },
    { id: 'order-cepat', label: 'Cus!', icon: Icon.Zap, hero: true },
    { id: 'orders', label: 'Pesanan', icon: Icon.ClipboardList },
    { id: 'profile', label: 'Profil', icon: Icon.User },
  ];

  const isActive = (id) => {
    if (id === 'home') return screen === 'home';
    if (id === 'order-cepat') return screen === 'order-cepat';
    if (id === 'orders') return ['orders', 'tracking'].includes(screen);
    if (id === 'profile') return screen === 'profile';
    if (id === 'search') return screen === 'search';
    return false;
  };

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
      paddingBottom: 18, paddingLeft: 8, paddingRight: 8,
      background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.95) 35%, var(--surface))',
      pointerEvents: 'none',
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 28,
        margin: '0 8px', padding: '8px 6px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        pointerEvents: 'auto',
      }}>
        {tabs.map(t => {
          const active = isActive(t.id);
          if (t.hero) {
            return (
              <button key={t.id} onClick={() => nav(t.id)} style={{
                width: 60, height: 60, marginTop: -28,
                borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(230,126,34,0.45), inset 0 1px 0 rgba(255,255,255,0.3)',
                color: '#fff',
              }}>
                <t.icon size={26} color="#fff" strokeWidth={2.5} />
                <div style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 10, fontWeight: 800,
                  marginTop: 1, letterSpacing: 0.3,
                }}>{t.label}</div>
              </button>
            );
          }
          return (
            <button key={t.id} onClick={() => nav(t.id)} style={{
              flex: 1, height: 56, border: 'none', background: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 3, cursor: 'pointer', position: 'relative',
              color: active ? 'var(--primary)' : 'var(--text-muted)',
            }}>
              <div style={{ position: 'relative' }}>
                <t.icon size={22} color={active ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth={active ? 2.2 : 1.75} />
                {t.id === 'orders' && cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -6, right: -8,
                    background: 'var(--error)', color: '#fff',
                    fontSize: 10, fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif',
                    minWidth: 16, height: 16, padding: '0 4px',
                    borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1.5px solid var(--surface)',
                  }}>{cartCount}</span>
                )}
              </div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 10,
                fontWeight: active ? 700 : 500,
              }}>{t.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────
function Home() {
  const { nav, cart, addToCart } = useCus();
  const [showAddrSheet, setShowAddrSheet] = useState(false);
  const featured = ms2.filter(m => m.is_featured);
  const others = ms2.filter(m => !m.is_featured);

  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--bg)',
      overflowY: 'auto', overflowX: 'hidden',
      paddingBottom: NAV_H + 16,
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 8,
        background: 'var(--surface)',
        paddingTop: SAFE_TOP, paddingLeft: 16, paddingRight: 16, paddingBottom: 12,
        borderBottom: '1px solid var(--border)',
      }}>
        <Ripple onClick={() => setShowAddrSheet(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
        }}>
          <Icon.MapPin size={16} color="var(--primary)" />
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)' }}>
            Antar ke
          </div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {u2.address.label}
          </div>
          <Icon.ChevronDown size={14} color="var(--text-muted)" />
        </Ripple>

        {/* Search */}
        <div style={{
          height: 44, borderRadius: 14, background: 'var(--bg)',
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 14px',
        }}>
          <Icon.Search size={18} color="var(--text-muted)" />
          <input
            placeholder="Cari makanan, toko, atau apa aja..."
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14,
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Order Cepat banner */}
      <div style={{ padding: '16px 16px 0' }}>
        <Ripple onClick={() => nav('order-cepat')} style={{
          width: '100%', borderRadius: 22,
          background: 'var(--order-cepat-gradient)',
          padding: '18px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 12px 28px rgba(230,126,34,0.35)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* shine */}
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 130, height: 130,
            borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
          }} />
          <div style={{
            width: 50, height: 50, borderRadius: 16, flexShrink: 0,
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.4)',
          }}>
            <Icon.Zap size={26} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1, color: '#fff', position: 'relative' }}>
            <div style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 800,
              letterSpacing: -0.3, marginBottom: 2,
            }}>ORDER CEPAT</div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              opacity: 0.95, lineHeight: 1.35,
            }}>Ketik apa aja, kami yang urus ✨</div>
          </div>
          <Icon.ChevronRight size={22} color="#fff" strokeWidth={2.5} />
        </Ripple>
      </div>

      {/* Categories */}
      <div style={{
        marginTop: 18, paddingLeft: 16,
        display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, paddingRight: 16,
        scrollbarWidth: 'none',
      }}>
        {cats2.map(c => {
          const Ic = ({
            makanan: Icon.UtensilsCrossed, minuman: Icon.Coffee,
            kebutuhan_harian: Icon.ShoppingBag, laundry: Icon.Shirt,
            dokumen: Icon.FileText, belanja_pasar: Icon.Apple,
            custom: Icon.MoreHorizontal,
          })[c.id];
          return (
            <Ripple key={c.id} onClick={() => nav('search', { cat: c.id })} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 6, minWidth: 56,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `color-mix(in oklab, ${c.tone} 12%, white)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {Ic && <Ic size={26} color={c.tone} strokeWidth={1.8} />}
              </div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fontWeight: 600,
                color: 'var(--text-primary)', textAlign: 'center', whiteSpace: 'nowrap',
              }}>{c.label}</div>
            </Ripple>
          );
        })}
      </div>

      {/* Lagi Rame Dipesan */}
      <div style={{ marginTop: 22 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', marginBottom: 12,
        }}>
          <Icon.Flame size={20} color="#E74C3C" />
          <div style={{
            flex: 1,
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 800,
            color: 'var(--text-primary)', letterSpacing: -0.3,
          }}>Lagi Rame Dipesan</div>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--primary)', fontWeight: 600,
          }}>Lihat semua →</div>
        </div>
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 16, paddingRight: 16, paddingBottom: 8,
          scrollbarWidth: 'none',
        }}>
          {ff2.map(f => {
            const m = ms2.find(x => x.id === f.merchant_id);
            const item = m.menu.find(i => i.id === f.item_id);
            return (
              <Ripple key={f.item_id} onClick={() => nav('merchant', { id: m.id })} style={{
                width: 152, flexShrink: 0,
                background: 'var(--surface)', borderRadius: 18,
                padding: 8,
                boxShadow: 'var(--card-shadow)',
              }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: 12,
                  background: `url(${f.image}) center/cover`,
                  position: 'relative',
                  marginBottom: 8,
                }}>
                  {f.badge && (
                    <div style={{
                      position: 'absolute', top: 8, left: 8,
                      padding: '3px 8px', borderRadius: 999,
                      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                      color: '#fff', fontSize: 10, fontWeight: 700,
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}>🔥 {f.badge}</div>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); addToCart(m.id, item, 1); }} style={{
                    position: 'absolute', bottom: 6, right: 6,
                    width: 32, height: 32, borderRadius: '50%', border: 'none',
                    background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)', cursor: 'pointer',
                  }}>
                    <Icon.Plus size={18} color="#fff" strokeWidth={2.5} />
                  </button>
                </div>
                <div style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
                  color: 'var(--text-primary)', marginBottom: 2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{f.item_name}</div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--text-muted)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  marginBottom: 4,
                }}>{f.merchant_name}</div>
                <div style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 800,
                  color: 'var(--primary)',
                }}>{rp2(f.price)}</div>
              </Ripple>
            );
          })}
        </div>
      </div>

      {/* Pilihan Cus (Featured) */}
      <div style={{ marginTop: 22, padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Icon.Sparkles size={20} color="var(--primary)" />
          <div style={{
            flex: 1,
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 800,
            color: 'var(--text-primary)', letterSpacing: -0.3,
          }}>Pilihan Cus</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {featured.map(m => <MerchantCard key={m.id} merchant={m} variant="banner" />)}
        </div>
      </div>

      {/* Semua Merchant */}
      <div style={{ marginTop: 22, padding: '0 16px' }}>
        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 800,
          color: 'var(--text-primary)', letterSpacing: -0.3, marginBottom: 12,
        }}>Semua Merchant</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {others.map(m => <MerchantCard key={m.id} merchant={m} variant="row" />)}
        </div>
      </div>

      {/* Address sheet */}
      {showAddrSheet && (
        <BottomSheet onClose={() => setShowAddrSheet(false)} title="Alamat Tersimpan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Rumah', icon: '🏠', addr: u2.address.full, active: true },
              { label: 'Kantor', icon: '🏢', addr: 'Jl. Veteran No. 8, Pujon', active: false },
            ].map(a => (
              <div key={a.label} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: 14, borderRadius: 14,
                background: a.active ? 'var(--primary-light)' : 'var(--bg)',
                border: a.active ? '1.5px solid var(--primary)' : '1.5px solid transparent',
              }}>
                <div style={{ fontSize: 22 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}>{a.label}</div>
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)',
                    marginTop: 2,
                  }}>{a.addr}</div>
                </div>
                {a.active && <Icon.Check size={18} color="var(--primary)" strokeWidth={2.5} />}
              </div>
            ))}
            <button onClick={() => setShowAddrSheet(false)} style={{
              marginTop: 8, height: 48, borderRadius: 14, border: '1.5px dashed var(--border)',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 600,
              color: 'var(--text-secondary)',
            }}>
              <Icon.Plus size={18} color="var(--text-secondary)" />
              Tambah Alamat Baru
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

// Reusable merchant card
function MerchantCard({ merchant: m, variant = 'banner' }) {
  const { nav } = useCus();
  if (variant === 'banner') {
    return (
      <Ripple onClick={() => nav('merchant', { id: m.id })} style={{
        background: 'var(--surface)', borderRadius: 18,
        boxShadow: 'var(--card-shadow)', overflow: 'hidden',
      }}>
        <div style={{
          width: '100%', height: 130,
          background: `url(${m.image}) center/cover`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 10, left: 10,
            padding: '4px 10px', borderRadius: 999,
            background: m.is_open ? 'rgba(39, 174, 96, 0.95)' : 'rgba(231, 76, 60, 0.95)',
            color: '#fff', fontSize: 11, fontWeight: 700,
            fontFamily: 'Plus Jakarta Sans, sans-serif', backdropFilter: 'blur(8px)',
          }}>{m.is_open ? 'Buka' : 'Tutup'}</div>
        </div>
        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 4,
          }}>
            <div style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 700,
              color: 'var(--text-primary)', letterSpacing: -0.2,
            }}>{m.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Icon.Star size={13} color="#F39C12" />
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fontWeight: 700,
                color: 'var(--text-primary)',
              }}>{m.rating}</span>
            </div>
          </div>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
            fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)',
          }}>
            <span>{m.distance_km} km</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor' }} />
            <span>{m.est_minutes} mnt</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor' }} />
            <span>{m.total_orders}+ order</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {m.tags.slice(0, 3).map(t => (
              <Pill key={t} color="var(--text-secondary)" bg="var(--bg)">{t}</Pill>
            ))}
          </div>
        </div>
      </Ripple>
    );
  }
  // row variant
  return (
    <Ripple onClick={() => nav('merchant', { id: m.id })} style={{
      background: 'var(--surface)', borderRadius: 16,
      padding: 10, display: 'flex', gap: 12, alignItems: 'center',
      boxShadow: 'var(--card-shadow)',
    }}>
      <div style={{
        width: 78, height: 78, borderRadius: 12, flexShrink: 0,
        background: `url(${m.image}) center/cover`,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{m.name}</div>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center',
          fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)',
          marginBottom: 6,
        }}>
          <Icon.Star size={12} color="#F39C12" />
          <span>{m.rating}</span>
          <span>·</span>
          <span>{m.distance_km} km</span>
          <span>·</span>
          <span>{m.est_minutes} mnt</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {m.tags.slice(0, 2).map(t => (
            <Pill key={t} color="var(--text-secondary)" bg="var(--bg)">{t}</Pill>
          ))}
        </div>
      </div>
      <Icon.ChevronRight size={18} color="var(--text-muted)" />
    </Ripple>
  );
}

// ─────────────────────────────────────────────────────────────
// BOTTOM SHEET (reusable)
// ─────────────────────────────────────────────────────────────
function BottomSheet({ children, onClose, title }) {
  const [anim, setAnim] = useState(false);
  useEffect(() => { setAnim(true); }, []);
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 40,
        background: 'rgba(0,0,0,0.4)',
        opacity: anim ? 1 : 0, transition: 'opacity 250ms',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 41,
        background: 'var(--surface)', borderRadius: '24px 24px 0 0',
        padding: '12px 20px 32px', maxHeight: '80%', overflowY: 'auto',
        transform: anim ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 350ms var(--ease-out)',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
      }}>
        <div style={{
          width: 38, height: 4, borderRadius: 2, background: 'var(--border)',
          margin: '0 auto 12px',
        }} />
        {title && (
          <div style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 800,
            color: 'var(--text-primary)', marginBottom: 14,
          }}>{title}</div>
        )}
        {children}
      </div>
    </>
  );
}

Object.assign(window, { Home, BottomNav, MerchantCard, BottomSheet });
