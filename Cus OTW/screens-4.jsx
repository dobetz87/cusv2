// Cart + Order Cepat + Tracking + Profile + Orders list
const { merchants: ms4, fmtRp: rp4, user: u4, driver: dr4 } = window.CUS_DATA;

// ─────────────────────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────────────────────
function Cart() {
  const { cart, updateQty, removeItem, nav, back, placeOrder } = useCus();
  const [payment, setPayment] = useState('cod'); // 'cod' | 'qris'

  const merchantIds = Object.keys(cart).filter(id => cart[id].items.length > 0);
  const subtotal = merchantIds.reduce((s, mid) => {
    const m = ms4.find(x => x.id === mid);
    return s + cart[mid].items.reduce((ss, ci) => {
      const item = m.menu.find(x => x.id === ci.menuId);
      return ss + (item?.price || 0) * ci.qty;
    }, 0);
  }, 0);

  const deliveryFee = 8000;
  const serviceFee = 3000;
  const stopFee = merchantIds.length > 1 ? (merchantIds.length - 1) * 2000 : 0;
  const total = subtotal + deliveryFee + serviceFee + stopFee;

  if (merchantIds.length === 0) {
    return (
      <div style={{
        width: '100%', height: '100%', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
      }}>
        <ScreenHeader title="Keranjang" onBack={back} />
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14,
          paddingBottom: NAV_H + 32,
        }}>
          <div style={{ fontSize: 56 }}>🛒</div>
          <div style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 700,
            color: 'var(--text-primary)', textAlign: 'center',
          }}>Keranjang masih kosong</div>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-secondary)',
            textAlign: 'center', maxWidth: 240, lineHeight: 1.5,
          }}>Cus, jelajah menu dan pesan yang lagi rame! 🍜</div>
          <div style={{ marginTop: 8 }}>
            <Btn onClick={() => nav('home')}>Cari Merchant</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--bg)',
      overflowY: 'auto', position: 'relative',
      paddingBottom: 110,
    }}>
      <ScreenHeader title="Keranjang" onBack={back} />

      {/* Items by merchant */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {merchantIds.map(mid => {
          const m = ms4.find(x => x.id === mid);
          const items = cart[mid].items;
          return (
            <div key={mid} style={{
              background: 'var(--surface)', borderRadius: 18,
              padding: '14px', boxShadow: 'var(--card-shadow)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `url(${m.image}) center/cover`,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}>{m.name}</div>
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--text-muted)',
                  }}>{m.distance_km} km · {m.est_minutes} mnt</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {items.map((ci, idx) => {
                  const item = m.menu.find(x => x.id === ci.menuId);
                  if (!item) return null;
                  return (
                    <div key={ci.menuId} style={{
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                      paddingTop: idx > 0 ? 12 : 0,
                      borderTop: idx > 0 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 600,
                          color: 'var(--text-primary)', marginBottom: 2,
                        }}>{item.name}</div>
                        {ci.notes && (
                          <div style={{
                            fontFamily: 'DM Sans, sans-serif', fontSize: 11,
                            color: 'var(--text-secondary)',
                            background: 'var(--bg)', padding: '4px 8px', borderRadius: 8,
                            display: 'inline-block', marginBottom: 4,
                          }}>📝 {ci.notes}</div>
                        )}
                        <div style={{
                          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
                          color: 'var(--primary)',
                        }}>{rp4(item.price * ci.qty)}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button onClick={() => updateQty(mid, ci.menuId, ci.qty - 1)} style={{
                          width: 28, height: 28, borderRadius: 8, border: '1px solid var(--border)',
                          background: 'var(--surface)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {ci.qty === 1
                            ? <Icon.Trash size={13} color="var(--error)" />
                            : <Icon.Minus size={13} color="var(--text-primary)" />}
                        </button>
                        <div style={{
                          minWidth: 22, textAlign: 'center',
                          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700,
                        }}>{ci.qty}</div>
                        <button onClick={() => updateQty(mid, ci.menuId, ci.qty + 1)} style={{
                          width: 28, height: 28, borderRadius: 8, border: 'none',
                          background: 'var(--primary)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon.Plus size={13} color="#fff" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Titip Sekalian */}
        <Ripple onClick={() => nav('order-cepat')} style={{
          padding: '14px', borderRadius: 18,
          border: '1.5px dashed var(--primary)',
          background: 'var(--primary-light)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: 'var(--order-cepat-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon.Zap size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700,
              color: 'var(--primary-hover)',
            }}>+ Titip Sekalian</div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)', marginTop: 1,
            }}>Mau titip beli yang lain sekalian? ⚡</div>
          </div>
          <Icon.ChevronRight size={18} color="var(--primary)" />
        </Ripple>

        {/* Address */}
        <div style={{
          background: 'var(--surface)', borderRadius: 18,
          padding: 14, boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
            color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase',
            letterSpacing: 0.5, fontSize: 11,
          }}>Antar Ke</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: 'var(--primary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon.MapPin size={20} color="var(--primary)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700,
                color: 'var(--text-primary)',
              }}>{u4.address.label}</div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)',
                marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{u4.address.full}</div>
            </div>
            <button style={{
              padding: '6px 12px', borderRadius: 999, border: '1px solid var(--border)',
              background: 'var(--surface)', cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fontWeight: 600,
              color: 'var(--text-secondary)',
            }}>Ubah</button>
          </div>
        </div>

        {/* Payment */}
        <div style={{
          background: 'var(--surface)', borderRadius: 18,
          padding: 14, boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700,
            color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase',
            letterSpacing: 0.5, fontSize: 11,
          }}>Pembayaran</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { id: 'cod', label: 'Bayar di Tempat (COD)', sub: 'Bayar pas paket sampai', icon: '💵' },
              { id: 'qris', label: 'QRIS', sub: 'Scan dari semua e-wallet', icon: '🟦' },
            ].map(p => (
              <Ripple key={p.id} onClick={() => setPayment(p.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: 12, borderRadius: 12,
                border: payment === p.id ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                background: payment === p.id ? 'var(--primary-light)' : 'transparent',
              }}>
                <div style={{ fontSize: 22 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}>{p.label}</div>
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--text-secondary)',
                  }}>{p.sub}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: payment === p.id ? '6px solid var(--primary)' : '1.5px solid var(--border)',
                  background: payment === p.id ? 'var(--surface)' : 'var(--surface)',
                  transition: 'all 150ms',
                }} />
              </Ripple>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div style={{
          background: 'var(--surface)', borderRadius: 18,
          padding: 14, boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700,
            color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase',
            letterSpacing: 0.5, fontSize: 11,
          }}>Rincian Biaya</div>
          {[
            ['Subtotal item', subtotal],
            ['Ongkos kirim', deliveryFee],
            ['Jasa titip', serviceFee],
            ...(stopFee > 0 ? [['Biaya stop tambahan', stopFee]] : []),
          ].map(([label, val]) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 0',
              fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)',
            }}>
              <span>{label}</span>
              <span>{rp4(val)}</span>
            </div>
          ))}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 10, marginTop: 6, borderTop: '1px solid var(--border)',
          }}>
            <span style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 700,
              color: 'var(--text-primary)',
            }}>Total</span>
            <span style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20, fontWeight: 800,
              color: 'var(--primary)',
            }}>{rp4(total)}</span>
          </div>
        </div>
      </div>

      {/* Sticky checkout */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
        padding: '14px 16px 28px',
        background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.96) 30%, var(--surface))',
      }}>
        <Btn full onClick={() => placeOrder({ total, payment })}>
          Pesan Sekarang · {rp4(total)}
        </Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ORDER CEPAT
// ─────────────────────────────────────────────────────────────
function OrderCepat({ params }) {
  const { back, placeOrder } = useCus();
  const examples = [
    'Beli nasi padang 2 porsi di RM Sederhana',
    'Ambil laundry di Mawar, sekalian beli rokok Surya 12',
    'Belanja pasar: wortel 1kg, tempe 5 bungkus',
    'Tolong antarkan dokumen ini ke kantor desa',
  ];
  const [text, setText] = useState(params?.prefill || '');
  const [phIdx, setPhIdx] = useState(0);
  const [chips, setChips] = useState([]); // attached items
  const [submitting, setSubmitting] = useState(null); // null | 'sending' | 'success'

  useEffect(() => {
    const t = setInterval(() => setPhIdx(i => (i + 1) % examples.length), 2800);
    return () => clearInterval(t);
  }, []);

  const submit = () => {
    if (!text.trim()) return;
    setSubmitting('sending');
    setTimeout(() => setSubmitting('success'), 1100);
    setTimeout(() => placeOrder({ total: 0, payment: 'cod', cepat: text }), 2400);
  };

  const addChip = (kind) => {
    const map = {
      photo: { kind: 'photo', label: 'Foto', icon: '📷' },
      voice: { kind: 'voice', label: 'Voice 0:08', icon: '🎤' },
      location: { kind: 'location', label: 'Lokasi pin', icon: '📍' },
    };
    setChips([...chips, { ...map[kind], id: Date.now() }]);
  };

  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      paddingBottom: NAV_H,
    }}>
      <ScreenHeader title="Order Cepat" onBack={back} right={
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--order-cepat-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon.Zap size={20} color="#fff" strokeWidth={2.5} />
        </div>
      } />

      <div style={{ flex: 1, padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        {/* Helper card */}
        <div style={{
          background: 'var(--primary-light)',
          border: '1px solid color-mix(in oklab, var(--primary) 30%, white)',
          borderRadius: 14, padding: 12,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <Icon.Sparkles size={20} color="var(--primary)" />
          <div style={{
            flex: 1,
            fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, lineHeight: 1.5,
            color: 'var(--text-primary)',
          }}>
            <strong>Tulis bebas apa aja.</strong> Admin kami akan baca, hitungin harga, dan konfirmasi balik ke kamu via WhatsApp.
          </div>
        </div>

        {/* Textarea */}
        <div style={{
          position: 'relative',
          border: '1.5px solid var(--border)', borderRadius: 16,
          background: 'var(--surface)',
          padding: 14, minHeight: 180,
          display: 'flex', flexDirection: 'column',
        }}>
          <textarea
            value={text} onChange={e => setText(e.target.value)}
            placeholder=""
            style={{
              width: '100%', flex: 1, minHeight: 140,
              border: 'none', outline: 'none', resize: 'none',
              fontFamily: 'DM Sans, sans-serif', fontSize: 15, lineHeight: 1.55,
              color: 'var(--text-primary)', background: 'transparent', boxSizing: 'border-box',
            }}
          />
          {!text && (
            <div style={{
              position: 'absolute', top: 14, left: 14, right: 14,
              pointerEvents: 'none',
              fontFamily: 'DM Sans, sans-serif', fontSize: 15, lineHeight: 1.55,
              color: 'var(--text-muted)',
            }}>
              <div style={{ marginBottom: 4, fontStyle: 'italic' }}>Contoh:</div>
              <div key={phIdx} style={{
                animation: 'fadeIn 600ms var(--ease-out)',
              }}>"{examples[phIdx]}"</div>
            </div>
          )}
          {/* counter */}
          <div style={{
            position: 'absolute', bottom: 8, right: 12,
            fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--text-muted)',
          }}>{text.length}/500</div>
        </div>

        {/* Chips */}
        {chips.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {chips.map(c => (
              <div key={c.id} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 12px 7px 10px', borderRadius: 999,
                background: 'var(--surface)', border: '1px solid var(--border)',
                fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600,
                color: 'var(--text-primary)',
              }}>
                <span>{c.icon}</span>
                <span>{c.label}</span>
                <button onClick={() => setChips(chips.filter(x => x.id !== c.id))} style={{
                  border: 'none', background: 'none', cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center',
                }}>
                  <Icon.X size={12} color="var(--text-muted)" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quick add row */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { kind: 'location', icon: <Icon.MapPin size={16} />, label: 'Lokasi' },
            { kind: 'photo', icon: <Icon.Camera size={16} />, label: 'Foto' },
            { kind: 'voice', icon: <Icon.Mic size={16} />, label: 'Suara' },
          ].map(b => (
            <button key={b.kind} onClick={() => addChip(b.kind)} style={{
              flex: 1, height: 42, borderRadius: 12,
              border: '1px solid var(--border)', background: 'var(--surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              {b.icon}{b.label}
            </button>
          ))}
        </div>

        {/* Address */}
        <div style={{
          background: 'var(--surface)', borderRadius: 14,
          padding: 12, display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: 'var(--card-shadow)',
        }}>
          <Icon.MapPin size={18} color="var(--primary)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--text-muted)',
            }}>Antar ke</div>
            <div style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
              color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{u4.address.label} · {u4.address.full}</div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div style={{ padding: '8px 16px 22px' }}>
        <Btn full disabled={!text.trim() || submitting} onClick={submit}>
          {submitting === 'sending' ? 'Mengirim...' :
           submitting === 'success' ? '✓ Terkirim!' :
           <><Icon.Send size={16} color="#fff" strokeWidth={2.5} />&nbsp;Kirim Pesanan</>}
        </Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TRACKING
// ─────────────────────────────────────────────────────────────
function Tracking() {
  const { back, nav, lastOrder } = useCus();
  const [step, setStep] = useState(2); // current active stop index
  const [breakdown, setBreakdown] = useState(false);

  const order = lastOrder || {
    id: 'ord-001',
    items: [
      { name: 'Pecel Komplit', qty: 2, price: 14000, merchant: 'Pecel Bu Mut' },
      { name: 'Es Teh Manis', qty: 2, price: 3000, merchant: 'Pecel Bu Mut' },
    ],
    total: 42000,
    pricing: { subtotal: 34000, delivery_fee: 8000, service_fee: 3000, stop_fee: 0, total: 45000 },
  };

  const stops = [
    { seq: 1, type: 'PICKUP', merchant: 'Pecel Bu Mut', status: step > 0 ? 'COMPLETED' : 'IN_PROGRESS', time: '19:42' },
    { seq: 2, type: 'PURCHASE', merchant: 'Toko Jaya Abadi', status: step > 1 ? 'COMPLETED' : step === 1 ? 'IN_PROGRESS' : 'PENDING', time: step > 1 ? '19:55' : null },
    { seq: 3, type: 'DELIVERY', address: 'Rumah - Jl. Ngroto', status: step > 2 ? 'COMPLETED' : 'PENDING', time: null },
  ];

  // Auto-advance for demo
  useEffect(() => {
    if (step < 3) {
      const t = setTimeout(() => setStep(step + 1), 6500);
      return () => clearTimeout(t);
    }
  }, [step]);

  const timeline = [
    { time: '19:30', event: 'Order dibuat', icon: <Icon.Plus size={14} color="#fff" />, done: true },
    { time: '19:33', event: 'Admin konfirmasi order', icon: <Icon.CheckCircle size={14} color="#fff" />, done: true },
    { time: '19:35', event: 'Mas Eko ditugaskan', icon: <Icon.User size={14} color="#fff" />, done: true },
    { time: '19:42', event: 'Sampai di Pecel Bu Mut', icon: <Icon.MapPin size={14} color="#fff" />, done: true },
    { time: '19:48', event: 'Pesanan diambil', icon: <Icon.Package size={14} color="#fff" />, done: true },
    { time: step >= 1 ? '19:55' : null, event: step >= 1 ? 'Beli rokok di Toko Jaya' : 'Menuju Toko Jaya Abadi', icon: <Icon.Navigation size={14} color="#fff" />, done: step > 1, active: step === 1 },
    { time: step >= 3 ? '20:10' : null, event: step >= 3 ? 'Pesanan tiba 🎉' : 'Antar ke alamat kamu', icon: <Icon.Home size={14} color="#fff" />, done: step >= 3, active: step === 2 },
  ];

  const statusLabel =
    step >= 3 ? { title: 'Pesanan Selesai!', sub: 'Terima kasih sudah pesan di Cus 🧡', tone: 'var(--success)' } :
    step === 2 ? { title: 'Driver Menuju Kamu', sub: 'Estimasi 8 menit lagi', tone: 'var(--primary)' } :
    step === 1 ? { title: 'Sedang Beli di Toko Jaya', sub: 'Mas Eko lagi belanjain', tone: 'var(--primary)' } :
    { title: 'Lagi Ambil Pesanan', sub: 'Sampai di Pecel Bu Mut', tone: 'var(--primary)' };

  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--bg)',
      overflowY: 'auto',
      paddingBottom: NAV_H + 16,
    }}>
      {/* Status hero */}
      <div style={{
        background: `linear-gradient(180deg, color-mix(in oklab, ${statusLabel.tone} 18%, white), var(--bg))`,
        paddingTop: SAFE_TOP, paddingBottom: 18, paddingLeft: 16, paddingRight: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <button onClick={back} style={{
            width: 38, height: 38, borderRadius: 999,
            background: 'rgba(255,255,255,0.95)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <Icon.ArrowLeft size={18} color="var(--text-primary)" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)',
            }}>Order #{order.id}</div>
          </div>
          <Pill color={statusLabel.tone} bg="var(--surface)">● Live</Pill>
        </div>

        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 26, fontWeight: 800,
          color: 'var(--text-primary)', letterSpacing: -0.5, marginBottom: 4, lineHeight: 1.15,
        }}>{statusLabel.title}</div>
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-secondary)',
        }}>{statusLabel.sub}</div>

        {/* Stop progress */}
        <div style={{
          marginTop: 18, padding: '14px', borderRadius: 18,
          background: 'var(--surface)', boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {stops.map((s, i) => (
              <React.Fragment key={s.seq}>
                <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 70 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: s.status === 'COMPLETED' ? 'var(--success)' :
                                s.status === 'IN_PROGRESS' ? 'var(--primary)' : 'var(--bg)',
                    border: s.status === 'PENDING' ? '2px solid var(--border)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: s.status === 'IN_PROGRESS' ? '0 0 0 6px color-mix(in oklab, var(--primary) 25%, transparent)' : 'none',
                    transition: 'all 250ms',
                  }}>
                    {s.status === 'COMPLETED' ? (
                      <Icon.Check size={16} color="#fff" strokeWidth={3} />
                    ) : s.type === 'PICKUP' ? (
                      <Icon.Package size={16} color={s.status === 'IN_PROGRESS' ? '#fff' : 'var(--text-muted)'} />
                    ) : s.type === 'PURCHASE' ? (
                      <Icon.ShoppingBag size={15} color={s.status === 'IN_PROGRESS' ? '#fff' : 'var(--text-muted)'} />
                    ) : (
                      <Icon.Home size={15} color={s.status === 'IN_PROGRESS' ? '#fff' : 'var(--text-muted)'} />
                    )}
                  </div>
                  <div style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 10, fontWeight: 700,
                    color: s.status === 'PENDING' ? 'var(--text-muted)' : 'var(--text-primary)',
                    textAlign: 'center', lineHeight: 1.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    width: '100%',
                  }}>{(s.merchant || s.address).split(' - ')[0].slice(0, 12)}</div>
                </div>
                {i < stops.length - 1 && (
                  <div style={{
                    flex: 1, height: 2,
                    background: stops[i + 1].status !== 'PENDING' ? 'var(--success)' : 'var(--border)',
                    transition: 'background 250ms',
                    marginTop: -16,
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Driver card */}
      <div style={{ padding: '0 14px', marginTop: 14 }}>
        <div style={{
          background: 'var(--secondary)', borderRadius: 18,
          padding: 14, color: '#fff',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 8px 20px rgba(44,62,80,0.18)',
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 800, color: '#fff',
            border: '2px solid rgba(255,255,255,0.2)',
          }}>ME</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2,
            }}>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 800,
              }}>{dr4.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Icon.Star size={11} color="#F39C12" />
                <span style={{ fontSize: 11, fontWeight: 600 }}>4.9</span>
              </div>
            </div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 12, opacity: 0.85,
            }}>{dr4.vehicle} · {dr4.plate}</div>
          </div>
          <button style={{
            width: 40, height: 40, borderRadius: 12, border: 'none',
            background: 'rgba(255,255,255,0.15)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon.MessageCircle size={18} color="#fff" />
          </button>
          <button style={{
            width: 40, height: 40, borderRadius: 12, border: 'none',
            background: '#25D366', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon.Phone size={18} color="#fff" />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: '0 14px', marginTop: 14 }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 18,
          padding: '16px', boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
            color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase',
            letterSpacing: 0.5, fontSize: 11,
          }}>Riwayat Pesanan</div>
          <div style={{ position: 'relative' }}>
            {/* vertical line */}
            <div style={{
              position: 'absolute', left: 11, top: 12, bottom: 12,
              width: 2, background: 'var(--border)',
            }} />
            {timeline.map((t, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                paddingBottom: i < timeline.length - 1 ? 14 : 0,
                position: 'relative', zIndex: 1,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: t.done ? 'var(--success)' : t.active ? 'var(--primary)' : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: t.active ? '0 0 0 4px color-mix(in oklab, var(--primary) 25%, transparent)' : 'none',
                  animation: t.active ? 'pulse 1.6s infinite' : 'none',
                }}>{t.icon}</div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13,
                    fontWeight: t.active ? 700 : 600,
                    color: t.done || t.active ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}>{t.event}</div>
                  {t.time && (
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: 11,
                      color: 'var(--text-muted)', marginTop: 1,
                    }}>{t.time}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown collapse */}
      <div style={{ padding: '0 14px', marginTop: 14 }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 18,
          boxShadow: 'var(--card-shadow)', overflow: 'hidden',
        }}>
          <button onClick={() => setBreakdown(!breakdown)} style={{
            width: '100%', padding: '14px 16px', border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', cursor: 'pointer',
          }}>
            <Icon.Receipt size={18} color="var(--text-secondary)" />
            <div style={{
              flex: 1, marginLeft: 10, textAlign: 'left',
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700,
              color: 'var(--text-primary)',
            }}>Rincian Biaya · {rp4(order.pricing?.total || order.total)}</div>
            <Icon.ChevronDown size={18} color="var(--text-muted)" style={{
              transform: breakdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms',
            }} />
          </button>
          {breakdown && (
            <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--border)' }}>
              {[
                ['Subtotal', order.pricing?.subtotal || 0],
                ['Ongkos kirim', order.pricing?.delivery_fee || 0],
                ['Jasa titip', order.pricing?.service_fee || 0],
                ...(order.pricing?.stop_fee ? [['Biaya stop tambahan', order.pricing.stop_fee]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)',
                }}>
                  <span>{k}</span><span>{rp4(v)}</span>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between', paddingTop: 8,
                marginTop: 6, borderTop: '1px solid var(--border)',
              }}>
                <span style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, color: 'var(--text-primary)',
                }}>Total</span>
                <span style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, color: 'var(--primary)',
                }}>{rp4(order.pricing?.total || order.total)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help */}
      <div style={{ padding: '14px', display: 'flex', gap: 10 }}>
        <button style={{
          flex: 1, height: 44, borderRadius: 12, border: '1.5px solid var(--border)',
          background: 'var(--surface)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
          color: 'var(--text-primary)',
        }}>
          <Icon.MessageCircle size={16} color="var(--text-primary)" />
          Butuh Bantuan?
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Simple Profile / Orders / Search stubs (so bottom nav works)
// ─────────────────────────────────────────────────────────────
function Orders() {
  const { back, nav, lastOrder } = useCus();
  const history = [
    { id: 'ord-prev-1', date: '7 Mei', status: 'COMPLETED', items_summary: 'Seblak Ceker x2, Es Teh', total: 41000, driver: 'Mas Eko', rating: 5 },
    { id: 'ord-prev-2', date: '6 Mei', status: 'COMPLETED', items_summary: 'Belanja Pasar (5 item)', total: 87000, driver: 'Mas Anto', rating: 4 },
    { id: 'ord-prev-3', date: '5 Mei', status: 'CANCELLED', items_summary: 'Rawon Daging x1', total: 30000, driver: null, rating: null },
  ];

  const [tab, setTab] = useState('aktif');
  const hasActive = !!lastOrder;

  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--bg)',
      overflowY: 'auto', paddingBottom: NAV_H + 16,
    }}>
      <ScreenHeader title="Pesanan" />
      <div style={{
        display: 'flex', gap: 6, padding: '0 16px 12px', position: 'sticky',
        top: SAFE_TOP + 50, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        zIndex: 7,
      }}>
        {[['aktif', 'Aktif'], ['selesai', 'Selesai']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, height: 38, border: 'none', borderRadius: 10,
            background: tab === id ? 'var(--primary-light)' : 'transparent',
            cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
            color: tab === id ? 'var(--primary)' : 'var(--text-muted)',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tab === 'aktif' && (
          hasActive ? (
            <Ripple onClick={() => nav('tracking')} style={{
              background: 'var(--surface)', borderRadius: 16, padding: 14,
              boxShadow: 'var(--card-shadow)',
              border: '1.5px solid var(--primary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Pill color="var(--primary)">● Live</Pill>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--text-muted)' }}>Order #{lastOrder.id}</div>
              </div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 800,
                color: 'var(--text-primary)', marginBottom: 4,
              }}>Pesanan kamu lagi otw 🛵</div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)',
              }}>Mas Eko · {rp4(lastOrder.total)}</div>
            </Ripple>
          ) : (
            <div style={{
              padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
              <div style={{ fontSize: 42 }}>📭</div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 700,
                color: 'var(--text-primary)',
              }}>Belum ada pesanan aktif</div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}>Cus, pesan sesuatu! 🛒</div>
            </div>
          )
        )}
        {tab === 'selesai' && history.map(o => (
          <div key={o.id} style={{
            background: 'var(--surface)', borderRadius: 14, padding: 14,
            boxShadow: 'var(--card-shadow)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
            }}>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-muted)' }}>{o.date}</div>
              <Pill color={o.status === 'COMPLETED' ? 'var(--success)' : 'var(--error)'}>
                {o.status === 'COMPLETED' ? 'Selesai' : 'Dibatalkan'}
              </Pill>
            </div>
            <div style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: 4,
            }}>{o.items_summary}</div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8,
            }}>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 800,
                color: 'var(--primary)',
              }}>{rp4(o.total)}</div>
              {o.status === 'COMPLETED' && (
                <button style={{
                  padding: '6px 14px', borderRadius: 999, border: '1px solid var(--primary)',
                  background: 'var(--surface)', cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fontWeight: 700,
                  color: 'var(--primary)',
                }}>Pesan Lagi</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const { setSignedIn, nav } = useCus();
  const items = [
    ['Alamat Tersimpan', <Icon.MapPin size={20} color="var(--primary)" />, '2 alamat'],
    ['Riwayat Pesanan', <Icon.ClipboardList size={20} color="var(--primary)" />, '12 selesai'],
    ['Metode Pembayaran', <Icon.Wallet size={20} color="var(--primary)" />, 'COD, QRIS'],
    ['Notifikasi', <Icon.Bell size={20} color="var(--primary)" />, ''],
    ['Bantuan', <Icon.MessageCircle size={20} color="var(--primary)" />, ''],
    ['Tentang Cus', <Icon.Sparkles size={20} color="var(--primary)" />, 'v1.0'],
  ];
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--bg)',
      overflowY: 'auto', paddingBottom: NAV_H + 16,
    }}>
      <ScreenHeader title="Profil" />
      {/* User card */}
      <div style={{ padding: '4px 14px 14px' }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 18,
          padding: 16, boxShadow: 'var(--card-shadow)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22, fontWeight: 800, color: '#fff',
          }}>{u4.name[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17, fontWeight: 800,
              color: 'var(--text-primary)',
            }}>{u4.name}</div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)',
            }}>+62 {u4.phone.slice(2)}</div>
          </div>
          <button style={{
            width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--surface)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon.Edit size={16} color="var(--text-primary)" />
          </button>
        </div>
      </div>

      <div style={{ padding: '0 14px' }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 18,
          boxShadow: 'var(--card-shadow)', overflow: 'hidden',
        }}>
          {items.map(([label, icon, sub], i) => (
            <Ripple key={label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 14,
              borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>{label}</div>
              </div>
              {sub && (
                <div style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-muted)',
                }}>{sub}</div>
              )}
              <Icon.ChevronRight size={16} color="var(--text-muted)" />
            </Ripple>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Btn variant="ghost" full onClick={() => { setSignedIn(false); nav('gateway'); }}>
            Keluar
          </Btn>
        </div>
      </div>
    </div>
  );
}

function Search({ params }) {
  const { back, nav } = useCus();
  const { categories: cats4 } = window.CUS_DATA;
  const [q, setQ] = useState('');
  const [activeCat, setActiveCat] = useState(params?.cat || 'all');
  const filtered = ms4.filter(m => {
    const matchCat = activeCat === 'all' || m.category === activeCat;
    const matchQ = !q || m.name.toLowerCase().includes(q.toLowerCase()) ||
                  m.menu.some(it => it.name.toLowerCase().includes(q.toLowerCase()));
    return matchCat && matchQ;
  });
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--bg)',
      overflowY: 'auto', paddingBottom: NAV_H + 16,
    }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 8, background: 'var(--surface)',
        paddingTop: SAFE_TOP, paddingBottom: 12, paddingLeft: 16, paddingRight: 16,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          height: 44, borderRadius: 14, background: 'var(--bg)',
          display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
        }}>
          <Icon.Search size={18} color="var(--text-muted)" />
          <input value={q} onChange={e => setQ(e.target.value)} autoFocus
            placeholder="Cari makanan, toko..."
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-primary)',
            }} />
          {q && <Icon.X size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => setQ('')} />}
        </div>
        {/* Cat filters */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[{ id: 'all', label: 'Semua' }, ...cats4].map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
              padding: '6px 12px', borderRadius: 999, border: 'none',
              background: activeCat === c.id ? 'var(--primary)' : 'var(--bg)',
              cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fontWeight: 700,
              color: activeCat === c.id ? '#fff' : 'var(--text-secondary)',
            }}>{c.label}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{
            padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <div style={{ fontSize: 36 }}>🔍</div>
            <div style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 700,
              color: 'var(--text-primary)',
            }}>Gak ketemu nih</div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 240,
            }}>Coba kata lain atau langsung Order Cepat!</div>
            <div style={{ marginTop: 6 }}>
              <Btn size="md" onClick={() => nav('order-cepat')}>
                <Icon.Zap size={14} color="#fff" />Order Cepat
              </Btn>
            </div>
          </div>
        ) : filtered.map(m => <MerchantCard key={m.id} merchant={m} variant="row" />)}
      </div>
    </div>
  );
}

function DriverPending() {
  const { back, nav } = useCus();
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
    }}>
      <ScreenHeader onBack={back} />
      <div style={{
        flex: 1, padding: '0 24px 32px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14,
      }}>
        <div style={{ fontSize: 64, marginBottom: 4 }}>⏱️</div>
        <h1 style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 24, fontWeight: 800,
          color: 'var(--text-primary)', margin: 0, letterSpacing: -0.4,
        }}>Pendaftaran Terkirim! 🎉</h1>
        <p style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-secondary)',
          margin: 0, lineHeight: 1.5, maxWidth: 280,
        }}>Admin kami akan review dan hubungi kamu via WhatsApp dalam 1×24 jam.</p>
        <div style={{
          marginTop: 12, width: '100%', maxWidth: 320,
          background: 'var(--surface)', borderRadius: 16, padding: 16,
          textAlign: 'left', boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', padding: '6px 0',
            fontFamily: 'DM Sans, sans-serif', fontSize: 13,
          }}><span style={{ color: 'var(--text-muted)' }}>Status</span>
            <Pill color="var(--warning)">⏳ Menunggu Review</Pill>
          </div>
          {[['Nama', 'Budi Santoso'], ['Area', 'Pujon'], ['Kendaraan', 'Honda Beat'], ['Plat', 'N 1234 ABC']].map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between', padding: '6px 0',
              fontFamily: 'DM Sans, sans-serif', fontSize: 13,
            }}>
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <Btn variant="secondary" onClick={() => {}}>
            <Icon.MessageCircle size={16} color="var(--secondary)" />Hubungi Admin
          </Btn>
          <Btn variant="ghost" onClick={() => nav('gateway')}>Beranda</Btn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Cart, OrderCepat, Tracking, Orders, Profile, Search, DriverPending });
