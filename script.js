/* ==========================
   Odrop Main Script
   ========================== */

// --- FIREBASE SETUP ---
const firebaseConfig = {
  apiKey: "AIzaSyCPnsRvqauy3OtBuMc-q39HFNc6u-bk6nw",
  authDomain: "odrop-98516.firebaseapp.com",
  projectId: "odrop-98516",
  storageBucket: "odrop-98516.firebasestorage.app",
  messagingSenderId: "127741872375",
  appId: "1:127741872375:web:2acc4fb95ffb06b63e2bf2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


// --- USER SIGNUP ---
async function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await user.sendEmailVerification();
    alert("✅ Verification email sent! Check your inbox.");
    window.location.href = "login.html";
  } catch (error) {
    alert("Error: " + error.message);
  }
}


// --- USER LOGIN ---
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    if (user.emailVerified) {
      alert("✅ Logged in successfully!");
      window.location.href = "profile.html";
    } else {
      alert("⚠️ Please verify your email before logging in.");
      auth.signOut();
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}


// --- USER LOGOUT ---
async function logout() {
  await auth.signOut();
  window.location.href = "login.html";
}


// --- PROFILE PAGE ---
auth.onAuthStateChanged((user) => {
  const profileContainer = document.getElementById("profile-container");
  if (profileContainer) {
    if (user) {
      profileContainer.innerHTML = `
        <div class="text-center mt-20">
          <h1 class="text-4xl font-bold mb-6">Welcome, ${user.email.split('@')[0]}!</h1>
          <p class="text-gray-400 mb-8">Manage your listings, notifications, and crypto transactions here.</p>
          <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Logout</button>
        </div>
      `;
    } else {
      window.location.href = "login.html";
    }
  }
});


// --- MOCK LISTINGS + NOTIFICATIONS ---
let listings = JSON.parse(localStorage.getItem("odropListings") || "[]");
let notifications = JSON.parse(localStorage.getItem("odropNotifications") || "[]");

function addListing(title, price, image) {
  listings.push({ title, price, image, active: true });
  localStorage.setItem("odropListings", JSON.stringify(listings));
  alert("✅ Listing added successfully!");
}

function endListing(index) {
  listings[index].active = false;
  localStorage.setItem("odropListings", JSON.stringify(listings));
  alert("✅ Listing ended.");
}

function notifyUser(user, message) {
  notifications.push({ user, message, read: false });
  localStorage.setItem("odropNotifications", JSON.stringify(notifications));
}

function showNotifications() {
  const notifContainer = document.getElementById("notifications");
  if (!notifContainer) return;

  notifContainer.innerHTML = notifications
    .map(n => `<div class="bg-gray-700 text-white p-2 rounded my-1">${n.message}</div>`)
    .join("");
}


// --- LIGHT/DARK MODE SWITCH ---
const toggleBtn = document.getElementById("theme-toggle");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
}

// Load theme preference
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}


// --- SIMPLE CHAT (Mockup Preview) ---
function sendMessage() {
  const input = document.getElementById("chat-input");
  const chatBox = document.getElementById("chat-box");
  if (!input.value) return;

  const message = input.value;
  const div = document.createElement("div");
  div.classList = "bg-blue-600 text-white p-2 rounded-xl my-2 text-left";
  div.textContent = "You: " + message;
  chatBox.appendChild(div);
  input.value = "";

  // Mock reply
  setTimeout(() => {
    const reply = document.createElement("div");
    reply.classList = "bg-gray-700 text-white p-2 rounded-xl my-2 text-right";
    reply.textContent = "User: Sure, let's do it!";
    chatBox.appendChild(reply);
  }, 1200);
}


// --- NAVIGATION HELPERS ---
function goHome() {
  window.location.href = "index.html";
}
function goLogin() {
  window.location.href = "login.html";
}
function goSignup() {
  window.location.href = "signup.html";
}
function goProfile() {
  window.location.href = "profile.html";
}
function goProducts() {
  window.location.href = "products.html";
}
function goAbout() {
  window.location.href = "about.html";
}
function goContact() {
  window.location.href = "contact.html";
}
