// Merchant detail + Cart + Order Cepat + Tracking screens
const { merchants: ms3, fmtRp: rp3, user: u3, driver: dr3 } = window.CUS_DATA;

// ─────────────────────────────────────────────────────────────
// MERCHANT DETAIL
// ─────────────────────────────────────────────────────────────
function Merchant({ params }) {
  const { back, cart, addToCart, nav } = useCus();
  const m = ms3.find(x => x.id === params.id) || ms3[0];
  const [sheet, setSheet] = useState(null); // selected menu item
  const [scrollY, setScrollY] = useState(0);

  const cartForThis = cart[m.id]?.items || [];
  const cartCount = cartForThis.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartForThis.reduce((s, i) => {
    const item = m.menu.find(x => x.id === i.menuId);
    return s + (item?.price || 0) * i.qty;
  }, 0);

  return (
    <div
      onScroll={e => setScrollY(e.target.scrollTop)}
      style={{
        width: '100%', height: '100%', background: 'var(--bg)',
        overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: cartCount > 0 ? 100 : 32,
      }}
    >
      {/* Banner */}
      <div style={{
        width: '100%', height: 220, position: 'relative',
        background: `url(${m.image}) center/cover`,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.5) 100%)',
        }} />
      </div>

      {/* Floating header buttons */}
      <div style={{
        position: 'fixed', top: SAFE_TOP - 6, left: 16, right: 16, zIndex: 9,
        display: 'flex', justifyContent: 'space-between',
        opacity: scrollY > 30 ? 1 : 0.96,
      }}>
        <button onClick={back} style={{
          width: 40, height: 40, borderRadius: 999,
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
        }}>
          <Icon.ArrowLeft size={20} color="var(--text-primary)" />
        </button>
      </div>

      {/* Info card (overlapping banner) */}
      <div style={{
        margin: '-26px 14px 0', position: 'relative', zIndex: 2,
        background: 'var(--surface)', borderRadius: 22,
        padding: 18, boxShadow: 'var(--card-shadow)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22, fontWeight: 800,
              color: 'var(--text-primary)', letterSpacing: -0.4,
              margin: '0 0 4px',
            }}>{m.name}</h1>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)',
            }}>{m.address}</div>
          </div>
          <Pill color={m.is_open ? 'var(--success)' : 'var(--error)'}>
            ● {m.is_open ? 'Buka' : 'Tutup'}
          </Pill>
        </div>

        <div style={{
          display: 'flex', gap: 16, marginTop: 14, paddingTop: 14,
          borderTop: '1px solid var(--border)',
        }}>
          {[
            { icon: <Icon.Star size={15} color="#F39C12" />, label: m.rating, sub: `${m.total_orders} order` },
            { icon: <Icon.MapPin size={15} color="var(--text-secondary)" />, label: `${m.distance_km} km`, sub: `${m.est_minutes} mnt` },
            { icon: <Icon.Clock size={15} color="var(--text-secondary)" />, label: m.operating_hours.split(' - ')[0], sub: `s/d ${m.operating_hours.split(' - ')[1]}` },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {s.icon}
                <div style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>{s.label}</div>
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--text-muted)',
              }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Titip Sekalian banner */}
      <div style={{ padding: '14px 14px 0' }}>
        <Ripple onClick={() => nav('order-cepat', { prefill: `Pesan di ${m.name}: ` })} style={{
          padding: '12px 14px', borderRadius: 14,
          border: '1.5px dashed var(--primary)',
          background: 'var(--primary-light)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon.Plus size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
              color: 'var(--primary-hover)',
            }}>Titip sekalian sesuatu?</div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--text-secondary)', marginTop: 1,
            }}>Mau beli di tempat lain juga? Tulis aja</div>
          </div>
          <Icon.ChevronRight size={18} color="var(--primary)" />
        </Ripple>
      </div>

      {/* Menu */}
      <div style={{
        marginTop: 20, padding: '0 14px',
      }}>
        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 800,
          color: 'var(--text-primary)', marginBottom: 12, padding: '0 4px',
        }}>Menu</div>
        <div style={{
          background: 'var(--surface)', borderRadius: 18, overflow: 'hidden',
          boxShadow: 'var(--card-shadow)',
        }}>
          {m.menu.map((item, idx) => (
            <Ripple
              key={item.id}
              onClick={() => item.is_available && setSheet(item)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 12,
                borderBottom: idx < m.menu.length - 1 ? '1px solid var(--border)' : 'none',
                opacity: item.is_available ? 1 : 0.5,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <div style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}>{item.name}</div>
                  {item.is_popular && (
                    <Pill color="#E74C3C" style={{ fontSize: 9, padding: '1px 6px' }}>🔥 LARIS</Pill>
                  )}
                </div>
                {item.description && (
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)',
                    lineHeight: 1.4, marginBottom: 6,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{item.description}</div>
                )}
                <div style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 800,
                  color: item.is_available ? 'var(--primary)' : 'var(--text-muted)',
                }}>
                  {rp3(item.price)}
                  {!item.is_available && <span style={{ marginLeft: 8, color: 'var(--error)', fontSize: 11 }}>habis</span>}
                </div>
              </div>
              {item.image ? (
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 86, height: 86, borderRadius: 12,
                    background: `url(${item.image}) center/cover`,
                  }} />
                  {item.is_available && (
                    <button onClick={(e) => { e.stopPropagation(); addToCart(m.id, item, 1); }} style={{
                      position: 'absolute', bottom: -8, right: -8,
                      width: 30, height: 30, borderRadius: '50%', border: '2px solid #fff',
                      background: 'var(--primary)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(230,126,34,0.4)',
                    }}>
                      <Icon.Plus size={16} color="#fff" strokeWidth={3} />
                    </button>
                  )}
                </div>
              ) : (
                item.is_available && (
                  <button onClick={(e) => { e.stopPropagation(); addToCart(m.id, item, 1); }} style={{
                    width: 38, height: 38, borderRadius: 12, border: '1.5px solid var(--primary)',
                    background: 'var(--primary-light)', cursor: 'pointer', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon.Plus size={18} color="var(--primary)" strokeWidth={2.5} />
                  </button>
                )
              )}
            </Ripple>
          ))}
        </div>
      </div>

      {/* Floating cart bar */}
      {cartCount > 0 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
          padding: '14px 16px 28px',
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.96) 30%, var(--surface))',
        }}>
          <Ripple onClick={() => nav('cart')} style={{
            background: 'var(--primary)', borderRadius: 16,
            padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 12px 28px rgba(230,126,34,0.4)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 800,
              color: '#fff',
            }}>{cartCount}</div>
            <div style={{ flex: 1, color: '#fff' }}>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fontWeight: 600, opacity: 0.9,
              }}>{cartCount} item · {rp3(cartTotal)}</div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 800,
              }}>Lihat Keranjang</div>
            </div>
            <Icon.ChevronRight size={20} color="#fff" strokeWidth={2.5} />
          </Ripple>
        </div>
      )}

      {/* Quick-add sheet */}
      {sheet && <QuickAddSheet item={sheet} merchant={m} onClose={() => setSheet(null)} />}
    </div>
  );
}

function QuickAddSheet({ item, merchant, onClose }) {
  const { addToCart } = useCus();
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  return (
    <BottomSheet onClose={onClose}>
      {item.image && (
        <div style={{
          width: '100%', aspectRatio: '16/10', borderRadius: 16,
          background: `url(${item.image}) center/cover`, marginBottom: 14,
        }} />
      )}
      <div style={{
        fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20, fontWeight: 800,
        color: 'var(--text-primary)', marginBottom: 4,
      }}>{item.name}</div>
      {item.description && (
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)',
          lineHeight: 1.5, marginBottom: 10,
        }}>{item.description}</div>
      )}
      <div style={{
        fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22, fontWeight: 800,
        color: 'var(--primary)', marginBottom: 16,
      }}>{rp3(item.price)}</div>

      <div style={{
        marginBottom: 14,
      }}>
        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 6,
        }}>Catatan (opsional)</div>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Mis. gak pake sayur, extra pedas..."
          style={{
            width: '100%', minHeight: 60, padding: 12,
            border: '1.5px solid var(--border)', borderRadius: 12,
            background: 'var(--bg)', outline: 'none',
            fontFamily: 'DM Sans, sans-serif', fontSize: 13, resize: 'none',
            color: 'var(--text-primary)', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          background: 'var(--bg)', borderRadius: 14, padding: 4,
        }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={{
            width: 38, height: 38, borderRadius: 10, border: 'none',
            background: qty > 1 ? 'var(--surface)' : 'transparent',
            cursor: qty > 1 ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: qty > 1 ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}>
            <Icon.Minus size={16} color={qty > 1 ? 'var(--text-primary)' : 'var(--text-muted)'} />
          </button>
          <div style={{
            minWidth: 36, textAlign: 'center',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 700,
            color: 'var(--text-primary)',
          }}>{qty}</div>
          <button onClick={() => setQty(qty + 1)} style={{
            width: 38, height: 38, borderRadius: 10, border: 'none',
            background: 'var(--surface)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}>
            <Icon.Plus size={16} color="var(--text-primary)" />
          </button>
        </div>
        <Btn full onClick={() => { addToCart(merchant.id, item, qty, notes); onClose(); }}>
          Tambah · {rp3(item.price * qty)}
        </Btn>
      </div>
    </BottomSheet>
  );
}

Object.assign(window, { Merchant, QuickAddSheet });
