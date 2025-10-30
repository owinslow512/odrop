/* main.js - shared odrop helpers, cart, theme, listings (localStorage) */
window.odrop = (function(){
  // storage keys
  const KEY_CART = 'odrop_cart_v1';
  const KEY_LISTINGS = 'odrop_listings_v1';
  const KEY_USER = 'odrop_user_v1'; // simple demo user object
  const KEY_USERNAME_TS = 'odrop_username_ts';

  function loadJSON(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e){ return fallback; } }
  function saveJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

  // Cart
  function getCart(){ return loadJSON(KEY_CART, []); }
  function saveCart(c){ saveJSON(KEY_CART, c); }
  function addToCart(item){
    const cart = getCart();
    cart.push(item);
    saveCart(cart);
    renderCartCount();
  }
  function clearCart(){ saveCart([]); renderCartCount(); }

  // Listings (approved only are shown)
  function getAllListings(){ return loadJSON(KEY_LISTINGS, []); }
  function addListing(listing){ // listing: {id,title,desc,price,currency,images,approved:false,owner}
    const arr = getAllListings(); arr.push(listing); saveJSON(KEY_LISTINGS, arr); }
  function getApprovedListings(){ return getAllListings().filter(l=>l.approved); }
  function approveListing(id){ const a=getAllListings(); const i=a.find(x=>x.id===id); if(i){ i.approved=true; saveJSON(KEY_LISTINGS,a);} }

  // Quick demo: render cart count (elements with id cartCount)
  function renderCartCount(){
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = getCart().length);
  }

  // theme toggle
  function initThemeButton(btnId){
    const btn = document.getElementById(btnId);
    if(!btn) return;
    const DARK = 'dark';
    const stored = localStorage.getItem('odrop_theme') || (matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? DARK : 'light');
    if(stored === DARK) document.documentElement.classList.add(DARK);
    updateIcon();

    btn.addEventListener('click', () => {
      document.documentElement.classList.toggle(DARK);
      const active = document.documentElement.classList.contains(DARK) ? DARK : 'light';
      localStorage.setItem('odrop_theme', active);
      updateIcon();
    });

    function updateIcon(){
      btn.innerHTML = document.documentElement.classList.contains(DARK) ? '🌙' : '☀️';
    }
  }

  // small helper to create IDs
  function uid(prefix='id'){ return prefix + '_' + Math.random().toString(36).slice(2,10); }

  // auto render cartCount on script load
  document.addEventListener('DOMContentLoaded', renderCartCount);

  // public API
  return {
    addToCart, getCart, clearCart, renderCartCount,
    addListing, getApprovedListings, approveListing, getAllListings,
    initThemeButton, uid,
    storage: { loadJSON, saveJSON }
  };
})();
