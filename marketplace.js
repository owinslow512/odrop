// marketplace.js

// --- Fake storage / example data ---
const listings = [
  {
    id: 1,
    title: "Gaming Laptop (RTX 4070)",
    description: "High-end MSI gaming laptop, barely used. Includes charger.",
    price: 1200,
    currency: "USD",
    images: [{ data: "images/msi-cyborg15.png" }]
  },
  {
    id: 2,
    title: "PulseChain Validator Node Setup",
    description: "Complete node setup guide & assistance for PulseChain validators.",
    price: 250,
    currency: "PLS",
    images: []
  },
  {
    id: 3,
    title: "Digital Art Commission",
    description: "High-quality digital portrait commission, delivered within 3 days.",
    price: 50,
    currency: "USDT",
    images: []
  }
];

// --- Theme toggle system ---
const themeBtn = document.getElementById("themeBtn");

function initThemeButton() {
  const currentTheme = localStorage.getItem("theme") || "light";
  document.documentElement.classList.toggle("dark", currentTheme === "dark");
  themeBtn.textContent = currentTheme === "dark" ? "🌙" : "☀️";
  
  themeBtn.onclick = () => {
    const newTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
    themeBtn.textContent = newTheme === "dark" ? "🌙" : "☀️";
  };
}

// --- Navigation ---
function goHome() { location.href = "index.html"; }
function goSell() { location.href = "sell.html"; }
function goProfile() { location.href = "profile.html"; }
function goSupport() { location.href = "support.html"; }
function goSettings() { location.href = "settings.html"; }

// --- Main rendering logic ---
document.addEventListener("DOMContentLoaded", () => {
  initThemeButton();

  const grid = document.getElementById("grid");
  
  if (!listings || listings.length === 0) {
    grid.innerHTML = `<p class="text-gray-500 dark:text-gray-400">
      No approved listings right now. Check back later or 
      <button class="text-blue-400 underline" onclick="goSell()">list an item</button>.
    </p>`;
    return;
  }

  grid.innerHTML = listings.map(item => `
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition">
      <div class="h-48 mb-3 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex items-center justify-center">
        ${item.images && item.images[0] 
          ? `<img src="${item.images[0].data}" class="object-cover w-full h-full" />`
          : `<div class="text-gray-400">No image</div>`}
      </div>
      <h2 class="text-xl font-semibold">${item.title}</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-2">${item.description}</p>
      <div class="flex items-center justify-between">
        <div class="font-bold">${item.price} ${item.currency}</div>
        <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onclick='alert("Added to cart: ${item.title}")'>Add to cart</button>
      </div>
    </div>
  `).join('');
});

