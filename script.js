/* ---------- Odrop Marketplace - script.js (all pages) ---------- */
/* global document, window, localStorage */

const LS_USERS = 'odrop_users';
const LS_PRODUCTS = 'odrop_products';
const LS_CURRENT = 'odrop_currentUser';
const LS_THEME = 'odrop_theme';

// small helpers
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const uid = () => 'u' + Math.random().toString(36).slice(2,10);

// load/save
function loadUsers(){ return JSON.parse(localStorage.getItem(LS_USERS) || '[]'); }
function saveUsers(u){ localStorage.setItem(LS_USERS, JSON.stringify(u)); }
function loadProducts(){ return JSON.parse(localStorage.getItem(LS_PRODUCTS) || '[]'); }
function saveProducts(p){ localStorage.setItem(LS_PRODUCTS, JSON.stringify(p)); }
function loadCurrent(){ return JSON.parse(localStorage.getItem(LS_CURRENT) || 'null'); }
function saveCurrent(c){ localStorage.setItem(LS_CURRENT, JSON.stringify(c)); }

// theme
function applyTheme(){
  const theme = localStorage.getItem(LS_THEME) || 'light';
  if(theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
  const btn = $('#theme-toggle');
  if(btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}
function toggleTheme(){
  const current = localStorage.getItem(LS_THEME) || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(LS_THEME, next);
  applyTheme();
}

// username validation (no special chars)
function validUsername(name){
  return /^[A-Za-z0-9_]{3,30}$/.test(name); // letters, numbers, underscore, 3-30 chars
}

// resize image to square (canvas) returns dataURL
function resizeImageFile(file, size=500){
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = e => img.src = e.target.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      // fill white
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      // compute cover crop
      const ratio = Math.max(size/img.width, size/img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (size - w)/2;
      const y = (size - h)/2;
      ctx.drawImage(img, x, y, w, h);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// product image resize (wider)
function resizeProductImage(file, maxWidth=1200){
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = e => img.src = e.target.result;
    img.onload = () => {
      const ratio = Math.min(1, maxWidth/img.width);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "#fff";
      ctx.fillRect(0,0,w,h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ----------------- PROFILE PAGE ----------------- */
function initProfilePage(){
  // elements
  const avatarInput = $('#avatar-input');
  const avatarPreview = $('#avatar-img');
  const avatarInitial = $('#avatar-initial');
  const profileName = $('#profile-name');
  const usernameInput = $('#username');
  const changeUsrBtn = $('#change-username');
  const saveBtn = $('#save-profile');
  const clearBtn = $('#clear-profile');
  const userListingsEl = $('#user-listings');
  const usernameNote = $('#username-note');

  let users = loadUsers();
  let current = loadCurrent();

  // load current user if none -> create guest
  if(!current){
    current = { id: uid(), profileName: '', username: '', usernameLastChanged: 0, avatar: '' };
    saveCurrent(current);
  }

  // display
  function refreshProfile(){
    current = loadCurrent();
    profileName.value = current.profileName || '';
    usernameInput.value = current.username || '';
    if(current.avatar){
      $('#avatar-img').src = current.avatar;
      $('#avatar-img').classList.remove('hidden');
      avatarInitial.classList.add('hidden');
    } else {
      $('#avatar-img').classList.add('hidden');
      avatarInitial.classList.remove('hidden');
      avatarInitial.textContent = (current.profileName || 'O')[0]?.toUpperCase() || 'O';
    }
    // show user's listings
    const products = loadProducts().filter(p => p.sellerId === current.id);
    userListingsEl.innerHTML = '';
    if(products.length === 0){
      userListingsEl.innerHTML = '<div class="p-4 text-sm text-slate-500">No listings yet</div>';
    } else {
      products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'p-3 bg-slate-50 rounded-lg border';
        card.innerHTML = `
          <img src="${p.image}" class="w-full h-36 object-cover rounded mb-2" />
          <h4 class="font-semibold">${escapeHtml(p.title)}</h4>
          <p class="text-xs text-slate-500">${escapeHtml(p.desc)}</p>
          <div class="mt-2 text-xs text-slate-500">Accepts: ${p.coin}</div>
        `;
        userListingsEl.appendChild(card);
      });
    }
  }

  // avatar upload: resize to 500x500
  avatarInput?.addEventListener('change', async (e) => {
    const f = e.target.files?.[0];
    if(!f) return;
    try{
      const dataUrl = await resizeImageFile(f, 500);
      // preview
      $('#avatar-img').src = dataUrl;
      $('#avatar-img').classList.remove('hidden');
      avatarInitial.classList.add('hidden');
      // save to current
      current.avatar = dataUrl;
      saveCurrent(current);
    } catch(err){ alert('Image error: ' + err); }
  });

  // change username logic (enforce 30 days)
  changeUsrBtn?.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if(!validUsername(name)){ alert('Username invalid. Use only letters, numbers, underscore (3-30 chars).'); return; }
    const now = Date.now();
    const last = current.usernameLastChanged || 0;
    const days = (now - last) / (1000*60*60*24);
    if(current.username && days < 30){
      alert(`You can change username again in ${Math.ceil(30 - days)} day(s).`);
      return;
    }
    // ensure uniqueness among users
    const existing = loadUsers().find(u => u.username === name && u.id !== current.id);
    if(existing){ alert('Username already taken.'); return; }
    current.username = name;
    current.usernameLastChanged = now;
    saveCurrent(current);
    // add to users list if not exist
    let users = loadUsers();
    const uidx = users.findIndex(u=>u.id===current.id);
    if(uidx === -1) users.push(current);
    else users[uidx] = current;
    saveUsers(users);
    alert('Username changed!');
    refreshProfile();
  });

  saveBtn?.addEventListener('click', () => {
    current.profileName = profileName.value.trim();
    // save current user to users list
    let users = loadUsers();
    const uidx = users.findIndex(u=>u.id===current.id);
    if(uidx === -1) users.push(current);
    else users[uidx] = current;
    saveUsers(users);
    saveCurrent(current);
    alert('Profile saved!');
    refreshProfile();
  });

  clearBtn?.addEventListener('click', () => {
    if(!confirm('Reset profile to blank?')) return;
    current.profileName = '';
    current.username = '';
    current.usernameLastChanged = 0;
    current.avatar = '';
    saveCurrent(current);
    refreshProfile();
  });

  refreshProfile();
}

/* ----------------- SELL PAGE ----------------- */
function initSellPage(){
  const form = $('#sell-form');
  const imgInput = $('#product-image');
  const previewWrap = $('#product-image-preview');
  const prodImgEl = $('#prod-img-el');
  const titleInput = $('#product-title');
  const descInput = $('#product-desc');
  const descCount = $('#desc-count');
  const coinSelect = $('#product-coin');

  let imageDataURL = null;
  imgInput?.addEventListener('change', async (e) => {
    const f = e.target.files?.[0];
    if(!f) return;
    const resized = await resizeProductImage(f, 1200).catch(()=>null);
    if(!resized) return alert('Could not process image.');
    imageDataURL = resized;
    prodImgEl.src = imageDataURL;
    previewWrap.classList.remove('hidden');
  });

  descInput?.addEventListener('input', (e) => {
    descCount.textContent = `${e.target.value.length} / 50`;
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    // validations
    if(!imageDataURL) return alert('Please upload a product image.');
    const title = titleInput.value.trim();
    if(!title) return alert('Enter product title.');
    const desc = descInput.value.trim();
    if(desc.length === 0) return alert('Enter a short description.');
    if(desc.length > 50) return alert('Description must be 50 chars or less.');
    const coin = coinSelect.value;
    if(!coin) return alert('Choose a crypto.');

    const current = loadCurrent() || { id: uid() };
    // ensure current user exists
    let users = loadUsers();
    if(!users.find(u=>u.id===current.id)){
      users.push(current);
      saveUsers(users);
      saveCurrent(current);
    }

    const products = loadProducts();
    const p = {
      id: 'p' + Math.random().toString(36).slice(2,9),
      sellerId: current.id,
      title,
      desc,
      coin,
      image: imageDataURL,
      created: Date.now(),
      status: 'available'
    };
    products.unshift(p);
    saveProducts(products);
    alert('Listing created! It appears in the marketplace.');
    // reset
    form.reset();
    previewWrap.classList.add('hidden');
    window.location.href = 'marketplace.html';
  });
}

/* ----------------- MARKETPLACE PAGE ----------------- */
function initMarketplacePage(){
  const listingsEl = $('#listings');
  const productModal = $('#product-modal');
  const modalImg = $('#modal-img');
  const modalTitle = $('#modal-title');
  const modalDesc = $('#modal-desc');
  const modalCoin = $('#modal-coin');
  const modalBuy = $('#modal-buy');
  const modalClose = $('#modal-close');
  const search = $('#search');
  const filterCoin = $('#filter-coin');

  function renderList(){
    const q = (search?.value || '').toLowerCase();
    const coinFilter = filterCoin?.value || '';
    const products = loadProducts().filter(p => {
      if(coinFilter && p.coin !== coinFilter) return false;
      if(q && !(p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))) return false;
      return true;
    });

    listingsEl.innerHTML = '';
    if(products.length === 0){
      listingsEl.innerHTML = '<div class="text-sm text-slate-500 col-span-3">No listings yet.</div>';
      return;
    }
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl p-3 shadow hover:shadow-md cursor-pointer';
      card.innerHTML = `
        <img src="${p.image}" alt="${escapeHtml(p.title)}" class="w-full h-48 object-cover rounded mb-3" />
        <h3 class="font-semibold">${escapeHtml(p.title)}</h3>
        <p class="text-sm text-slate-600">${escapeHtml(p.desc)}</p>
        <div class="mt-2 flex items-center justify-between">
          <div class="text-xs text-slate-500">Accepts: ${p.coin}</div>
          <div class="text-xs text-slate-500">#${p.id}</div>
        </div>
      `;
      card.addEventListener('click', () => openModal(p));
      listingsEl.appendChild(card);
    });
  }

  function openModal(p){
    modalImg.src = p.image;
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.desc;
    modalCoin.textContent = p.coin;
    modalBuy.dataset.pid = p.id;
    productModal.classList.remove('hidden');
  }

  modalClose?.addEventListener('click', () => productModal.classList.add('hidden'));

  modalBuy?.addEventListener('click', () => {
    const pid = modalBuy.dataset.pid;
    const products = loadProducts();
    const p = products.find(x=>x.id===pid);
    if(!p) return alert('Product missing.');

    // MOCK buy popup: ask for tx hash & mark sold
    const tx = prompt(`To simulate payment in ${p.coin}, paste your transaction hash (mock). This will mark the item as sold in local data.`);
    if(!tx) return alert('Payment cancelled.');
    p.status = 'sold';
    p.tx = tx;
    p.soldAt = Date.now();
    saveProducts(products);
    alert('Payment recorded (mock). Seller will see tx-hash on their profile page.');
    productModal.classList.add('hidden');
    renderList();
  });

  search?.addEventListener('input', renderList);
  filterCoin?.addEventListener('change', renderList);

  renderList();
}

/* ----------------- GLOBAL & NAV ----------------- */
function initGlobal(){
  // theme toggle
  const tbtn = $('#theme-toggle');
  if(tbtn){ tbtn.addEventListener('click', toggleTheme); }
  applyTheme();

  // cart popup
  const cartBtn = $('#cart-btn');
  const cartPopup = $('#cart-popup');
  const closeCart = $('#close-cart');
  cartBtn?.addEventListener('click', ()=> {
    const cart = JSON.parse(localStorage.getItem('odrop_cart') || '[]');
    $('#cart-contents').innerHTML = cart.length ? cart.map(ci=>`<div class="py-1">${escapeHtml(ci.title)}</div>`).join('') : 'No items in cart';
    cartPopup.classList.remove('hidden');
  });
  closeCart?.addEventListener('click', ()=> cartPopup.classList.add('hidden'));

  // page-specific
  const path = window.location.pathname.split('/').pop();
  if(path === 'profile.html') initProfilePage();
  if(path === 'sell.html') initSellPage();
  if(path === 'marketplace.html') initMarketplacePage();

  // utility: warn before leaving unsaved? (optional)
}

/* ----------------- HELPERS ----------------- */
function escapeHtml(s=''){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* ----------------- START ----------------- */
document.addEventListener('DOMContentLoaded', initGlobal);
