// ---------- DARK / LIGHT MODE ----------
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

// Toggle theme
themeToggle?.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ---------- SCROLL FADE ANIMATION ----------
const faders = document.querySelectorAll(".fade-in");

const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px",
};

const appearOnScroll = new IntersectionObserver(function (
  entries,
  appearOnScroll
) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    appearOnScroll.unobserve(entry.target);
  });
},
appearOptions);

faders.forEach((fader) => {
  appearOnScroll.observe(fader);
});

// ---------- CART POPUP ----------
const cartBtn = document.getElementById("cart-btn");
const cartPopup = document.createElement("div");
cartPopup.classList.add("cart-popup");
cartPopup.innerHTML = `
  <div class="cart-content">
    <h3>Your Cart</h3>
    <p id="cart-empty">No items yet.</p>
    <button id="close-cart" class="btn">Close</button>
  </div>
`;
document.body.appendChild(cartPopup);

cartBtn?.addEventListener("click", () => {
  cartPopup.classList.add("show");
});

document.body.addEventListener("click", (e) => {
  if (e.target.id === "close-cart" || e.target === cartPopup) {
    cartPopup.classList.remove("show");
  }
});

// ---------- SMOOTH PAGE TRANSITION ----------
window.addEventListener("beforeunload", () => {
  document.body.classList.add("fade-out");
});
