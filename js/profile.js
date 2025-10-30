// js/profile.js

document.addEventListener('DOMContentLoaded', () => {
  const KEY_PROFILE = 'odrop_profile';
  const KEY_USERNAME_TS = 'odrop_username_ts';

  function loadProfile() {
    return odrop.storage.loadJSON(KEY_PROFILE, { username: '', avatar: null, fullName:'' });
  }

  function saveProfile(p) {
    odrop.storage.saveJSON(KEY_PROFILE, p);
  }

  async function readFileAsImage(file){
    return new Promise((resolve,reject)=>{
      const fr = new FileReader();
      fr.onload = ()=>{
        const img = new Image();
        img.onload = ()=> resolve(img);
        img.onerror = reject;
        img.src = fr.result;
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  async function setAvatarFromInput(fileInput) {
    const file = fileInput.files[0];
    if(!file) return;

    const img = await readFileAsImage(file);

    const canvas = document.createElement('canvas');
    canvas.width = 500; canvas.height = 500;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,500,500);

    const ratio = Math.min(500/img.width, 500/img.height);
    const nw = img.width * ratio;
    const nh = img.height * ratio;

    ctx.drawImage(img, (500-nw)/2, (500-nh)/2, nw, nh);

    const data = canvas.toDataURL('image/png');

    const p = loadProfile();
    p.avatar = data;
    saveProfile(p);

    return data;
  }

  function canChangeUsername() {
    const last = parseInt(localStorage.getItem(KEY_USERNAME_TS) || 0);
    return (Date.now() - last) > (30*24*3600*1000);
  }

  function saveUsername(newName) {
    if(!/^[a-zA-Z0-9_-]{3,20}$/.test(newName)) throw new Error('Bad username');
    if(!canChangeUsername()) throw new Error('You can only change username once every 30 days');

    const p = loadProfile();
    p.username = newName;
    saveProfile(p);
    localStorage.setItem(KEY_USERNAME_TS, Date.now());
  }

  window.readProfile = loadProfile;
  window.saveUsername = saveUsername;
  window.setAvatarFromInput = setAvatarFromInput;
});
