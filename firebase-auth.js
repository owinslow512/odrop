<!-- include these scripts in pages where you use Firebase auth -->
<script src="https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js"></script>

<script>
const firebaseConfig = {
  apiKey: "AIzaSyCPnsRvqauy3OtBuMc-q39HFNc6u-bk6nw",
  authDomain: "odrop-98516.firebaseapp.com",
  projectId: "odrop-98516",
  storageBucket: "odrop-98516.firebasestorage.app",
  messagingSenderId: "127741872375",
  appId: "1:127741872375:web:2acc4fb95ffb06b63e2bf2"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth(app);

// signup example
async function firebaseSignup(email, password) {
  const { createUserWithEmailAndPassword, sendEmailVerification } = firebase.auth;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user); // <--- sendEmailVerification goes here
  return userCredential;
}
window.firebaseSignup = firebaseSignup;

// login example
async function firebaseLogin(email, password) {
  const { signInWithEmailAndPassword } = firebase.auth;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential;
}
window.firebaseLogin = firebaseLogin;

// auth state listener
firebase.auth.onAuthStateChanged(auth, (user) => {
  if(user) {
    // user is signed in
    localStorage.setItem('odrop_user_v1', user.email || user.uid);
  }
});
</script>
