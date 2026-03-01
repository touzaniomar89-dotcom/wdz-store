/* filepath: c:\Users\asus\Desktop\WDZSHO¨P\main.js */
/* global script used by every page */

const Cart = (() => {
  const STORAGE = 'wdz_cart';
  const SHIPPING_COST = 30;

  function get() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE)) || [];
    } catch {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE, JSON.stringify(items));
    updateCounter();
  }

  function updateCounter() {
    const count = get().reduce((a, i) => a + i.qty, 0);
    document.getElementById('cartCount')?.textContent = count;
  }

  function formatMAD(n) {
    return `${n} MAD`;
  }

  function add(product) {
    const items = get();
    const idx = items.findIndex(i => i.id === product.id);
    if (idx > -1) {
      items[idx].qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    save(items);
    showToast('تمت إضافة المنتج إلى السلة');
  }

  function remove(id) {
    save(get().filter(i => i.id !== id));
  }

  function changeQty(id, delta) {
    const items = get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, it.qty + delta);
    save(items);
  }

  function clear() {
    localStorage.removeItem(STORAGE);
    updateCounter();
  }

  function exportSimple() {
    const items = get().map(i => ({
      name: i.name,
      price: i.price,
      qty: i.qty,
      img: i.img
    }));
    localStorage.setItem('cart_simple', JSON.stringify(items));
  }

  function render() {
    const wrap = document.getElementById('cartItems');
    if (!wrap) return;
    const items = get();
    if (items.length === 0) {
      wrap.innerHTML = `<div class="empty-cart">السلة فارغة</div>`;
    } else {
      wrap.innerHTML = items.map(i => `
        <div class="cart-item">
          <img src="${i.img}" alt="${i.name}">
          <div class="item-info">
            <div class="item-name">${i.name}</div>
            <div class="item-price">${formatMAD(i.price)}</div>
            <div class="item-controls">
              <button class="cart-btn qty-btn" data-act="dec" data-id="${i.id}">-</button>
              <span class="qty">${i.qty}</span>
              <button class="cart-btn qty-btn" data-act="inc" data-id="${i.id}">+</button>
              <button class="cart-btn remove-btn" data-act="rm" data-id="${i.id}">إزالة</button>
            </div>
          </div>
        </div>`).join('');

      wrap.querySelectorAll('[data-act]').forEach(b => {
        b.addEventListener('click', () => {
          const act = b.dataset.act;
          const id = b.dataset.id;
          if (act === 'inc') changeQty(id, 1);
          else if (act === 'dec') changeQty(id, -1);
          else if (act === 'rm') remove(id);
          render(); // re‑render after modification
        });
      });
    }
    const sub = get().reduce((a, i) => a + i.price * i.qty, 0);
    document.getElementById('subTotal').textContent = formatMAD(sub);
    const ship = get().length ? SHIPPING_COST : 0;
    document.getElementById('shipping').textContent = formatMAD(ship);
    document.getElementById('grandTotal').textContent = formatMAD(sub + ship);
  }

  return {
    get,
    add,
    remove,
    changeQty,
    clear,
    render,
    updateCounter,
    exportSimple,
    SHIPPING_COST
  };
})();

/* small utility functions */
function showToast(text) {
  const t = document.getElementById('toast');
  t.textContent = text;
  t.classList.add('visible');
  setTimeout(() => t.classList.remove('visible'), 1300);
}

function openDrawer() {
  document.getElementById('cartOverlay').classList.add('active');
  const d = document.getElementById('cartDrawer');
  d.classList.add('open');
  d.setAttribute('aria-hidden', 'false');
  Cart.render();
}

function closeDrawer() {
  document.getElementById('cartOverlay').classList.remove('active');
  const d = document.getElementById('cartDrawer');
  d.classList.remove('open');
  d.setAttribute('aria-hidden', 'true');
}

function initCommon() {
  document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  document.getElementById('cartBtn')?.addEventListener('click', openDrawer);
  document.getElementById('closeCart')?.addEventListener('click', closeDrawer);
  document.getElementById('cartOverlay')?.addEventListener('click', closeDrawer);

  const headerEl = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    headerEl?.classList.toggle('scrolled', window.scrollY > 8);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .15 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

function initIndex() {
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      Cart.add({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price, 10),
        img: btn.dataset.img
      });
      openDrawer();
    });
  });

  document.querySelectorAll('.order-now').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      Cart.add({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price, 10),
        img: btn.dataset.img
      });
      Cart.exportSimple();
      window.location.href = 'checkout.html';
    });
  });

  document.querySelector('a.nav-btn[href="checkout.html"]')?.addEventListener('click', e => {
    e.preventDefault();
    Cart.exportSimple();
    window.location.href = 'checkout.html';
  });

  Cart.updateCounter();
}

function initCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart_simple')) || [];
  if (cart.length === 0) {
    document.querySelector('.container').innerHTML = '<div class="empty">السلة فارغة</div>';
    return;
  }

  let sub = 0;
  const summaryEl = document.getElementById('order-summary');
  summaryEl.innerHTML = cart.map(item => {
    const q = item.qty || 1;
    const line = item.price * q;
    sub += line;
    return `<div class="summary-line"><span>${item.name} × ${q}</span><strong>${line} MAD</strong></div>`;
  }).join('');

  document.getElementById('co-sub').textContent = `${sub} MAD`;
  document.getElementById('co-ship').textContent = `${Cart.SHIPPING_COST} MAD`;
  document.getElementById('total-price').textContent =
    `الإجمالي: ${sub + Cart.SHIPPING_COST} MAD`;

  const phoneEl = document.getElementById('phone');
  phoneEl.addEventListener('input', () => {
    phoneEl.value = phoneEl.value.replace(/[^\d+]/g, '').slice(0, 16);
  });
  phoneEl.addEventListener('blur', normalizePhoneInput);

  document.getElementById('checkout-form').addEventListener('submit', e => {
    e.preventDefault();
    handleCheckoutSubmit(cart, sub);
  });
}

function normalizePhoneInput(e) {
  e.target.value = normalizePhone(e.target.value);
}

function normalizePhone(v) {
  const digits = String(v).replace(/[^\d]/g, '');
  if (digits.startsWith('212') && digits.length >= 12) {
    return '0' + digits.slice(3, 12);
  }
  if (digits.startsWith('0') && digits.length >= 10) {
    return digits.slice(0, 10);
  }
  return digits;
}

function handleCheckoutSubmit(cart, sub) {
  const btn = document.getElementById('submit-btn');
  const msg = document.getElementById('msg');
  btn.disabled = true;
  btn.textContent = 'جاري المعالجة...';

  const normalPhone = normalizePhone(document.getElementById('phone').value);
  if (!/^0\d{9}$/.test(normalPhone)) {
    msg.style.color = 'orange';
    msg.textContent = 'تحقق من رقم الهاتف: أدخل 0 متبوعًا بـ 9 أرقام أو +212/212.';
    btn.disabled = false;
    btn.textContent = 'تأكيد الطلب';
    return;
  }

  const data = {
    name: document.getElementById('name').value,
    phone: normalPhone,
    city: document.getElementById('city').value,
    address: document.getElementById('address').value,
    date: new Date().toLocaleString('ar-MA', { hour12: false }),
    product: cart.map(i => `${i.name}×${i.qty || 1}`).join(', '),
    total: sub + Cart.SHIPPING_COST
  };

  fetch("https://script.google.com/macros/s/AKfycbyjwMU5fAB-_EsshT0JpPqP3RdWzA3mp0KsrN0GUgkh33ujesSP1DFfylfwKSfqa1qIxQ/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(data)
  })
    .then(res => res.text())
    .then(() => {
      localStorage.removeItem('cart_simple');
      Cart.clear();
      window.location.href = 'thankyou.html';
    })
    .catch(err => {
      console.error('checkout send failed', err);
      msg.style.color = 'red';
      msg.textContent = 'حدث خطأ أثناء الإرسال';
      btn.disabled = false;
      btn.textContent = 'تأكيد الطلب';
    });
}

function initThankyou() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.location.href = 'index.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  if (document.body.classList.contains('index')) initIndex();
  if (document.body.classList.contains('checkout')) initCheckout();
  if (document.body.classList.contains('thankyou')) initThankyou();
});
