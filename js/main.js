/* main.js - Shared Odrop client-side logic
   - Theme (site-wide)
   - Nav helpers
   - User mock/auth (localStorage)
   - Listings: pending & approved (localStorage)
   - Multi-image upload helpers
   - Email sending (EmailJS, but fallback to localStorage)
   - Admin review helper
*/

//// CONFIG (replace these with your EmailJS values)
const EMAILJS_SERVICE_ID = "service_8pofbon";
const EMAILJS_TEMPLATE_SUPPORT_ID = "template_o4sdsjm";
const EMAILJS_TEMPLATE_LISTING_ID = "template_ed7sx4o";
const EMAILJS_PUBLIC_KEY = "mqnVOPu2ysfQu72il";

// Admin email for notifications (you provided)
const ADMIN_EMAIL = "o.winslow512@gmail.com";

// --- Theme (site-wide) ---
(function themeInit(){
  const stored = localStorage.getItem("odropTheme");
  if(stored === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
})();
function toggleTheme(buttonEl){
  document.documentElement.classList.toggle("dark");
  const cur = document.documentElement.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("odropTheme", cur);
  if(buttonEl) buttonEl.textContent = cur === "dark" ? "☀️" : "🌙";
}

function initThemeButton(id){
  const btn = document.getElementById(id);
  if(!btn) return;
  btn.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
  btn.addEventListener("click", () => toggleTheme(btn));
}

//// Navigation helpers (use in nav onClick)
function go(path){ window.location.href = path; }
window.goHome = () => go("index.html");
window.goMarketplace = () => go("marketplace.html");
window.goSell = () => go("sell.html");
window.goProfile = () => go("profile.html");
window.goSupport = () => go("support.html");
window.goSettings = () => go("settings.html");
window.goReview = () => go("review.html");
window.goLogin = () => go("login.html");
window.goSignup = () => go("signup.html");

//// Simple user/auth mock (localStorage). Replace with Firebase later.
function getCurrentUser(){
  return JSON.parse(localStorage.getItem("odropUser") || "null");
}
function setCurrentUser(user){
  localStorage.setItem("odropUser", JSON.stringify(user));
}
function requireAuth(redirectTo="login.html"){
  if(!getCurrentUser()) window.location.href = redirectTo;
}

//// Listings storage (pending & approved)
function getPendingListings(){ return JSON.parse(localStorage.getItem("odropPending") || "[]"); }
function setPendingListings(arr){ localStorage.setItem("odropPending", JSON.stringify(arr)); }
function getApprovedListings(){ return JSON.parse(localStorage.getItem("odropApproved") || "[]"); }
function setApprovedListings(arr){ localStorage.setItem("odropApproved", JSON.stringify(arr)); }

//// Cart
function getCart(){ return JSON.parse(localStorage.getItem("odropCart") || "[]"); }
function addToCart(listing){ const c=getCart(); c.push(listing); localStorage.setItem("odropCart", JSON.stringify(c)); }

//// Notifications (local)
function notifyLocal(msg){
  const n = JSON.parse(localStorage.getItem("odropNotifications") || "[]");
  n.push({message:msg, time:Date.now()});
  localStorage.setItem("odropNotifications", JSON.stringify(n));
}

//// Email sending (EmailJS) with fallback
async function sendEmailJS(templateId, templateParams){
  // if EmailJS not configured, fallback to local storage
  if(!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID.startsWith("YOUR_") || !EMAILJS_PUBLIC_KEY){
    console.warn("EmailJS not configured — saving to local storage as fallback.");
    const saved = JSON.parse(localStorage.getItem("odropEmailQueue") || "[]");
    saved.push({templateId, templateParams, time:Date.now()});
    localStorage.setItem("odropEmailQueue", JSON.stringify(saved));
    return {ok:false, reason:"emailjs-not-configured"};
  }

  try{
    if(typeof emailjs === "undefined"){
      // load EmailJS automatically
      await new Promise((res,rej)=>{
        const s=document.createElement("script");
        s.src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
        s.onload=res; s.onerror=rej;
        document.head.appendChild(s);
      });
      // init
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
    const resp = await emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams);
    return {ok:true, resp};
  }catch(err){
    console.error("EmailJS send failed:", err);
    // fallback
    const q = JSON.parse(localStorage.getItem("odropEmailQueue") || "[]");
    q.push({templateId, templateParams, time:Date.now(), error: String(err)});
    localStorage.setItem("odropEmailQueue", JSON.stringify(q));
    return {ok:false, reason: String(err)};
  }
}

//// Listing submission helper (called from sell page)
async function submitListing({title, description, price, currency, imagesBase64}){
  // store in pending
  const user = getCurrentUser() || {email:"anonymous@odrop.local", username:"Guest"};
  const pending = getPendingListings();
  const id = "p_"+Date.now()+"_"+Math.floor(Math.random()*9999);
  const listing = {
    id, title, description, price, currency, images: imagesBase64 || [], ownerEmail: user.email, ownerName: user.username || user.email, created: Date.now(), status:"pending"
  };
  pending.push(listing);
  setPendingListings(pending);

  // send admin notification (EmailJS) with link to review page
  const reviewLink = window.location.origin + window.location.pathname.replace(/[^\/]*$/,"") + "review.html?reviewId=" + id;
  const templateParams = {
    admin_email: ADMIN_EMAIL,
    listing_title: title,
    listing_price: price + " " + currency,
    listing_owner: user.email,
    review_link: reviewLink,
    listing_id: id,
    listing_description: description
  };
  const r = await sendEmailJS(EMAILJS_TEMPLATE_LISTING_ID, templateParams);
  if(r.ok) notifyLocal("Listing submitted — admin notified.");
  else notifyLocal("Listing submitted — admin email fallback saved locally.");
  return listing;
}

//// Approve listing (admin)
function approveListing(id){
  const pend = getPendingListings();
  const idx = pend.findIndex(x=>x.id===id);
  if(idx === -1) return false;
  const [item] = pend.splice(idx,1);
  item.status="approved"; item.approvedAt=Date.now();
  const approved = getApprovedListings();
  approved.unshift(item);
  setApprovedListings(approved);
  setPendingListings(pend);
  // optional: notify owner via EmailJS (not implemented here automatically)
  return true;
}
function rejectListing(id){
  const pend = getPendingListings();
  const idx = pend.findIndex(x=>x.id===id);
  if(idx === -1) return false;
  pend.splice(idx,1);
  setPendingListings(pend);
  return true;
}

//// Support form send
async function submitSupport({name,email,phone,reason,message}){
  const templateParams = { name, email, phone, reason, message, admin_email: ADMIN_EMAIL };
  const r = await sendEmailJS(EMAILJS_TEMPLATE_SUPPORT_ID, templateParams);
  if(r.ok){
    notifyLocal("Support request sent.");
    return {ok:true};
  } else {
    // fallback to local storage
    const q = JSON.parse(localStorage.getItem("odropSupportQueue") || "[]");
    q.push({name,email,phone,reason,message,time:Date.now()});
    localStorage.setItem("odropSupportQueue", JSON.stringify(q));
    notifyLocal("Support saved locally (email not configured).");
    return {ok:false};
  }
}

//// Multi-image file -> base64 helper (used by sell page)
function filesToBase64(files){
  return Promise.all(Array.from(files).map(file => new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = () => res({name:file.name, data:r.result});
    r.onerror = rej;
    r.readAsDataURL(file);
  })));
}

/* Exported helpers for pages */
window.odrop = {
  initThemeButton,
  getCurrentUser, setCurrentUser, requireAuth,
  submitListing, getPendingListings, getApprovedListings, approveListing, rejectListing,
  submitSupport, filesToBase64, addToCart, getCart, notifyLocal
};
