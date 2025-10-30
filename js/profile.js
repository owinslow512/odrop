// js/profile.js
document.addEventListener('DOMContentLoaded', () => {
  const KEY_USER = 'odrop_user_v1';
  const KEY_USERNAME_TS = 'odrop_username_ts';
  const userSave = (u)=> localStorage.setItem(KEY_USER, JSON.stringify(u));
  const loadUser = ()=> { try { return JSON.parse(localStorage.getItem(KEY_USER)) || {}; } catch(e){ return {}; } };

  // Populate
  const user = loadUser();
  const emailEl = document.getElementById('profileEmail');
  const usernameEl = document.getElementById('profileName');
  const avatarImg = document.getElementById('avatarImg');
  if(emailEl && user.email) emailEl.textContent = user.email;
  if(usernameEl && user.username) usernameEl.textContent = user.username;
  if(avatarImg && user.avatar) avatarImg.src = user.avatar;

  // Upload avatar
  const avatarInput = document.getElementById('avatarInput');
  avatarInput && avatarInput.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if(!f) return;
    const r = new FileReader();
    r.onload = () => {
      avatarImg.src = r.result;
      user.avatar = r.result; userSave(user);
      alert('Avatar updated (stored in browser).');
    };
    r.readAsDataURL(f);
  });

  // change username with 30 day rule
  const nameInput = document.getElementById('usernameField');
  const saveBtn = document.getElementById('saveUsernameBtn');
  saveBtn && saveBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if(!name || /[^a-zA-Z0-9_]/.test(name)) return alert('Use letters, numbers, underscore only.');
    const last = parseInt(localStorage.getItem(KEY_USERNAME_TS) || '0', 10);
    const now = Date.now();
    if(last && now - last < 30*24*60*60*1000) return alert('Username can only change every 30 days.');
    user.username = name; userSave(user); localStorage.setItem(KEY_USERNAME_TS, String(now));
    alert('Username updated.');
    usernameEl.textContent = name;
  
  // profile helpers
function readProfile() {
  return odrop.storage.loadJSON('odrop_profile', { username: localStorage.getItem('odrop_user_v1') || '', avatar: null, fullName:'' });
}
function saveProfile(profile) { odrop.storage.saveJSON('odrop_profile', profile); }

async function setAvatarFromInput(fileInput) {
  const file = fileInput.files[0];
  if(!file) return;
  const img = await readFileAsImage(file);
  // draw into 500x500 canvas
  const canvas = document.createElement('canvas');
  canvas.width = 500; canvas.height = 500;
  const ctx = canvas.getContext('2d');
  // draw white background or transparent
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,500,500);
  // calculate fit
  let w = img.width, h = img.height;
  const ratio = Math.min(500/w, 500/h);
  const nw = w*ratio, nh = h*ratio;
  ctx.drawImage(img, (500-nw)/2, (500-nh)/2, nw, nh);
  const data = canvas.toDataURL('image/png');
  const p = readProfile();
  p.avatar = data;
  saveProfile(p);
  return data;
}
function readFileAsImage(file){
  return new Promise((res, rej)=> {
    const fr = new FileReader();
    fr.onload = ()=> {
      const img = new Image();
      img.onload = ()=> res(img);
      img.onerror = rej;
      img.src = fr.result;
    };
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

// username change cooldown (30 days)
function canChangeUsername() {
  const last = parseInt(localStorage.getItem('odrop_username_ts') || 0);
  return (Date.now() - last) > (30*24*3600*1000);
}
function saveUsername(newName) {
  if(!/^[a-zA-Z0-9_-]{3,20}$/.test(newName)) throw new Error('Bad username');
  if(!canChangeUsername()) throw new Error('You can only change username once every 30 days');
  const p = readProfile();
  p.username = newName;
  saveProfile(p);
  localStorage.setItem('odrop_username_ts', Date.now());
}
window.setAvatarFromInput = setAvatarFromInput;
window.saveUsername = saveUsername;
window.readProfile = readProfile;
 });
});
