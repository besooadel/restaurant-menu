// ============================================
// Admin Panel JavaScript
// ============================================

// ---- AUTH ----
const ADMIN_PASSWORD = 'admin2024'; // Change this!
const ADMIN_USER = 'admin';

function checkAuth() {
  return sessionStorage.getItem('adminAuth') === 'true';
}

function login() {
  const user = document.getElementById('loginUser')?.value || '';
  const pass = document.getElementById('loginPass')?.value || '';
  const err = document.getElementById('loginError');

  if (user === ADMIN_USER && pass === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminAuth', 'true');
    showAdminPanel();
  } else {
    if (err) { err.style.display = 'block'; err.textContent = '❌ بيانات الدخول غير صحيحة'; }
  }
}

function logout() {
  sessionStorage.removeItem('adminAuth');
  location.reload();
}

// ---- DATA (loads from localStorage - same as menu) ----
function getAllProducts() {
  // In production, fetch from API
  return JSON.parse(localStorage.getItem('adminProducts') || 'null') || getDemoProducts();
}

function getDemoProducts() {
  return [
    { id: 1, category_id: 1, name_ar: 'سلطة سيزر', price: 35, stock_quantity: 50, is_available: 1, is_featured: 0, image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=100' },
    { id: 2, category_id: 1, name_ar: 'حساء الطماطم', price: 28, stock_quantity: 30, is_available: 1, is_featured: 0, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100' },
    { id: 3, category_id: 2, name_ar: 'بيتزا مارغريتا', price: 65, stock_quantity: 20, is_available: 1, is_featured: 1, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100' },
    { id: 4, category_id: 2, name_ar: 'بيتزا بيبروني', price: 75, stock_quantity: 0, is_available: 1, is_featured: 1, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=100' },
    { id: 5, category_id: 3, name_ar: 'برغر كلاسيك', price: 55, stock_quantity: 40, is_available: 1, is_featured: 1, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100' },
    { id: 6, category_id: 3, name_ar: 'تشيز برغر', price: 65, stock_quantity: 40, is_available: 1, is_featured: 0, image_url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=100' },
    { id: 7, category_id: 4, name_ar: 'مشاوي مشكلة', price: 120, stock_quantity: 15, is_available: 1, is_featured: 1, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100' },
    { id: 8, category_id: 4, name_ar: 'دجاج مشوي', price: 75, stock_quantity: 25, is_available: 1, is_featured: 0, image_url: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=100' },
    { id: 9, category_id: 5, name_ar: 'عصير برتقال', price: 20, stock_quantity: 100, is_available: 1, is_featured: 0, image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=100' },
    { id: 10, category_id: 5, name_ar: 'كولا', price: 15, stock_quantity: 200, is_available: 1, is_featured: 0, image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=100' },
    { id: 11, category_id: 6, name_ar: 'كيك الشوكولاتة', price: 45, stock_quantity: 20, is_available: 1, is_featured: 1, image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100' },
    { id: 12, category_id: 6, name_ar: 'آيس كريم', price: 30, stock_quantity: 50, is_available: 1, is_featured: 0, image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=100' },
  ];
}

function getCategories() {
  return [
    { id: 1, name_ar: 'المقبلات' },
    { id: 2, name_ar: 'البيتزا' },
    { id: 3, name_ar: 'البرغر' },
    { id: 4, name_ar: 'المشويات' },
    { id: 5, name_ar: 'المشروبات' },
    { id: 6, name_ar: 'الحلويات' },
  ];
}

function getOrders() {
  return JSON.parse(localStorage.getItem('orders') || '[]');
}

function saveProducts(products) {
  localStorage.setItem('adminProducts', JSON.stringify(products));
}

// ---- NAVIGATION ----
let activePage = 'dashboard';

function navigate(page) {
  activePage = page;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  document.querySelectorAll('.page-section').forEach(s => s.style.display = s.dataset.page === page ? 'block' : 'none');
  document.getElementById('topbarTitle').textContent = getPageTitle(page);
  if (page === 'dashboard') renderDashboard();
  else if (page === 'products') renderProductsPage();
  else if (page === 'orders') renderOrdersPage();
  else if (page === 'inventory') renderInventoryPage();
  // Close mobile sidebar
  document.getElementById('adminSidebar')?.classList.remove('open');
}

function getPageTitle(page) {
  const titles = { dashboard: '📊 لوحة التحكم', products: '🍽️ إدارة المنتجات', categories: '📂 الأصناف', orders: '📋 الطلبات', inventory: '📦 المخزون', settings: '⚙️ الإعدادات' };
  return titles[page] || 'لوحة التحكم';
}

// ---- DASHBOARD ----
function renderDashboard() {
  const products = getAllProducts();
  const orders = getOrders();
  const totalRevenue = orders.reduce((a, o) => a + parseFloat(o.total || 0), 0);
  const outOfStock = products.filter(p => p.stock_quantity === 0).length;

  document.getElementById('statProducts').textContent = products.length;
  document.getElementById('statOrders').textContent = orders.length;
  document.getElementById('statRevenue').textContent = totalRevenue.toFixed(0) + ' ر.س';
  document.getElementById('statOutOfStock').textContent = outOfStock;

  // Recent orders
  const recentOrders = orders.slice(-5).reverse();
  const tbody = document.getElementById('recentOrdersBody');
  if (tbody) {
    tbody.innerHTML = recentOrders.length ? recentOrders.map(o => `
      <tr>
        <td>#${o.order_number || '---'}</td>
        <td>طاولة ${o.table_number}</td>
        <td>${o.items?.length || 0} وجبة</td>
        <td style="color:var(--secondary);font-weight:700">${o.total} ر.س</td>
        <td><span class="badge badge-warning">قيد التنفيذ</span></td>
        <td>${new Date(o.timestamp).toLocaleTimeString('ar')}</td>
      </tr>
    `).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:30px">لا توجد طلبات بعد</td></tr>';
  }
}

// ---- PRODUCTS PAGE ----
let editingProductId = null;

function renderProductsPage() {
  const products = getAllProducts();
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  tbody.innerHTML = products.map(p => {
    const stockColor = p.stock_quantity === 0 ? 'var(--danger)' : p.stock_quantity < 10 ? 'var(--warning)' : 'var(--success)';
    const stockPct = Math.min(100, (p.stock_quantity / 100) * 100);
    const catName = getCategories().find(c => c.id === p.category_id)?.name_ar || '---';
    return `
      <tr>
        <td><img class="product-thumb" src="${p.image_url}" alt="${p.name_ar}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'" /></td>
        <td style="font-weight:700">${p.name_ar}</td>
        <td>${catName}</td>
        <td style="color:var(--secondary);font-weight:700">${p.price} ر.س</td>
        <td>
          <div style="color:${stockColor};font-weight:700">${p.stock_quantity}</div>
          <div class="stock-bar"><div class="stock-fill" style="width:${stockPct}%;background:${stockColor}"></div></div>
        </td>
        <td>
          <div class="toggle-wrap">
            <label class="toggle-switch">
              <input type="checkbox" ${p.is_available ? 'checked' : ''} onchange="toggleAvailability(${p.id})" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </td>
        <td><span class="badge ${p.is_featured ? 'badge-success' : 'badge-danger'}">${p.is_featured ? '⭐ نعم' : 'لا'}</span></td>
        <td>
          <div class="action-btns">
            <button class="action-btn" onclick="editProduct(${p.id})" title="تعديل">✏️</button>
            <button class="action-btn" onclick="updateStock(${p.id})" title="تحديث المخزون">📦</button>
            <button class="action-btn delete" onclick="deleteProduct(${p.id})" title="حذف">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddProductModal() {
  editingProductId = null;
  document.getElementById('productModalTitle').textContent = '➕ إضافة منتج جديد';
  document.getElementById('productForm').reset();
  document.getElementById('productModal').classList.add('open');
}

function editProduct(id) {
  editingProductId = id;
  const p = getAllProducts().find(x => x.id === id);
  if (!p) return;
  document.getElementById('productModalTitle').textContent = '✏️ تعديل المنتج';
  document.getElementById('pName').value = p.name_ar;
  document.getElementById('pDesc').value = p.description_ar || '';
  document.getElementById('pCategory').value = p.category_id;
  document.getElementById('pPrice').value = p.price;
  document.getElementById('pStock').value = p.stock_quantity;
  document.getElementById('pImage').value = p.image_url || '';
  document.getElementById('pVideo').value = p.video_url || '';
  document.getElementById('pFeatured').checked = !!p.is_featured;
  document.getElementById('pCalories').value = p.calories || 0;
  document.getElementById('pPrepTime').value = p.prep_time || 15;
  document.getElementById('productModal').classList.add('open');
}

function saveProduct() {
  const products = getAllProducts();
  const data = {
    name_ar: document.getElementById('pName').value.trim(),
    description_ar: document.getElementById('pDesc').value.trim(),
    category_id: parseInt(document.getElementById('pCategory').value),
    price: parseFloat(document.getElementById('pPrice').value),
    stock_quantity: parseInt(document.getElementById('pStock').value),
    image_url: document.getElementById('pImage').value.trim(),
    video_url: document.getElementById('pVideo').value.trim(),
    is_featured: document.getElementById('pFeatured').checked ? 1 : 0,
    is_available: 1,
    calories: parseInt(document.getElementById('pCalories').value) || 0,
    prep_time: parseInt(document.getElementById('pPrepTime').value) || 15,
  };

  if (!data.name_ar || !data.price) {
    showAdminAlert('danger', '⚠️ يرجى تعبئة الحقول المطلوبة');
    return;
  }

  if (editingProductId) {
    const idx = products.findIndex(p => p.id === editingProductId);
    if (idx > -1) products[idx] = { ...products[idx], ...data };
    showAdminAlert('success', '✅ تم تحديث المنتج بنجاح');
  } else {
    data.id = Date.now();
    products.push(data);
    showAdminAlert('success', '✅ تم إضافة المنتج بنجاح');
  }

  saveProducts(products);
  closeAdminModal('productModal');
  renderProductsPage();
}

function deleteProduct(id) {
  if (!confirm('هل تريد حذف هذا المنتج؟')) return;
  const products = getAllProducts().filter(p => p.id !== id);
  saveProducts(products);
  renderProductsPage();
  showAdminAlert('success', '🗑️ تم حذف المنتج');
}

function toggleAvailability(id) {
  const products = getAllProducts();
  const p = products.find(x => x.id === id);
  if (p) { p.is_available = p.is_available ? 0 : 1; saveProducts(products); }
}

// ---- STOCK MODAL ----
let stockProductId = null;

function updateStock(id) {
  stockProductId = id;
  const p = getAllProducts().find(x => x.id === id);
  if (!p) return;
  document.getElementById('stockProductName').textContent = p.name_ar;
  document.getElementById('stockCurrentQty').textContent = p.stock_quantity;
  document.getElementById('stockQtyInput').value = p.stock_quantity;
  document.getElementById('stockModal').classList.add('open');
}

function saveStock() {
  const qty = parseInt(document.getElementById('stockQtyInput').value);
  if (isNaN(qty) || qty < 0) return;
  const products = getAllProducts();
  const p = products.find(x => x.id === stockProductId);
  if (p) { p.stock_quantity = qty; saveProducts(products); }
  closeAdminModal('stockModal');
  renderProductsPage();
  showAdminAlert('success', `✅ تم تحديث المخزون إلى ${qty}`);
}

// ---- ORDERS PAGE ----
function renderOrdersPage() {
  const orders = getOrders().reverse();
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  tbody.innerHTML = orders.length ? orders.map(o => `
    <tr>
      <td style="font-weight:700">#${o.order_number || '---'}</td>
      <td>🪑 طاولة ${o.table_number}</td>
      <td>${o.items?.map(i => i.name).join('، ') || '---'}</td>
      <td style="color:var(--secondary);font-weight:700">${o.total} ر.س</td>
      <td>${o.notes || '---'}</td>
      <td><span class="badge badge-warning">⏳ قيد التنفيذ</span></td>
      <td>${new Date(o.timestamp).toLocaleString('ar')}</td>
    </tr>
  `).join('') : '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:40px">لا توجد طلبات</td></tr>';
}

// ---- INVENTORY PAGE ----
function renderInventoryPage() {
  const products = getAllProducts();
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;

  tbody.innerHTML = products.map(p => {
    const pct = Math.min(100, (p.stock_quantity / 100) * 100);
    const color = p.stock_quantity === 0 ? 'var(--danger)' : p.stock_quantity < 10 ? 'var(--warning)' : 'var(--success)';
    const status = p.stock_quantity === 0 ? '🔴 نفذ المخزون' : p.stock_quantity < 10 ? '🟡 منخفض' : '🟢 متوفر';
    return `
      <tr>
        <td style="font-weight:700">${p.name_ar}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-weight:700;color:${color}">${p.stock_quantity}</span>
            <div class="stock-bar" style="flex:1;max-width:80px">
              <div class="stock-fill" style="width:${pct}%;background:${color}"></div>
            </div>
          </div>
        </td>
        <td>${status}</td>
        <td>
          <div style="display:flex;gap:6px;align-items:center">
            <input type="number" value="${p.stock_quantity}" min="0" id="inv-${p.id}" style="width:70px;background:var(--card2);border:1px solid var(--border);border-radius:6px;padding:5px 8px;color:var(--text);font-family:'Cairo',sans-serif;font-size:12px" />
            <button class="btn-sm" style="padding:5px 10px;font-size:12px" onclick="quickStockUpdate(${p.id})">حفظ</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function quickStockUpdate(id) {
  const val = parseInt(document.getElementById(`inv-${id}`)?.value);
  if (isNaN(val) || val < 0) return;
  const products = getAllProducts();
  const p = products.find(x => x.id === id);
  if (p) { p.stock_quantity = val; saveProducts(products); }
  showAdminAlert('success', `✅ تم تحديث المخزون`);
  renderInventoryPage();
}

// ---- HELPERS ----
function closeAdminModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

function showAdminAlert(type, msg) {
  const el = document.getElementById('adminAlert');
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3000);
}

function toggleMobileSidebar() {
  document.getElementById('adminSidebar')?.classList.toggle('open');
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loginPage')) {
    // Login page
    if (checkAuth()) showAdminPanel();
    document.getElementById('loginPass')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') login();
    });
  }
});

function showAdminPanel() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'flex';
  navigate('dashboard');
}
