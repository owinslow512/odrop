import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyCPnsRvqauy3OtBuMc-q39HFNc6u-bk6nw",
  authDomain: "odrop-98516.firebaseapp.com",
  projectId: "odrop-98516",
  storageBucket: "odrop-98516.firebasestorage.app",
  messagingSenderId: "127741872375",
  appId: "1:127741872375:web:2acc4fb95ffb06b63e2bf2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- Sign Up ---
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(userCredential.user)
          .then(() => alert("✅ Account created! Check your email for verification."));
        signupForm.reset();
      })
      .catch((error) => alert(`❌ ${error.message}`));
  });
}

// --- Login ---
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
          alert("✅ Logged in!");
          window.location.href = "profile.html";
        } else {
          alert("⚠️ Please verify your email first.");
        }
      })
      .catch((error) => alert(`❌ ${error.message}`));
  });
}

// --- Profile Page Logic ---
onAuthStateChanged(auth, (user) => {
  if (window.location.pathname.endsWith("profile.html")) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Show user data
    document.getElementById("profile-email").textContent = user.email;
    const savedUsername = localStorage.getItem(`odrop-username-${user.uid}`);
    document.getElementById("profile-name").textContent = savedUsername || "User";

    // Save username
    const saveBtn = document.getElementById("save-username-btn");
    const input = document.getElementById("username-input");
    saveBtn.addEventListener("click", () => {
      const newName = input.value.trim();
      if (newName.length === 0 || /[^a-zA-Z0-9]/.test(newName)) {
        alert("⚠️ Username must contain only letters or numbers.");
        return;
      }
      localStorage.setItem(`odrop-username-${user.uid}`, newName);
      document.getElementById("profile-name").textContent = newName;
      input.value = "";
      alert("✅ Username updated!");
    });

    // Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
      signOut(auth).then(() => {
        window.location.href = "login.html";
      });
    });
  }
});
