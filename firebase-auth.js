<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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

window.firebaseSignup = async (email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCred.user);
  return userCred;
};

window.firebaseLogin = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred;
};

onAuthStateChanged(auth, user => {
  if(user) localStorage.setItem('odrop_user_v1', user.email || user.uid);
});
</script>
