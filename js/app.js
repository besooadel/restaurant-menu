// ============================================
// Restaurant Digital Menu - Main JavaScript
// ============================================

// ---- DATA STORE ----
const DB = {
  categories: [],
  products: [],
  addons: {},
  cart: JSON.parse(localStorage.getItem('menuCart') || '[]'),
  tableNumber: localStorage.getItem('tableNumber') || null,
  currentCategory: 'all',
  searchQuery: '',
};

// ---- DEMO DATA (Fallback when no backend) ----
const demoData = {
  categories: [
    { id: 'all', name_ar: 'الكل', icon: '🍽️' },
    { id: 1, name_ar: 'المقبلات', icon: '🥗' },
    { id: 2, name_ar: 'البيتزا', icon: '🍕' },
    { id: 3, name_ar: 'البرغر', icon: '🍔' },
    { id: 4, name_ar: 'المشويات', icon: '🥩' },
    { id: 5, name_ar: 'المشروبات', icon: '🥤' },
    { id: 6, name_ar: 'الحلويات', icon: '🍰' },
  ],
  products: [
    { id: 1, category_id: 1, name_ar: 'سلطة سيزر', description_ar: 'سلطة طازجة مع صلصة السيزر والخبز المحمص وجبن البارميزان', price: 35, stock_quantity: 50, is_featured: false, calories: 280, prep_time: 10, image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', video_url: '' },
    { id: 2, category_id: 1, name_ar: 'حساء الطماطم', description_ar: 'حساء طماطم كريمي مع الريحان الطازج', price: 28, stock_quantity: 30, is_featured: false, calories: 180, prep_time: 15, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', video_url: '' },
    { id: 3, category_id: 2, name_ar: 'بيتزا مارغريتا', description_ar: 'بيتزا كلاسيكية بصلصة الطماطم وجبن الموزاريلا والريحان', price: 65, stock_quantity: 20, is_featured: true, calories: 850, prep_time: 20, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', video_url: '' },
    { id: 4, category_id: 2, name_ar: 'بيتزا بيبروني', description_ar: 'بيتزا بالبيبروني الشهي وجبن الموزاريلا المذاب', price: 75, stock_quantity: 0, is_featured: true, calories: 950, prep_time: 20, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', video_url: '' },
    { id: 5, category_id: 3, name_ar: 'برغر كلاسيك', description_ar: 'برغر لحم بقري طازج مع الخس والطماطم والبصل', price: 55, stock_quantity: 40, is_featured: true, calories: 650, prep_time: 15, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', video_url: '' },
    { id: 6, category_id: 3, name_ar: 'تشيز برغر', description_ar: 'برغر مزدوج مع جبن شيدر ذائب وصلصة خاصة', price: 65, stock_quantity: 40, is_featured: false, calories: 750, prep_time: 15, image_url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400', video_url: '' },
    { id: 7, category_id: 4, name_ar: 'مشاوي مشكلة', description_ar: 'تشكيلة من أفخر اللحوم المشوية مع الخضروات', price: 120, stock_quantity: 15, is_featured: true, calories: 1200, prep_time: 30, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', video_url: '' },
    { id: 8, category_id: 4, name_ar: 'دجاج مشوي', description_ar: 'دجاج مشوي على الفحم مع التوابل الشرقية', price: 75, stock_quantity: 25, is_featured: false, calories: 520, prep_time: 25, image_url: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400', video_url: '' },
    { id: 9, category_id: 5, name_ar: 'عصير برتقال', description_ar: 'عصير برتقال طازج 100٪', price: 20, stock_quantity: 100, is_featured: false, calories: 120, prep_time: 5, image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', video_url: '' },
    { id: 10, category_id: 5, name_ar: 'كولا', description_ar: 'مشروب غازي بارد', price: 15, stock_quantity: 200, is_featured: false, calories: 140, prep_time: 2, image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', video_url: '' },
    { id: 11, category_id: 6, name_ar: 'كيك الشوكولاتة', description_ar: 'كيك شوكولاتة فاخر مع الكريمة والفراولة', price: 45, stock_quantity: 20, is_featured: true, calories: 480, prep_time: 10, image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', video_url: '' },
    { id: 12, category_id: 6, name_ar: 'آيس كريم', description_ar: 'آيس كريم بنكهات متعددة', price: 30, stock_quantity: 50, is_featured: false, calories: 320, prep_time: 5, image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400', video_url: '' },
  ],
  banners: [
    { title_ar: 'عروض اليوم المميزة', subtitle_ar: 'استمتع بأشهى الوجبات بأفضل الأسعار', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80' },
    { title_ar: 'البيتزا الطازجة يومياً', subtitle_ar: 'معجنات من أجود المكونات', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80' },
    { title_ar: 'مشويات فاخرة على الفحم', subtitle_ar: 'لحوم طازجة مختارة بعناية', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80' },
  ],
  addons: {
    3: [
      { group_id: 1, name_ar: 'حجم البيتزا', is_required: true, max_selections: 1, options: [
        { id: 1, name_ar: 'صغير 25سم', price: 0 },
        { id: 2, name_ar: 'وسط 30سم', price: 10 },
        { id: 3, name_ar: 'كبير 35سم', price: 20 },
      ]},
      { group_id: 2, name_ar: 'إضافات', is_required: false, max_selections: 3, options: [
        { id: 4, name_ar: 'جبن إضافي', price: 8 },
        { id: 5, name_ar: 'فطر', price: 5 },
        { id: 6, name_ar: 'زيتون', price: 5 },
      ]},
    ],
    5: [
      { group_id: 3, name_ar: 'الإضافات', is_required: false, max_selections: 3, options: [
        { id: 7, name_ar: 'جبن شيدر', price: 5 },
        { id: 8, name_ar: 'بيض مقلي', price: 7 },
        { id: 9, name_ar: 'بيكون', price: 10 },
      ]},
      { group_id: 4, name_ar: 'الصلصة', is_required: false, max_selections: 1, options: [
        { id: 10, name_ar: 'كاتشب', price: 0 },
        { id: 11, name_ar: 'مايونيز', price: 0 },
        { id: 12, name_ar: 'صلصة حارة', price: 0 },
      ]},
    ],
  }
};

// ---- SLIDER ----
let currentSlide = 0;
let sliderInterval = null;

function initSlider(banners) {
  const track = document.getElementById('sliderTrack');
  const dots = document.getElementById('sliderDots');
  if (!track || !banners.length) return;

  track.innerHTML = banners.map(b => `
    <div class="slide">
      <img src="${b.image_url}" alt="${b.title_ar}" loading="lazy" />
      <div class="slide-content">
        <div class="slide-title">${b.title_ar}</div>
        <div class="slide-subtitle">${b.subtitle_ar || ''}</div>
      </div>
    </div>
  `).join('');

  dots.innerHTML = banners.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></div>`).join('');

  startSlider(banners.length);
}

function startSlider(total) {
  sliderInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % total;
    updateSlider();
  }, 4000);
}

function goToSlide(n) {
  clearInterval(sliderInterval);
  currentSlide = n;
  updateSlider();
  startSlider(demoData.banners.length);
}

function updateSlider() {
  document.getElementById('sliderTrack').style.transform = `translateX(${currentSlide * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

// ---- CATEGORIES ----
function renderCategories(categories) {
  const container = document.getElementById('categoriesContainer');
  container.innerHTML = categories.map(c => `
    <button class="cat-btn ${c.id === DB.currentCategory ? 'active' : ''}" onclick="selectCategory('${c.id}')">
      <span class="cat-icon">${c.icon}</span>
      ${c.name_ar}
    </button>
  `).join('');
}

function selectCategory(id) {
  DB.currentCategory = id === 'all' ? 'all' : parseInt(id);
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
  renderProducts();
}

// ---- PRODUCTS ----
function getFilteredProducts() {
  let products = DB.products;
  if (DB.currentCategory !== 'all') {
    products = products.filter(p => p.category_id === DB.currentCategory);
  }
  if (DB.searchQuery) {
    const q = DB.searchQuery.toLowerCase();
    products = products.filter(p => p.name_ar.includes(q) || (p.description_ar || '').includes(q));
  }
  return products;
}

function renderProducts() {
  const grid = document.getElementById('menuGrid');
  const featured = document.getElementById('featuredSection');
  const products = getFilteredProducts();

  // Featured section
  const featuredProducts = DB.products.filter(p => p.is_featured && p.stock_quantity > 0);
  if (featuredProducts.length && DB.currentCategory === 'all' && !DB.searchQuery) {
    featured.style.display = '';
    document.getElementById('featuredGrid').innerHTML = featuredProducts.slice(0, 6).map(productCard).join('');
  } else {
    featured.style.display = 'none';
  }

  grid.innerHTML = products.length
    ? products.map(productCard).join('')
    : `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">
        <div style="font-size:48px;margin-bottom:10px">🔍</div>
        <div>لا توجد نتائج</div>
      </div>`;
}

function productCard(p) {
  const outOfStock = p.stock_quantity === 0;
  return `
    <div class="product-card ${outOfStock ? 'out-of-stock' : ''}" onclick="${outOfStock ? '' : `openProduct(${p.id})`}">
      <div class="product-img-wrap">
        <img src="${p.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}" 
             alt="${p.name_ar}" loading="lazy" 
             onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'" />
        ${p.is_featured ? '<div class="product-badge">⭐ مميز</div>' : ''}
        ${p.video_url ? '<div class="product-video-icon">▶</div>' : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name_ar}</div>
        <div class="product-price">
          <span class="price-amount">${p.price} ر.س</span>
          ${!outOfStock ? `<button class="add-btn" onclick="event.stopPropagation();quickAdd(${p.id})">+</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

// ---- PRODUCT MODAL ----
let modalProduct = null;
let modalQty = 1;
let selectedAddons = {};

function openProduct(id) {
  const p = DB.products.find(x => x.id === id);
  if (!p) return;
  modalProduct = p;
  modalQty = 1;
  selectedAddons = {};

  document.getElementById('modalTitle').textContent = p.name_ar;
  document.getElementById('modalDesc').textContent = p.description_ar || '';
  document.getElementById('modalCalories').textContent = `🔥 ${p.calories || 0} سعر`;
  document.getElementById('modalPrepTime').textContent = `⏱ ${p.prep_time || 10} دقيقة`;
  document.getElementById('modalQty').textContent = 1;
  updateModalPrice();

  // Media
  const mediaContainer = document.getElementById('modalMedia');
  mediaContainer.innerHTML = p.video_url
    ? `<video src="${p.video_url}" autoplay muted loop playsinline></video>`
    : `<img src="${p.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}" alt="${p.name_ar}" />`;

  // Addons
  const addonsContainer = document.getElementById('modalAddons');
  const groups = DB.addons[id] || demoData.addons[id] || [];
  addonsContainer.innerHTML = groups.map(g => `
    <div class="addon-group">
      <div class="addon-group-title">
        ${g.name_ar}
        ${g.is_required ? '<span class="required-badge">مطلوب</span>' : ''}
        ${g.max_selections > 1 ? `<span style="font-size:11px;color:var(--text-muted);">اختر حتى ${g.max_selections}</span>` : ''}
      </div>
      <div class="addon-options">
        ${g.options.map(opt => `
          <div class="addon-option" onclick="toggleAddon(${g.group_id}, ${opt.id}, ${g.max_selections}, ${g.is_required})" id="addon-${g.group_id}-${opt.id}">
            <div style="display:flex;align-items:center;gap:8px;flex:1">
              <div class="addon-check" id="check-${g.group_id}-${opt.id}">✓</div>
              <span>${opt.name_ar}</span>
            </div>
            <span class="addon-price">${opt.price > 0 ? '+' + opt.price + ' ر.س' : 'مجاناً'}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
  modalProduct = null;
}

function toggleAddon(groupId, optId, maxSel, required) {
  if (!selectedAddons[groupId]) selectedAddons[groupId] = [];
  const idx = selectedAddons[groupId].indexOf(optId);
  if (idx > -1) {
    if (!required || selectedAddons[groupId].length > 1) {
      selectedAddons[groupId].splice(idx, 1);
    }
  } else {
    if (selectedAddons[groupId].length < maxSel) {
      if (maxSel === 1) selectedAddons[groupId] = [optId];
      else selectedAddons[groupId].push(optId);
    } else {
      // Replace oldest
      selectedAddons[groupId].shift();
      selectedAddons[groupId].push(optId);
    }
  }
  // Update UI
  const groups = DB.addons[modalProduct.id] || demoData.addons[modalProduct.id] || [];
  const group = groups.find(g => g.group_id === groupId);
  if (group) {
    group.options.forEach(opt => {
      const el = document.getElementById(`addon-${groupId}-${opt.id}`);
      const check = document.getElementById(`check-${groupId}-${opt.id}`);
      if (el) el.classList.toggle('selected', selectedAddons[groupId].includes(opt.id));
    });
  }
  updateModalPrice();
}

function getAddonsPrice() {
  let total = 0;
  const allGroups = DB.addons[modalProduct?.id] || demoData.addons[modalProduct?.id] || [];
  allGroups.forEach(g => {
    (selectedAddons[g.group_id] || []).forEach(optId => {
      const opt = g.options.find(o => o.id === optId);
      if (opt) total += parseFloat(opt.price);
    });
  });
  return total;
}

function updateModalPrice() {
  if (!modalProduct) return;
  const addonsPrice = getAddonsPrice();
  const total = (parseFloat(modalProduct.price) + addonsPrice) * modalQty;
  document.getElementById('modalTotalPrice').textContent = total.toFixed(2) + ' ر.س';
}

function changeQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  document.getElementById('modalQty').textContent = modalQty;
  updateModalPrice();
}

function addToCartFromModal() {
  if (!modalProduct) return;
  // Check required addons
  const allGroups = DB.addons[modalProduct.id] || demoData.addons[modalProduct.id] || [];
  for (const g of allGroups) {
    if (g.is_required && (!selectedAddons[g.group_id] || selectedAddons[g.group_id].length === 0)) {
      showToast(`⚠️ الرجاء اختيار ${g.name_ar}`, '#FFB300');
      return;
    }
  }

  const addonsText = Object.entries(selectedAddons).flatMap(([gid, ids]) => {
    const group = allGroups.find(g => g.group_id === parseInt(gid));
    return ids.map(id => group?.options.find(o => o.id === id)?.name_ar || '');
  }).filter(Boolean);

  const item = {
    id: Date.now(),
    productId: modalProduct.id,
    name: modalProduct.name_ar,
    price: parseFloat(modalProduct.price),
    image: modalProduct.image_url,
    qty: modalQty,
    addons: addonsText,
    addonsPrice: getAddonsPrice(),
  };

  DB.cart.push(item);
  saveCart();
  updateCartUI();
  closeProductModal();
  showToast('✅ تمت الإضافة للسلة');
}

function quickAdd(id) {
  if (!DB.tableNumber) { showTableModal(); return; }
  const p = DB.products.find(x => x.id === id);
  if (!p) return;
  DB.cart.push({
    id: Date.now(),
    productId: p.id,
    name: p.name_ar,
    price: parseFloat(p.price),
    image: p.image_url,
    qty: 1,
    addons: [],
    addonsPrice: 0,
  });
  saveCart();
  updateCartUI();
  showToast('✅ تمت الإضافة للسلة');
}

// ---- CART ----
function saveCart() {
  localStorage.setItem('menuCart', JSON.stringify(DB.cart));
}

function updateCartUI() {
  const count = DB.cart.reduce((a, i) => a + i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cartItemsList');
  const total = DB.cart.reduce((a, i) => a + (i.price + i.addonsPrice) * i.qty, 0);

  if (!DB.cart.length) {
    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <div style="font-weight:700;margin-bottom:6px">السلة فارغة</div>
        <div style="font-size:13px;color:var(--text-muted)">أضف وجباتك المفضلة</div>
      </div>`;
    document.getElementById('cartTotal').textContent = '0.00 ر.س';
    return;
  }

  container.innerHTML = DB.cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        ${item.addons.length ? `<div class="cart-item-addons">${item.addons.join(' • ')}</div>` : ''}
        <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
          <div class="cart-item-price">${((item.price + item.addonsPrice) * item.qty).toFixed(2)} ر.س</div>
          <div style="font-size:12px;color:var(--text-muted)">× ${item.qty}</div>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeCartItem(${item.id})">🗑</button>
    </div>
  `).join('');

  document.getElementById('cartTotal').textContent = total.toFixed(2) + ' ر.س';
}

function removeCartItem(id) {
  DB.cart = DB.cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartItems();
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ---- TABLE NUMBER ----
function showTableModal() {
  document.getElementById('tableModal').style.display = 'flex';
}

function confirmTable() {
  const num = document.getElementById('tableNumberInput').value.trim();
  if (!num) { showToast('⚠️ أدخل رقم الطاولة', '#FFB300'); return; }
  DB.tableNumber = num;
  localStorage.setItem('tableNumber', num);
  document.getElementById('tableModal').style.display = 'none';
  document.getElementById('tableDisplay').textContent = `طاولة ${num}`;
}

// ---- CHECKOUT ----
function submitOrder() {
  if (!DB.tableNumber) { showTableModal(); return; }
  if (!DB.cart.length) { showToast('⚠️ السلة فارغة', '#FFB300'); return; }

  const notes = document.getElementById('orderNotes').value;
  const total = DB.cart.reduce((a, i) => a + (i.price + i.addonsPrice) * i.qty, 0);
  const orderNum = Math.floor(1000 + Math.random() * 9000);

  const order = {
    table_number: DB.tableNumber,
    items: DB.cart,
    total: total.toFixed(2),
    notes: notes,
    order_number: orderNum,
    timestamp: new Date().toISOString(),
  };

  // Save to localStorage as demo
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Clear cart
  DB.cart = [];
  saveCart();
  updateCartUI();
  closeCart();

  // Show success
  document.getElementById('successOrderNum').textContent = '#' + orderNum;
  document.getElementById('orderSuccessOverlay').classList.add('show');

  setTimeout(() => {
    document.getElementById('orderSuccessOverlay').classList.remove('show');
  }, 5000);
}

// ---- SEARCH ----
function handleSearch(e) {
  DB.searchQuery = e.target.value;
  renderProducts();
}

// ---- TOAST ----
function showToast(msg, bg = '#00E676') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.background = bg;
  toast.style.color = bg === '#00E676' ? '#000' : '#fff';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ---- INIT ----
async function init() {
  // Try to load from API, fallback to demo data
  try {
    // For demo: use demoData directly
    // In production: fetch from api.php
    DB.categories = demoData.categories;
    DB.products = demoData.products;
    DB.addons = demoData.addons;
  } catch (e) {
    DB.categories = demoData.categories;
    DB.products = demoData.products;
    DB.addons = demoData.addons;
  }

  initSlider(demoData.banners);
  renderCategories(DB.categories);
  renderProducts();
  updateCartUI();

  if (DB.tableNumber) {
    document.getElementById('tableDisplay').textContent = `طاولة ${DB.tableNumber}`;
  } else {
    showTableModal();
  }

  // Slider buttons
  document.querySelector('.slider-btn.prev').addEventListener('click', () => {
    clearInterval(sliderInterval);
    currentSlide = (currentSlide + 1) % demoData.banners.length;
    updateSlider();
    startSlider(demoData.banners.length);
  });
  document.querySelector('.slider-btn.next').addEventListener('click', () => {
    clearInterval(sliderInterval);
    currentSlide = (currentSlide - 1 + demoData.banners.length) % demoData.banners.length;
    updateSlider();
    startSlider(demoData.banners.length);
  });
}

document.addEventListener('DOMContentLoaded', init);
