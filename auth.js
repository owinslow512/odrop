// --- Firebase Authentication Script for Odrop ---
// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithEmailAndPassword,
  signOut 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// --- Firebase Configuration (from your console) ---
const firebaseConfig = {
  apiKey: "AIzaSyCPnsRvqauy3OtBuMc-q39HFNc6u-bk6nw",
  authDomain: "odrop-98516.firebaseapp.com",
  projectId: "odrop-98516",
  storageBucket: "odrop-98516.firebasestorage.app",
  messagingSenderId: "127741872375",
  appId: "1:127741872375:web:2acc4fb95ffb06b63e2bf2"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- Sign Up Logic ---
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sendEmailVerification(user)
          .then(() => {
            alert("✅ Account created! Please check your email for a verification link.");
          });
        signupForm.reset();
      })
      .catch((error) => {
        alert(`❌ ${error.message}`);
      });
  });
}

// --- Login Logic ---
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          alert("✅ Login successful! Welcome back.");
          window.location.href = "profile.html"; // Redirect
        } else {
          alert("⚠️ Please verify your email before logging in.");
        }
      })
      .catch((error) => {
        alert(`❌ ${error.message}`);
      });
  });
}

// --- Logout Logic ---
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        alert("👋 You’ve been logged out.");
        window.location.href = "login.html";
      })
      .catch((error) => alert(error.message));
  });
}
