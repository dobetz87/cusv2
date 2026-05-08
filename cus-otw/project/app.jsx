// App.jsx — Cus prototype: provider, routing, frame
const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM } = React;

// ─────────────────────────────────────────────────────────────
// Provider — state management for the whole prototype
// ─────────────────────────────────────────────────────────────
function CusProvider({ children }) {
  const [stack, setStack] = uS([{ screen: 'gateway', params: {} }]);
  const [signedIn, setSignedIn] = uS(false);
  const [cart, setCart] = uS({}); // { merchantId: { items: [{menuId, qty, notes}] } }
  const [lastOrder, setLastOrder] = uS(null);
  const [toast, setToast] = uS(null);

  const current = stack[stack.length - 1];

  const nav = (screen, params = {}, opts = {}) => {
    if (opts.replace) {
      setStack(s => [...s.slice(0, -1), { screen, params }]);
    } else if (opts.reset) {
      setStack([{ screen, params }]);
    } else {
      setStack(s => [...s, { screen, params }]);
    }
    // scroll-to-top
    setTimeout(() => {
      const el = document.querySelector('[data-screen-scroll]');
      if (el) el.scrollTop = 0;
    }, 30);
  };
  const back = () => setStack(s => s.length > 1 ? s.slice(0, -1) : s);

  const cartCount = uM(() => Object.values(cart).reduce((n, m) =>
    n + m.items.reduce((nn, ci) => nn + ci.qty, 0), 0), [cart]);

  const addToCart = (merchantId, menuId, qty = 1, notes = '') => {
    setCart(c => {
      const m = c[merchantId] || { items: [] };
      const idx = m.items.findIndex(ci => ci.menuId === menuId && ci.notes === notes);
      let items;
      if (idx >= 0) {
        items = m.items.map((ci, i) => i === idx ? { ...ci, qty: ci.qty + qty } : ci);
      } else {
        items = [...m.items, { menuId, qty, notes }];
      }
      return { ...c, [merchantId]: { ...m, items } };
    });
    showToast('Ditambah ke keranjang ✓');
  };

  const updateQty = (merchantId, menuId, qty) => {
    setCart(c => {
      const m = c[merchantId];
      if (!m) return c;
      let items = qty <= 0
        ? m.items.filter(ci => ci.menuId !== menuId)
        : m.items.map(ci => ci.menuId === menuId ? { ...ci, qty } : ci);
      const next = { ...c };
      if (items.length === 0) delete next[merchantId];
      else next[merchantId] = { ...m, items };
      return next;
    });
  };

  const removeItem = (merchantId, menuId) => updateQty(merchantId, menuId, 0);

  const placeOrder = ({ total, payment, cepat }) => {
    const merchantIds = Object.keys(cart);
    const items = [];
    merchantIds.forEach(mid => {
      const m = window.CUS_DATA.merchants.find(x => x.id === mid);
      if (!m) return;
      cart[mid].items.forEach(ci => {
        const item = m.menu.find(x => x.id === ci.menuId);
        if (item) items.push({
          name: item.name, qty: ci.qty, price: item.price, merchant: m.name,
        });
      });
    });
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    setLastOrder({
      id: cepat ? 'cep-' + Math.floor(Math.random() * 999) : 'ord-' + Math.floor(Math.random() * 999),
      items: cepat ? [{ name: 'Order Cepat', desc: cepat, qty: 1, price: 0 }] : items,
      total: total || subtotal + 11000,
      pricing: cepat ? null : {
        subtotal, delivery_fee: 8000, service_fee: 3000,
        stop_fee: merchantIds.length > 1 ? (merchantIds.length - 1) * 2000 : 0,
        total: total || subtotal + 11000,
      },
    });
    setCart({});
    nav('tracking', {}, { reset: true });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const value = {
    screen: current.screen, params: current.params,
    nav, back, signedIn, setSignedIn,
    cart, addToCart, updateQty, removeItem, cartCount,
    lastOrder, placeOrder,
    toast, showToast,
  };

  return <CusCtx.Provider value={value}>{children}</CusCtx.Provider>;
}

// ─────────────────────────────────────────────────────────────
// Toast — global feedback
// ─────────────────────────────────────────────────────────────
function Toast() {
  const { toast } = useCus();
  if (!toast) return null;
  return (
    <div style={{
      position: 'absolute',
      bottom: 110, left: '50%', transform: 'translateX(-50%)',
      padding: '10px 18px', borderRadius: 999,
      background: 'var(--secondary)', color: '#fff',
      fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      zIndex: 100, animation: 'toastIn 200ms var(--ease-out)',
      whiteSpace: 'nowrap',
    }}>{toast}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Router — picks current screen + bottom nav visibility
// ─────────────────────────────────────────────────────────────
function ScreenRouter() {
  const { screen, params, signedIn } = useCus();
  const NAV_SCREENS = ['home', 'orders', 'profile'];
  const showNav = NAV_SCREENS.includes(screen);

  const Comp = ({
    'gateway': Gateway,
    'auth': Auth,
    'home': Home,
    'merchant': Merchant,
    'cart': Cart,
    'order-cepat': OrderCepat,
    'tracking': Tracking,
    'orders': Orders,
    'profile': Profile,
    'search': Search,
    'driver-pending': DriverPending,
  })[screen] || Gateway;

  return (
    <>
      <div data-screen-scroll style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
      }}>
        <div key={screen} style={{
          width: '100%', height: '100%', position: 'relative',
          animation: 'screenIn 220ms var(--ease-out)',
        }}>
          <Comp params={params} />
        </div>
      </div>
      {showNav && <BottomNav />}
      <Toast />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Phone bezel
// ─────────────────────────────────────────────────────────────
function Phone({ children, accent }) {
  const W = 402, H = 874;
  return (
    <div style={{
      width: W, height: H, borderRadius: 54, overflow: 'hidden',
      position: 'relative',
      background: 'var(--bg)',
      boxShadow: `
        0 0 0 12px #1a1a1a,
        0 0 0 13px #2a2a2a,
        0 50px 100px -20px rgba(0,0,0,0.4),
        0 30px 60px -30px rgba(0,0,0,0.5)
      `,
    }}>
      {/* dynamic island */}
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        width: 122, height: 36, borderRadius: 22, background: '#000',
        zIndex: 100, pointerEvents: 'none',
      }} />
      {/* status bar text */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 56,
        zIndex: 90, display: 'flex', alignItems: 'center',
        padding: '0 32px', pointerEvents: 'none',
      }}>
        <div style={{
          flex: 1,
          fontFamily: '-apple-system, "SF Pro", system-ui', fontSize: 16, fontWeight: 600,
          color: 'var(--text-primary)',
        }}>9:41</div>
        <div style={{
          flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6,
          color: 'var(--text-primary)',
        }}>
          {/* signal */}
          <svg width="18" height="11" viewBox="0 0 18 11"><g fill="currentColor">
            <rect x="0" y="7" width="3" height="4" rx="0.7"/>
            <rect x="5" y="5" width="3" height="6" rx="0.7"/>
            <rect x="10" y="2.5" width="3" height="8.5" rx="0.7"/>
            <rect x="15" y="0" width="3" height="11" rx="0.7"/>
          </g></svg>
          {/* wifi */}
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
            <path d="M8 11a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM4.4 7.5l-1.4-1.4a7 7 0 0110 0L11.6 7.5a5 5 0 00-7.2 0zM1.4 4.5L0 3.1A11 11 0 0116 3.1L14.6 4.5a9 9 0 00-13.2 0z"/>
          </svg>
          {/* battery */}
          <svg width="26" height="12" viewBox="0 0 26 12">
            <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4"/>
            <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/>
            <rect x="23" y="4" width="2" height="4" rx="0.5" fill="currentColor" fillOpacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* content */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {children}
      </div>

      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 134, height: 5, borderRadius: 100,
        background: 'var(--text-primary)', opacity: 0.28,
        zIndex: 100, pointerEvents: 'none',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tweaks
// ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#E67E22"
}/*EDITMODE-END*/;

function CusTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  uE(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', t.accent);
    // derive shades
    root.style.setProperty('--primary-hover', shade(t.accent, -12));
    root.style.setProperty('--primary-light', mix(t.accent, '#ffffff', 0.88));
  }, [t.accent]);

  return (
    <TweaksPanel title="Cus Tweaks">
      <TweakSection label="Brand">
        <TweakColor label="Accent" value={t.accent}
          options={['#E67E22', '#F2994A', '#E94560', '#27AE60', '#7B61FF', '#2C3E50']}
          onChange={v => setTweak('accent', v)} />
      </TweakSection>
      <TweakSection label="Quick Jump">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            ['Gateway', 'gateway'],
            ['Home', 'home'],
            ['Merchant', 'merchant', { id: 'm-pecel-bumut' }],
            ['Cart', 'cart'],
            ['Order Cepat', 'order-cepat'],
            ['Tracking', 'tracking'],
            ['Orders', 'orders'],
            ['Profile', 'profile'],
          ].map(([label, scr, p]) => (
            <button key={scr} onClick={() => window.__cusNav(scr, p || {})} style={{
              padding: '6px 8px', borderRadius: 8, border: '1px solid #ddd',
              background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600,
              fontFamily: 'system-ui',
            }}>{label}</button>
          ))}
        </div>
      </TweakSection>
    </TweaksPanel>
  );
}

// Color helpers
function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const adj = (c) => Math.max(0, Math.min(255, Math.round(c + (pct / 100) * 255)));
  return `#${[adj(r), adj(g), adj(b)].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}
function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 255, ag = (pa >> 8) & 255, ab = pa & 255;
  const br = (pb >> 16) & 255, bg = (pb >> 8) & 255, bb = pb & 255;
  const m = (x, y) => Math.round(x * (1 - t) + y * t);
  return `#${[m(ar, br), m(ag, bg), m(ab, bb)].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

// ─────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────
function NavExposer() {
  const { nav } = useCus();
  uE(() => { window.__cusNav = nav; }, [nav]);
  return null;
}

function App() {
  return (
    <CusProvider>
      <NavExposer />
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at top, #FAF7F2 0%, #F0EBE3 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, overflow: 'auto',
      }}>
        <Phone>
          <ScreenRouter />
        </Phone>
      </div>
      <CusTweaks />
    </CusProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
