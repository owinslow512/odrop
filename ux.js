// small helper to mark error/shake and show message
function showFieldError(el, message) {
  if(!el) return;
  el.classList.add('shake');
  el.focus();
  setTimeout(()=> el.classList.remove('shake'), 420);
  if(message) {
    // try to find a sibling .field-msg
    let msg = el.parentElement.querySelector('.field-msg');
    if(!msg) {
      msg = document.createElement('div');
      msg.className = 'field-msg';
      msg.style.color = '#ff4d4f';
      msg.style.marginTop = '6px';
      el.parentElement.appendChild(msg);
    }
    msg.textContent = message;
  }
}
window.showFieldError = showFieldError;
